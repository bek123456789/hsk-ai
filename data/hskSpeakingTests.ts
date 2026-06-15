import type { HSKLevel } from "@/types";
import { hskVocabulary } from "@/data/hskVocabulary";
import { createSpeakingPrompts } from "@/utils/practiceGenerator";

export const hskSpeakingTests = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) => createSpeakingPrompts(level, hskVocabulary, 24));

export function getSpeakingPractice(level: HSKLevel) {
  return hskSpeakingTests.filter((prompt) => prompt.hskLevel === level);
}
