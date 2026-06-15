import type { HSKLevel } from "@/types";
import { hskVocabulary } from "@/data/hskVocabulary";
import { createSkillPractice } from "@/utils/practiceGenerator";

export const hskWritingTests = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) => createSkillPractice(level, hskVocabulary, "writing", 12));

export function getWritingPractice(level: HSKLevel) {
  return hskWritingTests.filter((question) => question.hskLevel === level);
}
