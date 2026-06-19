import { hskWords } from "@/data/hskWords";
import type { AppLanguage, HSKWord, QuizQuestion } from "@/types";
import { getWordTranslation } from "@/utils/i18n";

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function shuffle<T>(items: T[], seed = "hanziflow"): T[] {
  return [...items]
    .map((item, index) => ({ item, weight: stableHash(`${seed}-${index}-${JSON.stringify(item)}`) }))
    .sort((first, second) => first.weight - second.weight)
    .map(({ item }) => item);
}

export function createQuizQuestions(words: HSKWord[], count = 8, language: AppLanguage = "uz"): QuizQuestion[] {
  const pool = shuffle(words, `pool-${language}-${count}`).slice(0, Math.min(count, words.length));

  return pool.map((word) => {
    const distractors = shuffle(
      hskWords
        .filter((candidate) => candidate.id !== word.id)
        .map((candidate) => getWordTranslation(candidate, language))
    , `distractors-${language}-${word.id}`).slice(0, 3);

    return {
      word,
      correctAnswer: getWordTranslation(word, language),
      options: shuffle([getWordTranslation(word, language), ...distractors], `options-${language}-${word.id}`)
    };
  });
}
