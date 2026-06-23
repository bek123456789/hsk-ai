import type { HSKContentOption, HSKReadingPassage, HSKSkillQuestion, HSKVocabularyEntry } from "@/data/hsk/contentTypes";
import { getVocabularyEntriesByLevel } from "@/data/hsk/vocabulary";
import type { HSKLevel } from "@/types";

export const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];

export function difficultyForLevel(level: HSKLevel) {
  return level <= 2 ? "easy" : level <= 4 ? "medium" : "hard";
}

export function wordsFor(level: HSKLevel, count: number, offset = 0) {
  const words = getVocabularyEntriesByLevel(level);
  if (!words.length) return [];
  return Array.from({ length: count }, (_, index) => words[(offset + index) % words.length]);
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function optionIdForSeed(seed: string): HSKContentOption["id"] {
  const quizMatch = seed.match(/(?:quiz|exam)-hsk(\d+)-(meaning|pinyin|character)-(\d+)/);
  if (quizMatch) {
    const level = Number(quizMatch[1]);
    const typeOffset: Record<string, number> = { meaning: 0, pinyin: 1, character: 2 };
    const questionNumber = Number(quizMatch[3]);
    return (["a", "b", "c", "d"] as const)[(questionNumber + level + typeOffset[quizMatch[2]]) % 4];
  }

  const skillMatch = seed.match(/(?:reading|listening|exam-reading|exam-listening)-hsk(\d+)-(\d+).*q(\d+)/);
  if (skillMatch) {
    const level = Number(skillMatch[1]);
    const itemNumber = Number(skillMatch[2]);
    const questionNumber = Number(skillMatch[3]);
    return (["a", "b", "c", "d"] as const)[(itemNumber + questionNumber + level) % 4];
  }

  return (["a", "b", "c", "d"] as const)[stableHash(seed) % 4];
}

function uniqueDistractors(input: {
  correctUz: string;
  correctRu: string;
  correctZh?: string;
  correctPinyin?: string;
  distractors: Array<{ uz: string; ru: string; zh?: string; pinyin?: string }>;
}) {
  const seen = new Set([
    input.correctUz.trim().toLowerCase(),
    input.correctRu.trim().toLowerCase(),
    input.correctZh?.trim().toLowerCase() ?? "",
    input.correctPinyin?.trim().toLowerCase() ?? ""
  ].filter(Boolean));

  const result: Array<{ uz: string; ru: string; zh?: string; pinyin?: string }> = [];
  for (const item of input.distractors) {
    const keys = [item.uz, item.ru, item.zh, item.pinyin]
      .filter((value): value is string => Boolean(value?.trim()))
      .map((value) => value.trim().toLowerCase());
    if (!keys.length || keys.some((key) => seen.has(key))) continue;
    keys.forEach((key) => seen.add(key));
    result.push(item);
    if (result.length === 3) break;
  }
  return result;
}

export function buildOptionSet(input: {
  seed: string;
  correctUz: string;
  correctRu: string;
  correctZh?: string;
  correctPinyin?: string;
  distractors: Array<{ uz: string; ru: string; zh?: string; pinyin?: string }>;
}): { options: HSKContentOption[]; correctOptionId: HSKContentOption["id"] } {
  const ids = ["a", "b", "c", "d"] as const;
  const correctOptionId = optionIdForSeed(input.seed);
  const distractors = uniqueDistractors(input);
  const options = ids.map((id, index) => {
    if (id === correctOptionId) {
      return {
        id,
        textUz: input.correctUz,
        textRu: input.correctRu,
        textZh: input.correctZh,
        textPinyin: input.correctPinyin
      };
    }
    const item = distractors.shift() ?? { uz: `Variant ${index + 1}`, ru: `Вариант ${index + 1}` };
    return {
      id,
      textUz: item.uz,
      textRu: item.ru,
      textZh: item.zh,
      textPinyin: item.pinyin
    };
  });

  return { options, correctOptionId };
}

export function translationDistractors(level: HSKLevel, correct: HSKVocabularyEntry) {
  const words = getVocabularyEntriesByLevel(level).filter((word) => word.id !== correct.id);
  const sameCategory = words.filter((word) => word.category === correct.category);
  const samePos = words.filter((word) => word.pos === correct.pos && word.category !== correct.category);
  const fallback = words.filter((word) => word.category !== correct.category && word.pos !== correct.pos);

  return [...sameCategory, ...samePos, ...fallback]
    .map((word) => ({ uz: word.uz, ru: word.ru, zh: word.hanzi, pinyin: word.pinyin }))
    .filter((item, index, array) => array.findIndex((other) => other.uz === item.uz || other.ru === item.ru || other.zh === item.zh || other.pinyin === item.pinyin) === index)
    .slice(0, 3);
}

export function simpleQuestion(input: {
  id: string;
  level: HSKLevel;
  promptZh: string;
  promptPinyin: string;
  correct: HSKVocabularyEntry;
  questionUz: string;
  questionRu: string;
  skill: HSKSkillQuestion["skill"];
  type: HSKSkillQuestion["type"];
}): HSKSkillQuestion {
  const { options, correctOptionId } = buildOptionSet({
    seed: input.id,
    correctUz: input.correct.uz,
    correctRu: input.correct.ru,
    correctZh: input.correct.hanzi,
    correctPinyin: input.correct.pinyin,
    distractors: translationDistractors(input.level, input.correct)
  });

  return {
    id: input.id,
    level: input.level,
    type: input.type,
    questionUz: input.questionUz,
    questionRu: input.questionRu,
    promptZh: input.promptZh,
    promptPinyin: input.promptPinyin,
    options,
    correctOptionId,
    explanationUz: `${input.correct.hanzi} (${input.correct.pinyin}) “${input.correct.uz}” degani. Boshqa variantlar shu HSK darajasidagi o‘xshash so‘zlar, lekin ma’nosi boshqa.`,
    explanationRu: `${input.correct.hanzi} (${input.correct.pinyin}) означает «${input.correct.ru}». Другие варианты похожи по уровню HSK, но имеют другое значение.`,
    skill: input.skill,
    difficulty: difficultyForLevel(input.level)
  };
}

export function passageQuestion(input: {
  id: string;
  level: HSKLevel;
  questionUz: string;
  questionRu: string;
  correctUz: string;
  correctRu: string;
  explanationUz: string;
  explanationRu: string;
  distractors?: Array<{ uz: string; ru: string }>;
}): HSKReadingPassage["questions"][number] {
  const { options, correctOptionId } = buildOptionSet({
    seed: input.id,
    correctUz: input.correctUz,
    correctRu: input.correctRu,
    distractors: input.distractors ?? [
      { uz: "do‘stini kutadi", ru: "ждёт друга" },
      { uz: "kitob sotib oladi", ru: "покупает книгу" },
      { uz: "uyga qaytadi", ru: "возвращается домой" }
    ]
  });

  return {
    id: input.id,
    questionUz: input.questionUz,
    questionRu: input.questionRu,
    options,
    correctOptionId,
    explanationUz: input.explanationUz,
    explanationRu: input.explanationRu
  };
}
