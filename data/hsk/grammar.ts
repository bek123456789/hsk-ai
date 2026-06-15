import { hskGrammar } from "@/data/hskGrammar";
import type { HSKLevel } from "@/types";

export const hskCentralGrammar = hskGrammar.map((item) => ({
  id: item.grammarId,
  level: item.hskLevel,
  titleUz: item.titleUz,
  titleRu: item.titleRu,
  pattern: item.structure,
  explanationUz: item.explanationUz,
  explanationRu: item.explanationRu,
  examples: item.chineseExamples,
  commonMistakes: item.commonMistakes,
  practiceQuestions: item.practiceQuestions
}));

export function getGrammarByLevel(level: HSKLevel) {
  return hskCentralGrammar.filter((item) => item.level === level);
}
