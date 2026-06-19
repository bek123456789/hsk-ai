import type { ExamSectionResult, ExamSkill, HSKLevel } from "@/types";
import type { ExamSpeakingPrompt } from "@/data/hsk/examSpeakingPrompts";
import type { ExamWritingPrompt } from "@/data/hsk/examWritingPrompts";
import { getCurriculumLessonsByLevel, type LessonSkillFocus } from "@/data/hsk/lessonCurriculum";
import { deterministicOpenAnswerScore, normalizeChineseAnswer } from "@/utils/answerEvaluation";

export const EXAM_PASSING_SCORE = 80;

function normalizeChinese(value: string) {
  return normalizeChineseAnswer(value);
}

function keywordCoverage(answer: string, keywords: string[]) {
  const normalized = normalizeChinese(answer);
  if (!normalized || !keywords.length) return 0;
  return keywords.filter((keyword) => normalized.includes(normalizeChinese(keyword))).length / keywords.length;
}

export function scoreChoiceSection(answerIds: Record<string, string>, questions: Array<{ questions: Array<{ id: string; correctOptionId: string }> }>): ExamSectionResult {
  const flat = questions.flatMap((item) => item.questions);
  const correct = flat.filter((question) => answerIds[question.id] === question.correctOptionId).length;
  return {
    score: Math.round((correct / Math.max(1, flat.length)) * 100),
    correct,
    total: flat.length
  };
}

export function scoreSpeakingAnswer(prompt: ExamSpeakingPrompt, answer: string) {
  return deterministicOpenAnswerScore({
    answer,
    keywordsZh: prompt.keywordsZh,
    minCharacters: prompt.level <= 2 ? 8 : prompt.level <= 4 ? 20 : 35,
    promptZh: prompt.textZh,
    promptPinyin: prompt.textPinyin,
    sampleAnswerZh: prompt.sampleAnswerZh,
    sampleAnswerPinyin: prompt.sampleAnswerPinyin,
    allowBeginnerPinyin: prompt.level <= 1,
    mode: "exam"
  }).score;
}

export function scoreWritingAnswer(prompt: ExamWritingPrompt, answer: string) {
  return deterministicOpenAnswerScore({
    answer,
    keywordsZh: prompt.expectedKeywordsZh,
    minCharacters: prompt.minCharacters,
    promptZh: prompt.instructionZh,
    sampleAnswerZh: prompt.sampleAnswerZh,
    sampleAnswerPinyin: prompt.sampleAnswerPinyin,
    allowBeginnerPinyin: prompt.level <= 1,
    mode: "exam"
  }).score;
}

export function scoreOpenSection(scores: number[], locale: "uz" | "ru", skill: "speaking" | "writing"): ExamSectionResult {
  const score = scores.length ? Math.round(scores.reduce((sum, item) => sum + item, 0) / scores.length) : 0;
  const passedItems = scores.filter((item) => item >= 60).length;
  const label = skill === "speaking"
    ? locale === "ru" ? "говорения" : "gapirish"
    : locale === "ru" ? "письма" : "yozish";
  return {
    score,
    correct: passedItems,
    total: scores.length,
    feedbackUz: score >= 80 ? `${label} bo‘yicha javoblar mazmunli va darajaga mos.` : `${label} bo‘yicha kalit so‘zlar va gap tuzilishini yana mashq qiling.`,
    feedbackRu: score >= 80 ? `Ответы по разделу ${label} содержательны и соответствуют уровню.` : `Повторите ключевые слова и структуру ответа в разделе ${label}.`
  };
}

export function calculateOverallExamScore(sections: Record<ExamSkill, ExamSectionResult>) {
  return Math.round(
    sections.listening.score * 0.25 +
    sections.reading.score * 0.25 +
    sections.speaking.score * 0.25 +
    sections.writing.score * 0.25
  );
}

export function getWeakExamSkills(sections: Record<ExamSkill, ExamSectionResult>) {
  return (Object.entries(sections) as Array<[ExamSkill, ExamSectionResult]>)
    .filter(([, result]) => result.score < 70)
    .map(([skill]) => skill);
}

export function getRecommendedExamLessons(level: HSKLevel, weakSkills: ExamSkill[]) {
  const lessons = getCurriculumLessonsByLevel(level);
  const skillMap: Record<ExamSkill, LessonSkillFocus> = {
    listening: "listening",
    reading: "reading",
    speaking: "speaking",
    writing: "writing"
  };
  const matched = lessons.filter((lesson) => weakSkills.some((skill) => lesson.skillFocus.includes(skillMap[skill])));
  return (matched.length ? matched : lessons).slice(0, 3).map((lesson) => lesson.id);
}
