import type { ExamAttempt, HSKLevel, MistakeRecord } from "@/types";
import { getUnlockedHskLevels } from "@/utils/hskUnlock";

type ProgressLike = {
  knownWordIds?: string[];
  weakWordIds?: string[];
  streak?: number;
  currentLevel?: HSKLevel;
  practiceResults?: Array<{ skill: string; score: number; total: number }>;
};

export function generateDailyStudyPlan(userProgress: ProgressLike, weakWords: string[] = [], mistakes: MistakeRecord[] = [], examResults: ExamAttempt[] = []) {
  const weakCount = Math.max(5, Math.min(12, weakWords.length || userProgress.weakWordIds?.length || 5));
  const learnedCount = userProgress.knownWordIds?.length ?? 0;
  const recentExam = examResults[0];
  const focusSkill = getRecommendedNextAction({ ...userProgress, mistakes, recentExam });
  const unlockedLevels = getUnlockedHskLevels({ knownWordIds: userProgress.knownWordIds ?? [] }, examResults);
  const requestedLevel = userProgress.currentLevel ?? 1;
  const level = unlockedLevels.includes(requestedLevel) ? requestedLevel : unlockedLevels.at(-1) ?? 1;

  return {
    completion: Math.min(100, Math.round((learnedCount % 10) * 10)),
    estimatedMinutes: recentExam && (recentExam.overallScore ?? recentExam.accuracy) < 80 ? 28 : 20,
    tasks: [
      { id: "lesson", titleUz: "Keyingi darsni davom ettiring", titleRu: "Продолжите следующий урок", href: `/lesson/${level}` },
      { id: "review", titleUz: `${weakCount} ta zaif so‘zni takrorlang`, titleRu: `Повторите ${weakCount} слабых слов`, href: "/review" },
      { id: "reading", titleUz: "1 ta o‘qish mashqini bajaring", titleRu: "Выполните 1 задание по чтению", href: `/reading/${level}` },
      { id: "listening", titleUz: "1 ta tinglash mashq qiling", titleRu: "Выполните 1 задание по аудированию", href: `/listening/${level}` },
      { id: "speaking", titleUz: "1 ta gapirish mashq qiling", titleRu: "Выполните 1 задание по говорению", href: `/speaking/${level}` }
    ],
    focusSkill
  };
}

export function getTodayTasks(userId?: string) {
  if (typeof window === "undefined") return [];
  const key = `hsk-ai-daily-tasks-${userId ?? "local"}-${new Date().toISOString().slice(0, 10)}`;
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function calculateDailyGoal(userProgress: ProgressLike) {
  return (userProgress.streak ?? 0) >= 7 ? 30 : 20;
}

export function getRecommendedNextAction(input: ProgressLike & { mistakes?: MistakeRecord[]; recentExam?: ExamAttempt }) {
  if (input.recentExam && (input.recentExam.overallScore ?? input.recentExam.accuracy) < 80) return "exam";
  if ((input.weakWordIds?.length ?? 0) > 8 || (input.mistakes?.length ?? 0) > 4) return "review";
  const weakSkill = input.practiceResults?.find((result) => result.total > 0 && result.score / result.total < 0.7)?.skill;
  return weakSkill ?? "lesson";
}
