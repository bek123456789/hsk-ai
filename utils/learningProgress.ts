import type { HSKLevel } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type LearningProgressKind = "reading" | "listening" | "dictation" | "sentence-builder";

export type LearningProgressRecord = {
  id: string;
  kind: LearningProgressKind;
  contentId: string;
  level: HSKLevel;
  score: number;
  total: number;
  done: boolean;
  mistakes: string[];
  completedAt: string;
};

const keys: Record<LearningProgressKind, string> = {
  reading: "hsk_reading_progress",
  listening: "hsk_listening_progress",
  dictation: "hsk_learning_progress",
  "sentence-builder": "hsk_learning_progress"
};

function readRecords(kind: LearningProgressKind) {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(keys[kind]) ?? "[]");
    return Array.isArray(parsed) ? (parsed as LearningProgressRecord[]) : [];
  } catch {
    return [];
  }
}

function writeRecords(kind: LearningProgressKind, records: LearningProgressRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(keys[kind], JSON.stringify(records.slice(0, 200)));
}

async function syncLearningProgress(record: LearningProgressRecord) {
  if (record.kind !== "reading" && record.kind !== "listening") return;
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    const table = record.kind === "reading" ? "reading_results" : "listening_results";
    const contentColumn = record.kind === "reading" ? "passage_id" : "listening_id";
    const payload = {
      user_id: userId,
      [contentColumn]: record.contentId,
      level: record.level,
      score: record.score,
      mistakes: record.mistakes,
      done: record.done
    };
    const { error } = await supabase.from(table).upsert(payload, { onConflict: `user_id,${contentColumn}` });
    if (error) await supabase.from(table).insert(payload);
  } catch {
    // LocalStorage is the primary safe fallback when optional Supabase tables are unavailable.
  }
}

export function saveLearningProgress(record: Omit<LearningProgressRecord, "id" | "completedAt">) {
  const records = readRecords(record.kind);
  const completedRecord: LearningProgressRecord = {
    ...record,
    id: `${record.kind}-${record.contentId}-${Date.now()}`,
    completedAt: new Date().toISOString()
  };
  writeRecords(record.kind, [
    completedRecord,
    ...records.filter((item) => item.contentId !== record.contentId)
  ]);
  void syncLearningProgress(completedRecord);
}

export function getLearningProgress(kind: LearningProgressKind) {
  return readRecords(kind);
}

export function isLearningContentDone(kind: LearningProgressKind, contentId: string) {
  return readRecords(kind).some((record) => record.contentId === contentId && record.done);
}
