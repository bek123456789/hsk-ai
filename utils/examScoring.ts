import type { ExamSectionResult, ExamSkill, HSKLevel } from "@/types";
import type { ExamSpeakingPrompt } from "@/data/hsk/examSpeakingPrompts";
import type { ExamWritingPrompt } from "@/data/hsk/examWritingPrompts";
import { getCurriculumLessonsByLevel, type LessonSkillFocus } from "@/data/hsk/lessonCurriculum";

export const EXAM_PASSING_SCORE = 80;

function normalizeChinese(value: string) {
  return value.toLowerCase().replace(/[\s，。！？、,.!?;；:："'“”‘’（）()]/g, "");
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
  const normalized = normalizeChinese(answer);
  if (!normalized) return 0;
  const source = normalizeChinese(prompt.textZh);
  const copiedRatio = source && normalized.length >= Math.min(12, source.length * 0.7) && source.includes(normalized) ? 1 : 0;
  const coverage = keywordCoverage(answer, prompt.keywordsZh);
  const lengthTarget = prompt.level <= 2 ? 8 : prompt.level <= 4 ? 20 : 35;
  const lengthScore = Math.min(1, normalized.length / lengthTarget);
  const score = Math.round(coverage * 70 + lengthScore * 30);
  return copiedRatio ? Math.min(45, score) : Math.min(100, score);
}

export function scoreWritingAnswer(prompt: ExamWritingPrompt, answer: string) {
  const normalized = normalizeChinese(answer);
  if (!normalized) return 0;
  const coverage = keywordCoverage(answer, prompt.expectedKeywordsZh);
  const lengthScore = Math.min(1, normalized.length / Math.max(1, prompt.minCharacters));
  return Math.min(100, Math.round(coverage * 65 + lengthScore * 35));
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
