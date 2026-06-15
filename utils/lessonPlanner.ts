import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { HSKLessonCurriculum } from "@/data/hsk/lessonCurriculum";
import { getLearningProgress } from "@/utils/learningProgress";
import { getSpeakingTaskProgress } from "@/utils/speakingProgress";

export type LessonProgressRecord = {
  lessonId: string;
  completedSections: string[];
  quizScore: number;
  quizTotal: number;
  markedDone: boolean;
  updatedAt: string;
};

const key = "hsk_lesson_progress";

function readRecords(): Record<string, LessonProgressRecord> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getAllLessonProgressRecords() {
  return readRecords();
}

function writeRecord(record: LessonProgressRecord) {
  if (typeof window === "undefined") return;
  const records = readRecords();
  window.localStorage.setItem(key, JSON.stringify({ ...records, [record.lessonId]: record }));
  void syncLessonProgress(record);
}

async function syncLessonProgress(record: LessonProgressRecord) {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    const payload = {
      user_id: userId,
      lesson_id: record.lessonId,
      completed_sections: record.completedSections,
      quiz_score: record.quizScore,
      quiz_total: record.quizTotal,
      completed: record.markedDone,
      updated_at: record.updatedAt
    };
    const { error } = await supabase.from("lesson_progress").upsert(
      payload,
      { onConflict: "user_id,lesson_id" }
    );
    if (error) await supabase.from("lesson_progress").insert(payload);
  } catch {
    // Optional Supabase table: LocalStorage remains the safe fallback.
  }
}

export function getLessonProgressRecord(lessonId: string): LessonProgressRecord {
  return readRecords()[lessonId] ?? {
    lessonId,
    completedSections: [],
    quizScore: 0,
    quizTotal: 0,
    markedDone: false,
    updatedAt: ""
  };
}

export function saveLessonSection(lessonId: string, section: string) {
  const current = getLessonProgressRecord(lessonId);
  writeRecord({
    ...current,
    completedSections: Array.from(new Set([...current.completedSections, section])),
    updatedAt: new Date().toISOString()
  });
}

export function saveLessonQuiz(lessonId: string, score: number, total: number) {
  const current = getLessonProgressRecord(lessonId);
  writeRecord({
    ...current,
    completedSections: Array.from(new Set([...current.completedSections, "quiz"])),
    quizScore: score,
    quizTotal: total,
    updatedAt: new Date().toISOString()
  });
}

export function markLessonDone(lessonId: string) {
  const current = getLessonProgressRecord(lessonId);
  writeRecord({ ...current, markedDone: true, updatedAt: new Date().toISOString() });
}

export function calculateLessonProgress(lesson: HSKLessonCurriculum, knownWordIds: string[]) {
  if (typeof window === "undefined") return 0;
  const record = getLessonProgressRecord(lesson.id);
  if (record.markedDone) return 100;
  const vocabularyDone = lesson.vocabularyIds.filter((id) => knownWordIds.includes(id)).length;
  const vocabularyRatio = vocabularyDone / Math.max(1, lesson.vocabularyIds.length);
  const readingDone = getLearningProgress("reading").some((item) => lesson.readingIds.includes(item.contentId) && item.done);
  const listeningDone = getLearningProgress("listening").some((item) => lesson.listeningIds.includes(item.contentId) && item.done);
  const speakingDone = getSpeakingTaskProgress().some((item) => lesson.speakingTaskIds.includes(item.taskId) && item.done);
  const quizRatio = record.quizTotal > 0 ? record.quizScore / record.quizTotal : 0;
  return Math.min(
    100,
    Math.round(
      vocabularyRatio * 30 +
      (record.completedSections.includes("grammar") ? 10 : 0) +
      (readingDone || record.completedSections.includes("reading") ? 15 : 0) +
      (listeningDone || record.completedSections.includes("listening") ? 15 : 0) +
      (speakingDone || record.completedSections.includes("speaking") ? 15 : 0) +
      quizRatio * 10
    )
  );
}

export function getLessonCompletionState(lesson: HSKLessonCurriculum, knownWordIds: string[]) {
  const record = getLessonProgressRecord(lesson.id);
  const readingDone = !lesson.readingIds.length || getLearningProgress("reading").some((item) => lesson.readingIds.includes(item.contentId) && item.done);
  const listeningDone = !lesson.listeningIds.length || getLearningProgress("listening").some((item) => lesson.listeningIds.includes(item.contentId) && item.done);
  const speakingDone = !lesson.speakingTaskIds.length || getSpeakingTaskProgress().some((item) => lesson.speakingTaskIds.includes(item.taskId) && item.done);
  const vocabularyDone = lesson.vocabularyIds.every((id) => knownWordIds.includes(id));
  const grammarDone = !lesson.grammarIds.length || record.completedSections.includes("grammar");
  const quizDone = !lesson.quizQuestionIds.length || record.quizTotal > 0 && record.quizScore / record.quizTotal >= 0.6;
  return {
    vocabularyDone,
    grammarDone,
    readingDone,
    listeningDone,
    speakingDone,
    quizDone,
    ready: vocabularyDone && grammarDone && readingDone && listeningDone && speakingDone && quizDone
  };
}

export function getNextLesson(levelLessons: HSKLessonCurriculum[], knownWordIds: string[]) {
  return levelLessons.find((lesson) => calculateLessonProgress(lesson, knownWordIds) < 100) ?? levelLessons[0];
}
