import type { HSKSentenceBuilderItem } from "@/data/hsk/contentTypes";
import { levels, wordsFor } from "@/data/hsk/contentFactory";
import type { HSKLevel } from "@/types";

export const hskSentenceBuilderItems: HSKSentenceBuilderItem[] = levels.flatMap((level) =>
  Array.from({ length: level <= 2 ? 12 : 8 }, (_, index) => {
    const [word] = wordsFor(level, 1, index);
    const hanzi = word?.hanzi ?? "汉语";
    const pinyin = word?.pinyin ?? "hàn yǔ";
    const uz = word?.uz ?? "xitoy tili";
    const ru = word?.ru ?? "китайский язык";
    const sentence = level <= 2 ? `我今天学习${hanzi}` : `我觉得学习${hanzi}可以帮助真实交流`;

    return {
      id: `sentence-hsk${level}-${String(index + 1).padStart(2, "0")}`,
      level,
      sentenceZh: sentence,
      sentencePinyin: level <= 2 ? `wǒ jīn tiān xué xí ${pinyin}` : `wǒ jué de xué xí ${pinyin} kě yǐ bāng zhù zhēn shí jiāo liú`,
      sentenceUz: level <= 2 ? `Men bugun “${uz}” ni o‘rganaman.` : `Menimcha, “${uz}” ni o‘rganish haqiqiy muloqotga yordam beradi.`,
      sentenceRu: level <= 2 ? `Сегодня я изучаю «${ru}».` : `Я считаю, что изучение «${ru}» помогает реальному общению.`,
      chunks: level <= 2 ? ["我", "今天", "学习", hanzi] : ["我觉得", "学习", hanzi, "可以", "帮助", "真实交流"],
      explanationUz: "Xitoy tilida odatiy tartib: ega + vaqt + fe’l + to‘ldiruvchi.",
      explanationRu: "Обычный порядок в китайском: подлежащее + время + глагол + дополнение."
    };
  })
);

export function getSentenceBuilderByLevel(level: HSKLevel) {
  return hskSentenceBuilderItems.filter((item) => item.level === level);
}
