import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ExamAttempt } from "@/types";

export const examResultsKey = "hsk_exam_results";

export function readExamResults(): ExamAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(examResultsKey) ?? "[]");
    return Array.isArray(parsed) ? parsed as ExamAttempt[] : [];
  } catch {
    return [];
  }
}

export function saveExamResultLocally(attempt: ExamAttempt) {
  if (typeof window === "undefined") return;
  const results = readExamResults();
  const next = [attempt, ...results.filter((item) => item.id !== attempt.id)].slice(0, 100);
  window.localStorage.setItem(examResultsKey, JSON.stringify(next));
}

export async function syncExamResult(attempt: ExamAttempt, userId?: string) {
  saveExamResultLocally(attempt);
  if (!userId) return false;
  try {
    const supabase = getSupabaseBrowserClient();
    const payload = {
      user_id: userId,
      hsk_level: attempt.hskLevel,
      score: attempt.score,
      total_questions: attempt.total,
      accuracy: attempt.overallScore ?? attempt.accuracy,
      time_spent_seconds: attempt.timeSpentSeconds,
      level: attempt.hskLevel,
      overall_score: attempt.overallScore ?? attempt.accuracy,
      passed: attempt.passed ?? attempt.accuracy >= 80,
      passing_score: attempt.passingScore ?? 80,
      section_scores: attempt.sections ?? {},
      weak_skills: attempt.weakSkills ?? [],
      recommended_lesson_ids: attempt.recommendedLessonIds ?? [],
      answers: attempt.answers,
      created_at: attempt.completedAt
    };
    const { error } = await supabase.from("exam_results").insert(payload);
    if (!error) return true;

    const legacy = {
      user_id: userId,
      hsk_level: attempt.hskLevel,
      score: attempt.score,
      total_questions: attempt.total,
      accuracy: attempt.accuracy,
      time_spent_seconds: attempt.timeSpentSeconds,
      passed: attempt.passed ?? attempt.accuracy >= 80
    };
    const { error: legacyError } = await supabase.from("exam_results").insert(legacy);
    return !legacyError;
  } catch {
    return false;
  }
}
