import { examQuestions } from "../data/examQuestions";
import {
  hskCentralExamQuestions,
  hskCentralGrammar,
  hskDictationItems,
  hskListeningContent,
  hskLessonCurriculum,
  hskQuizQuestions,
  hskReadingContent,
  hskRoleplayScenarios,
  hskSentenceBuilderItems,
  hskSpeakingTasks,
  vocabularyEntries
} from "../data/hsk/contentIndex";
import { hskExamQuestions } from "../data/hskExamQuestions";
import { hskExamTemplates } from "../data/hsk/examTemplates";
import { getExamSpeakingPrompts } from "../data/hsk/examSpeakingPrompts";
import { getExamWritingPrompts } from "../data/hsk/examWritingPrompts";
import { hskVocabulary } from "../data/hskVocabulary";
import { hskWords } from "../data/hskWords";
import type { ExamAttempt, HSKLevel } from "../types";
import { isLevelUnlocked } from "../utils/hskUnlock";

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];
const chineseRegex = /[\u3400-\u9fff]/;
const pinyinToneRegex = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňǹḿ]/i;
const englishLeakRegex = /\b(hello|thanks|goodbye|student|teacher|friend|china|learn|quiz|lesson|settings|profile|dashboard|checkout|subscribe)\b/i;

const errors: string[] = [];
const warnings: string[] = [];

function requireField(value: unknown, label: string, id: string) {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${id}: ${label} bo‘sh`);
  }
}

function hasFourUniqueOptions(options: string[]) {
  return options.length === 4 && new Set(options).size === 4 && options.every((item) => item.trim().length > 0);
}

function hasFourContentOptions(options: Array<{ id: string; textUz?: string; textRu?: string; textZh?: string; textPinyin?: string }>) {
  return options.length === 4 && new Set(options.map((option) => option.id)).size === 4 && options.every((option) => (option.textUz ?? option.textRu ?? option.textZh ?? option.textPinyin ?? "").trim().length > 0);
}

function checkTranslationText(value: string | undefined, label: string, id: string) {
  if (!value?.trim()) {
    errors.push(`${id}: ${label} bo‘sh`);
    return;
  }
  if (englishLeakRegex.test(value)) {
    errors.push(`${id}: ${label} ichida inglizcha so‘z bor: ${value}`);
  }
}

for (const word of hskVocabulary) {
  requireField(word.id, "id", "vocabulary");
  if (!levels.includes(word.hskLevel)) errors.push(`${word.id}: HSK level noto‘g‘ri`);
  if (!chineseRegex.test(word.chinese)) errors.push(`${word.id}: hanzi topilmadi`);
  requireField(word.pinyin, "pinyin", word.id);
  if (!pinyinToneRegex.test(word.pinyin)) errors.push(`${word.id}: pinyin tone mark yo‘q`);
  checkTranslationText(word.translationUz, "Uzbek tarjima", word.id);
  checkTranslationText(word.translationRu, "Russian tarjima", word.id);
  requireField(word.exampleChinese, "exampleChinese", word.id);
  requireField(word.examplePinyin, "examplePinyin", word.id);
  checkTranslationText(word.exampleUz, "exampleUz", word.id);
  checkTranslationText(word.exampleRu, "exampleRu", word.id);
  if (!chineseRegex.test(word.exampleChinese)) errors.push(`${word.id}: misolda xitoycha matn yo‘q`);
}

for (const level of levels) {
  const ids = new Set<string>();
  const hanzi = new Set<string>();
  const levelWords = hskVocabulary.filter((word) => word.hskLevel === level);
  const minimum = level === 1 ? 30 : level === 2 ? 12 : 6;
  if (levelWords.length < minimum) {
    errors.push(`HSK ${level}: lug‘at juda kam (${levelWords.length}/${minimum})`);
  }
  for (const word of levelWords) {
    if (ids.has(word.id)) errors.push(`${word.id}: takror id`);
    ids.add(word.id);
    if (hanzi.has(word.chinese)) errors.push(`${word.id}: HSK ${level} ichida takror hanzi ${word.chinese}`);
    hanzi.add(word.chinese);
  }
}

for (const word of vocabularyEntries) {
  requireField(word.id, "central id", "centralVocabulary");
  if (!levels.includes(word.level)) errors.push(`${word.id}: central HSK level noto‘g‘ri`);
  if (!chineseRegex.test(word.hanzi)) errors.push(`${word.id}: central hanzi topilmadi`);
  requireField(word.pinyin, "central pinyin", word.id);
  checkTranslationText(word.uz, "central Uzbek tarjima", word.id);
  checkTranslationText(word.ru, "central Russian tarjima", word.id);
  requireField(word.exampleZh, "central exampleZh", word.id);
  requireField(word.examplePinyin, "central examplePinyin", word.id);
  checkTranslationText(word.exampleUz, "central exampleUz", word.id);
  checkTranslationText(word.exampleRu, "central exampleRu", word.id);
}

for (const level of levels) {
  const ids = new Set<string>();
  const hanzi = new Set<string>();
  const levelWords = vocabularyEntries.filter((word) => word.level === level);
  const target = level === 1 ? 150 : level === 2 ? 150 : level === 3 ? 120 : level === 4 ? 100 : level === 5 ? 80 : 60;
  if (levelWords.length < target) {
    errors.push(`HSK ${level}: markaziy lug‘at targetdan kam (${levelWords.length}/${target})`);
  }
  for (const word of levelWords) {
    if (ids.has(word.id)) errors.push(`${word.id}: central takror id`);
    ids.add(word.id);
    if (hanzi.has(word.hanzi)) errors.push(`${word.id}: central HSK ${level} ichida takror hanzi ${word.hanzi}`);
    hanzi.add(word.hanzi);
  }
}

for (const word of hskWords) {
  requireField(word.id, "legacy id", "hskWords");
  if (!chineseRegex.test(word.chinese)) errors.push(`${word.id}: legacy hanzi topilmadi`);
  requireField(word.pinyin, "legacy pinyin", word.id);
  checkTranslationText(word.translationUz, "legacy Uzbek tarjima", word.id);
  checkTranslationText(word.translationRu, "legacy Russian tarjima", word.id);
  requireField(word.exampleChinese, "legacy exampleChinese", word.id);
  checkTranslationText(word.exampleUz, "legacy exampleUz", word.id);
  checkTranslationText(word.exampleRu, "legacy exampleRu", word.id);
}

for (const level of levels) {
  const ids = new Set<string>();
  const hanzi = new Set<string>();
  for (const word of hskWords.filter((item) => item.hskLevel === level)) {
    if (ids.has(word.id)) errors.push(`${word.id}: app lug‘atida takror id`);
    ids.add(word.id);
    if (hanzi.has(word.chinese)) errors.push(`${word.id}: app HSK ${level} ichida takror hanzi ${word.chinese}`);
    hanzi.add(word.chinese);
  }
}

for (const question of hskExamQuestions) {
  requireField(question.id, "question id", "question");
  if (!levels.includes(question.hskLevel)) errors.push(`${question.id}: HSK level noto‘g‘ri`);
  requireField(question.questionUz, "questionUz", question.id);
  requireField(question.questionRu, "questionRu", question.id);
  requireField(question.explanationUz, "explanationUz", question.id);
  requireField(question.explanationRu, "explanationRu", question.id);

  const isMultipleChoice = question.optionsUz.length > 0 || question.optionsRu.length > 0 || question.optionsChinese.length > 0;
  if (isMultipleChoice) {
    if (!hasFourUniqueOptions(question.optionsUz)) errors.push(`${question.id}: optionsUz 4 ta noyob javob emas`);
    if (!hasFourUniqueOptions(question.optionsRu)) errors.push(`${question.id}: optionsRu 4 ta noyob javob emas`);
    if (!hasFourUniqueOptions(question.optionsChinese)) errors.push(`${question.id}: optionsChinese 4 ta noyob javob emas`);
    const answerExists = [question.optionsUz, question.optionsRu, question.optionsChinese].some((options) => options.includes(question.correctAnswer));
    if (!answerExists) errors.push(`${question.id}: correctAnswer variantlar ichida topilmadi`);
  } else if (!question.sampleAnswer) {
    errors.push(`${question.id}: yozma savolda sampleAnswer yo‘q`);
  }
}

for (const question of examQuestions) {
  if (question.optionsUz.length > 1 && !hasFourUniqueOptions(question.optionsUz)) errors.push(`${question.id}: public optionsUz 4 ta emas`);
  if (question.optionsRu.length > 1 && !hasFourUniqueOptions(question.optionsRu)) errors.push(`${question.id}: public optionsRu 4 ta emas`);
  if (question.optionsUz.length > 1 && !question.optionsUz.includes(question.correctAnswerUz)) errors.push(`${question.id}: correctAnswerUz optionsUz ichida yo‘q`);
  if (question.optionsRu.length > 1 && !question.optionsRu.includes(question.correctAnswerRu)) errors.push(`${question.id}: correctAnswerRu optionsRu ichida yo‘q`);
}

for (const passage of hskReadingContent) {
  requireField(passage.id, "reading id", "reading");
  if (!levels.includes(passage.level)) errors.push(`${passage.id}: reading level noto‘g‘ri`);
  requireField(passage.passageZh, "passageZh", passage.id);
  requireField(passage.passagePinyin, "passagePinyin", passage.id);
  checkTranslationText(passage.passageUz, "passageUz", passage.id);
  checkTranslationText(passage.passageRu, "passageRu", passage.id);
  if (!passage.questions.length) errors.push(`${passage.id}: reading questions yo‘q`);
  for (const question of passage.questions) {
    if (!hasFourContentOptions(question.options)) errors.push(`${question.id}: reading options 4 ta emas`);
    if (!question.options.some((option) => option.id === question.correctOptionId)) errors.push(`${question.id}: correct option topilmadi`);
    checkTranslationText(question.explanationUz, "reading explanationUz", question.id);
    checkTranslationText(question.explanationRu, "reading explanationRu", question.id);
  }
}

for (const prompt of hskListeningContent) {
  requireField(prompt.id, "listening id", "listening");
  if (!levels.includes(prompt.level)) errors.push(`${prompt.id}: listening level noto‘g‘ri`);
  requireField(prompt.audioTextZh, "audioTextZh", prompt.id);
  requireField(prompt.audioTextPinyin, "audioTextPinyin", prompt.id);
  checkTranslationText(prompt.transcriptUz, "transcriptUz", prompt.id);
  checkTranslationText(prompt.transcriptRu, "transcriptRu", prompt.id);
  if (!prompt.questions.length) errors.push(`${prompt.id}: listening questions yo‘q`);
  for (const question of prompt.questions) {
    if (!hasFourContentOptions(question.options)) errors.push(`${question.id}: listening options 4 ta emas`);
    if (!question.options.some((option) => option.id === question.correctOptionId)) errors.push(`${question.id}: correct option topilmadi`);
  }
}

for (const task of hskSpeakingTasks) {
  requireField(task.id, "speaking id", "speaking");
  if (!levels.includes(task.level)) errors.push(`${task.id}: speaking level noto‘g‘ri`);
  requireField(task.textZh, "textZh", task.id);
  requireField(task.textPinyin, "textPinyin", task.id);
  checkTranslationText(task.textUz, "textUz", task.id);
  checkTranslationText(task.textRu, "textRu", task.id);
  requireField(task.sampleAnswerZh, "sampleAnswerZh", task.id);
  requireField(task.sampleAnswerPinyin, "sampleAnswerPinyin", task.id);
  if (!task.keywordsZh.length) errors.push(`${task.id}: keywordsZh yo‘q`);
}

for (const question of [...hskQuizQuestions, ...hskCentralExamQuestions]) {
  requireField(question.id, "central question id", "centralQuestion");
  if (!levels.includes(question.level)) errors.push(`${question.id}: central question level noto‘g‘ri`);
  requireField(question.questionUz, "questionUz", question.id);
  requireField(question.questionRu, "questionRu", question.id);
  checkTranslationText(question.explanationUz, "explanationUz", question.id);
  checkTranslationText(question.explanationRu, "explanationRu", question.id);
  if (question.options && !hasFourContentOptions(question.options)) errors.push(`${question.id}: central options 4 ta emas`);
}

for (const item of hskSentenceBuilderItems) {
  requireField(item.sentenceZh, "sentenceZh", item.id);
  requireField(item.sentencePinyin, "sentencePinyin", item.id);
  checkTranslationText(item.sentenceUz, "sentenceUz", item.id);
  checkTranslationText(item.sentenceRu, "sentenceRu", item.id);
  if (item.chunks.length < 3) errors.push(`${item.id}: sentence chunks kam`);
}

for (const item of hskDictationItems) {
  requireField(item.audioTextZh, "dictation audioTextZh", item.id);
  requireField(item.audioTextPinyin, "dictation audioTextPinyin", item.id);
  checkTranslationText(item.meaningUz, "dictation meaningUz", item.id);
  checkTranslationText(item.meaningRu, "dictation meaningRu", item.id);
}

for (const item of hskCentralGrammar) {
  requireField(item.pattern, "grammar pattern", item.id);
  checkTranslationText(item.explanationUz, "grammar explanationUz", item.id);
  checkTranslationText(item.explanationRu, "grammar explanationRu", item.id);
}

for (const scenario of hskRoleplayScenarios) {
  requireField(scenario.openingZh, "roleplay openingZh", scenario.id);
  requireField(scenario.openingPinyin, "roleplay openingPinyin", scenario.id);
  checkTranslationText(scenario.situationUz, "roleplay situationUz", scenario.id);
  checkTranslationText(scenario.situationRu, "roleplay situationRu", scenario.id);
}

const vocabularyById = new Map(vocabularyEntries.map((item) => [item.id, item]));
const grammarById = new Map(hskCentralGrammar.map((item) => [item.id, item]));
const readingById = new Map(hskReadingContent.map((item) => [item.id, item]));
const listeningById = new Map(hskListeningContent.map((item) => [item.id, item]));
const speakingById = new Map(hskSpeakingTasks.map((item) => [item.id, item]));
const quizById = new Map(hskQuizQuestions.map((item) => [item.id, item]));
const lessonIds = new Set<string>();

for (const lesson of hskLessonCurriculum) {
  if (lessonIds.has(lesson.id)) errors.push(`${lesson.id}: takror lesson id`);
  lessonIds.add(lesson.id);
  if (/Rejada so['‘’]?z/i.test(`${lesson.titleUz} ${lesson.descriptionUz}`)) errors.push(`${lesson.id}: taqiqlangan “Rejada so‘z” matni`);
  if (!lesson.vocabularyIds.length && !lesson.grammarIds.length && !lesson.readingIds.length && !lesson.listeningIds.length && !lesson.speakingTaskIds.length && !lesson.quizQuestionIds.length) {
    errors.push(`${lesson.id}: darsda o‘quv kontenti yo‘q`);
  }
  if (lesson.vocabularyIds.length < 5) warnings.push(`${lesson.id}: 5 tadan kam so‘z (${lesson.vocabularyIds.length})`);
  if (!lesson.readingIds.length || !lesson.listeningIds.length || !lesson.speakingTaskIds.length) warnings.push(`${lesson.id}: o‘qish/tinglash/gapirish bo‘limlaridan biri yo‘q`);

  const references = [
    ["vocabulary", lesson.vocabularyIds, vocabularyById],
    ["grammar", lesson.grammarIds, grammarById],
    ["reading", lesson.readingIds, readingById],
    ["listening", lesson.listeningIds, listeningById],
    ["speaking", lesson.speakingTaskIds, speakingById],
    ["quiz", lesson.quizQuestionIds, quizById]
  ] as const;
  for (const [kind, ids, index] of references) {
    for (const id of ids) {
      const item = index.get(id);
      if (!item) errors.push(`${lesson.id}: broken ${kind} id ${id}`);
      else if (item.level !== lesson.level) errors.push(`${lesson.id}: ${kind} ${id} HSK darajasi mos emas`);
    }
  }
}

for (const level of levels) {
  const lessons = hskLessonCurriculum.filter((item) => item.level === level);
  const target = level <= 4 ? (level === 1 ? 20 : 24) : 20;
  if (lessons.length < target) errors.push(`HSK ${level}: darslar soni kam (${lessons.length}/${target})`);
}

const advancedTargets = {
  reading: { 4: 12, 5: 10, 6: 8 },
  listening: { 4: 12, 5: 10, 6: 8 },
  speaking: { 4: 10, 5: 8, 6: 6 }
} as const;

for (const level of [4, 5, 6] as const) {
  const readingItems = hskReadingContent.filter((item) => item.level === level);
  const listeningItems = hskListeningContent.filter((item) => item.level === level);
  const speakingItems = hskSpeakingTasks.filter((item) => item.level === level);
  if (readingItems.length < advancedTargets.reading[level]) errors.push(`HSK ${level}: reading kam (${readingItems.length}/${advancedTargets.reading[level]})`);
  if (listeningItems.length < advancedTargets.listening[level]) errors.push(`HSK ${level}: listening kam (${listeningItems.length}/${advancedTargets.listening[level]})`);
  if (speakingItems.length < advancedTargets.speaking[level]) errors.push(`HSK ${level}: speaking kam (${speakingItems.length}/${advancedTargets.speaking[level]})`);

  if (new Set(readingItems.map((item) => item.passageZh)).size !== readingItems.length) errors.push(`HSK ${level}: takror reading matni bor`);
  if (new Set(listeningItems.map((item) => item.audioTextZh)).size !== listeningItems.length) errors.push(`HSK ${level}: takror listening matni bor`);
  if (new Set(speakingItems.map((item) => item.textZh)).size !== speakingItems.length) errors.push(`HSK ${level}: takror speaking matni bor`);
}

const examTemplateIds = new Set<string>();
for (const level of levels) {
  const template = hskExamTemplates.find((item) => item.level === level);
  if (!template) {
    errors.push(`HSK ${level}: exam template topilmadi`);
    continue;
  }
  if (examTemplateIds.has(template.id)) errors.push(`${template.id}: takror exam template id`);
  examTemplateIds.add(template.id);
  if (template.passingScore !== 80) errors.push(`${template.id}: o‘tish bali 80 emas`);
  if (template.sections.reduce((sum, section) => sum + section.weight, 0) !== 100) errors.push(`${template.id}: bo‘lim og‘irliklari 100 ga teng emas`);
  const requiredSkills = new Set(["listening", "reading", "speaking", "writing"]);
  for (const section of template.sections) requiredSkills.delete(section.id);
  if (requiredSkills.size) errors.push(`${template.id}: yetishmayotgan bo‘limlar ${Array.from(requiredSkills).join(", ")}`);

  for (const section of template.sections) {
    requireField(section.titleUz, `${section.id} titleUz`, template.id);
    requireField(section.titleRu, `${section.id} titleRu`, template.id);
    if (section.id === "listening") {
      if (!section.questions.length) errors.push(`${template.id}: listening savollari yo‘q`);
      for (const prompt of section.questions) {
        if (prompt.level !== level) errors.push(`${template.id}: listening ${prompt.id} HSK darajasi mos emas`);
        requireField(prompt.audioTextZh, "exam audioTextZh", prompt.id);
        for (const question of prompt.questions) {
          if (!hasFourContentOptions(question.options)) errors.push(`${question.id}: exam listening variantlari 4 ta emas`);
          if (question.options.filter((option) => option.id === question.correctOptionId).length !== 1) errors.push(`${question.id}: exam listening to‘g‘ri javobi bitta emas`);
          checkTranslationText(question.explanationUz, "exam listening explanationUz", question.id);
          checkTranslationText(question.explanationRu, "exam listening explanationRu", question.id);
        }
      }
    } else if (section.id === "reading") {
      if (!section.questions.length) errors.push(`${template.id}: reading savollari yo‘q`);
      for (const passage of section.questions) {
        if (passage.level !== level) errors.push(`${template.id}: reading ${passage.id} HSK darajasi mos emas`);
        requireField(passage.passageZh, "exam passageZh", passage.id);
        for (const question of passage.questions) {
          if (!hasFourContentOptions(question.options)) errors.push(`${question.id}: exam reading variantlari 4 ta emas`);
          if (question.options.filter((option) => option.id === question.correctOptionId).length !== 1) errors.push(`${question.id}: exam reading to‘g‘ri javobi bitta emas`);
          checkTranslationText(question.explanationUz, "exam reading explanationUz", question.id);
          checkTranslationText(question.explanationRu, "exam reading explanationRu", question.id);
        }
      }
    } else if (section.id === "speaking") {
      const prompts = getExamSpeakingPrompts(level);
      if (!prompts.length) errors.push(`${template.id}: speaking prompts yo‘q`);
      for (const prompt of prompts) {
        if (prompt.level !== level) errors.push(`${template.id}: speaking ${prompt.examId} HSK darajasi mos emas`);
        requireField(prompt.sampleAnswerZh, "exam speaking sampleAnswerZh", prompt.examId);
        requireField(prompt.sampleAnswerPinyin, "exam speaking sampleAnswerPinyin", prompt.examId);
        checkTranslationText(prompt.sampleAnswerUz, "exam speaking sampleAnswerUz", prompt.examId);
        checkTranslationText(prompt.sampleAnswerRu, "exam speaking sampleAnswerRu", prompt.examId);
      }
    } else {
      const prompts = getExamWritingPrompts(level);
      if (!prompts.length) errors.push(`${template.id}: writing prompts yo‘q`);
      for (const prompt of prompts) {
        if (prompt.level !== level) errors.push(`${template.id}: writing ${prompt.id} HSK darajasi mos emas`);
        requireField(prompt.sampleAnswerZh, "exam writing sampleAnswerZh", prompt.id);
        requireField(prompt.sampleAnswerPinyin, "exam writing sampleAnswerPinyin", prompt.id);
        checkTranslationText(prompt.sampleAnswerUz, "exam writing sampleAnswerUz", prompt.id);
        checkTranslationText(prompt.sampleAnswerRu, "exam writing sampleAnswerRu", prompt.id);
        if (!prompt.expectedKeywordsZh.length) errors.push(`${prompt.id}: writing expectedKeywordsZh yo‘q`);
      }
    }
  }
}

const unlockAttempt = (score: number): ExamAttempt => ({
  id: `unlock-test-${score}`,
  hskLevel: 1,
  score: 1,
  total: 1,
  accuracy: score,
  overallScore: score,
  passingScore: 80,
  passed: score >= 80,
  correctAnswers: score >= 80 ? 1 : 0,
  wrongAnswers: score >= 80 ? 0 : 1,
  timeSpentSeconds: 1,
  completedAt: new Date(0).toISOString(),
  answers: []
});
if (isLevelUnlocked(2, { knownWordIds: [] }, [])) errors.push("Unlock: HSK 2 natijasiz ochilib ketmoqda");
if (isLevelUnlocked(2, { knownWordIds: [] }, [unlockAttempt(79)])) errors.push("Unlock: HSK 2 79% bilan ochilib ketmoqda");
if (!isLevelUnlocked(2, { knownWordIds: [] }, [unlockAttempt(80)])) errors.push("Unlock: HSK 2 80% bilan ochilmadi");

function reportRepeatedLessonReference(kind: "reading" | "listening" | "speaking", ids: string[], maximum: number) {
  const counts = new Map<string, number>();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const [id, count] of counts) {
    if (count > maximum) warnings.push(`${kind} ${id}: ${count} ta darsda qayta ishlatilgan (tavsiya: ${maximum} tagacha)`);
  }
}

for (const level of [4, 5, 6] as const) {
  const lessons = hskLessonCurriculum.filter((item) => item.level === level);
  reportRepeatedLessonReference("reading", lessons.flatMap((lesson) => lesson.readingIds), 3);
  reportRepeatedLessonReference("listening", lessons.flatMap((lesson) => lesson.listeningIds), 3);
  reportRepeatedLessonReference("speaking", lessons.flatMap((lesson) => lesson.speakingTaskIds), 4);
}

function countByLevel(items: Array<{ level?: HSKLevel; hskLevel?: HSKLevel }>) {
  return Object.fromEntries(levels.map((level) => [level, items.filter((item) => (item.level ?? item.hskLevel) === level).length]));
}

if (errors.length) {
  console.error(`Kontent validatsiyasi xato: ${errors.length}`);
  for (const error of errors.slice(0, 120)) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Kontent hisobot:");
console.log("- vocabulary:", countByLevel(vocabularyEntries));
console.log("- app vocabulary:", countByLevel(hskWords));
console.log("- reading:", countByLevel(hskReadingContent));
console.log("- listening:", countByLevel(hskListeningContent));
console.log("- speaking:", countByLevel(hskSpeakingTasks));
console.log("- quiz:", countByLevel(hskQuizQuestions));
console.log("- exam:", countByLevel(hskCentralExamQuestions));
console.log("- exam templates:", countByLevel(hskExamTemplates));
console.log("- exam sections:", Object.fromEntries(levels.map((level) => [
  level,
  Object.fromEntries((hskExamTemplates.find((item) => item.level === level)?.sections ?? []).map((section) => [
    section.id,
    section.id === "listening" || section.id === "reading"
      ? section.questions.reduce((sum, item) => sum + item.questions.length, 0)
      : section.prompts.length
  ]))
])));
console.log("- unlock logic: HSK 2 yopiq <80%, ochiq >=80%");
console.log("- lessons:", countByLevel(hskLessonCurriculum));
console.log("- average words per lesson:", Object.fromEntries(levels.map((level) => {
  const lessons = hskLessonCurriculum.filter((item) => item.level === level);
  return [level, Number((lessons.reduce((sum, item) => sum + item.vocabularyIds.length, 0) / Math.max(1, lessons.length)).toFixed(1))];
})));
if (warnings.length) {
  console.warn(`Kontent ogohlantirishlari: ${warnings.length}`);
  for (const warning of warnings.slice(0, 24)) console.warn(`- ${warning}`);
}
console.log("Kontent validatsiyasi muvaffaqiyatli o‘tdi.");
