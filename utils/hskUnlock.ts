import { getCurriculumLessonsByLevel } from "@/data/hsk/lessonCurriculum";
import type { AppLanguage, ExamAttempt, HSKLevel } from "@/types";
import { calculateLessonProgress } from "@/utils/lessonPlanner";

export const HSK_PASSING_SCORE = 80;

export type HskProgressSnapshot = {
  knownWordIds: string[];
};

export function getBestExamScore(level: HSKLevel, examResults: ExamAttempt[]) {
  return examResults
    .filter((attempt) => attempt.hskLevel === level)
    .reduce((best, attempt) => Math.max(best, attempt.overallScore ?? attempt.accuracy), 0);
}

export function getCompletedLessonCount(level: HSKLevel, progress: HskProgressSnapshot) {
  return getCurriculumLessonsByLevel(level).filter((lesson) => calculateLessonProgress(lesson, progress.knownWordIds) === 100).length;
}

export function areRequiredLessonsCompleted(level: HSKLevel, progress: HskProgressSnapshot) {
  const lessons = getCurriculumLessonsByLevel(level);
  return lessons.length > 0 && getCompletedLessonCount(level, progress) === lessons.length;
}

export function isLevelUnlocked(level: HSKLevel, _progress: HskProgressSnapshot, examResults: ExamAttempt[]) {
  if (level === 1) return true;
  return getBestExamScore((level - 1) as HSKLevel, examResults) >= HSK_PASSING_SCORE;
}

export function isExamUnlocked(level: HSKLevel, progress: HskProgressSnapshot, examResults: ExamAttempt[]) {
  return isLevelUnlocked(level, progress, examResults) && areRequiredLessonsCompleted(level, progress);
}

export function getUnlockedHskLevels(progress: HskProgressSnapshot, examResults: ExamAttempt[]) {
  return ([1, 2, 3, 4, 5, 6] as HSKLevel[]).filter((level) => isLevelUnlocked(level, progress, examResults));
}

export function getLevelLockReason(level: HSKLevel, progress: HskProgressSnapshot, examResults: ExamAttempt[], locale: AppLanguage) {
  if (isLevelUnlocked(level, progress, examResults)) return "";
  const previous = (level - 1) as HSKLevel;
  return locale === "ru"
    ? `Чтобы открыть уроки HSK ${level}, сдайте экзамен HSK ${previous} на 80% или выше.`
    : `HSK ${level} darslarini ochish uchun HSK ${previous} imtihonidan 80% yoki yuqori ball oling.`;
}

export function getExamLockReason(level: HSKLevel, progress: HskProgressSnapshot, examResults: ExamAttempt[], locale: AppLanguage) {
  if (!isLevelUnlocked(level, progress, examResults)) return getLevelLockReason(level, progress, examResults, locale);
  if (!areRequiredLessonsCompleted(level, progress)) {
    return locale === "ru"
      ? `Чтобы открыть этот экзамен, завершите уроки HSK ${level}.`
      : `Bu imtihonni ochish uchun HSK ${level} darslarini yakunlang.`;
  }
  return "";
}

export function getNextRequiredAction(level: HSKLevel, progress: HskProgressSnapshot, examResults: ExamAttempt[], locale: AppLanguage) {
  if (!isLevelUnlocked(level, progress, examResults)) {
    return locale === "ru" ? "Сначала пройдите предыдущий уровень." : "Avval oldingi darajadan o‘ting.";
  }
  if (!areRequiredLessonsCompleted(level, progress)) {
    return locale === "ru" ? "Завершите уроки этого уровня." : "Bu daraja darslarini yakunlang.";
  }
  if (getBestExamScore(level, examResults) < HSK_PASSING_SCORE) {
    return locale === "ru" ? "Сдайте экзамен на 80% или выше." : "Imtihondan 80% yoki yuqori ball oling.";
  }
  return locale === "ru" ? "Следующий уровень открыт." : "Keyingi daraja ochildi.";
}
