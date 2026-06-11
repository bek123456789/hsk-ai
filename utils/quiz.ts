import { hskWords } from "@/data/hskWords";
import type { AppLanguage, HSKWord, QuizQuestion } from "@/types";
import { getWordTranslation } from "@/utils/i18n";

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function createQuizQuestions(words: HSKWord[], count = 8, language: AppLanguage = "uz"): QuizQuestion[] {
  const pool = shuffle(words).slice(0, Math.min(count, words.length));

  return pool.map((word) => {
    const distractors = shuffle(
      hskWords
        .filter((candidate) => candidate.id !== word.id)
        .map((candidate) => getWordTranslation(candidate, language))
    ).slice(0, 3);

    return {
      word,
      correctAnswer: getWordTranslation(word, language),
      options: shuffle([getWordTranslation(word, language), ...distractors])
    };
  });
}
