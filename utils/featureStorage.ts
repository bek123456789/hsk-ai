import { appendLocalItem, readLocalList, readLocalObject, writeLocalObject } from "@/utils/localLearning";

export function safeLocalGet<T>(key: string, fallback: T): T {
  return readLocalObject<T>(key, fallback);
}

export function safeLocalSet<T>(key: string, value: T) {
  try {
    writeLocalObject(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeLocalAppend<T extends { id: string }>(key: string, item: T, limit = 120) {
  try {
    appendLocalItem(key, item, limit);
    return true;
  } catch {
    return false;
  }
}

export function loadFeatureResults<T>(key: string) {
  return readLocalList<T>(key);
}

export async function trySupabaseInsertOptional(table: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return false;
  try {
    const { syncOptionalFeatureResult } = await import("@/utils/featureProgressSync");
    await syncOptionalFeatureResult(table, payload);
    return true;
  } catch {
    return false;
  }
}

export async function saveFeatureResult<T extends { id: string }>(input: {
  localKey: string;
  table: string;
  item: T;
  supabasePayload?: Record<string, unknown>;
}) {
  const localSaved = safeLocalAppend(input.localKey, input.item);
  await trySupabaseInsertOptional(input.table, input.supabasePayload ?? input.item as Record<string, unknown>);
  return localSaved;
}
