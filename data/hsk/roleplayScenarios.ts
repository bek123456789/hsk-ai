import type { HSKRoleplayScenario } from "@/data/hsk/contentTypes";
import { levels, wordsFor } from "@/data/hsk/contentFactory";
import type { HSKLevel } from "@/types";

const situations = [
  {
    titleUz: "Restoranda",
    titleRu: "В ресторане",
    situationUz: "Taom buyurtma qiling, suv so‘rang va narxni tasdiqlang.",
    situationRu: "Закажите еду, попросите воду и уточните цену.",
    openingZh: "欢迎光临，请问你想吃什么？",
    openingPinyin: "huān yíng guāng lín, qǐng wèn nǐ xiǎng chī shén me?"
  },
  {
    titleUz: "Do‘konda",
    titleRu: "В магазине",
    situationUz: "Narx so‘rang, tanlov qiling va muloyim javob bering.",
    situationRu: "Спросите цену, сделайте выбор и ответьте вежливо.",
    openingZh: "这个很受欢迎，你要看看吗？",
    openingPinyin: "zhè ge hěn shòu huān yíng, nǐ yào kàn kan ma?"
  },
  {
    titleUz: "Maktabda",
    titleRu: "В школе",
    situationUz: "O‘qituvchidan mashq haqida so‘rang va dars rejangizni ayting.",
    situationRu: "Спросите учителя о практике и расскажите план урока.",
    openingZh: "今天我们练习听力和阅读。",
    openingPinyin: "jīn tiān wǒ men liàn xí tīng lì hé yuè dú."
  }
];

export const hskRoleplayScenarios: HSKRoleplayScenario[] = levels.flatMap((level) =>
  situations.map((situation, index) => {
    const words = wordsFor(level, 4, index * 3);
    return {
      id: `roleplay-hsk${level}-${index + 1}`,
      level,
      titleUz: `HSK ${level}: ${situation.titleUz}`,
      titleRu: `HSK ${level}: ${situation.titleRu}`,
      situationUz: situation.situationUz,
      situationRu: situation.situationRu,
      openingZh: situation.openingZh,
      openingPinyin: situation.openingPinyin,
      suggestedRepliesZh: ["我想练习汉语。", "请再说一遍。", "这个多少钱？", "谢谢你的帮助。"],
      usefulWords: words.map((word) => word.hanzi)
    };
  })
);

export function getRoleplayScenariosByLevel(level: HSKLevel) {
  return hskRoleplayScenarios.filter((item) => item.level === level);
}
