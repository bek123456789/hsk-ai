import { appendLocalItem, readLocalList } from "@/utils/localLearning";

export type OfflineQueueItem = {
  id: string;
  type: string;
  payload: unknown;
  createdAt: string;
};

const key = "hsk-ai-offline-queue";

export function enqueueOfflineAction(type: string, payload: unknown) {
  appendLocalItem<OfflineQueueItem>(key, {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    payload,
    createdAt: new Date().toISOString()
  });
}

export function getOfflineQueue() {
  return readLocalList<OfflineQueueItem>(key);
}
