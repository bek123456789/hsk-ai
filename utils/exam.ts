import type { AppLanguage, ExamQuestion, HSKLevel } from "@/types";

export const hskLevels = [1, 2, 3, 4, 5, 6] as HSKLevel[];

export const examMeta: Record<HSKLevel, { minutes: number; difficultyUz: string; difficultyRu: string; lessons: number; words: number }> = {
  1: { minutes: 18, difficultyUz: "Yengil", difficultyRu: "Лёгкий", lessons: 4, words: 150 },
  2: { minutes: 25, difficultyUz: "Boshlang‘ich", difficultyRu: "Начальный", lessons: 6, words: 300 },
  3: { minutes: 35, difficultyUz: "O‘rta", difficultyRu: "Средний", lessons: 8, words: 600 },
  4: { minutes: 45, difficultyUz: "O‘rta yuqori", difficultyRu: "Выше среднего", lessons: 10, words: 1200 },
  5: { minutes: 55, difficultyUz: "Yuqori", difficultyRu: "Продвинутый", lessons: 12, words: 2500 },
  6: { minutes: 65, difficultyUz: "Professional", difficultyRu: "Профессиональный", lessons: 14, words: 5000 }
};

export function isExamUnlocked(level: HSKLevel, bestScoreByLevel: Partial<Record<HSKLevel, number>>) {
  if (level === 1) return true;
  return (bestScoreByLevel[(level - 1) as HSKLevel] ?? 0) >= 70;
}

export function getLocalizedQuestion(question: ExamQuestion, language: AppLanguage) {
  return {
    question: language === "ru" ? question.questionRu : question.questionUz,
    options: language === "ru" ? question.optionsRu : question.optionsUz,
    correctAnswer: language === "ru" ? question.correctAnswerRu : question.correctAnswerUz,
    explanation: language === "ru" ? question.explanationRu : question.explanationUz
  };
}

export function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
