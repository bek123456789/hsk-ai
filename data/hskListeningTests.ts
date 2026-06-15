import type { HSKLevel } from "@/types";
import { hskVocabulary } from "@/data/hskVocabulary";
import { createSkillPractice } from "@/utils/practiceGenerator";

export const hskListeningTests = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) => createSkillPractice(level, hskVocabulary, "listening", 16));

export function getListeningPractice(level: HSKLevel) {
  return hskListeningTests.filter((question) => question.hskLevel === level);
}
