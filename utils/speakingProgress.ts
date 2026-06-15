import type { HSKLevel } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type SpeakingEvaluationResult = {
  ok: boolean;
  done: boolean;
  score: number;
  meaningScore: number;
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  feedbackUz: string;
  feedbackRu: string;
  correctedAnswerZh: string;
  correctedAnswerPinyin: string;
  explanationUz: string;
  explanationRu: string;
  missingPointsUz: string[];
  missingPointsRu: string[];
  goodPointsUz: string[];
  goodPointsRu: string[];
  nextTipUz: string;
  nextTipRu: string;
};

export type SpeakingProgressRecord = {
  id: string;
  taskId: string;
  level: HSKLevel;
  score: number;
  userAnswerZh: string;
  correctedAnswerZh: string;
  done: boolean;
  feedback: SpeakingEvaluationResult;
  completedAt: string;
};

const key = "hsk_speaking_progress";

function readRecords() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? (parsed as SpeakingProgressRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveSpeakingTaskProgress(record: Omit<SpeakingProgressRecord, "id" | "completedAt">) {
  if (typeof window === "undefined") return;
  const records = readRecords();
  const completedRecord: SpeakingProgressRecord = {
    ...record,
    id: `speaking-task-${record.taskId}-${Date.now()}`,
    completedAt: new Date().toISOString()
  };
  window.localStorage.setItem(
    key,
    JSON.stringify([
      completedRecord,
      ...records.filter((item) => item.taskId !== record.taskId)
    ].slice(0, 200))
  );
  void syncSpeakingProgress(completedRecord);
}

async function syncSpeakingProgress(record: SpeakingProgressRecord) {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    const payload = {
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
    };
    const { error } = await supabase.from("speaking_task_results").upsert(payload, { onConflict: "user_id,task_id" });
    if (error) await supabase.from("speaking_task_results").insert(payload);
  } catch {
    // LocalStorage remains authoritative for the MVP when the optional table is absent.
  }
}

export function getSpeakingTaskProgress() {
  return readRecords();
}

export function isSpeakingTaskDone(taskId: string) {
  return readRecords().some((record) => record.taskId === taskId && record.done);
}
