import { hskCentralExamQuestions } from "../data/hsk/examQuestions";
import { examQuestions as publicExamQuestions } from "../data/examQuestions";
import { hskLessonCurriculum } from "../data/hsk/lessonCurriculum";
import { hskListeningContent } from "../data/hsk/listening";
import { hskQuizQuestions } from "../data/hsk/quizQuestions";
import { hskReadingContent } from "../data/hsk/reading";
import { vocabularyEntries } from "../data/hsk/vocabulary";
import type { HSKContentOption, HSKSkillQuestion } from "../data/hsk/contentTypes";
import type { HSKLevel } from "../types";

type ChoiceQuestion = {
  id: string;
  level: HSKLevel;
  options: HSKContentOption[];
  correctOptionId: "a" | "b" | "c" | "d";
  explanationUz: string;
  explanationRu: string;
  source: string;
};

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];
const optionIds = ["a", "b", "c", "d"] as const;
const failures: string[] = [];
const placeholderRegex = /\b(lorem|todo|example only|answer a|test)\b/i;
const minimumQuizCounts: Record<HSKLevel, number> = { 1: 120, 2: 120, 3: 100, 4: 100, 5: 80, 6: 80 };
const minimumSkillCounts: Record<HSKLevel, number> = { 1: 30, 2: 30, 3: 30, 4: 30, 5: 30, 6: 30 };
const advancedHskTerms = vocabularyEntries
  .filter((word) => word.level >= 4 && word.hanzi.length >= 2)
  .map((word) => word.hanzi);

function optionText(option: HSKContentOption) {
  return [option.textUz, option.textRu, option.textZh, option.textPinyin]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" | ");
}

function pushQuestion(question: HSKSkillQuestion, source: string): ChoiceQuestion | null {
  if (!question.options?.length || !question.correctOptionId) return null;
  return {
    id: question.id,
    level: question.level,
    options: question.options,
    correctOptionId: question.correctOptionId,
    explanationUz: question.explanationUz,
    explanationRu: question.explanationRu,
    source
  };
}

const quizQuestions = hskQuizQuestions
  .map((question) => pushQuestion(question, "quiz"))
  .filter((question): question is ChoiceQuestion => Boolean(question));

const examQuestions = hskCentralExamQuestions
  .map((question) => pushQuestion(question, "exam"))
  .filter((question): question is ChoiceQuestion => Boolean(question));

const readingQuestions: ChoiceQuestion[] = hskReadingContent.flatMap((passage) =>
  passage.questions.map((question) => ({
    id: question.id,
    level: passage.level,
    options: question.options,
    correctOptionId: question.correctOptionId,
    explanationUz: question.explanationUz,
    explanationRu: question.explanationRu,
    source: "reading"
  }))
);

const listeningQuestions: ChoiceQuestion[] = hskListeningContent.flatMap((prompt) =>
  prompt.questions.map((question) => ({
    id: question.id,
    level: prompt.level,
    options: question.options,
    correctOptionId: question.correctOptionId,
    explanationUz: question.explanationUz,
    explanationRu: question.explanationRu,
    source: "listening"
  }))
);

const allQuestions = [...quizQuestions, ...readingQuestions, ...listeningQuestions, ...examQuestions];

const publicExamChoiceQuestions: ChoiceQuestion[] = publicExamQuestions.flatMap((question) => {
  const rows: ChoiceQuestion[] = [];
  if (question.optionsUz.length >= 3) {
    const correctIndex = question.optionsUz.findIndex((option) => option === question.correctAnswerUz);
    rows.push({
      id: `${question.id}:uz`,
      level: question.hskLevel,
      options: question.optionsUz.map((option, index) => ({ id: optionIds[index] ?? "d", textUz: option })),
      correctOptionId: optionIds[correctIndex] ?? "a",
      explanationUz: question.explanationUz,
      explanationRu: question.explanationRu,
      source: "public-exam-uz"
    });
  }
  if (question.optionsRu.length >= 3) {
    const correctIndex = question.optionsRu.findIndex((option) => option === question.correctAnswerRu);
    rows.push({
      id: `${question.id}:ru`,
      level: question.hskLevel,
      options: question.optionsRu.map((option, index) => ({ id: optionIds[index] ?? "d", textRu: option })),
      correctOptionId: optionIds[correctIndex] ?? "a",
      explanationUz: question.explanationUz,
      explanationRu: question.explanationRu,
      source: "public-exam-ru"
    });
  }
  return rows;
});

function checkUniqueIds() {
  const seen = new Set<string>();
  for (const question of allQuestions) {
    if (seen.has(question.id)) failures.push(`${question.id}: duplicate question id`);
    seen.add(question.id);
  }
}

function checkOptions(question: ChoiceQuestion) {
  if (question.options.length < 3) failures.push(`${question.id}: kamida 3 ta option bo‘lishi kerak`);
  if (question.options.length !== 4) failures.push(`${question.id}: 4 ta option kutilgan`);
  const ids = question.options.map((option) => option.id);
  if (new Set(ids).size !== ids.length) failures.push(`${question.id}: option id takrorlangan`);
  if (!question.options.some((option) => option.id === question.correctOptionId)) {
    failures.push(`${question.id}: correctOptionId options ichida yo‘q`);
  }

  const texts = question.options.map(optionText);
  if (texts.some((text) => !text.trim())) failures.push(`${question.id}: bo‘sh option bor`);
  if (new Set(texts.map((text) => text.toLowerCase())).size !== texts.length) failures.push(`${question.id}: duplicate option text bor`);

  for (const text of texts) {
    if (placeholderRegex.test(text)) failures.push(`${question.id}: placeholder option text: ${text}`);
  }
}

function checkExplanations(question: ChoiceQuestion) {
  if (!question.explanationUz?.trim()) failures.push(`${question.id}: explanationUz bo‘sh`);
  if (!question.explanationRu?.trim()) failures.push(`${question.id}: explanationRu bo‘sh`);
  if (!question.source.startsWith("public-exam") && question.explanationUz && question.explanationUz.trim().length < 20) failures.push(`${question.id}: explanationUz juda qisqa`);
  if (/^(correct|to‘g‘ri|bu to‘g‘ri javob)$/i.test(question.explanationUz.trim())) {
    failures.push(`${question.id}: explanationUz o‘rgatuvchi emas`);
  }
  if (/^(correct|верно|правильно)$/i.test(question.explanationRu.trim())) {
    failures.push(`${question.id}: explanationRu o‘rgatuvchi emas`);
  }
}

function checkHsk1AdvancedTerms(question: ChoiceQuestion) {
  if (question.level !== 1) return;
  const chineseOptions = question.options.map((option) => option.textZh ?? "").filter(Boolean);
  const leaked = advancedHskTerms.find((term) => chineseOptions.some((option) => option === term));
  if (leaked) failures.push(`${question.id}: HSK 1 ichida advanced HSK 4-6 so‘z bor: ${leaked}`);
}

function checkDistribution(label: string, questions: ChoiceQuestion[]) {
  if (!questions.length) return;
  const counts = Object.fromEntries(optionIds.map((id) => [id, 0])) as Record<(typeof optionIds)[number], number>;
  for (const question of questions) counts[question.correctOptionId] += 1;
  const usedPositions = optionIds.filter((id) => counts[id] > 0).length;
  if (questions.length < 8) {
    if (usedPositions < Math.min(3, questions.length)) {
      failures.push(`${label}: correct answer pozitsiyalari yetarlicha aralashmagan`);
    }
    if (counts.a >= Math.max(4, questions.length)) {
      failures.push(`${label}: correct answer A juda ko‘p (${counts.a}/${questions.length})`);
    }
    return;
  }

  const firstRatio = counts.a / questions.length;
  if (firstRatio > 0.45) {
    failures.push(`${label}: correct answer A juda ko‘p (${counts.a}/${questions.length})`);
  }
  if (questions.length >= 12) {
    const expected = questions.length / 4;
    for (const id of optionIds) {
      if (Math.abs(counts[id] - expected) > Math.max(4, questions.length * 0.22)) {
        failures.push(`${label}: ${id.toUpperCase()} distribution balanssiz (${counts[id]}/${questions.length})`);
      }
    }
  }
}

function checkRuns(label: string, questions: ChoiceQuestion[]) {
  let previous = "";
  let run = 0;
  for (const question of questions) {
    if (question.correctOptionId === previous) {
      run += 1;
    } else {
      previous = question.correctOptionId;
      run = 1;
    }
    if (run > 3) failures.push(`${label}: ${question.id} oldidan 3 tadan ko‘p bir xil correct position ketma-ket keldi`);
  }
}

function checkDuplicateQuestionText(label: string, questions: ChoiceQuestion[]) {
  const seen = new Map<string, string>();
  for (const question of questions) {
    if (question.source !== "quiz" && question.source !== "exam") continue;
    if (!/(?:^quiz-hsk|^exam-hsk)/.test(question.id)) continue;
    const key = `${question.level}:${question.source}:${question.options.map(optionText).join("|")}:${question.explanationUz}`.toLowerCase();
    const previous = seen.get(key);
    if (previous) failures.push(`${label}: duplicate question content ${previous} va ${question.id}`);
    seen.set(key, question.id);
  }
}

function checkMinimumCounts() {
  for (const level of levels) {
    const quizCount = quizQuestions.filter((question) => question.level === level).length;
    const readingCount = hskReadingContent.filter((item) => item.level === level).length;
    const listeningCount = hskListeningContent.filter((item) => item.level === level).length;
    if (quizCount < minimumQuizCounts[level]) failures.push(`HSK ${level}: quiz count ${quizCount}, minimum ${minimumQuizCounts[level]}`);
    if (readingCount < minimumSkillCounts[level]) failures.push(`HSK ${level}: reading count ${readingCount}, minimum ${minimumSkillCounts[level]}`);
    if (listeningCount < minimumSkillCounts[level]) failures.push(`HSK ${level}: listening count ${listeningCount}, minimum ${minimumSkillCounts[level]}`);
  }
}

function checkLessonMiniTests() {
  const questionById = new Map(quizQuestions.map((question) => [question.id, question]));
  for (const lesson of hskLessonCurriculum) {
    const questions = lesson.quizQuestionIds
      .map((id) => questionById.get(id))
      .filter((question): question is ChoiceQuestion => Boolean(question));
    if (questions.length < 5) failures.push(`${lesson.id}: mini testda kamida 5 savol bo‘lishi kerak`);
    if (questions.some((question) => question.level !== lesson.level)) failures.push(`${lesson.id}: mini testda boshqa HSK level savoli bor`);
    checkRuns(`${lesson.id} mini test`, questions);
    checkDistribution(`${lesson.id} mini test`, questions);
  }
}

checkUniqueIds();
checkMinimumCounts();
checkDuplicateQuestionText("quiz/exam", allQuestions);
for (const question of allQuestions) {
  checkOptions(question);
  checkExplanations(question);
  checkHsk1AdvancedTerms(question);
}
for (const question of publicExamChoiceQuestions) {
  checkOptions(question);
  checkExplanations(question);
}

for (const level of levels) {
  checkDistribution(`HSK ${level} quiz`, quizQuestions.filter((question) => question.level === level));
  checkDistribution(`HSK ${level} exam`, examQuestions.filter((question) => question.level === level));
  checkDistribution(`HSK ${level} public exam`, publicExamChoiceQuestions.filter((question) => question.level === level));
  checkRuns(`HSK ${level} exam`, examQuestions.filter((question) => question.level === level));
  checkRuns(`HSK ${level} public exam`, publicExamChoiceQuestions.filter((question) => question.level === level));
}

checkLessonMiniTests();

if (failures.length) {
  console.error(`Question quality test xato: ${failures.length}`);
  failures.slice(0, 100).forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const summary = levels.map((level) => {
  const questions = quizQuestions.filter((question) => question.level === level);
  const counts = optionIds.map((id) => `${id.toUpperCase()}:${questions.filter((question) => question.correctOptionId === id).length}`).join(" ");
  const reading = hskReadingContent.filter((item) => item.level === level).length;
  const listening = hskListeningContent.filter((item) => item.level === level).length;
  return `HSK ${level} quiz ${questions.length} (${counts}) · reading ${reading} · listening ${listening}`;
});

const topicSummary = levels.map((level) => {
  const tags = [...hskReadingContent, ...hskListeningContent]
    .filter((item) => item.level === level)
    .flatMap((item) => item.tags?.filter((tag) => !tag.startsWith("hsk-") && tag !== "reading" && tag !== "listening") ?? []);
  const counts = tags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = (acc[tag] ?? 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag, count]) => `${tag}:${count}`)
    .join(" ");
  return `HSK ${level} topics ${top}`;
});

console.log("Question quality: optionlar, correct distribution, izohlar, HSK level va mini test patternlari o‘tdi.");
console.log(summary.join("\n"));
console.log(topicSummary.join("\n"));
