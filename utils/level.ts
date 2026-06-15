import type { HSKLevel } from "@/types";

export const hskLevelValues = [1, 2, 3, 4, 5, 6] as HSKLevel[];

export function parseHskLevel(value: string | string[] | number | undefined): HSKLevel {
  const raw = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(raw);
  return hskLevelValues.includes(numberValue as HSKLevel) ? (numberValue as HSKLevel) : 1;
}

export function levelPath(path: string, level: HSKLevel) {
  return `${path.replace(/\/$/, "")}/${level}`;
}
