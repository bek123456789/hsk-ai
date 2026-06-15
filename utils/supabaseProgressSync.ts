"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { migrateLocalProgressToSupabase } from "@/lib/progressService";
import type { ExamAttempt, ExamSectionResult, ExamSkill, HSKLevel, MistakeRecord, WordReviewState } from "@/types";
import type { LearningProgressKind, LearningProgressRecord } from "@/utils/learningProgress";
import type { LessonProgressRecord } from "@/utils/lessonPlanner";
import type { SpeakingEvaluationResult, SpeakingProgressRecord } from "@/utils/speakingProgress";
import { vocabularyEntries } from "@/data/hsk/vocabulary";
import { examResultsKey, readExamResults } from "@/utils/examProgress";

type JsonRecord = Record<string, unknown>;

const lessonKey = "hsk_lesson_progress";
const readingKey = "hsk_reading_progress";
const listeningKey = "hsk_listening_progress";
const speakingKey = "hsk_speaking_progress";

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function booleanValue(value: unknown) {
  return value === true;
}

function readObject<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "{}");
    return isRecord(parsed) ? (parsed as Record<string, T>) : {};
  } catch {
    return {};
  }
}

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function latestDate(first?: string, second?: string) {
  const firstTime = first ? Date.parse(first) : 0;
  const secondTime = second ? Date.parse(second) : 0;
  return firstTime >= secondTime ? first ?? second ?? "" : second ?? first ?? "";
}

function mergeLessonRecord(local: LessonProgressRecord | undefined, remote: LessonProgressRecord) {
  if (!local) return remote;
  const localRatio = local.quizTotal > 0 ? local.quizScore / local.quizTotal : 0;
  const remoteRatio = remote.quizTotal > 0 ? remote.quizScore / remote.quizTotal : 0;
  const quizSource = remoteRatio > localRatio ? remote : local;
  return {
    lessonId: remote.lessonId,
    completedSections: Array.from(new Set([...local.completedSections, ...remote.completedSections])),
    quizScore: quizSource.quizScore,
    quizTotal: quizSource.quizTotal,
    markedDone: local.markedDone || remote.markedDone,
    updatedAt: latestDate(local.updatedAt, remote.updatedAt)
  };
}

function mergeActivityRecords(local: LearningProgressRecord[], remote: LearningProgressRecord[]) {
  const merged = new Map<string, LearningProgressRecord>();
  for (const record of [...remote, ...local]) {
    const current = merged.get(record.contentId);
    if (!current) {
      merged.set(record.contentId, record);
      continue;
    }
    const currentRatio = current.total > 0 ? current.score / current.total : 0;
    const nextRatio = record.total > 0 ? record.score / record.total : 0;
    if (record.done && !current.done || nextRatio > currentRatio || Date.parse(record.completedAt) > Date.parse(current.completedAt)) {
      merged.set(record.contentId, {
        ...record,
        done: current.done || record.done,
        mistakes: Array.from(new Set([...current.mistakes, ...record.mistakes]))
      });
    }
  }
  return Array.from(merged.values()).sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt)).slice(0, 200);
}

function defaultSpeakingFeedback(row: JsonRecord): SpeakingEvaluationResult {
  const score = numberValue(row.score);
  return {
    ok: true,
    done: booleanValue(row.done),
    score,
    meaningScore: numberValue(row.meaning_score, score),
    grammarScore: numberValue(row.grammar_score, score),
    vocabularyScore: numberValue(row.vocabulary_score, score),
    fluencyScore: numberValue(row.fluency_score, score),
    feedbackUz: "Oldingi gapirish natijasi Supabase’dan yuklandi.",
    feedbackRu: "Предыдущий результат говорения загружен из Supabase.",
    correctedAnswerZh: text(row.corrected_answer_zh),
    correctedAnswerPinyin: "",
    explanationUz: "Natija hisobingiz bilan sinxronlashtirildi.",
    explanationRu: "Результат синхронизирован с вашим аккаунтом.",
    missingPointsUz: [],
    missingPointsRu: [],
    goodPointsUz: [],
    goodPointsRu: [],
    nextTipUz: "Keyingi mashqda asosiy fikrni to‘liqroq ayting.",
    nextTipRu: "В следующей попытке полнее передайте главную мысль."
  };
}

function mergeSpeakingRecords(local: SpeakingProgressRecord[], remote: SpeakingProgressRecord[]) {
  const merged = new Map<string, SpeakingProgressRecord>();
  for (const record of [...remote, ...local]) {
    const current = merged.get(record.taskId);
    if (!current || record.done && !current.done || record.score > current.score || Date.parse(record.completedAt) > Date.parse(current.completedAt)) {
      merged.set(record.taskId, { ...record, done: current?.done || record.done });
    }
  }
  return Array.from(merged.values()).sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt)).slice(0, 200);
}

async function hydrateLessons(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("lesson_progress").select("*").eq("user_id", userId);
  if (error || !data || typeof window === "undefined") return;
  const local = readObject<LessonProgressRecord>(lessonKey);
  const merged = { ...local };
  for (const raw of data as JsonRecord[]) {
    const lessonId = text(raw.lesson_id);
    if (!lessonId) continue;
    const remote: LessonProgressRecord = {
      lessonId,
      completedSections: Array.isArray(raw.completed_sections) ? raw.completed_sections.filter((item): item is string => typeof item === "string") : [],
      quizScore: numberValue(raw.quiz_score),
      quizTotal: numberValue(raw.quiz_total),
      markedDone: booleanValue(raw.completed),
      updatedAt: text(raw.updated_at, new Date(0).toISOString())
    };
    merged[lessonId] = mergeLessonRecord(merged[lessonId], remote);
  }
  window.localStorage.setItem(lessonKey, JSON.stringify(merged));
  await supabase.from("lesson_progress").upsert(
    Object.values(merged).map((record) => ({
      user_id: userId,
      lesson_id: record.lessonId,
      completed_sections: record.completedSections,
      quiz_score: record.quizScore,
      quiz_total: record.quizTotal,
      completed: record.markedDone,
      updated_at: record.updatedAt || new Date().toISOString()
    })),
    { onConflict: "user_id,lesson_id" }
  );
}

async function hydrateActivity(userId: string, kind: Extract<LearningProgressKind, "reading" | "listening">) {
  const supabase = getSupabaseBrowserClient();
  const table = kind === "reading" ? "reading_results" : "listening_results";
  const contentColumn = kind === "reading" ? "passage_id" : "listening_id";
  const key = kind === "reading" ? readingKey : listeningKey;
  const { data, error } = await supabase.from(table).select("*").eq("user_id", userId);
  if (error || !data || typeof window === "undefined") return;
  const local = readArray<LearningProgressRecord>(key);
  const remote = (data as JsonRecord[]).flatMap((row): LearningProgressRecord[] => {
    const contentId = text(row[contentColumn]);
    if (!contentId) return [];
    return [{
      id: `remote-${kind}-${text(row.id, contentId)}`,
      kind,
      contentId,
      level: Math.min(6, Math.max(1, numberValue(row.level, 1))) as HSKLevel,
      score: numberValue(row.score),
      total: Math.max(1, numberValue(row.total, 1)),
      done: booleanValue(row.done),
      mistakes: Array.isArray(row.mistakes) ? row.mistakes.filter((item): item is string => typeof item === "string") : [],
      completedAt: text(row.updated_at, text(row.created_at, new Date(0).toISOString()))
    }];
  });
  const merged = mergeActivityRecords(local, remote);
  window.localStorage.setItem(key, JSON.stringify(merged));
  const payload = merged.map((record) => ({
    user_id: userId,
    [contentColumn]: record.contentId,
    level: record.level,
    score: record.score,
    mistakes: record.mistakes,
    done: record.done
  }));
  const { error: upsertError } = await supabase.from(table).upsert(payload, { onConflict: `user_id,${contentColumn}` });
  if (upsertError) {
    const remoteIds = new Set(remote.map((record) => record.contentId));
    const missing = payload.filter((_, index) => !remoteIds.has(merged[index]?.contentId ?? ""));
    if (missing.length) await supabase.from(table).insert(missing);
  }
}

async function hydrateSpeaking(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("speaking_task_results").select("*").eq("user_id", userId);
  if (error || !data || typeof window === "undefined") return;
  const local = readArray<SpeakingProgressRecord>(speakingKey);
  const remote = (data as JsonRecord[]).flatMap((row): SpeakingProgressRecord[] => {
    const taskId = text(row.task_id);
    if (!taskId) return [];
    const storedFeedback = isRecord(row.feedback) ? row.feedback as unknown as SpeakingEvaluationResult : defaultSpeakingFeedback(row);
    return [{
      id: `remote-speaking-${text(row.id, taskId)}`,
      taskId,
      level: Math.min(6, Math.max(1, numberValue(row.level, 1))) as HSKLevel,
      score: numberValue(row.score),
      userAnswerZh: text(row.user_answer_zh),
      correctedAnswerZh: text(row.corrected_answer_zh),
      done: booleanValue(row.done),
      feedback: storedFeedback,
      completedAt: text(row.updated_at, text(row.created_at, new Date(0).toISOString()))
    }];
  });
  const merged = mergeSpeakingRecords(local, remote);
  window.localStorage.setItem(speakingKey, JSON.stringify(merged));
  const payload = merged.map((record) => ({
    user_id: userId,
    task_id: record.taskId,
    level: record.level,
    score: record.score,
    meaning_score: record.feedback.meaningScore,
    grammar_score: record.feedback.grammarScore,
    vocabulary_score: record.feedback.vocabularyScore,
    fluency_score: record.feedback.fluencyScore,
    user_answer_zh: record.userAnswerZh,
    corrected_answer_zh: record.correctedAnswerZh,
    feedback: record.feedback,
    done: record.done
  }));
  const { error: upsertError } = await supabase.from("speaking_task_results").upsert(payload, { onConflict: "user_id,task_id" });
  if (upsertError) {
    const remoteIds = new Set(remote.map((record) => record.taskId));
    const missing = payload.filter((record) => !remoteIds.has(record.task_id));
    if (missing.length) await supabase.from("speaking_task_results").insert(missing);
  }
}

async function hydrateReviewAndMistakes(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const [{ data: progress }, { data: weakWords }, { data: mistakes }] = await Promise.all([
    supabase.from("user_progress").select("*").eq("user_id", userId),
    supabase.from("weak_words").select("*").eq("user_id", userId),
    supabase.from("mistakes").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(100)
  ]);

  const progressRows = Array.isArray(progress) ? progress as JsonRecord[] : [];
  const weakRows = Array.isArray(weakWords) ? weakWords as JsonRecord[] : [];
  const mistakeRows = Array.isArray(mistakes) ? mistakes as JsonRecord[] : [];
  const wordReviews: Record<string, WordReviewState> = {};
  const knownWordIds: string[] = [];
  const weakWordIds = new Set<string>();

  for (const row of progressRows) {
    const wordId = text(row.word_id);
    if (!wordId) continue;
    const rawStatus = text(row.status, "new");
    const status: WordReviewState["status"] = ["new", "learning", "weak", "review", "mastered"].includes(rawStatus)
      ? rawStatus as WordReviewState["status"]
      : "learning";
    wordReviews[wordId] = {
      wordId,
      status,
      correctCount: numberValue(row.correct_count),
      wrongCount: numberValue(row.wrong_count),
      lastReviewedAt: text(row.last_reviewed_at) || undefined,
      nextReviewAt: text(row.next_review_at) || undefined,
      easeLevel: numberValue(row.ease_level, 1)
    };
    if (status === "review" || status === "mastered") knownWordIds.push(wordId);
    if (status === "weak") weakWordIds.add(wordId);
  }
  for (const row of weakRows) {
    const wordId = text(row.word_id);
    if (wordId) weakWordIds.add(wordId);
  }

  const wordById = new Map(vocabularyEntries.map((word) => [word.id, word]));
  const remoteMistakes: MistakeRecord[] = mistakeRows.map((row) => {
    const wordId = text(row.word_id) || undefined;
    const word = wordId ? wordById.get(wordId) : undefined;
    return {
      id: `remote-mistake-${text(row.id, `${text(row.question_id)}-${text(row.created_at)}`)}`,
      source: "quiz",
      hskLevel: Math.min(6, Math.max(1, numberValue(row.hsk_level, word?.level ?? 1))) as HSKLevel,
      chinese: word?.hanzi ?? text(row.correct_answer, "—"),
      pinyin: word?.pinyin,
      wrongAnswer: text(row.user_answer),
      correctAnswer: text(row.correct_answer),
      explanation: text(row.explanation_uz, text(row.explanation_ru, "Javobni yana bir marta ko‘rib chiqing.")),
      createdAt: text(row.created_at, new Date(0).toISOString()),
      learned: booleanValue(row.learned),
      wordId
    };
  });

  const { useProgressStore } = await import("@/store/progressStore");
  const local = useProgressStore.getState();
  const mistakeKeys = new Set((local.mistakes ?? []).map((item) => `${item.wordId ?? item.chinese}|${item.wrongAnswer}|${item.correctAnswer}`));
  const uniqueRemoteMistakes = remoteMistakes.filter((item) => !mistakeKeys.has(`${item.wordId ?? item.chinese}|${item.wrongAnswer}|${item.correctAnswer}`));
  useProgressStore.setState({
    knownWordIds: Array.from(new Set([...(local.knownWordIds ?? []), ...knownWordIds])),
    weakWordIds: Array.from(new Set([...(local.weakWordIds ?? []), ...weakWordIds])),
    wordReviews: { ...wordReviews, ...(local.wordReviews ?? {}) },
    mistakes: [...uniqueRemoteMistakes, ...(local.mistakes ?? [])].slice(0, 100)
  });
}

function parseExamSections(value: unknown) {
  if (!isRecord(value)) return undefined;
  const skills: ExamSkill[] = ["listening", "reading", "speaking", "writing"];
  const sections = {} as Record<ExamSkill, ExamSectionResult>;
  for (const skill of skills) {
    const raw = value[skill];
    if (!isRecord(raw)) return undefined;
    sections[skill] = {
      score: numberValue(raw.score),
      correct: numberValue(raw.correct),
      total: numberValue(raw.total),
      feedbackUz: text(raw.feedbackUz) || undefined,
      feedbackRu: text(raw.feedbackRu) || undefined
    };
  }
  return sections;
}

async function hydrateExamResults(userId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("exam_results").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error || !data || typeof window === "undefined") return;
  const remote = (data as JsonRecord[]).flatMap((row): ExamAttempt[] => {
    const level = Math.min(6, Math.max(1, numberValue(row.level, numberValue(row.hsk_level, 1)))) as HSKLevel;
    const overallScore = numberValue(row.overall_score, numberValue(row.accuracy));
    const answers = Array.isArray(row.answers)
      ? row.answers.filter(isRecord).map((answer) => ({
          questionId: text(answer.questionId, text(answer.question_id)),
          selectedAnswer: text(answer.selectedAnswer, text(answer.selected_answer)),
          correctAnswer: text(answer.correctAnswer, text(answer.correct_answer)),
          correct: booleanValue(answer.correct)
        }))
      : [];
    return [{
      id: `remote-exam-${text(row.id, `${level}-${text(row.created_at)}`)}`,
      hskLevel: level,
      score: numberValue(row.score, answers.filter((answer) => answer.correct).length),
      total: numberValue(row.total_questions, answers.length),
      accuracy: overallScore,
      overallScore,
      passingScore: numberValue(row.passing_score, 80),
      passed: typeof row.passed === "boolean" ? row.passed : overallScore >= 80,
      correctAnswers: numberValue(row.correct_answers, answers.filter((answer) => answer.correct).length),
      wrongAnswers: numberValue(row.wrong_answers, Math.max(0, answers.length - answers.filter((answer) => answer.correct).length)),
      timeSpentSeconds: numberValue(row.time_spent_seconds),
      completedAt: text(row.created_at, new Date(0).toISOString()),
      sections: parseExamSections(row.section_scores),
      weakSkills: Array.isArray(row.weak_skills) ? row.weak_skills.filter((skill): skill is ExamSkill => ["listening", "reading", "speaking", "writing"].includes(String(skill))) : [],
      recommendedLessonIds: Array.isArray(row.recommended_lesson_ids) ? row.recommended_lesson_ids.filter((id): id is string => typeof id === "string") : [],
      answers
    }];
  });
  const local = readExamResults();
  const merged = new Map<string, ExamAttempt>();
  for (const attempt of [...remote, ...local]) {
    const key = `${attempt.hskLevel}|${attempt.completedAt}|${attempt.overallScore ?? attempt.accuracy}`;
    if (!merged.has(key)) merged.set(key, attempt);
  }
  const results = Array.from(merged.values()).sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt)).slice(0, 100);
  window.localStorage.setItem(examResultsKey, JSON.stringify(results));
  const { useProgressStore } = await import("@/store/progressStore");
  const state = useProgressStore.getState();
  const bestScoreByLevel: Partial<Record<HSKLevel, number>> = { ...(state.bestScoreByLevel ?? {}) };
  const lastScoreByLevel: Partial<Record<HSKLevel, number>> = { ...(state.lastScoreByLevel ?? {}) };
  const examAccuracy: Partial<Record<HSKLevel, number>> = { ...(state.examAccuracy ?? {}) };
  const examTimeSpent: Partial<Record<HSKLevel, number>> = { ...(state.examTimeSpent ?? {}) };
  for (const attempt of results) {
    const score = attempt.overallScore ?? attempt.accuracy;
    bestScoreByLevel[attempt.hskLevel] = Math.max(bestScoreByLevel[attempt.hskLevel] ?? 0, score);
    if (lastScoreByLevel[attempt.hskLevel] === undefined) lastScoreByLevel[attempt.hskLevel] = score;
    if (examAccuracy[attempt.hskLevel] === undefined) examAccuracy[attempt.hskLevel] = score;
    if (examTimeSpent[attempt.hskLevel] === undefined) examTimeSpent[attempt.hskLevel] = attempt.timeSpentSeconds;
  }
  useProgressStore.setState({
    examAttempts: results,
    bestScoreByLevel,
    lastScoreByLevel,
    passedLevels: ([1, 2, 3, 4, 5, 6] as HSKLevel[]).filter((level) => (bestScoreByLevel[level] ?? 0) >= 80),
    currentLevel: ([1, 2, 3, 4, 5, 6] as HSKLevel[]).reduce<HSKLevel>(
      (highest, candidate) => candidate === 1 || (bestScoreByLevel[(candidate - 1) as HSKLevel] ?? 0) >= 80 ? candidate : highest,
      1
    ),
    examAccuracy,
    examTimeSpent
  });
}

async function uploadLegacyLocalProgress(userId: string) {
  try {
    await migrateLocalProgressToSupabase(userId);
  } catch {
    // Optional Supabase tables may be absent; specialized hydration above keeps LocalStorage fallback stable.
  }
}

export async function synchronizeLearningProgress(userId: string) {
  if (typeof window === "undefined" || !userId) return;
  const tasks = [
    uploadLegacyLocalProgress(userId),
    hydrateLessons(userId),
    hydrateActivity(userId, "reading"),
    hydrateActivity(userId, "listening"),
    hydrateSpeaking(userId),
    hydrateReviewAndMistakes(userId),
    hydrateExamResults(userId)
  ];
  const results = await Promise.allSettled(tasks);
  if (process.env.NODE_ENV === "development" && results.some((result) => result.status === "rejected")) {
    console.warn("HanziFlow AI: ayrim progress jadvallari mavjud emas, lokal saqlash ishlashda davom etadi.");
  }
  window.dispatchEvent(new CustomEvent("hsk-progress-synced"));
}
