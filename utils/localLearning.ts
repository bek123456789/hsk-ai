export function readLocalList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}

export function appendLocalItem<T extends { id: string }>(key: string, item: T, limit = 120) {
  if (typeof window === "undefined") return;
  const items = readLocalList<T>(key).filter((existing) => existing.id !== item.id);
  window.localStorage.setItem(key, JSON.stringify([item, ...items].slice(0, limit)));
}

export function readLocalObject<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? JSON.stringify(fallback)) as T;
  } catch {
    return fallback;
  }
}

export function writeLocalObject<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
