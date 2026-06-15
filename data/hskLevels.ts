import type { HSKLevel } from "@/types";

export const hskLevelsData: Array<{
  level: HSKLevel;
  wordCount: number;
  lessons: number;
  minutes: number;
  titleUz: string;
  titleRu: string;
  descriptionUz: string;
  descriptionRu: string;
}> = [
  { level: 1, wordCount: 150, lessons: 8, minutes: 40, titleUz: "Boshlang‘ich HSK 1", titleRu: "Начальный HSK 1", descriptionUz: "Salomlashish, sonlar, oila, vaqt va oddiy savollar.", descriptionRu: "Приветствия, числа, семья, время и простые вопросы." },
  { level: 2, wordCount: 300, lessons: 8, minutes: 55, titleUz: "Boshlang‘ich HSK 2", titleRu: "Начальный HSK 2", descriptionUz: "Xarid, transport, ob-havo, reja va kundalik suhbatlar.", descriptionRu: "Покупки, транспорт, погода, планы и повседневный разговор." },
  { level: 3, wordCount: 600, lessons: 8, minutes: 90, titleUz: "O‘rta HSK 3", titleRu: "Средний HSK 3", descriptionUz: "Ish, o‘qish, sog‘liq, sayohat va fikr bildirish.", descriptionRu: "Работа, учёба, здоровье, путешествия и выражение мнения." },
  { level: 4, wordCount: 1200, lessons: 8, minutes: 105, titleUz: "O‘rta HSK 4", titleRu: "Средний HSK 4", descriptionUz: "Madaniyat, jamiyat, munosabatlar va murakkab grammatika.", descriptionRu: "Культура, общество, отношения и сложная грамматика." },
  { level: 5, wordCount: 2500, lessons: 8, minutes: 125, titleUz: "Yuqori HSK 5", titleRu: "Продвинутый HSK 5", descriptionUz: "Biznes, media, mavhum mavzular va uzun matnlar.", descriptionRu: "Бизнес, медиа, абстрактные темы и длинные тексты." },
  { level: 6, wordCount: 5000, lessons: 8, minutes: 140, titleUz: "Yuqori HSK 6", titleRu: "Продвинутый HSK 6", descriptionUz: "Akademik xitoy tili, bahs, insho va rasmiy yozuv.", descriptionRu: "Академический китайский, дебаты, эссе и официальное письмо." }
];

export function getHskLevelData(level: HSKLevel) {
  return hskLevelsData.find((item) => item.level === level) ?? hskLevelsData[0];
}
