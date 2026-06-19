import type { HSKWord, MistakeRecord, WordReviewState } from "@/types";

export type ReviewCardType = "meaning" | "reverse" | "pinyin" | "sentence" | "listening";

export type ReviewQueueItem = {
  word: HSKWord;
  cardType: ReviewCardType;
  source: "due" | "weak" | "mistake" | "learned";
  dueAt?: string;
};

type BuildQueueInput = {
  words: HSKWord[];
  knownWordIds: string[];
  weakWordIds: string[];
  wordReviews: Record<string, WordReviewState>;
  mistakes: MistakeRecord[];
  limit?: number;
};

const fallbackReviewKey = "hanziflow_review_items";

const cardCycle: ReviewCardType[] = ["meaning", "reverse", "pinyin", "sentence", "listening"];

function isDue(review?: WordReviewState) {
  if (!review?.nextReviewAt) return false;
  return new Date(review.nextReviewAt).getTime() <= Date.now();
}

function priority(item: ReviewQueueItem) {
  if (item.source === "mistake") return 0;
  if (item.source === "weak") return 1;
  if (item.source === "due") return 2;
  return 3;
}

export function getReviewQueue({ words, knownWordIds, weakWordIds, wordReviews, mistakes, limit = 12 }: BuildQueueInput) {
  const wordById = new Map(words.map((word) => [word.id, word]));
  const mistakeWordIds = new Set(mistakes.map((mistake) => mistake.wordId).filter(Boolean) as string[]);
  const known = new Set(knownWordIds);
  const weak = new Set(weakWordIds);
  const queue = new Map<string, ReviewQueueItem>();

  words.forEach((word, index) => {
    const review = wordReviews[word.id];
    const fromMistake = mistakeWordIds.has(word.id);
    const fromWeak = weak.has(word.id) || review?.status === "weak" || review?.status === "learning";
    const fromDue = isDue(review);
    const fromLearned = known.has(word.id) && review?.status !== "mastered";

    if (!fromMistake && !fromWeak && !fromDue && !fromLearned) return;

    const source: ReviewQueueItem["source"] = fromMistake ? "mistake" : fromWeak ? "weak" : fromDue ? "due" : "learned";
    queue.set(word.id, {
      word,
      source,
      dueAt: review?.nextReviewAt,
      cardType: cardCycle[(review?.correctCount ?? index) % cardCycle.length]
    });
  });

  mistakes.forEach((mistake, index) => {
    if (!mistake.wordId || queue.has(mistake.wordId)) return;
    const word = wordById.get(mistake.wordId);
    if (!word) return;
    queue.set(word.id, {
      word,
      source: "mistake",
      cardType: cardCycle[index % cardCycle.length]
    });
  });

  return Array.from(queue.values())
    .sort((a, b) => {
      const priorityDiff = priority(a) - priority(b);
      if (priorityDiff !== 0) return priorityDiff;
      return (a.dueAt ?? "").localeCompare(b.dueAt ?? "");
    })
    .slice(0, limit);
}

export function getReviewDueCount(input: BuildQueueInput) {
  return getReviewQueue(input).length;
}

export function saveReviewItemFallback(word: HSKWord, review: WordReviewState) {
  if (typeof window === "undefined") return;
  try {
    const current = JSON.parse(window.localStorage.getItem(fallbackReviewKey) ?? "{}") as Record<string, unknown>;
    current[word.id] = {
      word_id: word.id,
      level: word.hskLevel,
      lesson_id: word.lessonId,
      ease: review.easeLevel,
      interval_days: review.nextReviewAt
        ? Math.max(0, Math.ceil((new Date(review.nextReviewAt).getTime() - Date.now()) / 86_400_000))
        : 0,
      due_at: review.nextReviewAt ?? new Date().toISOString(),
      correct_count: review.correctCount,
      wrong_count: review.wrongCount,
      last_reviewed_at: review.lastReviewedAt ?? new Date().toISOString()
    };
    window.localStorage.setItem(fallbackReviewKey, JSON.stringify(current));
  } catch {
    // The Zustand progress store remains the primary fallback if this compact review cache cannot be written.
  }
}

export function getReviewPrompt(type: ReviewCardType, language: "uz" | "ru") {
  const uz: Record<ReviewCardType, string> = {
    meaning: "Xitoycha so‘zning ma’nosini ayting",
    reverse: "Tarjimadan xitoycha so‘zni eslang",
    pinyin: "Pinyinni tanib oling",
    sentence: "Gapdagi so‘zni eslab qoling",
    listening: "Eshitib ma’nosini ayting"
  };
  const ru: Record<ReviewCardType, string> = {
    meaning: "Назовите значение китайского слова",
    reverse: "Вспомните китайское слово по переводу",
    pinyin: "Распознайте pinyin",
    sentence: "Запомните слово в предложении",
    listening: "Прослушайте и назовите значение"
  };
  return language === "ru" ? ru[type] : uz[type];
}
