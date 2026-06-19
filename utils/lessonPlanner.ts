import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { HSKLessonCurriculum } from "@/data/hsk/lessonCurriculum";
import { getLearningProgress } from "@/utils/learningProgress";
import { getSpeakingTaskProgress } from "@/utils/speakingProgress";

export type LessonProgressRecord = {
  lessonId: string;
  level?: number;
  completedSections: string[];
  sections?: Partial<Record<LessonSectionKey, boolean>>;
  quizScore: number;
  quizTotal: number;
  progress?: number;
  markedDone: boolean;
  done?: boolean;
  completedAt?: string;
  updatedAt: string;
};

const key = "hsk_lesson_progress";
const miniTestPassingRatio = 0.6;
export const requiredLessonSections = ["vocabulary", "grammar", "reading", "listening", "speaking", "miniTest"] as const;
export type LessonSectionKey = typeof requiredLessonSections[number];

function normalizeSection(section: string): LessonSectionKey | string {
  return section === "quiz" ? "miniTest" : section;
}

function normalizeCompletedSections(sections: unknown): string[] {
  if (!Array.isArray(sections)) return [];
  return Array.from(new Set(sections.filter((item): item is string => typeof item === "string").map(normalizeSection)));
}

function normalizeRecord(lessonId: string, raw: Partial<LessonProgressRecord> | undefined): LessonProgressRecord {
  const completedSections = normalizeCompletedSections(raw?.completedSections);
  const rawSections = raw?.sections && typeof raw.sections === "object" ? raw.sections : {};
  const sections: Partial<Record<LessonSectionKey, boolean>> = {};
  for (const section of requiredLessonSections) {
    sections[section] = rawSections[section] === true || completedSections.includes(section);
  }
  const markedDone = raw?.markedDone === true || raw?.done === true || raw?.progress === 100;
  return {
    lessonId,
    level: raw?.level,
    completedSections,
    sections,
    quizScore: typeof raw?.quizScore === "number" ? raw.quizScore : 0,
    quizTotal: typeof raw?.quizTotal === "number" ? raw.quizTotal : 0,
    progress: typeof raw?.progress === "number" ? raw.progress : markedDone ? 100 : undefined,
    markedDone,
    done: markedDone,
    completedAt: raw?.completedAt,
    updatedAt: raw?.updatedAt ?? ""
  };
}

function readRecords(): Record<string, LessonProgressRecord> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, Partial<LessonProgressRecord>>).map(([lessonId, record]) => [lessonId, normalizeRecord(lessonId, record)])
    );
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
  const normalized = normalizeRecord(record.lessonId, record);
  window.localStorage.setItem(key, JSON.stringify({ ...records, [record.lessonId]: normalized }));
  void syncLessonProgress(normalized);
}

async function syncLessonProgress(record: LessonProgressRecord) {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    const legacyPayload = {
      user_id: userId,
      lesson_id: record.lessonId,
      completed_sections: record.completedSections,
      quiz_score: record.quizScore,
      quiz_total: record.quizTotal,
      completed: record.markedDone || record.done === true,
      updated_at: record.updatedAt
    };
    const modernPayload = {
      ...legacyPayload,
      level: record.level,
      progress: record.progress ?? (record.markedDone || record.done ? 100 : 0),
      done: record.markedDone || record.done === true,
      sections: record.sections ?? {},
      completed_at: record.completedAt ?? null
    };
    const { error } = await supabase.from("lesson_progress").upsert(
      modernPayload,
      { onConflict: "user_id,lesson_id" }
    );
    if (error) {
      const { error: legacyError } = await supabase.from("lesson_progress").upsert(
        legacyPayload,
        { onConflict: "user_id,lesson_id" }
      );
      if (legacyError) await supabase.from("lesson_progress").insert(legacyPayload);
    }
  } catch {
    // Optional Supabase table: LocalStorage remains the safe fallback.
  }
}

export function getLessonProgressRecord(lessonId: string): LessonProgressRecord {
  return readRecords()[lessonId] ?? normalizeRecord(lessonId, undefined);
}

export function saveLessonSection(lessonId: string, section: string, level?: number) {
  const current = getLessonProgressRecord(lessonId);
  const normalizedSection = normalizeSection(section);
  const sections = { ...(current.sections ?? {}) };
  if (requiredLessonSections.includes(normalizedSection as LessonSectionKey)) {
    sections[normalizedSection as LessonSectionKey] = true;
  }
  writeRecord({
    ...current,
    level: level ?? current.level,
    completedSections: Array.from(new Set([...current.completedSections, normalizedSection])),
    sections,
    updatedAt: new Date().toISOString()
  });
}

export function saveLessonQuiz(lessonId: string, score: number, total: number, level?: number) {
  const current = getLessonProgressRecord(lessonId);
  const passed = total === 0 || score / total >= miniTestPassingRatio;
  const sections = { ...(current.sections ?? {}) };
  if (passed) sections.miniTest = true;
  writeRecord({
    ...current,
    level: level ?? current.level,
    completedSections: passed ? Array.from(new Set([...current.completedSections, "miniTest"])) : current.completedSections,
    sections,
    quizScore: score,
    quizTotal: total,
    updatedAt: new Date().toISOString()
  });
}

export function markLessonDone(lessonId: string, level?: number) {
  const current = getLessonProgressRecord(lessonId);
  const now = new Date().toISOString();
  const sections = { ...(current.sections ?? {}) };
  for (const section of requiredLessonSections) sections[section] = true;
  writeRecord({
    ...current,
    level: level ?? current.level,
    completedSections: Array.from(new Set([...current.completedSections, ...requiredLessonSections])),
    sections,
    progress: 100,
    markedDone: true,
    done: true,
    completedAt: current.completedAt ?? now,
    updatedAt: now
  });
}

function lessonRequiredSections(lesson: HSKLessonCurriculum): LessonSectionKey[] {
  const sections: LessonSectionKey[] = [];
  if (lesson.vocabularyIds.length) sections.push("vocabulary");
  if (lesson.grammarIds.length) sections.push("grammar");
  if (lesson.readingIds.length) sections.push("reading");
  if (lesson.listeningIds.length) sections.push("listening");
  if (lesson.speakingTaskIds.length) sections.push("speaking");
  if (lesson.quizQuestionIds.length) sections.push("miniTest");
  return sections.length ? sections : [...requiredLessonSections];
}

export function getLessonSectionState(lesson: HSKLessonCurriculum, knownWordIds: string[]) {
  const record = getLessonProgressRecord(lesson.id);
  const sectionDone = (section: LessonSectionKey) => record.sections?.[section] === true || record.completedSections.includes(section);
  const readingDone = !lesson.readingIds.length || sectionDone("reading") || getLearningProgress("reading").some((item) => lesson.readingIds.includes(item.contentId) && item.done);
  const listeningDone = !lesson.listeningIds.length || sectionDone("listening") || getLearningProgress("listening").some((item) => lesson.listeningIds.includes(item.contentId) && item.done);
  const speakingDone = !lesson.speakingTaskIds.length || sectionDone("speaking") || getSpeakingTaskProgress().some((item) => lesson.speakingTaskIds.includes(item.taskId) && item.done);
  const vocabularyDone = !lesson.vocabularyIds.length || sectionDone("vocabulary") || lesson.vocabularyIds.every((id) => knownWordIds.includes(id));
  const grammarDone = !lesson.grammarIds.length || sectionDone("grammar");
  const miniTestDone = !lesson.quizQuestionIds.length || sectionDone("miniTest") || record.quizTotal > 0 && record.quizScore / record.quizTotal >= miniTestPassingRatio;
  return {
    vocabulary: vocabularyDone,
    grammar: grammarDone,
    reading: readingDone,
    listening: listeningDone,
    speaking: speakingDone,
    miniTest: miniTestDone
  } satisfies Record<LessonSectionKey, boolean>;
}

export function completeLessonIfReady(lesson: HSKLessonCurriculum, knownWordIds: string[]) {
  const completion = getLessonCompletionState(lesson, knownWordIds);
  if (!completion.ready) return false;
  markLessonDone(lesson.id, lesson.level);
  return true;
}

export function calculateLessonProgress(lesson: HSKLessonCurriculum, knownWordIds: string[]) {
  if (typeof window === "undefined") return 0;
  const record = getLessonProgressRecord(lesson.id);
  if (record.markedDone || record.done === true || record.progress === 100) return 100;
  const sections = getLessonSectionState(lesson, knownWordIds);
  const required = lessonRequiredSections(lesson);
  const completed = required.filter((section) => sections[section]).length;
  return completed === required.length ? 100 : Math.round((completed / Math.max(1, required.length)) * 100);
}

export function getLessonCompletionState(lesson: HSKLessonCurriculum, knownWordIds: string[]) {
  const sections = getLessonSectionState(lesson, knownWordIds);
  return {
    vocabularyDone: sections.vocabulary,
    grammarDone: sections.grammar,
    readingDone: sections.reading,
    listeningDone: sections.listening,
    speakingDone: sections.speaking,
    quizDone: sections.miniTest,
    miniTestDone: sections.miniTest,
    ready: lessonRequiredSections(lesson).every((section) => sections[section])
  };
}

export function getNextLesson(levelLessons: HSKLessonCurriculum[], knownWordIds: string[]) {
  return levelLessons.find((lesson) => calculateLessonProgress(lesson, knownWordIds) < 100) ?? levelLessons[0];
}
