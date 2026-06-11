import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ExamAttempt, HSKLevel, MistakeRecord, QuizResult, WordReviewState } from "@/types";

type WordProgressInput = {
  userId?: string;
  wordId: string;
  hskLevel: HSKLevel;
  lessonId?: string;
  status?: WordReviewState["status"];
  correctCount?: number;
  wrongCount?: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  easeLevel?: number;
};

type QuizResultInput = {
  userId?: string;
  level: HSKLevel;
  lessonId?: string;
  score: number;
  total: number;
};

type ExamResultInput = {
  userId?: string;
  attempt: ExamAttempt;
};

type WeakWordInput = {
  userId?: string;
  wordId: string;
  hskLevel: HSKLevel;
  lessonId?: string;
  reason?: string;
};

type MistakeInput = {
  userId?: string;
  mistake: MistakeRecord;
  questionId?: string;
};

function localProgressState() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem("hsk-ai-progress");
    return raw ? JSON.parse(raw).state ?? {} : {};
  } catch {
    return {};
  }
}

function requireUserId(userId?: string) {
  if (!userId) return null;
  return userId;
}

export async function getUserProgress(userId?: string) {
  const id = requireUserId(userId);
  if (!id) return localProgressState();

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", id);
  if (error) throw error;

  return data;
}

export async function saveWordProgress(input: WordProgressInput) {
  const userId = requireUserId(input.userId);
  if (!userId) return localProgressState();

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      word_id: input.wordId,
      hsk_level: input.hskLevel,
      lesson_id: input.lessonId,
      status: input.status ?? "new",
      correct_count: input.correctCount ?? 0,
      wrong_count: input.wrongCount ?? 0,
      last_reviewed_at: input.lastReviewedAt,
      next_review_at: input.nextReviewAt,
      ease_level: input.easeLevel ?? 1,
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id,word_id" }
  );
  if (error) throw error;
}

export async function saveQuizResult(input: QuizResultInput) {
  const userId = requireUserId(input.userId);
  if (!userId) return localProgressState();

  const supabase = getSupabaseBrowserClient();
  const totalQuestions = Math.max(1, input.total);
  const { error } = await supabase.from("quiz_results").insert({
    user_id: userId,
    hsk_level: input.level,
    lesson_id: input.lessonId,
    score: input.score,
    total_questions: input.total,
    accuracy: Math.round((input.score / totalQuestions) * 100)
  });
  if (error) throw error;
}

export async function saveExamResult(input: ExamResultInput) {
  const userId = requireUserId(input.userId);
  if (!userId) return localProgressState();

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("exam_results").insert({
    user_id: userId,
    hsk_level: input.attempt.hskLevel,
    score: input.attempt.score,
    total_questions: input.attempt.total,
    accuracy: input.attempt.accuracy,
    time_spent_seconds: input.attempt.timeSpentSeconds,
    passed: input.attempt.accuracy >= 70
  });
  if (error) throw error;

  if (input.attempt.accuracy >= 70) {
    const { data: existing, error: existingError } = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", userId)
      .eq("hsk_level", input.attempt.hskLevel)
      .maybeSingle();
    if (existingError) throw existingError;

    if (!existing) {
      const { error: certificateError } = await supabase.from("certificates").insert({
        user_id: userId,
        hsk_level: input.attempt.hskLevel,
        score: input.attempt.accuracy,
        certificate_code: `HSKAI-${userId.slice(0, 8)}-${input.attempt.hskLevel}-${Date.now()}`
      });
      if (certificateError) throw certificateError;
    }
  }
}

export async function saveWeakWord(input: WeakWordInput) {
  const userId = requireUserId(input.userId);
  if (!userId) return localProgressState();

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("weak_words").upsert(
    {
      user_id: userId,
      word_id: input.wordId,
      hsk_level: input.hskLevel,
      lesson_id: input.lessonId,
      reason: input.reason
    },
    { onConflict: "user_id,word_id" }
  );
  if (error) throw error;
}

export async function saveMistake(input: MistakeInput) {
  const userId = requireUserId(input.userId);
  if (!userId) return localProgressState();

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("mistakes").insert({
    user_id: userId,
    question_id: input.questionId,
    word_id: input.mistake.wordId,
    hsk_level: input.mistake.hskLevel,
    user_answer: input.mistake.wrongAnswer,
    correct_answer: input.mistake.correctAnswer,
    explanation_uz: input.mistake.explanation,
    explanation_ru: input.mistake.explanation
  });
  if (error) throw error;
}

export async function getWeakWords(userId?: string) {
  const id = requireUserId(userId);
  if (!id) return localProgressState().weakWordIds ?? [];

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("weak_words").select("*").eq("user_id", id);
  if (error) throw error;
  return data;
}

export async function getMistakes(userId?: string) {
  const id = requireUserId(userId);
  if (!id) return localProgressState().mistakes ?? [];

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("mistakes").select("*").eq("user_id", id).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCertificates(userId?: string) {
  const id = requireUserId(userId);
  if (!id) return localProgressState().certificates ?? [];

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("certificates").select("*").eq("user_id", id).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getExamResults(userId?: string) {
  const id = requireUserId(userId);
  if (!id) return localProgressState().examAttempts ?? [];

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("exam_results").select("*").eq("user_id", id).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getQuizResults(userId?: string) {
  const id = requireUserId(userId);
  if (!id) return localProgressState().quizResults ?? [];

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("quiz_results").select("*").eq("user_id", id).order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function migrateLocalProgressToSupabase(userId: string) {
  const state = localProgressState() as {
    knownWordIds?: string[];
    weakWordIds?: string[];
    wordReviews?: Record<string, WordReviewState>;
    quizResults?: QuizResult[];
    examAttempts?: ExamAttempt[];
    mistakes?: MistakeRecord[];
  };

  await Promise.all(
    Object.values(state.wordReviews ?? {}).map((review) =>
      saveWordProgress({
        userId,
        wordId: review.wordId,
        hskLevel: 1,
        status: review.status,
        correctCount: review.correctCount,
        wrongCount: review.wrongCount,
        lastReviewedAt: review.lastReviewedAt,
        nextReviewAt: review.nextReviewAt,
        easeLevel: review.easeLevel
      })
    )
  );

  await Promise.all((state.knownWordIds ?? []).map((wordId) => saveWordProgress({ userId, wordId, hskLevel: 1, status: "review", correctCount: 1 })));
  await Promise.all((state.weakWordIds ?? []).map((wordId) => saveWeakWord({ userId, wordId, hskLevel: 1, reason: "local" })));
  await Promise.all((state.quizResults ?? []).map((result) => saveQuizResult({ userId, level: result.level, score: result.score, total: result.total })));
  await Promise.all((state.examAttempts ?? []).map((attempt) => saveExamResult({ userId, attempt })));
  await Promise.all((state.mistakes ?? []).map((mistake) => saveMistake({ userId, mistake })));
}
