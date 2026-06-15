import type { HSKContentOption, HSKReadingPassage, HSKSkillQuestion, HSKVocabularyEntry } from "@/data/hsk/contentTypes";
import { getVocabularyEntriesByLevel } from "@/data/hsk/vocabulary";
import type { HSKLevel } from "@/types";

export const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];

export function difficultyForLevel(level: HSKLevel) {
  return level <= 2 ? "easy" : level <= 4 ? "medium" : "hard";
}

export function wordsFor(level: HSKLevel, count: number, offset = 0) {
  const words = getVocabularyEntriesByLevel(level);
  if (!words.length) return [];
  return Array.from({ length: count }, (_, index) => words[(offset + index) % words.length]);
}

export function optionSet(input: {
  correctUz: string;
  correctRu: string;
  correctZh?: string;
  correctPinyin?: string;
  distractors: Array<{ uz: string; ru: string; zh?: string; pinyin?: string }>;
}): HSKContentOption[] {
  const base = [
    { id: "a" as const, textUz: input.correctUz, textRu: input.correctRu, textZh: input.correctZh, textPinyin: input.correctPinyin },
    ...input.distractors.slice(0, 3).map((item, index) => ({
      id: (["b", "c", "d"] as const)[index],
      textUz: item.uz,
      textRu: item.ru,
      textZh: item.zh,
      textPinyin: item.pinyin
    }))
  ];

  return base;
}

export function translationDistractors(level: HSKLevel, correct: HSKVocabularyEntry) {
  return getVocabularyEntriesByLevel(level)
    .filter((word) => word.id !== correct.id)
    .slice(0, 12)
    .map((word) => ({ uz: word.uz, ru: word.ru, zh: word.hanzi, pinyin: word.pinyin }))
    .filter((item, index, array) => array.findIndex((other) => other.uz === item.uz || other.ru === item.ru) === index)
    .slice(0, 3);
}

export function simpleQuestion(input: {
  id: string;
  level: HSKLevel;
  promptZh: string;
  promptPinyin: string;
  correct: HSKVocabularyEntry;
  questionUz: string;
  questionRu: string;
  skill: HSKSkillQuestion["skill"];
  type: HSKSkillQuestion["type"];
}): HSKSkillQuestion {
  return {
    id: input.id,
    level: input.level,
    type: input.type,
    questionUz: input.questionUz,
    questionRu: input.questionRu,
    promptZh: input.promptZh,
    promptPinyin: input.promptPinyin,
    options: optionSet({
      correctUz: input.correct.uz,
      correctRu: input.correct.ru,
      correctZh: input.correct.hanzi,
      correctPinyin: input.correct.pinyin,
      distractors: translationDistractors(input.level, input.correct)
    }),
    correctOptionId: "a",
    explanationUz: `${input.correct.hanzi} (${input.correct.pinyin}) — ${input.correct.uz}.`,
    explanationRu: `${input.correct.hanzi} (${input.correct.pinyin}) — ${input.correct.ru}.`,
    skill: input.skill,
    difficulty: difficultyForLevel(input.level)
  };
}

export function passageQuestion(input: {
  id: string;
  level: HSKLevel;
  questionUz: string;
  questionRu: string;
  correctUz: string;
  correctRu: string;
  explanationUz: string;
  explanationRu: string;
  distractors?: Array<{ uz: string; ru: string }>;
}): HSKReadingPassage["questions"][number] {
  return {
    id: input.id,
    questionUz: input.questionUz,
    questionRu: input.questionRu,
    options: optionSet({
      correctUz: input.correctUz,
      correctRu: input.correctRu,
      distractors: input.distractors ?? [
        { uz: "do‘stini kutadi", ru: "ждёт друга" },
        { uz: "kitob sotib oladi", ru: "покупает книгу" },
        { uz: "uyga qaytadi", ru: "возвращается домой" }
      ]
    }),
    correctOptionId: "a",
    explanationUz: input.explanationUz,
    explanationRu: input.explanationRu
  };
}
