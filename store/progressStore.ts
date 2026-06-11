"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CertificateRecord, ExamAttempt, HSKLevel, MistakeRecord, QuizResult, WordReviewState } from "@/types";

type ProgressState = {
  knownWordIds: string[];
  weakWordIds: string[];
  reviewedWordIds: string[];
  quizResults: QuizResult[];
  wordReviews: Record<string, WordReviewState>;
  mistakes: MistakeRecord[];
  examAttempts: ExamAttempt[];
  bestScoreByLevel: Partial<Record<HSKLevel, number>>;
  lastScoreByLevel: Partial<Record<HSKLevel, number>>;
  examAccuracy: Partial<Record<HSKLevel, number>>;
  examTimeSpent: Partial<Record<HSKLevel, number>>;
  passedLevels: HSKLevel[];
  certificates: CertificateRecord[];
  streak: number;
  currentLevel: HSKLevel;
  markKnown: (wordId: string) => void;
  markWeak: (wordId: string) => void;
  markReviewed: (wordId: string) => void;
  saveQuizResult: (result: QuizResult) => void;
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
  bestScoreByLevel: {},
  lastScoreByLevel: {},
  examAccuracy: {},
  examTimeSpent: {},
  passedLevels: [],
  certificates: [],
  streak: 1,
  currentLevel: 1 as HSKLevel
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
  const status: WordReviewState["status"] = !correct ? "learning" : correctCount >= 3 ? "mastered" : "review";

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
          wordReviews: updateReviewMap(state.wordReviews ?? {}, wordId, true)
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
          streak: Math.max(1, state.streak)
        })),
      updateWordReview: (wordId, correct) =>
        set((state) => ({
          wordReviews: updateReviewMap(state.wordReviews ?? {}, wordId, correct)
        })),
      addMistake: (mistake) =>
        set((state) => ({
          mistakes: [
            {
              ...mistake,
              id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              createdAt: new Date().toISOString(),
              learned: false
            },
            ...(state.mistakes ?? [])
          ].slice(0, 100)
        })),
      markMistakeLearned: (id) =>
        set((state) => ({
          mistakes: (state.mistakes ?? []).map((mistake) => (mistake.id === id ? { ...mistake, learned: true } : mistake))
        })),
      saveExamAttempt: (attempt) =>
        set((state) => {
          const level = attempt.hskLevel;
          const bestScore = Math.max(state.bestScoreByLevel?.[level] ?? 0, attempt.accuracy);
          const passedLevels = attempt.accuracy >= 70 ? Array.from(new Set([...(state.passedLevels ?? []), level])) : state.passedLevels ?? [];
          const certificateExists = (state.certificates ?? []).some((certificate) => certificate.hskLevel === level);
          const certificates =
            attempt.accuracy >= 70 && !certificateExists
              ? [
                  ...(state.certificates ?? []),
                  {
                    id: `certificate-hsk${level}-${Date.now()}`,
                    hskLevel: level,
                    score: attempt.accuracy,
                    date: attempt.completedAt
                  }
                ]
              : state.certificates ?? [];

          return {
            examAttempts: [attempt, ...(state.examAttempts ?? [])].slice(0, 50),
            bestScoreByLevel: { ...(state.bestScoreByLevel ?? {}), [level]: bestScore },
            lastScoreByLevel: { ...(state.lastScoreByLevel ?? {}), [level]: attempt.accuracy },
            examAccuracy: { ...(state.examAccuracy ?? {}), [level]: attempt.accuracy },
            examTimeSpent: { ...(state.examTimeSpent ?? {}), [level]: attempt.timeSpentSeconds },
            passedLevels,
            certificates,
            currentLevel: attempt.accuracy >= 70 && level < 6 ? ((level + 1) as HSKLevel) : state.currentLevel
          };
        }),
      resetProgress: () => set(initialState)
    }),
    {
      name: "hsk-ai-progress"
    }
  )
);
