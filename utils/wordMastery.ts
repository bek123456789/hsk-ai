import type { WordReviewState } from "@/types";

export function getWordStatus(wordId: string, userProgress: Record<string, WordReviewState> = {}) {
  return userProgress[wordId]?.status ?? "new";
}

export function updateWordMastery(current: WordReviewState | undefined, result: "correct" | "wrong"): WordReviewState {
  const review = current ?? { wordId: "", status: "new" as const, correctCount: 0, wrongCount: 0, easeLevel: 2 };
  const correctCount = review.correctCount + (result === "correct" ? 1 : 0);
  const wrongCount = review.wrongCount + (result === "wrong" ? 1 : 0);
  const status = result === "wrong" ? "weak" : correctCount >= 5 ? "mastered" : correctCount >= 2 ? "review" : "learning";

  return {
    ...review,
    status,
    correctCount,
    wrongCount,
    lastReviewedAt: new Date().toISOString(),
    easeLevel: Math.max(1, Math.min(5, review.easeLevel + (result === "correct" ? 1 : -1)))
  };
}

export function markWordWeak(wordId: string) {
  return updateWordMastery({ wordId, status: "weak", correctCount: 0, wrongCount: 0, easeLevel: 2 }, "wrong");
}

export function markWordMastered(wordId: string) {
  return { wordId, status: "mastered" as const, correctCount: 5, wrongCount: 0, easeLevel: 5, lastReviewedAt: new Date().toISOString() };
}

export function getWordsForReview(userProgress: Record<string, WordReviewState> = {}) {
  const now = Date.now();
  return Object.values(userProgress).filter((review) => review.status === "weak" || review.status === "learning" || (review.nextReviewAt && new Date(review.nextReviewAt).getTime() <= now));
}
