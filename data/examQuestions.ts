import type { ExamQuestion, ExamQuestionType, HSKLevel } from "@/types";

const typeCycle: ExamQuestionType[] = ["vocabulary", "pinyin", "character", "sentence", "listening", "grammar"];

const samples: Record<HSKLevel, Array<{ chinese: string; pinyin: string; uz: string; ru: string; sentence: string; sentenceUz: string; sentenceRu: string }>> = {
  1: [
    { chinese: "你好", pinyin: "nǐ hǎo", uz: "salom", ru: "привет", sentence: "你好，我是学生。", sentenceUz: "Salom, men o‘quvchiman.", sentenceRu: "Привет, я ученик." },
    { chinese: "谢谢", pinyin: "xiè xie", uz: "rahmat", ru: "спасибо", sentence: "谢谢你的帮助。", sentenceUz: "Yordamingiz uchun rahmat.", sentenceRu: "Спасибо за помощь." },
    { chinese: "再见", pinyin: "zài jiàn", uz: "xayr", ru: "до свидания", sentence: "老师，再见。", sentenceUz: "Ustoz, xayr.", sentenceRu: "Учитель, до свидания." },
    { chinese: "学习", pinyin: "xué xí", uz: "o‘rganmoq", ru: "учиться", sentence: "我学习汉语。", sentenceUz: "Men xitoy tilini o‘rganaman.", sentenceRu: "Я изучаю китайский." },
    { chinese: "朋友", pinyin: "péng you", uz: "do‘st", ru: "друг", sentence: "他是我的朋友。", sentenceUz: "U mening do‘stim.", sentenceRu: "Он мой друг." }
  ],
  2: [
    { chinese: "时间", pinyin: "shí jiān", uz: "vaqt", ru: "время", sentence: "现在是什么时间？", sentenceUz: "Hozir soat nechchi?", sentenceRu: "Который сейчас час?" },
    { chinese: "生日", pinyin: "shēng rì", uz: "tug‘ilgan kun", ru: "день рождения", sentence: "今天是我的生日。", sentenceUz: "Bugun mening tug‘ilgan kunim.", sentenceRu: "Сегодня мой день рождения." },
    { chinese: "运动", pinyin: "yùn dòng", uz: "sport", ru: "спорт", sentence: "我喜欢运动。", sentenceUz: "Men sportni yoqtiraman.", sentenceRu: "Я люблю спорт." },
    { chinese: "房间", pinyin: "fáng jiān", uz: "xona", ru: "комната", sentence: "房间很干净。", sentenceUz: "Xona juda toza.", sentenceRu: "Комната очень чистая." }
  ],
  3: [
    { chinese: "城市", pinyin: "chéng shì", uz: "shahar", ru: "город", sentence: "这个城市很大。", sentenceUz: "Bu shahar katta.", sentenceRu: "Этот город большой." },
    { chinese: "决定", pinyin: "jué dìng", uz: "qaror qilmoq", ru: "решать", sentence: "我决定学习中文。", sentenceUz: "Men xitoy tilini o‘rganishga qaror qildim.", sentenceRu: "Я решил изучать китайский." },
    { chinese: "健康", pinyin: "jiàn kāng", uz: "sog‘lom", ru: "здоровый", sentence: "健康很重要。", sentenceUz: "Sog‘liq juda muhim.", sentenceRu: "Здоровье очень важно." },
    { chinese: "会议", pinyin: "huì yì", uz: "majlis", ru: "собрание", sentence: "会议九点开始。", sentenceUz: "Majlis soat to‘qqizda boshlanadi.", sentenceRu: "Собрание начинается в девять." }
  ],
  4: [
    { chinese: "经验", pinyin: "jīng yàn", uz: "tajriba", ru: "опыт", sentence: "他有很多经验。", sentenceUz: "Uning tajribasi ko‘p.", sentenceRu: "У него большой опыт." },
    { chinese: "环境", pinyin: "huán jìng", uz: "muhit", ru: "среда", sentence: "这里的环境很好。", sentenceUz: "Bu yerning muhiti yaxshi.", sentenceRu: "Здесь хорошая среда." },
    { chinese: "解释", pinyin: "jiě shì", uz: "tushuntirmoq", ru: "объяснять", sentence: "请你解释一下。", sentenceUz: "Iltimos, tushuntirib bering.", sentenceRu: "Пожалуйста, объясните." }
  ],
  5: [
    { chinese: "效率", pinyin: "xiào lǜ", uz: "samaradorlik", ru: "эффективность", sentence: "这样可以提高效率。", sentenceUz: "Bu samaradorlikni oshiradi.", sentenceRu: "Это повышает эффективность." },
    { chinese: "态度", pinyin: "tài dù", uz: "munosabat", ru: "отношение", sentence: "他的态度很好。", sentenceUz: "Uning munosabati yaxshi.", sentenceRu: "У него хорошее отношение." },
    { chinese: "趋势", pinyin: "qū shì", uz: "tendensiya", ru: "тенденция", sentence: "这是新的趋势。", sentenceUz: "Bu yangi tendensiya.", sentenceRu: "Это новая тенденция." }
  ],
  6: [
    { chinese: "综合", pinyin: "zōng hé", uz: "umumiy", ru: "комплексный", sentence: "我们需要综合分析。", sentenceUz: "Biz umumiy tahlil qilishimiz kerak.", sentenceRu: "Нам нужен комплексный анализ." },
    { chinese: "实施", pinyin: "shí shī", uz: "amalga oshirmoq", ru: "осуществлять", sentence: "计划已经开始实施。", sentenceUz: "Reja amalga oshirila boshlandi.", sentenceRu: "План начали осуществлять." },
    { chinese: "显著", pinyin: "xiǎn zhù", uz: "sezilarli", ru: "значительный", sentence: "效果非常显著。", sentenceUz: "Natija juda sezilarli.", sentenceRu: "Эффект очень значительный." }
  ]
};

const counts: Record<HSKLevel, number> = { 1: 30, 2: 20, 3: 20, 4: 15, 5: 15, 6: 15 };
const fallbackUz = ["salom", "rahmat", "xayr", "suv", "vaqt", "shahar", "tajriba", "samaradorlik"];
const fallbackRu = ["привет", "спасибо", "пока", "вода", "время", "город", "опыт", "эффективность"];

function makeQuestion(level: HSKLevel, index: number): ExamQuestion {
  const item = samples[level][index % samples[level].length];
  const type = typeCycle[index % typeCycle.length];
  const id = `exam-hsk${level}-q${String(index + 1).padStart(3, "0")}`;
  const optionsUz = Array.from(new Set([item.uz, ...fallbackUz])).slice(0, 4);
  const optionsRu = Array.from(new Set([item.ru, ...fallbackRu])).slice(0, 4);
  const pinyinOptions = Array.from(new Set([item.pinyin, "nǐ hǎo", "xué xí", "shí jiān"])).slice(0, 4);
  const characterOptions = Array.from(new Set([item.chinese, "你好", "学习", "时间"])).slice(0, 4);

  if (type === "pinyin") {
    return { id, hskLevel: level, type, promptChinese: item.chinese, promptPinyin: item.pinyin, questionUz: "To‘g‘ri pinyinni tanlang", questionRu: "Выберите правильный пиньинь", optionsUz: pinyinOptions, optionsRu: pinyinOptions, correctAnswerUz: item.pinyin, correctAnswerRu: item.pinyin, explanationUz: `${item.chinese} pinyini: ${item.pinyin}.`, explanationRu: `Пиньинь для ${item.chinese}: ${item.pinyin}.` };
  }
  if (type === "character") {
    return { id, hskLevel: level, type, promptChinese: item.uz, promptPinyin: item.pinyin, questionUz: "Mos iyeroglifni tanlang", questionRu: "Выберите подходящий иероглиф", optionsUz: characterOptions, optionsRu: characterOptions, correctAnswerUz: item.chinese, correctAnswerRu: item.chinese, explanationUz: `${item.uz} — ${item.chinese}.`, explanationRu: `${item.ru} — ${item.chinese}.` };
  }
  if (type === "sentence") {
    return { id, hskLevel: level, type, promptChinese: item.sentence, promptPinyin: item.pinyin, questionUz: "Gap ma’nosini tanlang", questionRu: "Выберите значение предложения", optionsUz: [item.sentenceUz, ...fallbackUz.slice(0, 3)], optionsRu: [item.sentenceRu, ...fallbackRu.slice(0, 3)], correctAnswerUz: item.sentenceUz, correctAnswerRu: item.sentenceRu, explanationUz: item.sentenceUz, explanationRu: item.sentenceRu };
  }
  if (type === "grammar") {
    return { id, hskLevel: level, type, promptChinese: "我___汉语。", promptPinyin: item.pinyin, questionUz: "Bo‘sh joyga mos so‘zni tanlang", questionRu: "Выберите слово для пропуска", optionsUz: ["学习", "你好", "谢谢", "再见"], optionsRu: ["学习", "你好", "谢谢", "再见"], correctAnswerUz: "学习", correctAnswerRu: "学习", explanationUz: "我学习汉语 — Men xitoy tilini o‘rganaman.", explanationRu: "我学习汉语 — Я изучаю китайский." };
  }
  return { id, hskLevel: level, type, promptChinese: item.chinese, promptPinyin: item.pinyin, questionUz: type === "listening" ? "Eshiting va ma’nosini tanlang" : "Bu so‘zning ma’nosini tanlang", questionRu: type === "listening" ? "Прослушайте и выберите значение" : "Выберите значение этого слова", optionsUz, optionsRu, correctAnswerUz: item.uz, correctAnswerRu: item.ru, explanationUz: `${item.chinese} — ${item.uz}.`, explanationRu: `${item.chinese} — ${item.ru}.` };
}

export const examQuestions: ExamQuestion[] = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) =>
  Array.from({ length: counts[level] }, (_, index) => makeQuestion(level, index))
);

export function getExamQuestions(level: HSKLevel) {
  return examQuestions.filter((question) => question.hskLevel === level);
}
