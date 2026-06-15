import type { HSKLevel } from "@/types";
import { hskGrammar } from "@/data/hskGrammar";
import { hskVocabulary } from "@/data/hskVocabulary";
import { createCourseLessons } from "@/utils/contentGenerator";

export const hskCourseLessons = createCourseLessons(hskVocabulary, hskGrammar);

export function getCourseLessonsByLevel(level: HSKLevel) {
  return hskCourseLessons.filter((lesson) => lesson.hskLevel === level);
}

export function getCourseLesson(lessonId: string) {
  return hskCourseLessons.find((lesson) => lesson.lessonId === lessonId);
}
