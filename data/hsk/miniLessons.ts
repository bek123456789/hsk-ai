import type { HSKMiniLesson } from "@/data/hsk/contentTypes";
import { levels, simpleQuestion, wordsFor } from "@/data/hsk/contentFactory";
import { getGrammarByLevel } from "@/data/hsk/grammar";
import type { HSKLevel } from "@/types";

export const hskMiniLessons: HSKMiniLesson[] = levels.flatMap((level) =>
  Array.from({ length: 4 }, (_, index) => {
    const words = wordsFor(level, 4, index * 4);
    const grammar = getGrammarByLevel(level)[index % Math.max(1, getGrammarByLevel(level).length)];
    const first = words[0];
    return {
      id: `mini-hsk${level}-${index + 1}`,
      level,
      titleUz: `HSK ${level}: ${grammar?.titleUz ?? "Qisqa dars"}`,
      titleRu: `HSK ${level}: ${grammar?.titleRu ?? "Короткий урок"}`,
      minutes: level <= 2 ? 3 : 5,
      grammarPattern: grammar?.pattern ?? "主语 + 动词 + 宾语",
      explanationUz: grammar?.explanationUz ?? "Qisqa gap tuzishda ega, fe’l va to‘ldiruvchi tartibini saqlang.",
      explanationRu: grammar?.explanationRu ?? "В коротком предложении сохраняйте порядок: подлежащее, глагол, дополнение.",
      vocabularyIds: words.map((word) => word.id),
      dialogueZh: `A：你今天学习什么？B：我学习${first?.hanzi ?? "汉语"}，也练习句子。`,
      dialoguePinyin: `A: nǐ jīn tiān xué xí shén me? B: wǒ xué xí ${first?.pinyin ?? "hàn yǔ"}, yě liàn xí jù zi.`,
      dialogueUz: `A bugun nima o‘rganishini so‘raydi. B “${first?.uz ?? "xitoy tili"}” ni va gaplarni mashq qilayotganini aytadi.`,
      dialogueRu: `A спрашивает, что B сегодня изучает. B отвечает, что учит «${first?.ru ?? "китайский язык"}» и тренирует предложения.`,
      quiz: first
        ? [
            simpleQuestion({
              id: `mini-hsk${level}-${index + 1}-q1`,
              level,
              promptZh: first.hanzi,
              promptPinyin: first.pinyin,
              correct: first,
              questionUz: "Mini darsdagi so‘z ma’nosini tanlang.",
              questionRu: "Выберите значение слова из мини-урока.",
              skill: "vocabulary",
              type: "vocabulary"
            })
          ]
        : []
    };
  })
);

export function getMiniLessonsByLevel(level: HSKLevel) {
  return hskMiniLessons.filter((lesson) => lesson.level === level);
}
