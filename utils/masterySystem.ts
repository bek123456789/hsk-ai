import { hskWords } from "@/data/hskWords";
import type { ExamAttempt, HSKLevel, MistakeRecord, PracticeResult, QuizResult, SpeakingPracticeResult, WordReviewState } from "@/types";
import { getBestExamScore, getUnlockedHskLevels, HSK_PASSING_SCORE } from "@/utils/hskUnlock";
import { getCurrentAvailableLesson, getLevelCompletionStatus, type LessonUnlockProgress } from "@/utils/lessonUnlock";
import type { LessonProgressRecord } from "@/utils/lessonPlanner";
import { calculateExamReadiness } from "@/utils/readinessScore";

export const masteryCacheKey = "mastery_diagnosis_cache";
export const masteryRecommendationsKey = "mastery_recommendations";
export const passPredictionCacheKey = "pass_prediction_cache";

export type MistakeReasonType =
  | "word_meaning"
  | "pinyin"
  | "tone"
  | "similar_hanzi"
  | "grammar_word_order"
  | "listening_misunderstanding"
  | "reading_comprehension"
  | "speaking_missing_keyword"
  | "writing_grammar"
  | "copied_prompt"
  | "incomplete_answer"
  | "hsk_level_mismatch";

export type MasterySnapshot = {
  currentLevel: HSKLevel;
  knownWordIds: string[];
  weakWordIds: string[];
  wordReviews?: Record<string, WordReviewState>;
  quizResults: QuizResult[];
  mistakes: MistakeRecord[];
  examAttempts: ExamAttempt[];
  practiceResults?: PracticeResult[];
  speakingResults?: SpeakingPracticeResult[];
  lessonProgress?: Record<string, LessonProgressRecord>;
  streak?: number;
  premium?: boolean;
};

export type MasteryRecommendation = {
  id: string;
  titleUz: string;
  detailUz: string;
  whyUz: string;
  href: string;
  kind: "lesson" | "review" | "listening" | "speaking" | "exam" | "mistake" | "ai";
  priority: number;
  premiumOnly?: boolean;
};

export type MasteryDrill = {
  id: string;
  type: "meaning" | "sentence" | "listening";
  questionUz: string;
  promptZh?: string;
  promptPinyin?: string;
  optionsUz?: string[];
  correctAnswerUz: string;
  explanationUz: string;
};

export type PassPrediction = {
  hasEnoughData: boolean;
  level: HSKLevel;
  readiness: number;
  probabilityUz: "past" | "o‘rtacha" | "yuqori";
  weakSkills: string[];
  neededUz: string[];
  messageUz: string;
};

export type MasteryDiagnosis = {
  hasEnoughData: boolean;
  level: HSKLevel;
  diagnosisUz: string[];
  knownHighlightsUz: string[];
  weakPointsUz: string[];
  biggestMistakeReason?: {
    type: MistakeReasonType;
    titleUz: string;
    detailUz: string;
  };
  recommendations: MasteryRecommendation[];
  drills: MasteryDrill[];
  passPrediction: PassPrediction;
  generatedAt: string;
  premiumSummaryUz: string;
};

const reasonLabels: Record<MistakeReasonType, string> = {
  word_meaning: "So‘z ma’nosi",
  pinyin: "Pinyin xatosi",
  tone: "Ton xatosi",
  similar_hanzi: "O‘xshash hanzi",
  grammar_word_order: "Gap tartibi",
  listening_misunderstanding: "Tinglab tushunish",
  reading_comprehension: "O‘qib tushunish",
  speaking_missing_keyword: "Speakingda kalit so‘z yetishmadi",
  writing_grammar: "Yozuv grammatikasi",
  copied_prompt: "Vazifa matni ko‘chirilgan",
  incomplete_answer: "Javob to‘liq emas",
  hsk_level_mismatch: "Daraja mos emas"
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function hasHanzi(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

function normalizePinyinLike(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ü/g, "u")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikePinyin(value: string, referencePinyin?: string) {
  const normalized = value.trim().toLowerCase();
  if (referencePinyin && normalizePinyinLike(value) === normalizePinyinLike(referencePinyin)) return true;
  return normalized.length > 1 && /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/i.test(normalized);
}

function latestByDate<T extends { completedAt?: string; createdAt?: string }>(items: T[]) {
  return [...items].sort((first, second) => new Date(second.completedAt ?? second.createdAt ?? 0).getTime() - new Date(first.completedAt ?? first.createdAt ?? 0).getTime());
}

function progressSnapshot(input: MasterySnapshot): LessonUnlockProgress {
  return { knownWordIds: input.knownWordIds, lessonProgress: input.lessonProgress };
}

function strongestWords(input: MasterySnapshot) {
  const known = new Set(input.knownWordIds);
  return hskWords
    .filter((word) => word.hskLevel === input.currentLevel && known.has(word.id))
    .slice(0, 3)
    .map((word) => `${word.chinese} (${word.translationUz})`);
}

function weakWordNames(input: MasterySnapshot) {
  const weak = new Set(input.weakWordIds);
  return hskWords
    .filter((word) => word.hskLevel === input.currentLevel && weak.has(word.id))
    .slice(0, 5)
    .map((word) => `${word.chinese} — ${word.translationUz}`);
}

export function classifyMistakeReason(mistake: Pick<MistakeRecord, "source" | "chinese" | "pinyin" | "wrongAnswer" | "correctAnswer" | "explanation" | "hskLevel">): MistakeReasonType {
  const text = `${mistake.wrongAnswer} ${mistake.correctAnswer} ${mistake.explanation}`.toLowerCase();
  if (text.includes("ko‘chir") || text.includes("copy") || text.includes("prompt")) return "copied_prompt";
  if (text.includes("to‘liq") || text.includes("yetish") || text.includes("missing") || text.includes("empty")) return "incomplete_answer";
  if (mistake.source === "listening" || mistake.source === "dictation" || text.includes("audio")) return "listening_misunderstanding";
  if (mistake.source === "reading") return "reading_comprehension";
  if (mistake.source === "speaking") return "speaking_missing_keyword";
  if (mistake.source === "writing") return "writing_grammar";
  if (mistake.source === "sentence-builder" || text.includes("tartib") || text.includes("grammar")) return "grammar_word_order";
  if (mistake.source === "tone-trainer" || text.includes("ton")) return "tone";
  if (looksLikePinyin(mistake.wrongAnswer, mistake.pinyin) && !hasHanzi(mistake.wrongAnswer)) return "pinyin";
  if (hasHanzi(mistake.wrongAnswer) && hasHanzi(mistake.correctAnswer) && mistake.wrongAnswer !== mistake.correctAnswer) return "similar_hanzi";
  if (mistake.hskLevel > 1 && /hsk\s?1|juda oson|boshlang/.test(text)) return "hsk_level_mismatch";
  return "word_meaning";
}

export function getMistakeReasonExplanation(mistake: MistakeRecord) {
  const type = classifyMistakeReason(mistake);
  const word = hskWords.find((item) => item.id === mistake.wordId || item.chinese === mistake.chinese);
  const correct = word ? `${word.chinese} — ${word.translationUz}` : `${mistake.chinese} — ${mistake.correctAnswer}`;

  const detailByType: Record<MistakeReasonType, string> = {
    word_meaning: `Bu xato so‘z ma’nosidan bo‘ldi. ${correct}. Siz javobda “${mistake.wrongAnswer}” bilan adashtirdingiz.`,
    pinyin: `Bu pinyin xatosi. Hanzi va pinyin alohida tekshiriladi: ${mistake.chinese}${mistake.pinyin ? ` (${mistake.pinyin})` : ""}.`,
    tone: `Bu ton xatosi. Pinyin belgisi ma’noni o‘zgartirishi mumkin, shuning uchun ${mistake.chinese} talaffuziga yana quloq soling.`,
    similar_hanzi: `Bu o‘xshash hanzi xatosi. ${mistake.chinese} belgisi va to‘g‘ri javobni yonma-yon ko‘rib, farqli qismini eslab qoling.`,
    grammar_word_order: "Bu gap tartibi xatosi. Xitoy tilida oddiy gap tartibi: ega + fe’l + to‘ldiruvchi. Masalan: 我学习汉语.",
    listening_misunderstanding: `Bu tinglab tushunish xatosi. Audio ichidagi asosiy so‘z ${mistake.chinese} bo‘lishi mumkin, uni pinyin bilan qayta eshiting.`,
    reading_comprehension: "Bu o‘qib tushunish xatosi. Avval savoldagi kalit so‘zni toping, keyin matndan shu ma’nodagi gapni izlang.",
    speaking_missing_keyword: `Speaking javobida kalit ma’no yetishmagan. Javobingizda ${mistake.correctAnswer} ma’nosini aniq aytishga harakat qiling.`,
    writing_grammar: "Yozuvda grammatik tuzilma yetarli emas. Qisqa, lekin to‘liq gap yozing: ega + fe’l + to‘ldiruvchi.",
    copied_prompt: "Vazifa matnini ko‘chirish o‘rganishni ko‘rsatmaydi. Shu ma’noni o‘zingiz tuzgan xitoycha gap bilan ayting.",
    incomplete_answer: "Javob qisman to‘g‘ri bo‘lishi mumkin, lekin topshiriqdagi barcha talablar bajarilmagan.",
    hsk_level_mismatch: "Bu xato HSK darajasi mos kelmaganidan bo‘lishi mumkin. Avval shu darajadagi asosiy so‘z va qoliplarni mustahkamlang."
  };

  return {
    type,
    titleUz: reasonLabels[type],
    detailUz: detailByType[type]
  };
}

export function generateMistakeDrills(mistake: MistakeRecord): MasteryDrill[] {
  const word = hskWords.find((item) => item.id === mistake.wordId || item.chinese === mistake.chinese);
  const chinese = word?.chinese ?? mistake.chinese;
  const pinyin = word?.pinyin ?? mistake.pinyin ?? "";
  const meaning = word?.translationUz ?? mistake.correctAnswer;
  const example = word?.exampleChinese ?? `我学习${chinese}。`;
  const exampleUz = word?.exampleUz ?? `${chinese} qatnashgan gapni tushuning.`;
  const distractors = hskWords
    .filter((item) => item.hskLevel === mistake.hskLevel && item.chinese !== chinese)
    .slice(0, 3)
    .map((item) => item.translationUz);

  return [
    {
      id: `${mistake.id}-meaning`,
      type: "meaning",
      questionUz: `${chinese} nimani anglatadi?`,
      promptZh: chinese,
      promptPinyin: pinyin,
      optionsUz: [meaning, ...distractors].slice(0, 4),
      correctAnswerUz: meaning,
      explanationUz: `${chinese}${pinyin ? ` (${pinyin})` : ""} Uzbek tilida “${meaning}” degani.`
    },
    {
      id: `${mistake.id}-sentence`,
      type: "sentence",
      questionUz: `Gapdagi ${chinese} so‘zining vazifasini tushuning.`,
      promptZh: example,
      promptPinyin: word?.pinyin ? pinyin : undefined,
      correctAnswerUz: exampleUz,
      explanationUz: `Bu drill xatoni yangi gapda ko‘rishga yordam beradi, shunda faqat yodlash emas, real ishlatish ham mashq qilinadi.`
    },
    {
      id: `${mistake.id}-listening`,
      type: "listening",
      questionUz: `Eshitsangiz, qaysi so‘zga e’tibor berasiz?`,
      promptZh: example,
      promptPinyin: word?.exampleChinese ? word.pinyin : pinyin,
      correctAnswerUz: chinese,
      explanationUz: `Audio ichida ${chinese} kalit so‘zini ushlash listening xatolarini kamaytiradi.`
    }
  ];
}

export function calculateMasteryPassPrediction(input: MasterySnapshot): PassPrediction {
  const hasEnoughData = input.knownWordIds.length > 0 || input.quizResults.length > 0 || input.examAttempts.length > 0 || (input.practiceResults?.length ?? 0) > 0;
  if (!hasEnoughData) {
    return {
      hasEnoughData: false,
      level: input.currentLevel,
      readiness: 0,
      probabilityUz: "past",
      weakSkills: [],
      neededUz: ["Kamida 1 ta mini test bajaring", "1 ta listening yoki speaking mashq qiling"],
      messageUz: "Tayyorlikni hisoblash uchun kamida 1 ta mini test va 1 ta speaking/listening mashq kerak."
    };
  }

  const readiness = calculateExamReadiness({
    level: input.currentLevel,
    knownWordIds: input.knownWordIds,
    weakWordIds: input.weakWordIds,
    mistakes: input.mistakes,
    quizResults: input.quizResults,
    examAttempts: latestByDate(input.examAttempts),
    practiceResults: input.practiceResults,
    streak: input.streak
  });
  const weakSkills = Object.entries(readiness.skills)
    .filter(([, score]) => score < 70)
    .sort((left, right) => left[1] - right[1])
    .slice(0, 3)
    .map(([skill]) => skill);
  const latestExamScore = getBestExamScore(input.currentLevel, input.examAttempts);
  const reviewGap = Math.min(30, input.weakWordIds.length * 2);
  const score = clamp(readiness.score + Math.max(0, latestExamScore - 80) * 0.25 - reviewGap * 0.2);
  const probabilityUz = score >= 80 ? "yuqori" : score >= 55 ? "o‘rtacha" : "past";

  return {
    hasEnoughData: true,
    level: input.currentLevel,
    readiness: score,
    probabilityUz,
    weakSkills,
    neededUz: [
      weakSkills.includes("listening") ? "listening bo‘yicha kamida 3 ta drill qiling" : "",
      weakSkills.includes("speaking") ? "speaking javoblarida kalit so‘zlarni to‘liq ayting" : "",
      input.weakWordIds.length ? `${Math.min(20, input.weakWordIds.length)} ta zaif so‘zni takrorlang` : "",
      latestExamScore && latestExamScore < HSK_PASSING_SCORE ? "imtihonni qayta topshirishdan oldin zaif bo‘limlarni tuzating" : ""
    ].filter(Boolean),
    messageUz: `HSK ${input.currentLevel} imtihoniga tayyorlik: ${score}%. Taxminiy pass ehtimoli: ${probabilityUz}.`
  };
}

export function buildMasteryDiagnosis(input: MasterySnapshot): MasteryDiagnosis {
  const levelStatus = getLevelCompletionStatus(input.currentLevel, progressSnapshot(input));
  const passPrediction = calculateMasteryPassPrediction(input);
  const recentMistakes = latestByDate(input.mistakes).filter((mistake) => mistake.hskLevel === input.currentLevel).slice(0, 8);
  const reasonCounts = recentMistakes.reduce((map, mistake) => {
    const reason = classifyMistakeReason(mistake);
    map.set(reason, (map.get(reason) ?? 0) + 1);
    return map;
  }, new Map<MistakeReasonType, number>());
  const biggestReasonType = [...reasonCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0];
  const biggestMistake = biggestReasonType ? recentMistakes.find((mistake) => classifyMistakeReason(mistake) === biggestReasonType) : undefined;
  const biggestMistakeReason = biggestMistake ? getMistakeReasonExplanation(biggestMistake) : undefined;
  const knownHighlights = strongestWords(input);
  const weakWords = weakWordNames(input);
  const unlockedLevels = getUnlockedHskLevels({ knownWordIds: input.knownWordIds }, input.examAttempts);
  const activeLevel = unlockedLevels.includes(input.currentLevel) ? input.currentLevel : unlockedLevels.at(-1) ?? 1;
  const currentLesson = getCurrentAvailableLesson(activeLevel, progressSnapshot(input));
  const examPassed = getBestExamScore(activeLevel, input.examAttempts) >= HSK_PASSING_SCORE;

  const recommendations: MasteryRecommendation[] = [];
  if (currentLesson) {
    recommendations.push({
      id: "current-lesson",
      titleUz: `HSK ${activeLevel} — ${currentLesson.titleUz}`,
      detailUz: "Joriy darsni tugating.",
      whyUz: "Bu dars tavsiya qilindi, chunki keyingi ochiq qadam aynan shu dars va undagi bo‘limlar keyingi imtihonga tayyorlaydi.",
      href: `/lesson/${activeLevel}/${currentLesson.id}`,
      kind: "lesson",
      priority: 1
    });
  } else if (!examPassed) {
    recommendations.push({
      id: "exam",
      titleUz: `HSK ${activeLevel} imtihonini topshiring`,
      detailUz: "Barcha darslar tugagan, endi 80% yoki undan yuqori ball kerak.",
      whyUz: `HSK ${activeLevel} darslari yakunlangan. Keyingi darajani ochish uchun imtihon natijasi kerak.`,
      href: `/exam/${activeLevel}`,
      kind: "exam",
      priority: 1
    });
  }
  if (input.weakWordIds.length) {
    recommendations.push({
      id: "review",
      titleUz: `${Math.min(12, input.weakWordIds.length)} ta zaif so‘zni takrorlang`,
      detailUz: "Aqlli takrorlash orqali zaif so‘zlarni mustahkamlang.",
      whyUz: `${input.weakWordIds.length} ta so‘z zaif ro‘yxatda turibdi, shuning uchun review bugungi eng foydali qadam bo‘lishi mumkin.`,
      href: "/review",
      kind: "review",
      priority: 2
    });
  }
  if (passPrediction.weakSkills.includes("listening") || recentMistakes.some((mistake) => classifyMistakeReason(mistake) === "listening_misunderstanding")) {
    recommendations.push({
      id: "listening",
      titleUz: "1 ta listening drill qiling",
      detailUz: "Audio ichidagi kalit so‘zlarni ushlashni mashq qiling.",
      whyUz: "Listening tavsiya qilindi, chunki oxirgi natijalarda tinglab tushunish zaif ko‘nikma sifatida ko‘rindi.",
      href: `/listening/${activeLevel}`,
      kind: "listening",
      priority: 3
    });
  }
  if (recentMistakes.length) {
    recommendations.push({
      id: "mistake-drill",
      titleUz: "Xatoni hozir tuzatish",
      detailUz: "Eng so‘nggi xatodan 3 ta mini mashq yarating.",
      whyUz: "Bu drill tavsiya qilindi, chunki xato sababini darhol tuzatish keyingi testda takroriy xatoni kamaytiradi.",
      href: `/mastery?mistake=${recentMistakes[0].id}`,
      kind: "mistake",
      priority: 4
    });
  }
  recommendations.push({
    id: "ai-coach",
    titleUz: input.premium ? "AI bilan chuqur tahlil qiling" : "1 ta AI drill oling",
    detailUz: input.premium ? "Speaking, writing va imtihon zaifliklarini chuqur tahlil qiling." : "Bepul rejada kuniga 1 ta AI drill bilan xatoni tuzating.",
    whyUz: "AI HSK Ustoz real progress va xatolar asosida keyingi eng foydali qadamni tushuntiradi.",
    href: "/ai-tutor",
    kind: "ai",
    priority: 5,
    premiumOnly: input.premium ? false : true
  });

  const drills = recentMistakes[0] ? generateMistakeDrills(recentMistakes[0]) : [];
  const hasEnoughData = passPrediction.hasEnoughData || levelStatus.completed > 0 || recentMistakes.length > 0;
  const diagnosisUz = hasEnoughData
    ? [
        levelStatus.completed
          ? `Siz HSK ${input.currentLevel} bo‘yicha ${levelStatus.completed}/${levelStatus.total} ta darsni yakunlagansiz.`
          : `Siz HSK ${input.currentLevel} yo‘lidasiz, lekin hali dars yakunlanmagan.`,
        knownHighlights.length
          ? `${knownHighlights.join(", ")} so‘zlari yaxshi o‘zlashtirilgan.`
          : "Hali yaxshi o‘zlashtirilgan so‘zlar kam, avval HSK 1 asoslarini mustahkamlang.",
        weakWords.length
          ? `${weakWords.slice(0, 3).join(", ")} so‘zlari qayta mashq talab qiladi.`
          : "Zaif so‘zlar ro‘yxati hozircha kichik."
      ]
    : ["Hali tahlil qilish uchun ma’lumot yetarli emas. Avval 1 ta dars va 1 ta mini test bajaring."];

  return {
    hasEnoughData,
    level: input.currentLevel,
    diagnosisUz,
    knownHighlightsUz: knownHighlights,
    weakPointsUz: [
      ...weakWords,
      ...(biggestMistakeReason ? [biggestMistakeReason.titleUz] : []),
      ...passPrediction.weakSkills.map((skill) => `${skill} ko‘nikmasi`)
    ].slice(0, 6),
    biggestMistakeReason,
    recommendations: recommendations.sort((left, right) => left.priority - right.priority).slice(0, input.premium ? 6 : 4),
    drills,
    passPrediction,
    generatedAt: new Date().toISOString(),
    premiumSummaryUz: input.premium
      ? "Premium rejada to‘liq diagnoz, ko‘proq AI drill va chuqur speaking/writing tahlili ochiq."
      : "Bepul rejada asosiy diagnoz, top 3 zaif joy va kuniga 1 ta AI drill mavjud. Premium to‘liq tahlilni ochadi."
  };
}

export function saveMasteryDiagnosisCache(diagnosis: MasteryDiagnosis) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(masteryCacheKey, JSON.stringify(diagnosis));
    window.localStorage.setItem(masteryRecommendationsKey, JSON.stringify(diagnosis.recommendations));
    window.localStorage.setItem(passPredictionCacheKey, JSON.stringify(diagnosis.passPrediction));
    return true;
  } catch {
    return false;
  }
}

export function readMasteryDiagnosisCache(): MasteryDiagnosis | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(masteryCacheKey);
    return raw ? JSON.parse(raw) as MasteryDiagnosis : null;
  } catch {
    return null;
  }
}

export async function syncMasteryDiagnosisBestEffort(diagnosis: MasteryDiagnosis, userId?: string) {
  if (!userId || typeof window === "undefined") return false;
  try {
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("mastery_diagnoses").insert({
      user_id: userId,
      level: diagnosis.level,
      readiness: diagnosis.passPrediction.readiness,
      diagnosis,
      created_at: diagnosis.generatedAt
    });
    return !error;
  } catch {
    return false;
  }
}
