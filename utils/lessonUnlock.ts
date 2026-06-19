import { getCurriculumLesson, getCurriculumLessonsByLevel, type HSKLessonCurriculum } from "@/data/hsk/lessonCurriculum";
import type { AppLanguage, ExamAttempt, HSKLevel } from "@/types";
import { isLevelUnlocked } from "@/utils/hskUnlock";
import { calculateLessonProgress, getAllLessonProgressRecords, type LessonProgressRecord } from "@/utils/lessonPlanner";

export type LessonUnlockProgress = {
  knownWordIds?: string[];
  lessonProgress?: Record<string, LessonProgressRecord>;
};

type NormalizedLessonProgress = {
  knownWordIds: string[];
  lessonProgress: Record<string, LessonProgressRecord>;
};

function sortedLessons(level: HSKLevel) {
  return [...getCurriculumLessonsByLevel(level)].sort((first, second) => first.order - second.order);
}

function normalizeProgress(progress?: LessonUnlockProgress | Record<string, LessonProgressRecord>): NormalizedLessonProgress {
  if (!progress) return { knownWordIds: [] as string[], lessonProgress: getAllLessonProgressRecords() };
  const candidate = progress as LessonUnlockProgress;
  if (Array.isArray(candidate.knownWordIds) || candidate.lessonProgress) {
    return {
      knownWordIds: candidate.knownWordIds ?? [],
      lessonProgress: candidate.lessonProgress ?? getAllLessonProgressRecords()
    };
  }
  return {
    knownWordIds: [] as string[],
    lessonProgress: progress as Record<string, LessonProgressRecord>
  };
}

function progressDone(lesson: HSKLessonCurriculum, progress?: LessonUnlockProgress | Record<string, LessonProgressRecord>) {
  const normalized = normalizeProgress(progress);
  const record = normalized.lessonProgress[lesson.id];
  return Boolean(record?.markedDone || record?.done || record?.progress === 100) || calculateLessonProgress(lesson, normalized.knownWordIds) === 100;
}

export function getLessonOrder(level: HSKLevel) {
  return sortedLessons(level);
}

export function getNextLesson(level: HSKLevel, lessonId: string) {
  const lessons = sortedLessons(level);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 ? lessons[index + 1] ?? null : null;
}

export function getPreviousLesson(level: HSKLevel, lessonId: string) {
  const lessons = sortedLessons(level);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index > 0 ? lessons[index - 1] ?? null : null;
}

export function isLessonCompleted(level: HSKLevel, lessonId: string, progress?: LessonUnlockProgress | Record<string, LessonProgressRecord>) {
  const lesson = getCurriculumLesson(level, lessonId);
  return lesson ? progressDone(lesson, progress) : false;
}

export function isLessonUnlocked(
  level: HSKLevel,
  lessonId: string,
  lessonProgress: LessonUnlockProgress | Record<string, LessonProgressRecord> | undefined,
  examResults: ExamAttempt[]
) {
  const progress = normalizeProgress(lessonProgress);
  if (!isLevelUnlocked(level, { knownWordIds: progress.knownWordIds }, examResults)) return false;

  const lessons = sortedLessons(level);
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) return false;
  if (lesson.order === 1) return true;

  const previousLesson = getPreviousLesson(level, lessonId);
  return previousLesson ? progressDone(previousLesson, progress) : false;
}

export function getLessonLockReason(
  level: HSKLevel,
  lessonId: string,
  lessonProgress: LessonUnlockProgress | Record<string, LessonProgressRecord> | undefined,
  examResults: ExamAttempt[],
  locale: AppLanguage
) {
  const progress = normalizeProgress(lessonProgress);
  if (!isLevelUnlocked(level, { knownWordIds: progress.knownWordIds }, examResults)) {
    const previousLevel = Math.max(1, level - 1);
    return locale === "ru"
      ? `Сначала сдайте экзамен HSK ${previousLevel} на 80% или выше.`
      : `Avval HSK ${previousLevel} imtihonidan 80% yoki undan yuqori ball oling.`;
  }

  const previousLesson = getPreviousLesson(level, lessonId);
  if (previousLesson && !progressDone(previousLesson, progress)) {
    const title = locale === "ru" ? previousLesson.titleRu : previousLesson.titleUz;
    return locale === "ru"
      ? `Сначала завершите урок ${title}.`
      : `Avval ${title} darsini yakunlang.`;
  }

  return "";
}

export function getCurrentAvailableLesson(level: HSKLevel, lessonProgress?: LessonUnlockProgress | Record<string, LessonProgressRecord>) {
  const progress = normalizeProgress(lessonProgress);
  const lessons = sortedLessons(level);
  return lessons.find((lesson) => !progressDone(lesson, progress)) ?? null;
}

export function getLevelCompletionStatus(level: HSKLevel, lessonProgress?: LessonUnlockProgress | Record<string, LessonProgressRecord>) {
  const progress = normalizeProgress(lessonProgress);
  const lessons = sortedLessons(level);
  const completedLessons = lessons.filter((lesson) => progressDone(lesson, progress));
  const currentLesson = lessons.find((lesson) => !progressDone(lesson, progress)) ?? null;
  return {
    total: lessons.length,
    completed: completedLessons.length,
    allCompleted: lessons.length > 0 && completedLessons.length === lessons.length,
    currentLesson,
    progressPercent: Math.round((completedLessons.length / Math.max(1, lessons.length)) * 100)
  };
}
