import type { HSKGrammarPoint, HSKLevel, RichHSKLesson, RichHSKVocabularyItem } from "@/types";

type SeedWord = {
  chinese: string;
  pinyin: string;
  uz: string;
  ru: string;
  posUz: string;
  posRu: string;
  tag: string;
  exampleChinese: string;
  examplePinyin: string;
  exampleUz: string;
  exampleRu: string;
};

export const hskCourseThemes: Record<HSKLevel, Array<{ id: string; uz: string; ru: string; descUz: string; descRu: string }>> = {
  1: [
    { id: "greetings", uz: "Salomlashish", ru: "Приветствия", descUz: "Oddiy salomlashish va tanishuv iboralari.", descRu: "Простые приветствия и знакомство." },
    { id: "numbers", uz: "Sonlar va vaqt", ru: "Числа и время", descUz: "Sonlar, kunlar va vaqtni aytish.", descRu: "Числа, дни и время." },
    { id: "family", uz: "Oila va odamlar", ru: "Семья и люди", descUz: "Oila a’zolari va odamlar haqida gapirish.", descRu: "Разговор о семье и людях." },
    { id: "food", uz: "Kundalik harakatlar", ru: "Ежедневные действия", descUz: "Yeyish, ichish va kundalik fe’llar.", descRu: "Еда, напитки и ежедневные глаголы." }
  ],
  2: [
    { id: "shopping", uz: "Xarid qilish", ru: "Покупки", descUz: "Narx so‘rash, tanlash va sotib olish.", descRu: "Цена, выбор и покупка." },
    { id: "transport", uz: "Transport", ru: "Транспорт", descUz: "Yo‘l, bekat va borish rejasi.", descRu: "Дорога, остановки и планы поездки." },
    { id: "weather", uz: "Ob-havo", ru: "Погода", descUz: "Ob-havo va oddiy reja tuzish.", descRu: "Погода и простые планы." },
    { id: "daily-life", uz: "Kundalik suhbat", ru: "Повседневный разговор", descUz: "Do‘stlar bilan qisqa muloqot.", descRu: "Короткие разговоры с друзьями." }
  ],
  3: [
    { id: "work", uz: "Ish", ru: "Работа", descUz: "Ish joyi, vazifa va jadval.", descRu: "Рабочее место, задачи и график." },
    { id: "study", uz: "O‘qish", ru: "Учёба", descUz: "Dars, imtihon va o‘quv maqsadlari.", descRu: "Уроки, экзамены и учебные цели." },
    { id: "health", uz: "Sog‘liq", ru: "Здоровье", descUz: "Holat, maslahat va oddiy shikoyatlar.", descRu: "Состояние, советы и простые жалобы." },
    { id: "travel", uz: "Sayohat", ru: "Путешествие", descUz: "Yo‘nalish, mehmonxona va fikr bildirish.", descRu: "Маршрут, отель и мнение." }
  ],
  4: [
    { id: "culture", uz: "Madaniyat", ru: "Культура", descUz: "Bayram, odat va madaniy farqlar.", descRu: "Праздники, традиции и различия." },
    { id: "society", uz: "Jamiyat", ru: "Общество", descUz: "Yangilik, munosabat va ijtimoiy mavzular.", descRu: "Новости, отношения и социальные темы." },
    { id: "relationships", uz: "Munosabatlar", ru: "Отношения", descUz: "Kelishish, bahslashish va taklif berish.", descRu: "Согласие, спор и предложения." },
    { id: "work-life", uz: "Ish hayoti", ru: "Рабочая жизнь", descUz: "Tajriba, natija va mas’uliyat.", descRu: "Опыт, результат и ответственность." }
  ],
  5: [
    { id: "business", uz: "Biznes", ru: "Бизнес", descUz: "Strategiya, bozor va muzokara.", descRu: "Стратегия, рынок и переговоры." },
    { id: "media", uz: "Media", ru: "Медиа", descUz: "Maqola, xabar va jamoatchilik fikri.", descRu: "Статьи, новости и общественное мнение." },
    { id: "idioms", uz: "Iboralar", ru: "Идиомы", descUz: "Ko‘chma ma’no va uslubiy ifodalar.", descRu: "Переносные значения и стиль." },
    { id: "abstract", uz: "Mavhum fikrlar", ru: "Абстрактные темы", descUz: "Qadriyat, qarash va xulosa.", descRu: "Ценности, взгляды и выводы." }
  ],
  6: [
    { id: "academic", uz: "Akademik xitoy tili", ru: "Академический китайский", descUz: "Formal uslub, tahlil va dalillash.", descRu: "Формальный стиль, анализ и аргументация." },
    { id: "debates", uz: "Bahslar", ru: "Дебаты", descUz: "Murakkab fikr, qarshi dalil va baho.", descRu: "Сложные мнения, контраргументы и оценка." },
    { id: "essays", uz: "Insholar", ru: "Эссе", descUz: "Tuzilma, xulosa va yakuniy fikr.", descRu: "Структура, вывод и заключение." },
    { id: "formal", uz: "Rasmiy nutq", ru: "Официальная речь", descUz: "Rasmiy matn va ixtisoslashgan iboralar.", descRu: "Официальные тексты и специальные выражения." }
  ]
};

const seedWords: Record<HSKLevel, SeedWord[]> = {
  1: [
    { chinese: "你好", pinyin: "nǐ hǎo", uz: "salom", ru: "привет", posUz: "ibora", posRu: "фраза", tag: "greetings", exampleChinese: "你好，我是学生。", examplePinyin: "nǐ hǎo, wǒ shì xué sheng.", exampleUz: "Salom, men talabaman.", exampleRu: "Привет, я студент." },
    { chinese: "谢谢", pinyin: "xiè xie", uz: "rahmat", ru: "спасибо", posUz: "ibora", posRu: "фраза", tag: "greetings", exampleChinese: "谢谢你的帮助。", examplePinyin: "xiè xie nǐ de bāng zhù.", exampleUz: "Yordamingiz uchun rahmat.", exampleRu: "Спасибо за вашу помощь." },
    { chinese: "再见", pinyin: "zài jiàn", uz: "xayr", ru: "до свидания", posUz: "ibora", posRu: "фраза", tag: "greetings", exampleChinese: "老师，再见。", examplePinyin: "lǎo shī, zài jiàn.", exampleUz: "Ustoz, xayr.", exampleRu: "Учитель, до свидания." },
    { chinese: "是", pinyin: "shì", uz: "bo‘lmoq", ru: "быть, являться", posUz: "fe’l", posRu: "глагол", tag: "food", exampleChinese: "我是中国人。", examplePinyin: "wǒ shì zhōng guó rén.", exampleUz: "Men xitoylikman.", exampleRu: "Я китаец." },
    { chinese: "不", pinyin: "bù", uz: "emas, yo‘q", ru: "не, нет", posUz: "inkor", posRu: "отрицание", tag: "food", exampleChinese: "我不是老师。", examplePinyin: "wǒ bú shì lǎo shī.", exampleUz: "Men o‘qituvchi emasman.", exampleRu: "Я не учитель." },
    { chinese: "我", pinyin: "wǒ", uz: "men", ru: "я", posUz: "olmosh", posRu: "местоимение", tag: "family", exampleChinese: "我学习汉语。", examplePinyin: "wǒ xué xí hàn yǔ.", exampleUz: "Men xitoy tilini o‘rganaman.", exampleRu: "Я изучаю китайский." },
    { chinese: "你", pinyin: "nǐ", uz: "sen, siz", ru: "ты, вы", posUz: "olmosh", posRu: "местоимение", tag: "family", exampleChinese: "你是学生吗？", examplePinyin: "nǐ shì xué sheng ma?", exampleUz: "Siz talabamisiz?", exampleRu: "Вы студент?" },
    { chinese: "他", pinyin: "tā", uz: "u (erkak)", ru: "он", posUz: "olmosh", posRu: "местоимение", tag: "family", exampleChinese: "他是我的朋友。", examplePinyin: "tā shì wǒ de péng you.", exampleUz: "U mening do‘stim.", exampleRu: "Он мой друг." },
    { chinese: "她", pinyin: "tā", uz: "u (ayol)", ru: "она", posUz: "olmosh", posRu: "местоимение", tag: "family", exampleChinese: "她是老师。", examplePinyin: "tā shì lǎo shī.", exampleUz: "U o‘qituvchi.", exampleRu: "Она учитель." },
    { chinese: "我们", pinyin: "wǒ men", uz: "biz", ru: "мы", posUz: "olmosh", posRu: "местоимение", tag: "family", exampleChinese: "我们去中国。", examplePinyin: "wǒ men qù zhōng guó.", exampleUz: "Biz Xitoyga boramiz.", exampleRu: "Мы едем в Китай." },
    { chinese: "他们", pinyin: "tā men", uz: "ular", ru: "они", posUz: "olmosh", posRu: "местоимение", tag: "family", exampleChinese: "他们学习汉语。", examplePinyin: "tā men xué xí hàn yǔ.", exampleUz: "Ular xitoy tilini o‘rganadi.", exampleRu: "Они изучают китайский." },
    { chinese: "这", pinyin: "zhè", uz: "bu", ru: "это", posUz: "olmosh", posRu: "местоимение", tag: "greetings", exampleChinese: "这是我的书。", examplePinyin: "zhè shì wǒ de shū.", exampleUz: "Bu mening kitobim.", exampleRu: "Это моя книга." },
    { chinese: "那", pinyin: "nà", uz: "ana u", ru: "то", posUz: "olmosh", posRu: "местоимение", tag: "greetings", exampleChinese: "那是学校。", examplePinyin: "nà shì xué xiào.", exampleUz: "Ana u maktab.", exampleRu: "То школа." },
    { chinese: "哪", pinyin: "nǎ", uz: "qaysi", ru: "какой, который", posUz: "so‘roq", posRu: "вопросительное слово", tag: "greetings", exampleChinese: "你去哪儿？", examplePinyin: "nǐ qù nǎr?", exampleUz: "Siz qayerga borasiz?", exampleRu: "Куда вы идёте?" },
    { chinese: "谁", pinyin: "shéi", uz: "kim", ru: "кто", posUz: "so‘roq", posRu: "вопросительное слово", tag: "greetings", exampleChinese: "他是谁？", examplePinyin: "tā shì shéi?", exampleUz: "U kim?", exampleRu: "Кто он?" },
    { chinese: "什么", pinyin: "shén me", uz: "nima", ru: "что", posUz: "so‘roq", posRu: "вопросительное слово", tag: "greetings", exampleChinese: "这是什么？", examplePinyin: "zhè shì shén me?", exampleUz: "Bu nima?", exampleRu: "Что это?" },
    { chinese: "多少", pinyin: "duō shao", uz: "qancha", ru: "сколько", posUz: "so‘roq", posRu: "вопросительное слово", tag: "numbers", exampleChinese: "这个多少钱？", examplePinyin: "zhè ge duō shao qián?", exampleUz: "Bu qancha turadi?", exampleRu: "Сколько это стоит?" },
    { chinese: "几", pinyin: "jǐ", uz: "nechta", ru: "сколько", posUz: "so‘roq", posRu: "вопросительное слово", tag: "numbers", exampleChinese: "你有几个朋友？", examplePinyin: "nǐ yǒu jǐ ge péng you?", exampleUz: "Sizda nechta do‘st bor?", exampleRu: "Сколько у вас друзей?" },
    { chinese: "人", pinyin: "rén", uz: "odam", ru: "человек", posUz: "ot", posRu: "существительное", tag: "family", exampleChinese: "这里有很多人。", examplePinyin: "zhè lǐ yǒu hěn duō rén.", exampleUz: "Bu yerda ko‘p odam bor.", exampleRu: "Здесь много людей." },
    { chinese: "学生", pinyin: "xué sheng", uz: "talaba, o‘quvchi", ru: "студент, ученик", posUz: "ot", posRu: "существительное", tag: "family", exampleChinese: "我是学生。", examplePinyin: "wǒ shì xué sheng.", exampleUz: "Men talabaman.", exampleRu: "Я студент." },
    { chinese: "老师", pinyin: "lǎo shī", uz: "o‘qituvchi", ru: "учитель", posUz: "ot", posRu: "существительное", tag: "family", exampleChinese: "老师说汉语。", examplePinyin: "lǎo shī shuō hàn yǔ.", exampleUz: "O‘qituvchi xitoycha gapiradi.", exampleRu: "Учитель говорит по-китайски." },
    { chinese: "朋友", pinyin: "péng you", uz: "do‘st", ru: "друг", posUz: "ot", posRu: "существительное", tag: "family", exampleChinese: "你是我的朋友。", examplePinyin: "nǐ shì wǒ de péng you.", exampleUz: "Siz mening do‘stimsiz.", exampleRu: "Вы мой друг." },
    { chinese: "中国", pinyin: "zhōng guó", uz: "Xitoy", ru: "Китай", posUz: "ot", posRu: "существительное", tag: "family", exampleChinese: "我去中国学习。", examplePinyin: "wǒ qù zhōng guó xué xí.", exampleUz: "Men Xitoyga o‘qishga boraman.", exampleRu: "Я еду учиться в Китай." },
    { chinese: "汉语", pinyin: "hàn yǔ", uz: "xitoy tili", ru: "китайский язык", posUz: "ot", posRu: "существительное", tag: "family", exampleChinese: "汉语很好听。", examplePinyin: "hàn yǔ hěn hǎo tīng.", exampleUz: "Xitoy tili juda yoqimli eshitiladi.", exampleRu: "Китайский звучит красиво." },
    { chinese: "学习", pinyin: "xué xí", uz: "o‘rganmoq", ru: "учиться", posUz: "fe’l", posRu: "глагол", tag: "food", exampleChinese: "我们学习汉语。", examplePinyin: "wǒ men xué xí hàn yǔ.", exampleUz: "Biz xitoy tilini o‘rganamiz.", exampleRu: "Мы изучаем китайский." },
    { chinese: "吃", pinyin: "chī", uz: "yemoq", ru: "есть", posUz: "fe’l", posRu: "глагол", tag: "food", exampleChinese: "我吃米饭。", examplePinyin: "wǒ chī mǐ fàn.", exampleUz: "Men guruch yeyman.", exampleRu: "Я ем рис." },
    { chinese: "喝", pinyin: "hē", uz: "ichmoq", ru: "пить", posUz: "fe’l", posRu: "глагол", tag: "food", exampleChinese: "你喝水吗？", examplePinyin: "nǐ hē shuǐ ma?", exampleUz: "Siz suv ichasizmi?", exampleRu: "Вы пьёте воду?" },
    { chinese: "去", pinyin: "qù", uz: "bormoq", ru: "идти, ехать", posUz: "fe’l", posRu: "глагол", tag: "food", exampleChinese: "他去学校。", examplePinyin: "tā qù xué xiào.", exampleUz: "U maktabga boradi.", exampleRu: "Он идёт в школу." },
    { chinese: "来", pinyin: "lái", uz: "kelmoq", ru: "приходить", posUz: "fe’l", posRu: "глагол", tag: "food", exampleChinese: "朋友来我家。", examplePinyin: "péng you lái wǒ jiā.", exampleUz: "Do‘stim uyimga keladi.", exampleRu: "Друг приходит ко мне домой." },
    { chinese: "看", pinyin: "kàn", uz: "ko‘rmoq, o‘qimoq", ru: "смотреть, читать", posUz: "fe’l", posRu: "глагол", tag: "food", exampleChinese: "我看书。", examplePinyin: "wǒ kàn shū.", exampleUz: "Men kitob o‘qiyman.", exampleRu: "Я читаю книгу." }
  ],
  2: [
    { chinese: "便宜", pinyin: "pián yi", uz: "arzon", ru: "дешёвый", posUz: "sifat", posRu: "прилагательное", tag: "shopping", exampleChinese: "这个苹果很便宜。", examplePinyin: "zhè ge píng guǒ hěn pián yi.", exampleUz: "Bu olma juda arzon.", exampleRu: "Это яблоко очень дешёвое." },
    { chinese: "贵", pinyin: "guì", uz: "qimmat", ru: "дорогой", posUz: "sifat", posRu: "прилагательное", tag: "shopping", exampleChinese: "这件衣服太贵了。", examplePinyin: "zhè jiàn yī fu tài guì le.", exampleUz: "Bu kiyim juda qimmat.", exampleRu: "Эта одежда слишком дорогая." },
    { chinese: "买", pinyin: "mǎi", uz: "sotib olmoq", ru: "покупать", posUz: "fe’l", posRu: "глагол", tag: "shopping", exampleChinese: "我想买一本书。", examplePinyin: "wǒ xiǎng mǎi yì běn shū.", exampleUz: "Men bitta kitob sotib olmoqchiman.", exampleRu: "Я хочу купить одну книгу." },
    { chinese: "卖", pinyin: "mài", uz: "sotmoq", ru: "продавать", posUz: "fe’l", posRu: "глагол", tag: "shopping", exampleChinese: "商店卖水果。", examplePinyin: "shāng diàn mài shuǐ guǒ.", exampleUz: "Do‘kon meva sotadi.", exampleRu: "Магазин продаёт фрукты." },
    { chinese: "车站", pinyin: "chē zhàn", uz: "bekat, stansiya", ru: "станция", posUz: "ot", posRu: "существительное", tag: "transport", exampleChinese: "车站离这儿不远。", examplePinyin: "chē zhàn lí zhèr bù yuǎn.", exampleUz: "Bekat bu yerdan uzoq emas.", exampleRu: "Станция недалеко отсюда." },
    { chinese: "机场", pinyin: "jī chǎng", uz: "aeroport", ru: "аэропорт", posUz: "ot", posRu: "существительное", tag: "transport", exampleChinese: "我明天去机场。", examplePinyin: "wǒ míng tiān qù jī chǎng.", exampleUz: "Men ertaga aeroportga boraman.", exampleRu: "Завтра я еду в аэропорт." },
    { chinese: "公共汽车", pinyin: "gōng gòng qì chē", uz: "avtobus", ru: "автобус", posUz: "ot", posRu: "существительное", tag: "transport", exampleChinese: "我们坐公共汽车去学校。", examplePinyin: "wǒ men zuò gōng gòng qì chē qù xué xiào.", exampleUz: "Biz maktabga avtobusda boramiz.", exampleRu: "Мы едем в школу на автобусе." },
    { chinese: "天气", pinyin: "tiān qì", uz: "ob-havo", ru: "погода", posUz: "ot", posRu: "существительное", tag: "weather", exampleChinese: "今天天气很好。", examplePinyin: "jīn tiān tiān qì hěn hǎo.", exampleUz: "Bugun ob-havo juda yaxshi.", exampleRu: "Сегодня хорошая погода." },
    { chinese: "下雨", pinyin: "xià yǔ", uz: "yomg‘ir yog‘moq", ru: "идёт дождь", posUz: "fe’l", posRu: "глагол", tag: "weather", exampleChinese: "外面下雨了。", examplePinyin: "wài miàn xià yǔ le.", exampleUz: "Tashqarida yomg‘ir yog‘yapti.", exampleRu: "На улице идёт дождь." },
    { chinese: "阴天", pinyin: "yīn tiān", uz: "bulutli kun", ru: "пасмурный день", posUz: "ot", posRu: "существительное", tag: "weather", exampleChinese: "今天是阴天。", examplePinyin: "jīn tiān shì yīn tiān.", exampleUz: "Bugun bulutli kun.", exampleRu: "Сегодня пасмурный день." },
    { chinese: "打算", pinyin: "dǎ suàn", uz: "rejalashtirmoq", ru: "планировать", posUz: "fe’l", posRu: "глагол", tag: "daily-life", exampleChinese: "你周末打算做什么？", examplePinyin: "nǐ zhōu mò dǎ suàn zuò shén me?", exampleUz: "Dam olish kunlari nima qilmoqchisiz?", exampleRu: "Что вы планируете делать на выходных?" },
    { chinese: "一起", pinyin: "yì qǐ", uz: "birga", ru: "вместе", posUz: "ravish", posRu: "наречие", tag: "daily-life", exampleChinese: "我们一起去吃饭吧。", examplePinyin: "wǒ men yì qǐ qù chī fàn ba.", exampleUz: "Keling, birga ovqatlanishga boramiz.", exampleRu: "Давайте вместе пойдём поесть." }
  ],
  3: [
    { chinese: "会议", pinyin: "huì yì", uz: "majlis", ru: "собрание", posUz: "ot", posRu: "существительное", tag: "work", exampleChinese: "下午有一个重要会议。", examplePinyin: "xià wǔ yǒu yí ge zhòng yào huì yì.", exampleUz: "Tushdan keyin muhim majlis bor.", exampleRu: "Во второй половине дня важное собрание." },
    { chinese: "经理", pinyin: "jīng lǐ", uz: "menejer", ru: "менеджер", posUz: "ot", posRu: "существительное", tag: "work", exampleChinese: "经理让我准备报告。", examplePinyin: "jīng lǐ ràng wǒ zhǔn bèi bào gào.", exampleUz: "Menejer menga hisobot tayyorlashni aytdi.", exampleRu: "Менеджер попросил меня подготовить отчёт." },
    { chinese: "成绩", pinyin: "chéng jì", uz: "natija, baho", ru: "оценка, результат", posUz: "ot", posRu: "существительное", tag: "study", exampleChinese: "这次考试成绩不错。", examplePinyin: "zhè cì kǎo shì chéng jì bú cuò.", exampleUz: "Bu imtihon natijasi yomon emas.", exampleRu: "Результат этого экзамена неплохой." },
    { chinese: "复习", pinyin: "fù xí", uz: "takrorlamoq", ru: "повторять", posUz: "fe’l", posRu: "глагол", tag: "study", exampleChinese: "考试前要认真复习。", examplePinyin: "kǎo shì qián yào rèn zhēn fù xí.", exampleUz: "Imtihondan oldin jiddiy takrorlash kerak.", exampleRu: "Перед экзаменом нужно серьёзно повторять." },
    { chinese: "健康", pinyin: "jiàn kāng", uz: "sog‘liq", ru: "здоровье", posUz: "ot", posRu: "существительное", tag: "health", exampleChinese: "多运动对健康有好处。", examplePinyin: "duō yùn dòng duì jiàn kāng yǒu hǎo chù.", exampleUz: "Ko‘proq harakat qilish sog‘liq uchun foydali.", exampleRu: "Больше двигаться полезно для здоровья." },
    { chinese: "旅行", pinyin: "lǚ xíng", uz: "sayohat qilmoq", ru: "путешествовать", posUz: "fe’l", posRu: "глагол", tag: "travel", exampleChinese: "我喜欢一个人旅行。", examplePinyin: "wǒ xǐ huan yí ge rén lǚ xíng.", exampleUz: "Men yolg‘iz sayohat qilishni yoqtiraman.", exampleRu: "Мне нравится путешествовать одному." },
    { chinese: "比较", pinyin: "bǐ jiào", uz: "nisbatan, taqqoslamoq", ru: "сравнивать, довольно", posUz: "ravish", posRu: "наречие", tag: "study", exampleChinese: "今天比较冷。", examplePinyin: "jīn tiān bǐ jiào lěng.", exampleUz: "Bugun nisbatan sovuq.", exampleRu: "Сегодня довольно холодно." },
    { chinese: "认为", pinyin: "rèn wéi", uz: "deb hisoblamoq", ru: "считать, полагать", posUz: "fe’l", posRu: "глагол", tag: "work", exampleChinese: "我认为这个方法很好。", examplePinyin: "wǒ rèn wéi zhè ge fāng fǎ hěn hǎo.", exampleUz: "Menimcha, bu usul juda yaxshi.", exampleRu: "Я считаю, что этот способ хороший." }
  ],
  4: [
    { chinese: "文化", pinyin: "wén huà", uz: "madaniyat", ru: "культура", posUz: "ot", posRu: "существительное", tag: "culture", exampleChinese: "学习语言也要了解文化。", examplePinyin: "xué xí yǔ yán yě yào liǎo jiě wén huà.", exampleUz: "Til o‘rganishda madaniyatni ham tushunish kerak.", exampleRu: "Изучая язык, нужно понимать и культуру." },
    { chinese: "社会", pinyin: "shè huì", uz: "jamiyat", ru: "общество", posUz: "ot", posRu: "существительное", tag: "society", exampleChinese: "这个问题和社会发展有关。", examplePinyin: "zhè ge wèn tí hé shè huì fā zhǎn yǒu guān.", exampleUz: "Bu masala jamiyat rivoji bilan bog‘liq.", exampleRu: "Эта проблема связана с развитием общества." },
    { chinese: "新闻", pinyin: "xīn wén", uz: "yangilik", ru: "новость", posUz: "ot", posRu: "существительное", tag: "society", exampleChinese: "我每天早上看新闻。", examplePinyin: "wǒ měi tiān zǎo shang kàn xīn wén.", exampleUz: "Men har kuni ertalab yangiliklarni o‘qiyman.", exampleRu: "Каждое утро я читаю новости." },
    { chinese: "关系", pinyin: "guān xi", uz: "munosabat, aloqa", ru: "отношение, связь", posUz: "ot", posRu: "существительное", tag: "relationships", exampleChinese: "他们的关系很好。", examplePinyin: "tā men de guān xi hěn hǎo.", exampleUz: "Ularning munosabati yaxshi.", exampleRu: "У них хорошие отношения." },
    { chinese: "经验", pinyin: "jīng yàn", uz: "tajriba", ru: "опыт", posUz: "ot", posRu: "существительное", tag: "work-life", exampleChinese: "这份工作需要很多经验。", examplePinyin: "zhè fèn gōng zuò xū yào hěn duō jīng yàn.", exampleUz: "Bu ish katta tajriba talab qiladi.", exampleRu: "Эта работа требует большого опыта." },
    { chinese: "责任", pinyin: "zé rèn", uz: "mas’uliyat", ru: "ответственность", posUz: "ot", posRu: "существительное", tag: "work-life", exampleChinese: "每个人都有自己的责任。", examplePinyin: "měi ge rén dōu yǒu zì jǐ de zé rèn.", exampleUz: "Har bir insonning o‘z mas’uliyati bor.", exampleRu: "У каждого человека есть своя ответственность." }
  ],
  5: [
    { chinese: "市场", pinyin: "shì chǎng", uz: "bozor", ru: "рынок", posUz: "ot", posRu: "существительное", tag: "business", exampleChinese: "这个产品在市场上很受欢迎。", examplePinyin: "zhè ge chǎn pǐn zài shì chǎng shang hěn shòu huān yíng.", exampleUz: "Bu mahsulot bozorda juda ommabop.", exampleRu: "Этот продукт очень популярен на рынке." },
    { chinese: "效率", pinyin: "xiào lǜ", uz: "samaradorlik", ru: "эффективность", posUz: "ot", posRu: "существительное", tag: "business", exampleChinese: "新的工具提高了工作效率。", examplePinyin: "xīn de gōng jù tí gāo le gōng zuò xiào lǜ.", exampleUz: "Yangi vosita ish samaradorligini oshirdi.", exampleRu: "Новый инструмент повысил эффективность работы." },
    { chinese: "媒体", pinyin: "méi tǐ", uz: "ommaviy axborot vositalari", ru: "медиа", posUz: "ot", posRu: "существительное", tag: "media", exampleChinese: "媒体对公众影响很大。", examplePinyin: "méi tǐ duì gōng zhòng yǐng xiǎng hěn dà.", exampleUz: "Media jamoatchilikka katta ta’sir qiladi.", exampleRu: "Медиа сильно влияют на общественность." },
    { chinese: "观点", pinyin: "guān diǎn", uz: "nuqtayi nazar", ru: "точка зрения", posUz: "ot", posRu: "существительное", tag: "abstract", exampleChinese: "我同意你的观点。", examplePinyin: "wǒ tóng yì nǐ de guān diǎn.", exampleUz: "Men sizning nuqtayi nazaringizga qo‘shilaman.", exampleRu: "Я согласен с вашей точкой зрения." },
    { chinese: "价值", pinyin: "jià zhí", uz: "qadriyat, qiymat", ru: "ценность, стоимость", posUz: "ot", posRu: "существительное", tag: "abstract", exampleChinese: "教育的价值不能只用钱来衡量。", examplePinyin: "jiào yù de jià zhí bù néng zhǐ yòng qián lái héng liáng.", exampleUz: "Ta’lim qiymatini faqat pul bilan o‘lchab bo‘lmaydi.", exampleRu: "Ценность образования нельзя измерять только деньгами." },
    { chinese: "趋势", pinyin: "qū shì", uz: "tendensiya", ru: "тенденция", posUz: "ot", posRu: "существительное", tag: "media", exampleChinese: "线上学习已经成为一种趋势。", examplePinyin: "xiàn shàng xué xí yǐ jīng chéng wéi yì zhǒng qū shì.", exampleUz: "Onlayn o‘qish allaqachon tendensiyaga aylandi.", exampleRu: "Онлайн-обучение уже стало тенденцией." }
  ],
  6: [
    { chinese: "综合", pinyin: "zōng hé", uz: "umumlashtirmoq", ru: "обобщать", posUz: "fe’l", posRu: "глагол", tag: "academic", exampleChinese: "我们需要综合各方面的信息。", examplePinyin: "wǒ men xū yào zōng hé gè fāng miàn de xìn xī.", exampleUz: "Biz turli tomonlardagi ma’lumotlarni umumlashtirishimiz kerak.", exampleRu: "Нам нужно обобщить информацию с разных сторон." },
    { chinese: "论证", pinyin: "lùn zhèng", uz: "dalillash", ru: "аргументация", posUz: "ot", posRu: "существительное", tag: "debates", exampleChinese: "这篇文章的论证很清楚。", examplePinyin: "zhè piān wén zhāng de lùn zhèng hěn qīng chǔ.", exampleUz: "Bu maqolaning dalillashi juda aniq.", exampleRu: "Аргументация этой статьи очень ясная." },
    { chinese: "阐述", pinyin: "chǎn shù", uz: "batafsil bayon qilmoq", ru: "излагать", posUz: "fe’l", posRu: "глагол", tag: "essays", exampleChinese: "请阐述你的主要观点。", examplePinyin: "qǐng chǎn shù nǐ de zhǔ yào guān diǎn.", exampleUz: "Iltimos, asosiy fikringizni batafsil bayon qiling.", exampleRu: "Пожалуйста, изложите свою основную мысль." },
    { chinese: "显著", pinyin: "xiǎn zhù", uz: "sezilarli", ru: "значительный", posUz: "sifat", posRu: "прилагательное", tag: "academic", exampleChinese: "这个政策带来了显著变化。", examplePinyin: "zhè ge zhèng cè dài lái le xiǎn zhù biàn huà.", exampleUz: "Bu siyosat sezilarli o‘zgarish olib keldi.", exampleRu: "Эта политика принесла значительные изменения." },
    { chinese: "实施", pinyin: "shí shī", uz: "amalga oshirmoq", ru: "осуществлять", posUz: "fe’l", posRu: "глагол", tag: "formal", exampleChinese: "计划将在下个月实施。", examplePinyin: "jì huà jiāng zài xià ge yuè shí shī.", exampleUz: "Reja keyingi oy amalga oshiriladi.", exampleRu: "План будет осуществлён в следующем месяце." },
    { chinese: "原则", pinyin: "yuán zé", uz: "tamoyil", ru: "принцип", posUz: "ot", posRu: "существительное", tag: "formal", exampleChinese: "我们应该坚持公平原则。", examplePinyin: "wǒ men yīng gāi jiān chí gōng píng yuán zé.", exampleUz: "Biz adolat tamoyiliga amal qilishimiz kerak.", exampleRu: "Мы должны придерживаться принципа справедливости." }
  ]
};

export function createVocabularyItems(level: HSKLevel): RichHSKVocabularyItem[] {
  const themes = hskCourseThemes[level];
  const difficulty = level <= 2 ? "easy" : level <= 4 ? "medium" : "hard";

  return seedWords[level].map((seed, index) => {
    const theme = themes.find((item) => item.id === seed.tag) ?? themes[index % themes.length];
    return {
      id: `hsk${level}-vocab-${String(index + 1).padStart(4, "0")}`,
      chinese: seed.chinese,
      pinyin: seed.pinyin,
      translationUz: seed.uz,
      translationRu: seed.ru,
      partOfSpeechUz: seed.posUz,
      partOfSpeechRu: seed.posRu,
      hskLevel: level,
      lessonId: `hsk${level}-${theme.id}`,
      exampleChinese: seed.exampleChinese,
      examplePinyin: seed.examplePinyin,
      exampleUz: seed.exampleUz,
      exampleRu: seed.exampleRu,
      difficulty,
      tags: [seed.tag, theme.id, `hsk-${level}`]
    };
  });
}

export function createGrammarPoints(level: HSKLevel): HSKGrammarPoint[] {
  const patterns = [
    { minLevel: 1, structure: "主语 + 是 + 名词", uz: "“是” bilan sodda tasdiq gap tuzish.", ru: "Простое утверждение с 是.", cn: "我是学生。", py: "wǒ shì xué sheng." },
    { minLevel: 1, structure: "主语 + 不 + 动词", uz: "“不” bilan inkor gap tuzish.", ru: "Отрицание с 不.", cn: "我不喝咖啡。", py: "wǒ bù hē kā fēi." },
    { minLevel: 2, structure: "动词 + 了", uz: "“了” tugallangan yoki yangi holatni bildiradi.", ru: "了 показывает завершённость действия или новое состояние.", cn: "我买了书。", py: "wǒ mǎi le shū." },
    { minLevel: 2, structure: "要 / 想 + 动词", uz: "Istak yoki reja bildirish uchun ishlatiladi.", ru: "Используется для желания или плана.", cn: "我想学习汉语。", py: "wǒ xiǎng xué xí hàn yǔ." },
    { minLevel: 3, structure: "主语 + 比 + 对象 + 形容词", uz: "Taqqoslashda “比” ishlatish.", ru: "Сравнение с 比.", cn: "今天比昨天热。", py: "jīn tiān bǐ zuó tiān rè." },
    { minLevel: 4, structure: "虽然...但是...", uz: "Qarama-qarshi fikrni bog‘lash.", ru: "Связь уступки и противопоставления.", cn: "虽然很忙，但是我会复习。", py: "suī rán hěn máng, dàn shì wǒ huì fù xí." }
  ];

  return patterns.filter((item) => item.minLevel <= level).slice(0, level <= 2 ? 4 : level <= 4 ? 5 : 6).map((item, index) => ({
    grammarId: `hsk${level}-grammar-${index + 1}`,
    hskLevel: level,
    titleUz: `HSK ${level} grammatika: ${item.structure}`,
    titleRu: `Грамматика HSK ${level}: ${item.structure}`,
    explanationUz: item.uz,
    explanationRu: item.ru,
    structure: item.structure,
    chineseExamples: [{ chinese: item.cn, pinyin: item.py, uz: item.uz, ru: item.ru }],
    commonMistakes: [
      { uz: "So‘z tartibini o‘zbekcha tartibga ko‘chirmang.", ru: "Не переносите порядок слов из родного языка." }
    ],
    practiceQuestions: [
      { questionUz: "Berilgan qolip bilan bitta gap tuzing.", questionRu: "Составьте одно предложение по модели.", answer: item.cn }
    ]
  }));
}

export function createCourseLessons(vocabulary: RichHSKVocabularyItem[], grammar: HSKGrammarPoint[]): RichHSKLesson[] {
  return ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) =>
    hskCourseThemes[level].map((theme) => {
      const lessonVocabulary = vocabulary.filter((word) => word.lessonId === `hsk${level}-${theme.id}`);
      const lessonGrammar = grammar.filter((item) => item.hskLevel === level).slice(0, 2);

      return {
        lessonId: `hsk${level}-${theme.id}`,
        hskLevel: level,
        titleUz: `HSK ${level}: ${theme.uz}`,
        titleRu: `HSK ${level}: ${theme.ru}`,
        shortDescriptionUz: theme.descUz,
        shortDescriptionRu: theme.descRu,
        vocabulary: lessonVocabulary,
        grammarPoints: lessonGrammar,
        exampleSentences: lessonVocabulary.slice(0, 5).map((word) => word.exampleChinese),
        miniQuiz: [],
        flashcards: lessonVocabulary,
        listeningPractice: [],
        writingPractice: [],
        reviewItems: lessonVocabulary.slice(0, 6).map((word) => word.id)
      };
    })
  );
}
