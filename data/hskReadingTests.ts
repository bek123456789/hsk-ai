import type { HSKLevel } from "@/types";
import { hskVocabulary } from "@/data/hskVocabulary";
import { createSkillPractice } from "@/utils/practiceGenerator";

export const hskReadingTests = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) => createSkillPractice(level, hskVocabulary, "reading", 16));

export function getReadingPractice(level: HSKLevel) {
  return hskReadingTests.filter((question) => question.hskLevel === level);
}
