import type { HSKLevel } from "@/types";
import { hskVocabulary } from "@/data/hskVocabulary";
import { createExamQuestions } from "@/utils/examGenerator";

export const hskExamQuestions = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) => createExamQuestions(level, hskVocabulary));

export function getHskExamQuestions(level: HSKLevel) {
  return hskExamQuestions.filter((question) => question.hskLevel === level);
}
