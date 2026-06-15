import type { HSKLevel } from "@/types";
import { createGrammarPoints } from "@/utils/contentGenerator";

export const hskGrammar = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) => createGrammarPoints(level));

export function getGrammarByLevel(level: HSKLevel) {
  return hskGrammar.filter((point) => point.hskLevel === level);
}
