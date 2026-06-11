import type { HSKLevel } from "@/types";

export function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

export function progressKey(level: HSKLevel) {
  return `hsk-${level}`;
}
