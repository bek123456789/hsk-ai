import type { HSKLevel } from "@/types";
import { createVocabularyItems } from "@/utils/contentGenerator";

export const hskVocabulary = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) => createVocabularyItems(level));

export function getVocabularyByLevel(level: HSKLevel) {
  return hskVocabulary.filter((word) => word.hskLevel === level);
}

export function getVocabularyByLesson(lessonId: string) {
  return hskVocabulary.filter((word) => word.lessonId === lessonId);
}
