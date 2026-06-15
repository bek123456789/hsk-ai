import type { ExamQuestionType, HSKContentSection, HSKExamQuestion, HSKLevel, RichHSKVocabularyItem } from "@/types";

function pickDistractors(words: RichHSKVocabularyItem[], current: RichHSKVocabularyItem, field: "translationUz" | "translationRu" | "chinese" | "pinyin") {
  return words
    .filter((word) => word.id !== current.id)
    .slice(0, 12)
    .map((word) => word[field])
    .filter((value) => value !== current[field])
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 3);
}

function sectionForType(type: ExamQuestionType): HSKContentSection {
  if (type.startsWith("listen_") || type === "listening") return "listening";
  if (type.startsWith("write_") || type === "short_answer" || type === "essay_placeholder") return "writing";
  return "reading";
}

export function createQuestion(input: {
  level: HSKLevel;
  index: number;
  word: RichHSKVocabularyItem;
  levelWords: RichHSKVocabularyItem[];
  type: ExamQuestionType;
}): HSKExamQuestion {
  const { level, index, word, levelWords, type } = input;
  const section = sectionForType(type);
  const part = section === "listening" ? 1 : section === "reading" ? 2 : 3;
  const id = `hsk${level}-${section}-${String(index + 1).padStart(3, "0")}`;

  if (type === "pinyin") {
    return {
      id,
      hskLevel: level,
      section,
      part,
      type,
      questionChinese: word.chinese,
      questionPinyin: "",
      questionUz: "To‘g‘ri pinyinni tanlang.",
      questionRu: "Выберите правильный пиньинь.",
      optionsChinese: [word.pinyin, ...pickDistractors(levelWords, word, "pinyin")],
      optionsUz: [word.pinyin, ...pickDistractors(levelWords, word, "pinyin")],
      optionsRu: [word.pinyin, ...pickDistractors(levelWords, word, "pinyin")],
      correctAnswer: word.pinyin,
      explanationUz: `${word.chinese} pinyini: ${word.pinyin}.`,
      explanationRu: `Пиньинь для ${word.chinese}: ${word.pinyin}.`
    };
  }

  if (type === "character" || type === "write_character_or_word") {
    return {
      id,
      hskLevel: level,
      section,
      part,
      type,
      questionChinese: word.translationUz,
      questionPinyin: word.pinyin,
      questionUz: "Berilgan ma’noga mos xitoycha so‘zni tanlang.",
      questionRu: "Выберите китайское слово по значению.",
      optionsChinese: [word.chinese, ...pickDistractors(levelWords, word, "chinese")],
      optionsUz: [word.chinese, ...pickDistractors(levelWords, word, "chinese")],
      optionsRu: [word.chinese, ...pickDistractors(levelWords, word, "chinese")],
      correctAnswer: word.chinese,
      explanationUz: `${word.translationUz} — ${word.chinese}.`,
      explanationRu: `${word.translationRu} — ${word.chinese}.`,
      sampleAnswer: word.chinese
    };
  }

  if (type === "sentence_order" || type === "write_sentence_from_words") {
    return {
      id,
      hskLevel: level,
      section,
      part,
      type,
      questionChinese: "我 / 想 / 学习 / 汉语",
      questionPinyin: "wǒ / xiǎng / xué xí / hàn yǔ",
      questionUz: "So‘zlarni to‘g‘ri tartibga keltiring.",
      questionRu: "Поставьте слова в правильном порядке.",
      optionsChinese: ["我想学习汉语", "学习我想汉语", "汉语想我学习", "想我汉语学习"],
      optionsUz: ["我想学习汉语", "学习我想汉语", "汉语想我学习", "想我汉语学习"],
      optionsRu: ["我想学习汉语", "学习我想汉语", "汉语想我学习", "想我汉语学习"],
      correctAnswer: "我想学习汉语",
      explanationUz: "Xitoy tilida odatiy tartib: ega + modal/fe’l + to‘ldiruvchi.",
      explanationRu: "Обычный порядок: подлежащее + модальный/глагол + дополнение.",
      sampleAnswer: "我想学习汉语。"
    };
  }

  if (type === "reading_comprehension") {
    const passageChinese = `今天我学习${word.chinese}。老师说这个词很有用。`;
    return {
      id,
      hskLevel: level,
      section,
      part,
      type,
      questionChinese: passageChinese,
      questionPinyin: `jīn tiān wǒ xué xí ${word.pinyin}.`,
      questionUz: "Matnga ko‘ra, qaysi so‘z foydali?",
      questionRu: "Согласно тексту, какое слово полезное?",
      optionsChinese: [word.chinese, ...pickDistractors(levelWords, word, "chinese")],
      optionsUz: [word.chinese, ...pickDistractors(levelWords, word, "chinese")],
      optionsRu: [word.chinese, ...pickDistractors(levelWords, word, "chinese")],
      correctAnswer: word.chinese,
      explanationUz: "Matnda o‘qituvchi shu so‘z foydali ekanini aytadi.",
      explanationRu: "В тексте учитель говорит, что это слово полезно.",
      passageChinese,
      passagePinyin: `jīn tiān wǒ xué xí ${word.pinyin}. lǎo shī shuō zhè ge cí hěn yǒu yòng.`
    };
  }

  if (type === "short_answer" || type === "essay_placeholder") {
    return {
      id,
      hskLevel: level,
      section,
      part,
      type,
      questionChinese: word.chinese,
      questionPinyin: word.pinyin,
      questionUz: "Berilgan so‘z bilan qisqa javob yozing.",
      questionRu: "Напишите короткий ответ с данным словом.",
      optionsChinese: [],
      optionsUz: [],
      optionsRu: [],
      correctAnswer: word.exampleChinese,
      explanationUz: "MVP bosqichida yozuv javobi namuna bilan solishtiriladi.",
      explanationRu: "В MVP письменный ответ сравнивается с образцом.",
      sampleAnswer: word.exampleChinese
    };
  }

  const isListening = section === "listening";
  const isSentence = type === "sentence" || type === "listen_dialogue_question" || type === "true_false";
  return {
    id,
    hskLevel: level,
    section,
    part,
    type,
    questionChinese: isSentence ? word.exampleChinese : word.chinese,
    questionPinyin: isSentence ? word.examplePinyin : word.pinyin,
    questionUz: isListening ? "Eshiting va to‘g‘ri javobni tanlang." : "To‘g‘ri ma’noni tanlang.",
    questionRu: isListening ? "Прослушайте и выберите правильный ответ." : "Выберите правильное значение.",
    optionsChinese: [word.chinese, ...pickDistractors(levelWords, word, "chinese")],
    optionsUz: [word.translationUz, ...pickDistractors(levelWords, word, "translationUz")],
    optionsRu: [word.translationRu, ...pickDistractors(levelWords, word, "translationRu")],
    correctAnswer: word.translationUz,
    explanationUz: `${word.chinese} — ${word.translationUz}.`,
    explanationRu: `${word.chinese} — ${word.translationRu}.`,
    audioTextChinese: isListening ? word.exampleChinese : undefined
  };
}
