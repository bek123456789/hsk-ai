"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { saveMistakeForCurrentUser } from "@/lib/progressService";
import type { CertificateRecord, ExamAttempt, GameResult, HSKLevel, LearningActivityResult, MistakeRecord, PlacementResult, PracticeResult, QuizResult, SpeakingPracticeResult, WordReviewState } from "@/types";
import { saveExamResultLocally } from "@/utils/examProgress";

type ProgressState = {
  knownWordIds: string[];
  weakWordIds: string[];
  reviewedWordIds: string[];
  quizResults: QuizResult[];
  wordReviews: Record<string, WordReviewState>;
  mistakes: MistakeRecord[];
  examAttempts: ExamAttempt[];
  practiceResults: PracticeResult[];
  speakingResults: SpeakingPracticeResult[];
  gameResults: GameResult[];
  learningActivityResults: LearningActivityResult[];
  placementResults: PlacementResult[];
  dailyPlanCompletions: Record<string, string[]>;
  achievementUnlocks: Record<string, string>;
  bestScoreByLevel: Partial<Record<HSKLevel, number>>;
  lastScoreByLevel: Partial<Record<HSKLevel, number>>;
  examAccuracy: Partial<Record<HSKLevel, number>>;
  examTimeSpent: Partial<Record<HSKLevel, number>>;
  passedLevels: HSKLevel[];
  certificates: CertificateRecord[];
  streak: number;
  currentLevel: HSKLevel;
  xp: number;
  markKnown: (wordId: string) => void;
  markWeak: (wordId: string) => void;
  markReviewed: (wordId: string) => void;
  saveQuizResult: (result: QuizResult) => void;
  savePracticeResult: (result: PracticeResult) => void;
  saveSpeakingResult: (result: SpeakingPracticeResult) => void;
  saveGameResult: (result: GameResult) => void;
  saveLearningActivity: (result: LearningActivityResult) => void;
  savePlacementResult: (result: PlacementResult) => void;
  toggleDailyTask: (date: string, taskId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  setCurrentLevel: (level: HSKLevel) => void;
  updateWordReview: (wordId: string, correct: boolean) => void;
  addMistake: (mistake: Omit<MistakeRecord, "id" | "createdAt" | "learned">) => void;
  markMistakeLearned: (id: string) => void;
  saveExamAttempt: (attempt: ExamAttempt) => void;
  resetProgress: () => void;
};

const initialState = {
  knownWordIds: [],
  weakWordIds: [],
  reviewedWordIds: [],
  quizResults: [],
  wordReviews: {},
  mistakes: [],
  examAttempts: [],
  practiceResults: [],
  speakingResults: [],
  gameResults: [],
  learningActivityResults: [],
  placementResults: [],
  dailyPlanCompletions: {},
  achievementUnlocks: {},
  bestScoreByLevel: {},
  lastScoreByLevel: {},
  examAccuracy: {},
  examTimeSpent: {},
  passedLevels: [],
  certificates: [],
  streak: 1,
  currentLevel: 1 as HSKLevel,
  xp: 0
};

function nextReviewDate(correct: boolean, correctCount: number) {
  const date = new Date();
  const days = correct ? Math.min(14, Math.max(1, correctCount) * 2) : 0;
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function updateReviewMap(map: Record<string, WordReviewState>, wordId: string, correct: boolean) {
  const current = map[wordId] ?? {
    wordId,
    status: "new" as const,
    correctCount: 0,
    wrongCount: 0,
    easeLevel: 2
  };
  const correctCount = current.correctCount + (correct ? 1 : 0);
  const wrongCount = current.wrongCount + (correct ? 0 : 1);
  const status: WordReviewState["status"] = !correct ? "weak" : correctCount >= 5 ? "mastered" : correctCount >= 2 ? "review" : "learning";

  return {
    ...map,
    [wordId]: {
      ...current,
      status,
      correctCount,
      wrongCount,
      easeLevel: Math.max(1, Math.min(5, current.easeLevel + (correct ? 1 : -1))),
      lastReviewedAt: new Date().toISOString(),
      nextReviewAt: nextReviewDate(correct, correctCount)
    }
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initialState,
      markKnown: (wordId) =>
        set((state) => ({
          knownWordIds: Array.from(new Set([...state.knownWordIds, wordId])),
          weakWordIds: state.weakWordIds.filter((id) => id !== wordId),
          reviewedWordIds: Array.from(new Set([...state.reviewedWordIds, wordId])),
          wordReviews: updateReviewMap(state.wordReviews ?? {}, wordId, true),
          xp: (state.xp ?? 0) + 25
        })),
      markWeak: (wordId) =>
        set((state) => ({
          weakWordIds: Array.from(new Set([...state.weakWordIds, wordId])),
          reviewedWordIds: Array.from(new Set([...state.reviewedWordIds, wordId])),
          wordReviews: updateReviewMap(state.wordReviews ?? {}, wordId, false)
        })),
      markReviewed: (wordId) =>
        set((state) => ({
          reviewedWordIds: Array.from(new Set([...state.reviewedWordIds, wordId]))
        })),
      saveQuizResult: (result) =>
        set((state) => ({
          quizResults: [result, ...state.quizResults].slice(0, 20),
          streak: Math.max(1, state.streak),
          xp: (state.xp ?? 0) + result.score * 15
        })),
      savePracticeResult: (result) =>
        set((state) => ({
          practiceResults: [result, ...(state.practiceResults ?? [])].slice(0, 80),
          xp: (state.xp ?? 0) + result.score * 10
        })),
      saveSpeakingResult: (result) =>
        set((state) => ({
          speakingResults: [result, ...(state.speakingResults ?? [])].slice(0, 120),
          knownWordIds: result.isCorrect ? Array.from(new Set([...state.knownWordIds, result.wordId])) : state.knownWordIds,
          weakWordIds: result.isCorrect ? state.weakWordIds.filter((id) => id !== result.wordId) : Array.from(new Set([...state.weakWordIds, result.wordId])),
          wordReviews: updateReviewMap(state.wordReviews ?? {}, result.wordId, result.isCorrect),
          xp: (state.xp ?? 0) + (result.isCorrect ? 20 : 5)
        })),
      saveGameResult: (result) =>
        set((state) => ({
          gameResults: [result, ...(state.gameResults ?? [])].slice(0, 60),
          xp: (state.xp ?? 0) + result.xp
        })),
      saveLearningActivity: (result) =>
        set((state) => ({
          learningActivityResults: [result, ...(state.learningActivityResults ?? [])].slice(0, 160),
          xp: (state.xp ?? 0) + Math.max(5, Math.round((result.score / Math.max(1, result.total)) * 30))
        })),
      savePlacementResult: (result) =>
        set((state) => ({
          placementResults: [result, ...(state.placementResults ?? [])].slice(0, 10)
        })),
      toggleDailyTask: (date, taskId) =>
        set((state) => {
          const completed = state.dailyPlanCompletions?.[date] ?? [];
          const exists = completed.includes(taskId);
          return {
            dailyPlanCompletions: {
              ...(state.dailyPlanCompletions ?? {}),
              [date]: exists ? completed.filter((id) => id !== taskId) : [...completed, taskId]
            },
            xp: exists ? state.xp : (state.xp ?? 0) + 10
          };
        }),
      unlockAchievement: (achievementId) =>
        set((state) => ({
          achievementUnlocks: state.achievementUnlocks?.[achievementId]
            ? state.achievementUnlocks
            : { ...(state.achievementUnlocks ?? {}), [achievementId]: new Date().toISOString() }
        })),
      setCurrentLevel: (level) => set({ currentLevel: level }),
      updateWordReview: (wordId, correct) =>
        set((state) => ({
          wordReviews: updateReviewMap(state.wordReviews ?? {}, wordId, correct)
        })),
      addMistake: (mistake) => {
        const record: MistakeRecord = {
          ...mistake,
          id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
          learned: false
        };
        set((state) => ({
          mistakes: [
            record,
            ...(state.mistakes ?? [])
          ].slice(0, 100)
        }));
        void saveMistakeForCurrentUser(record);
      },
      markMistakeLearned: (id) =>
        set((state) => ({
          mistakes: (state.mistakes ?? []).map((mistake) => (mistake.id === id ? { ...mistake, learned: true } : mistake))
        })),
      saveExamAttempt: (attempt) => {
        saveExamResultLocally(attempt);
        set((state) => {
          const level = attempt.hskLevel;
          const score = attempt.overallScore ?? attempt.accuracy;
          const passed = attempt.passed ?? score >= 80;
          const bestScore = Math.max(state.bestScoreByLevel?.[level] ?? 0, score);
          const passedLevels = passed ? Array.from(new Set([...(state.passedLevels ?? []), level])) : state.passedLevels ?? [];
          const certificateExists = (state.certificates ?? []).some((certificate) => certificate.hskLevel === level);
          const certificates =
            passed && !certificateExists
              ? [
                  ...(state.certificates ?? []),
                  {
                    id: `certificate-hsk${level}-${Date.now()}`,
                    hskLevel: level,
                    score,
                    date: attempt.completedAt
                  }
                ]
              : state.certificates ?? [];

          return {
            examAttempts: [attempt, ...(state.examAttempts ?? [])].slice(0, 50),
            bestScoreByLevel: { ...(state.bestScoreByLevel ?? {}), [level]: bestScore },
            lastScoreByLevel: { ...(state.lastScoreByLevel ?? {}), [level]: score },
            examAccuracy: { ...(state.examAccuracy ?? {}), [level]: score },
            examTimeSpent: { ...(state.examTimeSpent ?? {}), [level]: attempt.timeSpentSeconds },
            passedLevels,
            certificates,
            currentLevel: passed && level < 6 ? ((level + 1) as HSKLevel) : state.currentLevel,
            xp: (state.xp ?? 0) + attempt.correctAnswers * 10
          };
        });
      },
      resetProgress: () => set(initialState)
    }),
    {
      name: "hsk-ai-progress"
    }
  )
);
