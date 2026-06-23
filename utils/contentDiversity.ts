type OptionId = "a" | "b" | "c" | "d";

type QuestionLike = {
  id: string;
  correctOptionId?: OptionId;
  promptZh?: string;
  promptPinyin?: string;
  questionUz?: string;
  type?: string;
  skill?: string;
};

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getContentFingerprint(item: QuestionLike) {
  return [item.type, item.skill, item.promptZh, item.promptPinyin, item.questionUz]
    .filter(Boolean)
    .join("|")
    .toLowerCase();
}

export function getQuestionVocabularyKey(item: QuestionLike) {
  const prompt = item.promptZh?.trim();
  if (prompt && /[\u3400-\u9fff]/.test(prompt)) return prompt;
  const idMatch = item.id.match(/(?:meaning|pinyin|character)-(\d+)/);
  return idMatch?.[1] ?? item.id;
}

export function balanceCorrectAnswerPositions<T extends QuestionLike>(items: T[]) {
  const result: T[] = [];
  const queues = new Map<OptionId, T[]>();
  for (const item of items) {
    const id = item.correctOptionId ?? "a";
    queues.set(id, [...(queues.get(id) ?? []), item]);
  }

  const order: OptionId[] = ["a", "b", "c", "d"];
  while ([...queues.values()].some((queue) => queue.length)) {
    for (const option of order) {
      const queue = queues.get(option);
      const next = queue?.shift();
      if (next) result.push(next);
    }
  }
  return result;
}

export function balanceQuestionTypes<T extends QuestionLike>(items: T[]) {
  const buckets = new Map<string, T[]>();
  for (const item of items) {
    const key = `${item.skill ?? "skill"}:${item.type ?? "type"}`;
    buckets.set(key, [...(buckets.get(key) ?? []), item]);
  }
  const keys = [...buckets.keys()].sort();
  const result: T[] = [];
  while ([...buckets.values()].some((bucket) => bucket.length)) {
    for (const key of keys) {
      const next = buckets.get(key)?.shift();
      if (next) result.push(next);
    }
  }
  return result;
}

export function avoidRecentWords<T extends QuestionLike>(items: T[]) {
  const result: T[] = [];
  const deferred: T[] = [];
  let previous = "";

  for (const item of items) {
    const key = getQuestionVocabularyKey(item);
    if (key && key === previous) {
      deferred.push(item);
      continue;
    }
    result.push(item);
    previous = key;
  }

  for (const item of deferred) {
    const key = getQuestionVocabularyKey(item);
    const last = result[result.length - 1];
    if (last && getQuestionVocabularyKey(last) === key) {
      const insertAt = Math.max(0, result.findIndex((candidate) => getQuestionVocabularyKey(candidate) !== key));
      result.splice(insertAt, 0, item);
    } else {
      result.push(item);
    }
  }

  return result;
}

export function pickDiverseQuestions<T extends QuestionLike>(items: T[], input: { count: number; seed: string }) {
  const deduped = new Map<string, T>();
  for (const item of items) {
    const fingerprint = getContentFingerprint(item) || item.id;
    if (!deduped.has(fingerprint)) deduped.set(fingerprint, item);
  }

  const shuffled = [...deduped.values()].sort((a, b) => stableHash(`${input.seed}:${a.id}`) - stableHash(`${input.seed}:${b.id}`));
  return avoidRecentWords(balanceCorrectAnswerPositions(balanceQuestionTypes(shuffled))).slice(0, input.count);
}
