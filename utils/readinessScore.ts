import type { ExamAttempt, HSKLevel, MistakeRecord, PracticeResult, QuizResult } from "@/types";

type ReadinessInput = {
  level: HSKLevel;
  knownWordIds: string[];
  weakWordIds: string[];
  mistakes: MistakeRecord[];
  quizResults: QuizResult[];
  examAttempts: ExamAttempt[];
  practiceResults?: PracticeResult[];
  streak?: number;
};

export function calculateSkillScore(skill: string, practiceResults: PracticeResult[] = []) {
  const results = practiceResults.filter((result) => result.skill === skill).slice(0, 5);
  if (!results.length) return 45;
  const correct = results.reduce((sum, result) => sum + result.score, 0);
  const total = results.reduce((sum, result) => sum + result.total, 0);
  return Math.round((correct / Math.max(1, total)) * 100);
}

export function calculateExamReadiness(input: ReadinessInput) {
  const levelPrefix = `hsk${input.level}-`;
  const learned = input.knownWordIds.filter((id) => id.startsWith(levelPrefix)).length;
  const weak = input.weakWordIds.filter((id) => id.startsWith(levelPrefix)).length;
  const mistakes = input.mistakes.filter((item) => item.hskLevel === input.level).length;
  const quiz = input.quizResults.find((result) => result.level === input.level);
  const exam = input.examAttempts.find((attempt) => attempt.hskLevel === input.level);
  const vocabulary = Math.min(100, Math.round((learned / Math.max(30, learned + weak + 1)) * 100));
  const quizScore = quiz ? Math.round((quiz.score / Math.max(1, quiz.total)) * 100) : 50;
  const examScore = exam?.accuracy ?? 45;
  const consistency = Math.min(100, (input.streak ?? 1) * 12);
  const penalty = Math.min(30, weak * 2 + mistakes);
  const skills = {
    vocabulary,
    grammar: Math.max(35, quizScore - Math.min(20, mistakes)),
    reading: calculateSkillScore("reading", input.practiceResults),
    listening: calculateSkillScore("listening", input.practiceResults),
    writing: calculateSkillScore("writing", input.practiceResults),
    speaking: calculateSkillScore("speaking", input.practiceResults)
  };
  const base = Object.values(skills).reduce((sum, value) => sum + value, 0) / Object.values(skills).length;
  const score = Math.max(0, Math.min(100, Math.round(base * 0.55 + quizScore * 0.18 + examScore * 0.18 + consistency * 0.09 - penalty)));

  return {
    score,
    skills,
    weakestSkill: getWeakestSkill(skills),
    recommendationUz: getReadinessRecommendation(score, getWeakestSkill(skills), "uz"),
    recommendationRu: getReadinessRecommendation(score, getWeakestSkill(skills), "ru")
  };
}

export function getWeakestSkill(skills: Record<string, number>) {
  return Object.entries(skills).sort((left, right) => left[1] - right[1])[0]?.[0] ?? "vocabulary";
}

export function getReadinessRecommendation(score: number, skill: string, language: "uz" | "ru") {
  const skillLabels = {
    uz: {
      vocabulary: "lug‘at",
      grammar: "grammatika",
      reading: "o‘qish",
      listening: "tinglash",
      writing: "yozish",
      speaking: "gapirish"
    },
    ru: {
      vocabulary: "словарь",
      grammar: "грамматика",
      reading: "чтение",
      listening: "аудирование",
      writing: "письмо",
      speaking: "говорение"
    }
  };
  const skillLabel = skillLabels[language][skill as keyof (typeof skillLabels)["uz"]] ?? skill;

  if (language === "ru") {
    if (score >= 85) return "Вы готовы к тренировочному тесту HSK.";
    if (score >= 70) return `Вы почти готовы. Больше практикуйте навык: ${skillLabel}.`;
    if (score >= 40) return `Нужна практика. Самый слабый навык: ${skillLabel}.`;
    return "Сначала укрепите словарь, грамматику и слабые слова.";
  }
  if (score >= 85) return "Siz HSK uslubidagi testga tayyorsiz.";
  if (score >= 70) return `Deyarli tayyorsiz. ${skillLabel} bo‘yicha yana mashq qiling.`;
  if (score >= 40) return `Mashq kerak. ${skillLabel} eng zaif ko‘nikma bo‘lib turibdi.`;
  return "Avval lug‘at, grammatika va zaif so‘zlarni mustahkamlang.";
}
