import { hskListeningContent } from "@/data/hsk/listening";
import { hskSpeakingTasks } from "@/data/hsk/speakingTasks";
import { vocabularyEntries } from "@/data/hsk/vocabulary";
import type { HSKVocabularyEntry } from "@/data/hsk/contentTypes";
import type { AppLanguage, HSKLevel } from "@/types";

type CharacterHint = {
  radical: string;
  componentUz: string;
  componentRu: string;
  memoryUz: string;
  memoryRu: string;
  strokeUz: string;
  strokeRu: string;
};

const characterHints: Record<string, CharacterHint> = {
  你: {
    radical: "亻",
    componentUz: "odam radikali + tovush qismi",
    componentRu: "ключ человек + звуковая часть",
    memoryUz: "Odamga murojaat qilishda ishlatiladi: sen yoki siz.",
    memoryRu: "Используется при обращении к человеку: ты или вы.",
    strokeUz: "Avval chapdagi odam radikali, keyin o‘ngdagi qism yoziladi.",
    strokeRu: "Сначала пишется ключ человека слева, затем правая часть."
  },
  好: {
    radical: "女",
    componentUz: "ayol + bola",
    componentRu: "женщина + ребёнок",
    memoryUz: "Yaxshi holat yoki rozilikni bildiradi.",
    memoryRu: "Передаёт значение хорошо или согласие.",
    strokeUz: "Chap komponentdan boshlang, keyin 子 qismini yozing.",
    strokeRu: "Начните с левого компонента, затем напишите 子."
  },
  学: {
    radical: "子",
    componentUz: "ustki qism + bola",
    componentRu: "верхняя часть + ребёнок",
    memoryUz: "Bola bilim olayotganini tasavvur qiling.",
    memoryRu: "Представьте ребёнка, который учится.",
    strokeUz: "Ustki nuqtalar va qopqoqdan boshlanadi, 子 bilan tugaydi.",
    strokeRu: "Начинается с верхних точек и крышки, заканчивается 子."
  },
  汉: {
    radical: "氵",
    componentUz: "suv radikali + o‘ng qism",
    componentRu: "ключ вода + правая часть",
    memoryUz: "汉语 so‘zida xitoy tilini bildiradi.",
    memoryRu: "В слове 汉语 обозначает китайский язык.",
    strokeUz: "Avval uch tomchi suv radikali, keyin o‘ng qism yoziladi.",
    strokeRu: "Сначала пишутся три капли воды, затем правая часть."
  },
  语: {
    radical: "讠",
    componentUz: "nutq radikali + o‘ng qism",
    componentRu: "ключ речь + правая часть",
    memoryUz: "Til, gapirish va so‘zlashuv bilan bog‘liq.",
    memoryRu: "Связано с языком, речью и общением.",
    strokeUz: "Avval nutq radikali, keyin o‘ngdagi qism yoziladi.",
    strokeRu: "Сначала пишется ключ речи, затем правая часть."
  },
  谢: {
    radical: "讠",
    componentUz: "nutq radikali",
    componentRu: "ключ речь",
    memoryUz: "Rahmat aytish nutq orqali bo‘ladi.",
    memoryRu: "Благодарность выражается речью.",
    strokeUz: "Chapdagi 讠 kichik yoziladi, o‘ng qism bosqichma-bosqich yoziladi.",
    strokeRu: "Левый 讠 пишется компактно, правая часть по порядку."
  },
  茶: {
    radical: "艹",
    componentUz: "o‘t-o‘simlik radikali",
    componentRu: "ключ трава",
    memoryUz: "Choy o‘simlikdan keladi, shuning uchun yuqorida 艹 bor.",
    memoryRu: "Чай связан с растением, поэтому сверху есть 艹.",
    strokeUz: "Yuqoridagi 艹 dan boshlang, keyin pastki qismni yozing.",
    strokeRu: "Начните с верхнего 艹, затем напишите нижнюю часть."
  },
  饭: {
    radical: "饣",
    componentUz: "ovqat radikali",
    componentRu: "ключ еда",
    memoryUz: "Ovqat bilan bog‘liq so‘zlarda 饣 ko‘p uchraydi.",
    memoryRu: "В словах о еде часто встречается 饣.",
    strokeUz: "Chapdagi ovqat radikali qisqa, o‘ng qism esa kengroq yoziladi.",
    strokeRu: "Левый ключ еды пишется узко, правая часть шире."
  },
  吗: {
    radical: "口",
    componentUz: "og‘iz radikali",
    componentRu: "ключ рот",
    memoryUz: "Savol og‘zaki nutqda beriladi, shuning uchun 口 bor.",
    memoryRu: "Вопрос задаётся речью, поэтому есть 口.",
    strokeUz: "Avval 口, keyin o‘ngdagi 马 qismi yoziladi.",
    strokeRu: "Сначала 口, затем правая часть 马."
  },
  我: {
    radical: "戈",
    componentUz: "murakkab asosiy belgi",
    componentRu: "сложный базовый знак",
    memoryUz: "O‘zingiz haqingizda gapirganda ishlatiladi: men.",
    memoryRu: "Используется, когда говорите о себе: я.",
    strokeUz: "Chap yuqori chiziqlardan boshlanadi, oxirida uzun egri chiziq yoziladi.",
    strokeRu: "Начинается с верхних левых черт, длинная наклонная черта ближе к концу."
  }
};

const toneMarks: Record<string, 1 | 2 | 3 | 4 | 5> = {
  ā: 1, ē: 1, ī: 1, ō: 1, ū: 1, ǖ: 1,
  á: 2, é: 2, í: 2, ó: 2, ú: 2, ǘ: 2,
  ǎ: 3, ě: 3, ǐ: 3, ǒ: 3, ǔ: 3, ǚ: 3,
  à: 4, è: 4, ì: 4, ò: 4, ù: 4, ǜ: 4
};

export function getCharacterHint(character: string): CharacterHint {
  return characterHints[character] ?? {
    radical: character,
    componentUz: "asosiy iyeroglif qismi",
    componentRu: "основная часть иероглифа",
    memoryUz: "Bu belgini so‘z va misol gap ichida eslab qoling.",
    memoryRu: "Запоминайте знак внутри слова и примера.",
    strokeUz: "Umumiy qoida: yuqoridan pastga, chapdan o‘ngga yoziladi.",
    strokeRu: "Общее правило: сверху вниз, слева направо."
  };
}

export function getHanziAnalysis(word: HSKVocabularyEntry) {
  return Array.from(word.hanzi).map((character) => ({
    character,
    hint: getCharacterHint(character)
  }));
}

export function getToneNumbers(pinyin: string) {
  return pinyin
    .split(/\s+/)
    .map((part) => {
      const mark = Array.from(part).find((char) => toneMarks[char]);
      return mark ? toneMarks[mark] : 5;
    });
}

export function getPrimaryTone(pinyin: string) {
  return getToneNumbers(pinyin)[0] ?? 5;
}

export function toneLabel(tone: number, language: AppLanguage) {
  const uz = { 1: "1-ton", 2: "2-ton", 3: "3-ton", 4: "4-ton", 5: "Yengil ton" };
  const ru = { 1: "1-й тон", 2: "2-й тон", 3: "3-й тон", 4: "4-й тон", 5: "Нейтральный тон" };
  return language === "ru" ? ru[tone as keyof typeof ru] : uz[tone as keyof typeof uz];
}

export function toneExplanation(tone: number, language: AppLanguage) {
  const uz = {
    1: "Ovoz baland va tekis saqlanadi.",
    2: "Ovoz pastdan yuqoriga ko‘tariladi.",
    3: "Ovoz pastga tushib, yana ko‘tariladi.",
    4: "Ovoz keskin pastga tushadi.",
    5: "Qisqa va yengil aytiladi."
  };
  const ru = {
    1: "Голос высокий и ровный.",
    2: "Голос поднимается снизу вверх.",
    3: "Голос опускается и снова поднимается.",
    4: "Голос резко падает вниз.",
    5: "Произносится коротко и легко."
  };
  return language === "ru" ? ru[tone as keyof typeof ru] : uz[tone as keyof typeof uz];
}

export function getTonePracticeWords(level: HSKLevel, limit = 18) {
  return vocabularyEntries
    .filter((word) => word.level <= level && getToneNumbers(word.pinyin).some(Boolean))
    .slice(0, limit);
}

export function getShadowingSentences(level: HSKLevel) {
  const listening = hskListeningContent
    .filter((item) => item.level <= level)
    .slice(0, 8)
    .map((item) => ({
      id: `listening-${item.id}`,
      level: item.level,
      zh: item.audioTextZh,
      pinyin: item.audioTextPinyin,
      uz: item.transcriptUz,
      ru: item.transcriptRu
    }));
  const speaking = hskSpeakingTasks
    .filter((item) => item.level <= level)
    .slice(0, 8)
    .map((item) => ({
      id: `speaking-${item.id}`,
      level: item.level,
      zh: item.sampleAnswerZh,
      pinyin: item.sampleAnswerPinyin,
      uz: item.sampleAnswerUz,
      ru: item.sampleAnswerRu
    }));
  return [...listening, ...speaking].slice(0, 14);
}

export function normalizeHanzi(value: string) {
  return value.replace(/[\s，。！？、,.!?;；:："'“”‘’（）()\[\]{}<>《》\-—_]/g, "");
}
