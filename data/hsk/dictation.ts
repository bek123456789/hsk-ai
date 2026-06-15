import type { HSKDictationItem } from "@/data/hsk/contentTypes";
import { difficultyForLevel, levels, wordsFor } from "@/data/hsk/contentFactory";
import type { HSKLevel } from "@/types";

export const hskDictationItems: HSKDictationItem[] = levels.flatMap((level) =>
  wordsFor(level, level <= 2 ? 18 : 10).map((word, index) => ({
    id: `dictation-hsk${level}-${String(index + 1).padStart(2, "0")}`,
    level,
    audioTextZh: index % 2 === 0 ? word.hanzi : word.exampleZh,
    audioTextPinyin: index % 2 === 0 ? word.pinyin : word.examplePinyin,
    answerZh: index % 2 === 0 ? word.hanzi : word.exampleZh,
    answerPinyin: index % 2 === 0 ? word.pinyin : word.examplePinyin,
    meaningUz: index % 2 === 0 ? word.uz : word.exampleUz,
    meaningRu: index % 2 === 0 ? word.ru : word.exampleRu,
    difficulty: difficultyForLevel(level)
  }))
);

export function getDictationByLevel(level: HSKLevel) {
  return hskDictationItems.filter((item) => item.level === level);
}
