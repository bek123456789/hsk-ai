import type { AppLanguage } from "@/types";

const hanziRegex = /[\u3400-\u9fff]/;
const latinRegex = /[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹḿ]/i;

const toneMap: Record<string, string> = {
  ā: "a", á: "a", ǎ: "a", à: "a",
  ē: "e", é: "e", ě: "e", è: "e",
  ī: "i", í: "i", ǐ: "i", ì: "i",
  ō: "o", ó: "o", ǒ: "o", ò: "o",
  ū: "u", ú: "u", ǔ: "u", ù: "u",
  ǖ: "u", ǘ: "u", ǚ: "u", ǜ: "u",
  ü: "u", ń: "n", ň: "n", ǹ: "n", ḿ: "m"
};

export type AnswerPrecheck = {
  valid: boolean;
  code: "ok" | "empty" | "pinyin_only" | "copied_prompt" | "copied_sample" | "copied_pinyin";
  scoreCap?: number;
  scoreOverride?: number;
  messageUz: string;
  messageRu: string;
};

export function normalizeChineseAnswer(value: string) {
  return value.toLowerCase().replace(/[\s，。！？、,.!?;；:："'“”‘’（）()\[\]{}<>《》\-—_]/g, "");
}

export function normalizePinyinAnswer(value: string) {
  return value
    .toLowerCase()
    .replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹḿ]/g, (match) => toneMap[match] ?? match)
    .replace(/[^a-z0-9]/g, "");
}

export function hasHanzi(value: string) {
  return hanziRegex.test(value);
}

export function isPinyinOnlyAnswer(value: string) {
  const cleaned = value.trim();
  if (!cleaned || hasHanzi(cleaned)) return false;
  return latinRegex.test(cleaned) && normalizePinyinAnswer(cleaned).length >= 3;
}

function similarityRatio(first: string, second: string) {
  if (!first || !second) return 0;
  const rows = first.length + 1;
  const cols = second.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(cols).fill(0));
  for (let row = 0; row < rows; row += 1) matrix[row][0] = row;
  for (let col = 0; col < cols; col += 1) matrix[0][col] = col;
  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = first[row - 1] === second[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost
      );
    }
  }
  const distance = matrix[first.length][second.length];
  return 1 - distance / Math.max(first.length, second.length);
}

function equalOrMostlyCopied(answer: string, reference: string, mode: "practice" | "exam") {
  const normalizedAnswer = normalizeChineseAnswer(answer);
  const normalizedReference = normalizeChineseAnswer(reference);
  if (!normalizedAnswer || !normalizedReference) return false;
  if (normalizedAnswer === normalizedReference) return true;
  const lengthRatio = normalizedAnswer.length / Math.max(1, normalizedReference.length);
  if (normalizedAnswer.includes(normalizedReference) && lengthRatio >= 0.9) return true;
  if (mode === "exam" && normalizedReference.includes(normalizedAnswer) && lengthRatio >= 0.9) return true;
  return lengthRatio >= 0.85 && similarityRatio(normalizedAnswer, normalizedReference) >= 0.9;
}

function pinyinCopied(answer: string, referencePinyin?: string) {
  if (!referencePinyin) return false;
  const normalizedAnswer = normalizePinyinAnswer(answer);
  const normalizedReference = normalizePinyinAnswer(referencePinyin);
  return Boolean(normalizedAnswer && normalizedReference && normalizedAnswer === normalizedReference);
}

export function precheckChineseAnswer(input: {
  answer: string;
  promptZh?: string;
  promptPinyin?: string;
  instructionZh?: string;
  sampleAnswerZh?: string;
  sampleAnswerPinyin?: string;
  allowBeginnerPinyin?: boolean;
  mode?: "practice" | "exam";
}): AnswerPrecheck {
  const answer = input.answer.trim();
  const mode = input.mode ?? "practice";
  if (!answer) {
    return {
      valid: false,
      code: "empty",
      scoreOverride: 0,
      messageUz: "Javob bo‘sh bo‘lishi mumkin emas.",
      messageRu: "Ответ не может быть пустым."
    };
  }
  if (input.promptZh && equalOrMostlyCopied(answer, input.promptZh, "exam") || input.instructionZh && equalOrMostlyCopied(answer, input.instructionZh, "exam")) {
    return {
      valid: false,
      code: "copied_prompt",
      scoreOverride: 0,
      messageUz: "Berilgan matnni ko‘chirmang. Mazmunni o‘z xitoycha gapingiz bilan ayting.",
      messageRu: "Не копируйте исходный текст. Передайте смысл своими китайскими фразами."
    };
  }
  if (input.sampleAnswerZh && equalOrMostlyCopied(answer, input.sampleAnswerZh, mode)) {
    if (mode === "practice") {
      return {
        valid: true,
        code: "copied_sample",
        scoreCap: 88,
        messageUz: "Javob to‘g‘ri, lekin keyingi safar namuna gapni aynan ko‘chirmasdan o‘zingiz tuzishga harakat qiling.",
        messageRu: "Ответ верный, но в следующий раз попробуйте составить свой вариант, не копируя пример полностью."
      };
    }
    return {
      valid: false,
      code: "copied_sample",
      scoreOverride: 0,
      messageUz: "Namuna javobni aynan ko‘chirmang. O‘z javobingizni yozing.",
      messageRu: "Не копируйте пример ответа дословно. Напишите свой ответ."
    };
  }
  if (pinyinCopied(answer, input.promptPinyin) || pinyinCopied(answer, input.sampleAnswerPinyin)) {
    return {
      valid: false,
      code: "copied_pinyin",
      scoreOverride: 0,
      messageUz: "Pinyin matnini ko‘chirish javob hisoblanmaydi. Hanzi bilan javob yozing.",
      messageRu: "Скопированный pinyin не считается ответом. Напишите ответ ханьцзы."
    };
  }
  if (isPinyinOnlyAnswer(answer)) {
    return {
      valid: input.allowBeginnerPinyin === true,
      code: "pinyin_only",
      scoreCap: input.allowBeginnerPinyin ? 35 : 0,
      scoreOverride: input.allowBeginnerPinyin ? undefined : 0,
      messageUz: "Faqat pinyin to‘liq xitoycha javob emas. Hanzi bilan yozing.",
      messageRu: "Один pinyin не является полноценным китайским ответом. Напишите ханьцзы."
    };
  }
  if (!hasHanzi(answer)) {
    return {
      valid: false,
      code: "pinyin_only",
      scoreOverride: 0,
      messageUz: "Javob xitoycha hanzi bilan yozilishi kerak.",
      messageRu: "Ответ нужно написать китайскими иероглифами."
    };
  }
  return {
    valid: true,
    code: "ok",
    messageUz: "Javob tekshirildi.",
    messageRu: "Ответ проверен."
  };
}

export function localizedPrecheckMessage(precheck: AnswerPrecheck, locale: AppLanguage) {
  return locale === "ru" ? precheck.messageRu : precheck.messageUz;
}

type CoverageResult = {
  score: number;
  missingKeywords: string[];
};

function includesAny(normalized: string, values: string[]) {
  return values.some((value) => normalized.includes(normalizeChineseAnswer(value)));
}

function scoreStoreSituation(normalized: string, keywordsZh: string[]): CoverageResult | null {
  const normalizedKeywords = keywordsZh.map((keyword) => normalizeChineseAnswer(keyword));
  const priceIndex = normalizedKeywords.indexOf(normalizeChineseAnswer("多少钱"));
  const buyIndex = normalizedKeywords.indexOf(normalizeChineseAnswer("买"));
  const rejectIndex = normalizedKeywords.indexOf(normalizeChineseAnswer("不要"));
  if (priceIndex === -1 || buyIndex === -1 || rejectIndex === -1 || keywordsZh.length < 5) return null;

  const wantedItem = keywordsZh.find((keyword, index) => index !== priceIndex && index !== buyIndex && index < rejectIndex);
  const rejectedItem = keywordsZh.find((keyword, index) => index !== rejectIndex && index > rejectIndex);
  const hasPrice = includesAny(normalized, ["多少钱", "多少", "价格", "几块", "几元"]);
  const hasBuy = includesAny(normalized, ["买", "要", "想买"]);
  const hasReject = includesAny(normalized, ["不要", "不买", "不要买"]);
  const hasWantedSpecific = Boolean(wantedItem && normalized.includes(normalizeChineseAnswer(wantedItem)));
  const hasRejectedSpecific = Boolean(rejectedItem && normalized.includes(normalizeChineseAnswer(rejectedItem)));
  const hasWantedGeneric = hasBuy && normalized.includes(normalizeChineseAnswer("这个"));
  const hasRejectedGeneric = hasReject && normalized.includes(normalizeChineseAnswer("那个"));

  let score = 0;
  if (hasPrice) score += 25;
  if (hasBuy) score += 20;
  if (hasWantedSpecific) score += 20;
  else if (hasWantedGeneric) score += 12;
  if (hasReject) score += 20;
  if (hasRejectedSpecific) score += 15;
  else if (hasRejectedGeneric) score += 8;

  const missingKeywords: string[] = [];
  if (!hasPrice) missingKeywords.push("多少钱");
  if (!hasBuy) missingKeywords.push("买");
  if (!hasWantedSpecific && !hasWantedGeneric && wantedItem) missingKeywords.push(wantedItem);
  if (!hasReject) missingKeywords.push("不要");
  if (!hasRejectedSpecific && !hasRejectedGeneric && rejectedItem) missingKeywords.push(rejectedItem);
  return { score: Math.max(0, Math.min(100, Math.round(score))), missingKeywords };
}

function scoreKeywordCoverage(normalized: string, keywordsZh: string[], minCharacters: number): CoverageResult {
  const storeScore = scoreStoreSituation(normalized, keywordsZh);
  if (storeScore) return storeScore;
  const matched = keywordsZh.filter((keyword) => normalized.includes(normalizeChineseAnswer(keyword)));
  const keywordCoverage = keywordsZh.length ? matched.length / keywordsZh.length : 0;
  const lengthScore = Math.min(1, normalized.length / Math.max(1, minCharacters));
  return {
    score: Math.round(keywordCoverage * 70 + lengthScore * 30),
    missingKeywords: keywordsZh.filter((keyword) => !matched.includes(keyword))
  };
}

export function localizedMissingKeywordFeedback(missingKeywords: string[], locale: AppLanguage) {
  const normalizedMissing = missingKeywords.map((item) => normalizeChineseAnswer(item));
  const missesReject = normalizedMissing.includes(normalizeChineseAnswer("不要"));
  const missingRejectedItem = [...missingKeywords].reverse().find((item) => !["多少钱", "买", "不要"].includes(item));
  if (missesReject && missingRejectedItem) {
    return locale === "ru"
      ? `Ответ частично верный. Вы спросили цену, но также скажите, что не хотите покупать: 不要${missingRejectedItem}.`
      : `Javob qisman to‘g‘ri. Narxni so‘radingiz, lekin nimani olmasligingizni ham ayting: 不要${missingRejectedItem}.`;
  }
  if (missesReject) {
    return locale === "ru"
      ? "Ответ частично верный. Добавьте, что вы не хотите покупать: 不要..."
      : "Javob qisman to‘g‘ri. Olmasligingizni ham ayting: 不要...";
  }
  return locale === "ru"
    ? `Ответ частично верный. Добавьте недостающие части: ${missingKeywords.join("、")}.`
    : `Javob qisman to‘g‘ri. Yetishmayotgan qismlarni qo‘shing: ${missingKeywords.join("、")}.`;
}

export function deterministicOpenAnswerScore(input: {
  answer: string;
  keywordsZh: string[];
  minCharacters: number;
  promptZh?: string;
  promptPinyin?: string;
  sampleAnswerZh?: string;
  sampleAnswerPinyin?: string;
  allowBeginnerPinyin?: boolean;
  mode?: "practice" | "exam";
}) {
  const precheck = precheckChineseAnswer(input);
  if (!precheck.valid && precheck.scoreOverride !== undefined) return { score: precheck.scoreOverride, precheck, missingKeywords: input.keywordsZh };
  const normalized = normalizeChineseAnswer(input.answer);
  const coverage = scoreKeywordCoverage(normalized, input.keywordsZh, input.minCharacters);
  const capped = precheck.scoreCap !== undefined ? Math.min(precheck.scoreCap, coverage.score) : coverage.score;
  return { score: Math.max(0, Math.min(100, capped)), precheck, missingKeywords: coverage.missingKeywords };
}
