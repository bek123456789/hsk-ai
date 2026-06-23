import type { HSKSkillQuestion } from "@/data/hsk/contentTypes";
import { buildOptionSet, difficultyForLevel, levels, simpleQuestion, translationDistractors, wordsFor } from "@/data/hsk/contentFactory";
import type { HSKLevel } from "@/types";

export const hskQuizQuestions: HSKSkillQuestion[] = levels.flatMap((level) => {
  const words = wordsFor(level, level <= 2 ? 40 : level <= 4 ? 34 : 27);
  return words.flatMap((word, index) => {
    const distractors = translationDistractors(level, word);
    const pinyinOptions = buildOptionSet({
      seed: `quiz-hsk${level}-pinyin-${String(index + 1).padStart(3, "0")}`,
      correctUz: word.pinyin,
      correctRu: word.pinyin,
      correctPinyin: word.pinyin,
      distractors: distractors.map((item) => ({ uz: item.pinyin ?? item.uz, ru: item.pinyin ?? item.ru, pinyin: item.pinyin }))
    });
    const characterOptions = buildOptionSet({
      seed: `quiz-hsk${level}-character-${String(index + 1).padStart(3, "0")}`,
      correctUz: word.hanzi,
      correctRu: word.hanzi,
      correctZh: word.hanzi,
      distractors: distractors.map((item) => ({ uz: item.zh ?? item.uz, ru: item.zh ?? item.ru, zh: item.zh }))
    });

    return [
      simpleQuestion({
        id: `quiz-hsk${level}-meaning-${String(index + 1).padStart(3, "0")}`,
        level,
        promptZh: word.hanzi,
        promptPinyin: word.pinyin,
        correct: word,
        questionUz: "Bu so‘zning ma’nosini tanlang.",
        questionRu: "Выберите значение этого слова.",
        skill: "vocabulary",
        type: "vocabulary"
      }),
      {
        id: `quiz-hsk${level}-pinyin-${String(index + 1).padStart(3, "0")}`,
        level,
        type: "pinyin" as const,
        questionUz: "To‘g‘ri pinyinni tanlang.",
        questionRu: "Выберите pinyin.",
        promptZh: word.hanzi,
        promptPinyin: "",
        options: pinyinOptions.options,
        correctOptionId: pinyinOptions.correctOptionId,
        explanationUz: `${word.hanzi} pinyini ${word.pinyin}. Ohang belgilariga e’tibor bering: bir harf o‘zgarsa ham talaffuz va ma’no adashishi mumkin.`,
        explanationRu: `Pinyin для ${word.hanzi}: ${word.pinyin}. Обратите внимание на знаки тонов: одна другая тоновая отметка может изменить произношение и смысл.`,
        skill: "vocabulary" as const,
        difficulty: difficultyForLevel(level)
      },
      {
        id: `quiz-hsk${level}-character-${String(index + 1).padStart(3, "0")}`,
        level,
        type: "vocabulary" as const,
        questionUz: "Ma’noga mos xitoycha so‘zni tanlang.",
        questionRu: "Выберите китайское слово по значению.",
        promptZh: word.uz,
        promptPinyin: word.ru,
        options: characterOptions.options,
        correctOptionId: characterOptions.correctOptionId,
        explanationUz: `${word.uz} xitoychada ${word.hanzi} (${word.pinyin}) bo‘ladi. Variantlarni iyeroglif ko‘rinishi bilan solishtirib o‘rganing.`,
        explanationRu: `${word.ru} по-китайски — ${word.hanzi} (${word.pinyin}). Сравнивайте варианты по иероглифам и pinyin.`,
        skill: "vocabulary" as const,
        difficulty: difficultyForLevel(level)
      }
    ];
  });
});

export function getQuizQuestionsByLevel(level: HSKLevel) {
  return hskQuizQuestions.filter((question) => question.level === level);
}
