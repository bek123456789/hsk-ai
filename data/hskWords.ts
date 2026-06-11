import type { HSKLesson, HSKLevel, HSKWord, LevelMeta } from "@/types";

const hsk1Translations: Record<string, { ru: string; zh: string; exampleRu: string; exampleZh: string }> = {
  "hsk1-001": { ru: "привет", zh: "打招呼用语", exampleRu: "Привет, я ученик.", exampleZh: "用于见面打招呼。" },
  "hsk1-002": { ru: "спасибо", zh: "表示感谢", exampleRu: "Спасибо за вашу помощь.", exampleZh: "用于表达感谢。" },
  "hsk1-003": { ru: "до свидания", zh: "告别用语", exampleRu: "Учитель, до свидания.", exampleZh: "用于离开时告别。" },
  "hsk1-004": { ru: "быть, являться", zh: "表示判断", exampleRu: "Я китаец.", exampleZh: "用于说明身份或状态。" },
  "hsk1-005": { ru: "не, нет", zh: "否定词", exampleRu: "Я не учитель.", exampleZh: "用于否定。" },
  "hsk1-006": { ru: "я", zh: "第一人称代词", exampleRu: "Я изучаю китайский.", exampleZh: "表示自己。" },
  "hsk1-007": { ru: "ты, вы", zh: "第二人称代词", exampleRu: "Вы ученик?", exampleZh: "表示对方。" },
  "hsk1-008": { ru: "он", zh: "男性第三人称", exampleRu: "Он мой друг.", exampleZh: "指男性的他。" },
  "hsk1-009": { ru: "она", zh: "女性第三人称", exampleRu: "Она учитель.", exampleZh: "指女性的她。" },
  "hsk1-010": { ru: "мы", zh: "我们", exampleRu: "Мы едем в Китай.", exampleZh: "表示包括自己的多人。" },
  "hsk1-011": { ru: "они", zh: "他们", exampleRu: "Они изучают китайский.", exampleZh: "表示第三人称复数。" },
  "hsk1-012": { ru: "это", zh: "近指代词", exampleRu: "Это моя книга.", exampleZh: "指近处的人或物。" },
  "hsk1-013": { ru: "то", zh: "远指代词", exampleRu: "То школа.", exampleZh: "指远处的人或物。" },
  "hsk1-014": { ru: "какой, где", zh: "疑问代词", exampleRu: "Куда вы идёте?", exampleZh: "用于询问地点或选择。" },
  "hsk1-015": { ru: "кто", zh: "询问人物", exampleRu: "Кто он?", exampleZh: "用于询问人。" },
  "hsk1-016": { ru: "что", zh: "询问事物", exampleRu: "Что это?", exampleZh: "用于询问事物。" },
  "hsk1-017": { ru: "сколько", zh: "询问数量或价格", exampleRu: "Сколько это стоит?", exampleZh: "用于询问数量或价格。" },
  "hsk1-018": { ru: "сколько, несколько", zh: "询问小数量", exampleRu: "Сколько у вас друзей?", exampleZh: "用于询问较小数量。" },
  "hsk1-019": { ru: "человек", zh: "人", exampleRu: "Здесь много людей.", exampleZh: "表示人。" },
  "hsk1-020": { ru: "ученик, студент", zh: "学生", exampleRu: "Я студент.", exampleZh: "表示学习的人。" },
  "hsk1-021": { ru: "учитель", zh: "老师", exampleRu: "Учитель говорит по-китайски.", exampleZh: "表示教师。" },
  "hsk1-022": { ru: "друг", zh: "朋友", exampleRu: "Вы мой друг.", exampleZh: "表示朋友。" },
  "hsk1-023": { ru: "Китай", zh: "中国", exampleRu: "Я еду учиться в Китай.", exampleZh: "国家名称。" },
  "hsk1-024": { ru: "китайский язык", zh: "汉语", exampleRu: "Китайский звучит красиво.", exampleZh: "表示中文语言。" },
  "hsk1-025": { ru: "учиться", zh: "学习", exampleRu: "Мы изучаем китайский.", exampleZh: "表示学习。" },
  "hsk1-026": { ru: "есть", zh: "吃", exampleRu: "Я ем рис.", exampleZh: "表示吃东西。" },
  "hsk1-027": { ru: "пить", zh: "喝", exampleRu: "Вы пьёте воду?", exampleZh: "表示喝。" },
  "hsk1-028": { ru: "идти, ехать", zh: "去", exampleRu: "Он идёт в школу.", exampleZh: "表示去某处。" },
  "hsk1-029": { ru: "приходить", zh: "来", exampleRu: "Друг приходит ко мне домой.", exampleZh: "表示来到这里。" },
  "hsk1-030": { ru: "смотреть, читать", zh: "看", exampleRu: "Я читаю книгу.", exampleZh: "表示看或阅读。" }
};

const hsk1BaseWords = [
  { id: "hsk1-001", hskLevel: 1, lessonId: "hsk1-greetings", chinese: "你好", pinyin: "nǐ hǎo", translationUz: "salom", exampleChinese: "你好，我是学生。", exampleUz: "Salom, men o'quvchiman." },
  { id: "hsk1-002", hskLevel: 1, lessonId: "hsk1-greetings", chinese: "谢谢", pinyin: "xiè xie", translationUz: "rahmat", exampleChinese: "谢谢你的帮助。", exampleUz: "Yordamingiz uchun rahmat." },
  { id: "hsk1-003", hskLevel: 1, lessonId: "hsk1-greetings", chinese: "再见", pinyin: "zài jiàn", translationUz: "xayr", exampleChinese: "老师，再见。", exampleUz: "Ustoz, xayr." },
  { id: "hsk1-004", hskLevel: 1, lessonId: "hsk1-actions", chinese: "是", pinyin: "shì", translationUz: "bo'lmoq", exampleChinese: "我是中国人。", exampleUz: "Men xitoylikman." },
  { id: "hsk1-005", hskLevel: 1, lessonId: "hsk1-actions", chinese: "不", pinyin: "bù", translationUz: "yo'q, emas", exampleChinese: "我不是老师。", exampleUz: "Men o'qituvchi emasman." },
  { id: "hsk1-006", hskLevel: 1, lessonId: "hsk1-people", chinese: "我", pinyin: "wǒ", translationUz: "men", exampleChinese: "我学习汉语。", exampleUz: "Men xitoy tilini o'rganaman." },
  { id: "hsk1-007", hskLevel: 1, lessonId: "hsk1-people", chinese: "你", pinyin: "nǐ", translationUz: "sen, siz", exampleChinese: "你是学生吗？", exampleUz: "Siz o'quvchimisiz?" },
  { id: "hsk1-008", hskLevel: 1, lessonId: "hsk1-people", chinese: "他", pinyin: "tā", translationUz: "u (erkak)", exampleChinese: "他是我的朋友。", exampleUz: "U mening do'stim." },
  { id: "hsk1-009", hskLevel: 1, lessonId: "hsk1-people", chinese: "她", pinyin: "tā", translationUz: "u (ayol)", exampleChinese: "她是老师。", exampleUz: "U o'qituvchi." },
  { id: "hsk1-010", hskLevel: 1, lessonId: "hsk1-people", chinese: "我们", pinyin: "wǒ men", translationUz: "biz", exampleChinese: "我们去中国。", exampleUz: "Biz Xitoyga boramiz." },
  { id: "hsk1-011", hskLevel: 1, lessonId: "hsk1-people", chinese: "他们", pinyin: "tā men", translationUz: "ular", exampleChinese: "他们学习汉语。", exampleUz: "Ular xitoy tilini o'rganadilar." },
  { id: "hsk1-012", hskLevel: 1, lessonId: "hsk1-questions", chinese: "这", pinyin: "zhè", translationUz: "bu", exampleChinese: "这是我的书。", exampleUz: "Bu mening kitobim." },
  { id: "hsk1-013", hskLevel: 1, lessonId: "hsk1-questions", chinese: "那", pinyin: "nà", translationUz: "ana u", exampleChinese: "那是学校。", exampleUz: "Ana u maktab." },
  { id: "hsk1-014", hskLevel: 1, lessonId: "hsk1-questions", chinese: "哪", pinyin: "nǎ", translationUz: "qaysi", exampleChinese: "你去哪儿？", exampleUz: "Siz qayerga borasiz?" },
  { id: "hsk1-015", hskLevel: 1, lessonId: "hsk1-questions", chinese: "谁", pinyin: "shéi", translationUz: "kim", exampleChinese: "他是谁？", exampleUz: "U kim?" },
  { id: "hsk1-016", hskLevel: 1, lessonId: "hsk1-questions", chinese: "什么", pinyin: "shén me", translationUz: "nima", exampleChinese: "这是什么？", exampleUz: "Bu nima?" },
  { id: "hsk1-017", hskLevel: 1, lessonId: "hsk1-questions", chinese: "多少", pinyin: "duō shao", translationUz: "qancha", exampleChinese: "这个多少钱？", exampleUz: "Bu qancha turadi?" },
  { id: "hsk1-018", hskLevel: 1, lessonId: "hsk1-questions", chinese: "几", pinyin: "jǐ", translationUz: "nechta", exampleChinese: "你有几个朋友？", exampleUz: "Sizda nechta do'st bor?" },
  { id: "hsk1-019", hskLevel: 1, lessonId: "hsk1-people", chinese: "人", pinyin: "rén", translationUz: "odam", exampleChinese: "这里有很多人。", exampleUz: "Bu yerda ko'p odam bor." },
  { id: "hsk1-020", hskLevel: 1, lessonId: "hsk1-people", chinese: "学生", pinyin: "xué sheng", translationUz: "o'quvchi, talaba", exampleChinese: "我是学生。", exampleUz: "Men talabaman." },
  { id: "hsk1-021", hskLevel: 1, lessonId: "hsk1-people", chinese: "老师", pinyin: "lǎo shī", translationUz: "o'qituvchi", exampleChinese: "老师说汉语。", exampleUz: "O'qituvchi xitoycha gapiradi." },
  { id: "hsk1-022", hskLevel: 1, lessonId: "hsk1-people", chinese: "朋友", pinyin: "péng you", translationUz: "do'st", exampleChinese: "你是我的朋友。", exampleUz: "Siz mening do'stimsiz." },
  { id: "hsk1-023", hskLevel: 1, lessonId: "hsk1-people", chinese: "中国", pinyin: "Zhōng guó", translationUz: "Xitoy", exampleChinese: "我去中国学习。", exampleUz: "Men Xitoyga o'qishga boraman." },
  { id: "hsk1-024", hskLevel: 1, lessonId: "hsk1-people", chinese: "汉语", pinyin: "Hàn yǔ", translationUz: "xitoy tili", exampleChinese: "汉语很好听。", exampleUz: "Xitoy tili juda yoqimli eshitiladi." },
  { id: "hsk1-025", hskLevel: 1, lessonId: "hsk1-actions", chinese: "学习", pinyin: "xué xí", translationUz: "o'rganmoq", exampleChinese: "我们学习汉语。", exampleUz: "Biz xitoy tilini o'rganamiz." },
  { id: "hsk1-026", hskLevel: 1, lessonId: "hsk1-actions", chinese: "吃", pinyin: "chī", translationUz: "yemoq", exampleChinese: "我吃米饭。", exampleUz: "Men guruch yeyman." },
  { id: "hsk1-027", hskLevel: 1, lessonId: "hsk1-actions", chinese: "喝", pinyin: "hē", translationUz: "ichmoq", exampleChinese: "你喝水吗？", exampleUz: "Siz suv ichasizmi?" },
  { id: "hsk1-028", hskLevel: 1, lessonId: "hsk1-actions", chinese: "去", pinyin: "qù", translationUz: "bormoq", exampleChinese: "他去学校。", exampleUz: "U maktabga boradi." },
  { id: "hsk1-029", hskLevel: 1, lessonId: "hsk1-actions", chinese: "来", pinyin: "lái", translationUz: "kelmoq", exampleChinese: "朋友来我家。", exampleUz: "Do'stim uyimga keladi." },
  { id: "hsk1-030", hskLevel: 1, lessonId: "hsk1-actions", chinese: "看", pinyin: "kàn", translationUz: "ko'rmoq, qaramoq", exampleChinese: "我看书。", exampleUz: "Men kitob o'qiyman." }
] satisfies Array<Omit<HSKWord, "translationRu" | "translationZh" | "exampleRu" | "exampleZh">>;

const hsk1Words: HSKWord[] = hsk1BaseWords.map((word) => ({
  ...word,
  translationRu: hsk1Translations[word.id].ru,
  translationZh: hsk1Translations[word.id].zh,
  exampleRu: hsk1Translations[word.id].exampleRu,
  exampleZh: hsk1Translations[word.id].exampleZh
}));

export const hskWords: HSKWord[] = hsk1Words;

export const hskLessons: HSKLesson[] = [
  {
    id: "hsk1-greetings",
    hskLevel: 1,
    title: "1-dars: Salomlashish",
    description: "Kundalik muloyim iboralar bilan suhbat boshlang.",
    wordIds: ["hsk1-001", "hsk1-002", "hsk1-003"],
    locked: false
  },
  {
    id: "hsk1-people",
    hskLevel: 1,
    title: "2-dars: Odamlar",
    description: "O‘zingiz, do‘stlar, ustozlar va Xitoy haqida gapiring.",
    wordIds: ["hsk1-006", "hsk1-007", "hsk1-008", "hsk1-009", "hsk1-010", "hsk1-011", "hsk1-019", "hsk1-020", "hsk1-021", "hsk1-022", "hsk1-023", "hsk1-024"],
    locked: false
  },
  {
    id: "hsk1-questions",
    hskLevel: 1,
    title: "3-dars: Savollar",
    description: "Kim, nima, qayer, qancha va qaysi savollarini ishlating.",
    wordIds: ["hsk1-012", "hsk1-013", "hsk1-014", "hsk1-015", "hsk1-016", "hsk1-017", "hsk1-018"],
    locked: false
  },
  {
    id: "hsk1-actions",
    hskLevel: 1,
    title: "4-dars: Kundalik harakatlar",
    description: "O‘qish, yeyish, borish, kelish va ko‘rish fe’llarini mashq qiling.",
    wordIds: ["hsk1-004", "hsk1-005", "hsk1-025", "hsk1-026", "hsk1-027", "hsk1-028", "hsk1-029", "hsk1-030"],
    locked: false
  },
  ...([2, 3, 4, 5, 6] as HSKLevel[]).map((level) => ({
    id: `hsk${level}-foundation`,
    hskLevel: level,
    title: `HSK ${level}: Tayyorlov ko‘rinishi`,
    description: "Keyingi o‘quv ma’lumotlari uchun tayyor dars tuzilmasi.",
    wordIds: [],
    locked: true
  }))
];

export const hskLevelPlaceholders = ([2, 3, 4, 5, 6] as HSKLevel[]).map((level) => ({
  hskLevel: level,
  tableName: "hsk_words",
  status: "rejalashtirilgan",
  fields: ["id", "hskLevel", "lessonId", "chinese", "pinyin", "translationUz", "exampleChinese", "exampleUz"]
}));

export const levelMeta: LevelMeta[] = [
  { level: 1, wordCount: 150, locked: false, accent: "orange" },
  { level: 2, wordCount: 300, locked: true, accent: "green" },
  { level: 3, wordCount: 600, locked: true, accent: "blue" },
  { level: 4, wordCount: 1200, locked: true, accent: "purple" },
  { level: 5, wordCount: 2500, locked: true, accent: "orange" },
  { level: 6, wordCount: 5000, locked: true, accent: "blue" }
];

export function getWordsByLevel(level: HSKLevel) {
  return hskWords.filter((word) => word.hskLevel === level);
}

export function getWordsByLesson(lessonId: string) {
  return hskWords.filter((word) => word.lessonId === lessonId);
}
