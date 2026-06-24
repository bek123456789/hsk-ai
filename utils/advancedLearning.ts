import { getListeningByLevel, getReadingByLevel, getVocabularyEntriesByLevel } from "@/data/hsk/contentIndex";
import type { HSKVocabularyEntry } from "@/data/hsk/contentTypes";
import type { HSKLevel, MistakeRecord, PracticeResult } from "@/types";

export type AdvancedFeatureKey =
  | "pronunciation-coach"
  | "tone-battle"
  | "word-family"
  | "topics"
  | "stories"
  | "grammar-playground"
  | "reading-trainer"
  | "weakness-map"
  | "boss-battle"
  | "error-replay"
  | "offline-pack"
  | "mentor-report";

export type AdvancedFeatureConfig = {
  key: AdvancedFeatureKey;
  href: string;
  titleUz: string;
  eyebrowUz: string;
  descriptionUz: string;
  primaryActionUz: string;
  localStorageKey: string;
  table: string;
  bulletsUz: string[];
};

export type AdvancedSnapshot = {
  currentLevel: HSKLevel;
  knownWordIds: string[];
  weakWordIds: string[];
  mistakes: MistakeRecord[];
  practiceResults: PracticeResult[];
};

export const advancedFeatureConfigs: Record<AdvancedFeatureKey, AdvancedFeatureConfig> = {
  "pronunciation-coach": {
    key: "pronunciation-coach",
    href: "/pronunciation-coach",
    titleUz: "Talaffuz murabbiyi",
    eyebrowUz: "Speaking + tonlar",
    descriptionUz: "Xitoycha gapni eshiting, takrorlang va yetishmagan so‘zlar hamda tonlarga oid Uzbek feedback oling.",
    primaryActionUz: "Talaffuzni mashq qilish",
    localStorageKey: "pronunciation_results",
    table: "pronunciation_results",
    bulletsUz: ["Eshiting va takrorlang", "Yetishmagan so‘zlar", "Tonlarga e’tibor bering", "Typed fallback mavjud"]
  },
  "tone-battle": {
    key: "tone-battle",
    href: "/tone-battle",
    titleUz: "Ton jangi",
    eyebrowUz: "Tezkor ton challenge",
    descriptionUz: "O‘xshash pinyin tonlarini tez farqlang, streak yig‘ing va xato tonlarni qayta mashq qiling.",
    primaryActionUz: "Ton jangini boshlash",
    localStorageKey: "tone_battle_results",
    table: "tone_battle_results",
    bulletsUz: ["Qaysi tonni eshitdingiz?", "mā / má / mǎ / mà taqqoslash", "Tezkor mashq", "Xato tonlar reviewga qaytadi"]
  },
  "word-family": {
    key: "word-family",
    href: "/word-family",
    titleUz: "So‘z oilasi",
    eyebrowUz: "Hanzi orqali lug‘at",
    descriptionUz: "Bitta ieroglif atrofidagi so‘zlarni ko‘rib, pinyin, ma’no va misollar bilan mustahkamlang.",
    primaryActionUz: "So‘z oilasini ochish",
    localStorageKey: "word_family_progress",
    table: "word_family_progress",
    bulletsUz: ["Bir ieroglifdan kelgan so‘zlar", "O‘xshash so‘zlar", "Misol gaplar", "Oilani reviewga qo‘shish"]
  },
  topics: {
    key: "topics",
    href: "/topics",
    titleUz: "Mavzular bo‘yicha o‘rganish",
    eyebrowUz: "Real hayot topic pack",
    descriptionUz: "Tanishuv, oila, maktab, ovqat, do‘kon, transport va boshqa HSK mavzularini bir joyda o‘rganing.",
    primaryActionUz: "Bugungi mavzuni boshlash",
    localStorageKey: "topic_progress",
    table: "topic_progress",
    bulletsUz: ["Vocabulary", "Mini grammatika", "Listening", "Speaking", "Reading", "Quiz", "Roleplay"]
  },
  stories: {
    key: "stories",
    href: "/stories",
    titleUz: "Hikoya orqali o‘rganish",
    eyebrowUz: "Context learning",
    descriptionUz: "HSK darajangizga mos qisqa hikoyalarni pinyin, Uzbek izoh, audio va savollar bilan o‘qing.",
    primaryActionUz: "Hikoyani o‘qish",
    localStorageKey: "story_progress",
    table: "story_progress",
    bulletsUz: ["Noma’lum so‘zlar", "Hikoyani eshitish", "Savollarga javob bering", "So‘zlarni reviewga qo‘shish"]
  },
  "grammar-playground": {
    key: "grammar-playground",
    href: "/grammar-playground",
    titleUz: "Grammatika laboratoriyasi",
    eyebrowUz: "Interactive grammar",
    descriptionUz: "Gapni savolga, inkor gapga yoki yangi tartibga aylantirib, xitoycha struktura bilan ishlang.",
    primaryActionUz: "Gapni o‘zgartirish",
    localStorageKey: "grammar_playground_results",
    table: "grammar_playground_results",
    bulletsUz: ["Gapni o‘zgartiring", "Savolga aylantiring", "Inkor gap qiling", "Tuzilishi ko‘rsatiladi"]
  },
  "reading-trainer": {
    key: "reading-trainer",
    href: "/reading-trainer",
    titleUz: "O‘qish murabbiyi",
    eyebrowUz: "Reading clues",
    descriptionUz: "Matndan asosiy fikr, kalit so‘z, vaqt, joy, inkor va javob dalilini topishni mashq qiling.",
    primaryActionUz: "Javob kalitini topish",
    localStorageKey: "reading_trainer_results",
    table: "reading_trainer_results",
    bulletsUz: ["Asosiy fikr", "Kalit so‘z", "Dalil gap", "Nega bu clue muhim?"]
  },
  "weakness-map": {
    key: "weakness-map",
    href: "/weakness-map",
    titleUz: "Zaif joylar xaritasi",
    eyebrowUz: "Progress heatmap",
    descriptionUz: "Vocabulary, pinyin, tones, grammar, reading, listening, speaking va writing bo‘yicha kuchli/zaif joylarni ko‘ring.",
    primaryActionUz: "Bugun tuzatish kerak",
    localStorageKey: "weakness_map_cache",
    table: "weakness_map_cache",
    bulletsUz: ["Eng ko‘p xato", "Kuchli tomonlar", "Critical skill", "AI Drills bilan bog‘langan"]
  },
  "boss-battle": {
    key: "boss-battle",
    href: "/boss-battle",
    titleUz: "HSK Boss Battle",
    eyebrowUz: "Gamified challenge",
    descriptionUz: "Aralash savollar bilan boss HPsini kamaytiring. Bu motivatsion badge beradi, rasmiy HSK unlock emas.",
    primaryActionUz: "Boss bilan jang qilish",
    localStorageKey: "boss_battle_results",
    table: "boss_battle_results",
    bulletsUz: ["Boss kuchi", "Sizning energiyangiz", "Zarba!", "G‘alaba badge, imtihon o‘rnini bosmaydi"]
  },
  "error-replay": {
    key: "error-replay",
    href: "/error-replay",
    titleUz: "Xatolar replay",
    eyebrowUz: "Mistake lesson",
    descriptionUz: "So‘nggi xatolarni sababiga ko‘ra guruhlab, qisqa replay dars va yangi savollar yarating.",
    primaryActionUz: "Replay darsni ochish",
    localStorageKey: "error_replay_sessions",
    table: "error_replay_sessions",
    bulletsUz: ["Nega xato bo‘ldi?", "Shunga o‘xshash mashq", "Endi to‘g‘ri yechib ko‘ring", "Xatodan dars"]
  },
  "offline-pack": {
    key: "offline-pack",
    href: "/offline-pack",
    titleUz: "Offline mashq paketi",
    eyebrowUz: "Low internet mode",
    descriptionUz: "Bugungi so‘z, grammatika, listening, reading va quiz paketini LocalStoragega saqlang.",
    primaryActionUz: "Bugungi paketni saqlash",
    localStorageKey: "offline_practice_pack",
    table: "offline_pack_results",
    bulletsUz: ["20 so‘z", "5 grammar task", "5 listening text", "5 reading task", "5 quiz question"]
  },
  "mentor-report": {
    key: "mentor-report",
    href: "/mentor-report",
    titleUz: "Ustoz/Ota-ona hisoboti",
    eyebrowUz: "Mentor view",
    descriptionUz: "O‘quvchi progressi, zaif ko‘nikmalar, HSK readiness va tavsiya qilingan yordamni sodda ko‘rinishda ko‘rsating.",
    primaryActionUz: "Hisobotni ko‘rish",
    localStorageKey: "mentor_reports",
    table: "mentor_reports",
    bulletsUz: ["O‘quvchi progressi", "Yordam kerak bo‘lgan joylar", "Chop etish", "Rasmiy sertifikat deb ko‘rsatmaydi"]
  }
};

export function getAdvancedFeatureConfig(key: AdvancedFeatureKey) {
  return advancedFeatureConfigs[key];
}

export function normalizeChineseInput(value: string) {
  return value.toLowerCase().replace(/[，。！？,.!?\s]/g, "").trim();
}

export function evaluateDictationAnswer(target: string, answer: string) {
  if (!answer.trim()) {
    return { completed: false, score: 0, missingWords: [target], extraWords: [], feedbackUz: "Avval eshitganingizni yozing." };
  }
  const targetChars = Array.from(normalizeChineseInput(target));
  const answerChars = Array.from(normalizeChineseInput(answer));
  const missingWords = targetChars.filter((char) => !answerChars.includes(char));
  const extraWords = answerChars.filter((char) => !targetChars.includes(char));
  const score = Math.max(0, Math.round(((targetChars.length - missingWords.length) / Math.max(1, targetChars.length)) * 100 - extraWords.length * 8));
  return {
    completed: true,
    score,
    missingWords,
    extraWords,
    feedbackUz: score >= 85 ? "Diktant yaxshi bajarildi." : "Yetishmagan so‘zlarni ko‘rib, yana eshiting."
  };
}

export function buildHomeworkTasks(snapshot: AdvancedSnapshot) {
  const weakCount = Math.min(5, Math.max(1, snapshot.weakWordIds.length));
  const hasMistakes = snapshot.mistakes.length > 0;
  return [
    { id: "review", titleUz: `${weakCount} ta zaif so‘zni takrorlang`, href: "/review", whyUz: snapshot.weakWordIds.length ? "Zaif so‘zlar ro‘yxatingiz bor." : "Yangi progress uchun review odatini boshlang." },
    { id: "tone", titleUz: "1 ta ton drill qiling", href: "/tone-battle", whyUz: "Tonlarni tez ajratish speaking va listeningni kuchaytiradi." },
    { id: "dictation", titleUz: "1 ta diktant bajaring", href: "/dictation", whyUz: "Diktant tanlash testidan ko‘ra haqiqiy listeningni tekshiradi." },
    { id: "mistake", titleUz: hasMistakes ? "1 ta xatoni tuzating" : "1 ta mini test bajaring", href: hasMistakes ? "/error-replay" : `/quiz/${snapshot.currentLevel}`, whyUz: hasMistakes ? "Oxirgi xatoni darhol tuzatish takroriy xatoni kamaytiradi." : "Mini test keyingi zaif joyni aniqlaydi." }
  ];
}

export function buildWeaknessHeatmap(snapshot: AdvancedSnapshot) {
  const mistakeCount = snapshot.mistakes.length;
  const lowPractice = (skill: string) => {
    const latest = snapshot.practiceResults.filter((item) => item.skill === skill).slice(-3);
    if (!latest.length) return 55;
    const score = latest.reduce((sum, item) => sum + item.score, 0);
    const total = latest.reduce((sum, item) => sum + item.total, 0);
    return Math.round((score / Math.max(1, total)) * 100);
  };
  const vocabulary = Math.max(20, 90 - snapshot.weakWordIds.length * 4);
  const grammar = Math.max(20, 82 - snapshot.mistakes.filter((item) => item.source === "sentence-builder" || item.source === "writing").length * 9);
  return [
    { skillUz: "Vocabulary", score: vocabulary },
    { skillUz: "Pinyin", score: Math.max(25, 85 - mistakeCount * 3) },
    { skillUz: "Tones", score: Math.max(20, 80 - snapshot.mistakes.filter((item) => item.source === "tone-trainer").length * 12) },
    { skillUz: "Grammar", score: grammar },
    { skillUz: "Reading", score: lowPractice("reading") },
    { skillUz: "Listening", score: lowPractice("listening") },
    { skillUz: "Speaking", score: lowPractice("speaking") },
    { skillUz: "Writing", score: lowPractice("writing") }
  ].map((item) => ({
    ...item,
    statusUz: item.score >= 80 ? "kuchli" : item.score >= 60 ? "o‘rtacha" : item.score >= 40 ? "zaif" : "critical"
  }));
}

export function createOfflinePracticePack(level: HSKLevel) {
  const vocabulary = getVocabularyEntriesByLevel(level).slice(0, 20);
  const listening = getListeningByLevel(level).slice(0, 5);
  const reading = getReadingByLevel(level).slice(0, 5);
  return {
    id: `offline-pack-hsk${level}-${new Date().toISOString().slice(0, 10)}`,
    level,
    vocabulary: vocabulary.map((word) => ({ id: word.id, hanzi: word.hanzi, pinyin: word.pinyin, uz: word.uz })),
    grammarTasks: vocabulary.slice(0, 5).map((word) => `${word.hanzi} so‘zi bilan bitta gap tuzing.`),
    listeningTexts: listening.map((item) => item.audioTextZh),
    readingTasks: reading.map((item) => item.passageZh),
    quizQuestions: vocabulary.slice(5, 10).map((word) => `${word.hanzi} nimani anglatadi?`)
  };
}

export function buildBossBattleResult(correct: number, total: number) {
  const bossHp = Math.max(0, 100 - correct * 12);
  const userEnergy = Math.max(0, 100 - (total - correct) * 18);
  return {
    bossHp,
    userEnergy,
    won: bossHp === 0 && userEnergy > 0,
    unlocksOfficialHsk: false,
    feedbackUz: bossHp === 0 ? "G‘alaba! Bu badge motivatsion, lekin HSK darajani exam 80% bilan ochasiz." : "Yana urinib ko‘ring va zaif savollarni takrorlang."
  };
}

export function buildMentorReport(snapshot: AdvancedSnapshot) {
  return {
    titleUz: "Ustoz/Ota-ona hisoboti",
    completedWords: snapshot.knownWordIds.length,
    weakAreas: buildWeaknessHeatmap(snapshot).filter((item) => item.score < 60).map((item) => item.skillUz),
    recommendationUz: snapshot.weakWordIds.length ? "Har kuni 10 daqiqa review va 1 ta listening drill tavsiya qilinadi." : "Dars davomiyligini saqlab boring.",
    officialClaimUz: "Bu hisobot rasmiy HSK sertifikati emas, faqat o‘quv progressi uchun."
  };
}

export function getWordFamilies(level: HSKLevel) {
  const words = getVocabularyEntriesByLevel(level);
  const byChar = new Map<string, HSKVocabularyEntry[]>();
  words.forEach((word) => {
    Array.from(word.hanzi).forEach((char) => {
      if (!byChar.has(char)) byChar.set(char, []);
      byChar.get(char)?.push(word);
    });
  });
  return [...byChar.entries()]
    .map(([char, family]) => ({ char, family: family.slice(0, 6) }))
    .filter((item) => item.family.length >= 2)
    .slice(0, 8);
}

export function saveAdvancedLocalResult<T extends { id: string }>(key: string, item: T) {
  if (typeof window === "undefined") return false;
  try {
    const current = JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[];
    window.localStorage.setItem(key, JSON.stringify([item, ...current.filter((existing) => existing.id !== item.id)].slice(0, 100)));
    return true;
  } catch {
    return false;
  }
}

export async function syncAdvancedFeatureBestEffort(table: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return false;
  try {
    const { syncOptionalFeatureResult } = await import("@/utils/featureProgressSync");
    await syncOptionalFeatureResult(table, payload);
    return true;
  } catch {
    return false;
  }
}
