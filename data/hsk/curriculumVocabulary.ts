import type { HSKVocabularyEntry } from "@/data/hsk/contentTypes";
import type { HSKLevel } from "@/types";

type WordSeed = [hanzi: string, pinyin: string, uz: string, ru: string, category: string, pos: string];

const words: Record<HSKLevel, WordSeed[]> = {
  1: [
    ["下午", "xià wǔ", "tushdan keyin", "после полудня", "time", "ot"],
    ["下", "xià", "past, ost", "внизу, под", "place", "ot"],
    ["五", "wǔ", "besh", "пять", "number", "son"],
    ["冷", "lěng", "sovuq", "холодный", "weather", "sifat"],
    ["零", "líng", "nol", "ноль", "number", "son"],
    ["认识", "rèn shi", "tanimoq, tanishmoq", "знать, знакомиться", "person", "fe’l"],
    ["门", "mén", "eshik", "дверь", "daily-life", "ot"],
    ["后面", "hòu miàn", "orqa tomon", "сзади", "place", "ot"],
    ["衣服", "yī fu", "kiyim", "одежда", "daily-life", "ot"],
    ["饭", "fàn", "ovqat", "еда", "food", "ot"],
    ["外面", "wài miàn", "tashqarida", "снаружи", "place", "ot"],
    ["里面", "lǐ miàn", "ichkarida", "внутри", "place", "ot"],
    ["旁边", "páng biān", "yonida", "рядом", "place", "ot"],
    ["天气", "tiān qì", "ob-havo", "погода", "weather", "ot"]
  ],
  2: [
    ["妹妹", "mèi mei", "singil", "младшая сестра", "family", "ot"],
    ["牛奶", "niú nǎi", "sut", "молоко", "drink", "ot"],
    ["跑步", "pǎo bù", "yugurmoq", "бегать", "health", "fe’l"],
    ["票", "piào", "chipta", "билет", "travel", "ot"],
    ["便宜", "pián yi", "arzon", "дешёвый", "shopping", "sifat"],
    ["生气", "shēng qì", "jahli chiqmoq", "сердиться", "emotion", "fe’l"],
    ["一起", "yì qǐ", "birga", "вместе", "daily-life", "ravish"],
    ["阴", "yīn", "bulutli", "пасмурный", "weather", "sifat"],
    ["每", "měi", "har bir", "каждый", "grammar-function", "olmosh"],
    ["卖", "mài", "sotmoq", "продавать", "shopping", "fe’l"],
    ["慢", "màn", "sekin", "медленный", "adjective", "sifat"],
    ["忙", "máng", "band", "занятый", "work", "sifat"],
    ["晴", "qíng", "ochiq, quyoshli", "ясный, солнечный", "weather", "sifat"],
    ["游泳", "yóu yǒng", "suzmoq", "плавать", "health", "fe’l"],
    ["颜色", "yán sè", "rang", "цвет", "daily-life", "ot"],
    ["宾馆", "bīn guǎn", "mehmonxona", "гостиница", "travel", "ot"],
    ["旁边", "páng biān", "yonida", "рядом", "place", "ot"],
    ["分钟", "fēn zhōng", "daqiqa", "минута", "time", "o‘lchov so‘zi"]
  ],
  3: [
    ["害怕", "hài pà", "qo‘rqmoq", "бояться", "emotion", "fe’l"],
    ["黑板", "hēi bǎn", "doska", "доска", "school", "ot"],
    ["护照", "hù zhào", "pasport", "паспорт", "travel", "ot"],
    ["花", "huā", "gul", "цветок", "daily-life", "ot"],
    ["花园", "huā yuán", "bog‘", "сад", "place", "ot"],
    ["画", "huà", "rasm chizmoq", "рисовать", "culture", "fe’l"],
    ["坏", "huài", "yomon, buzilgan", "плохой, сломанный", "adjective", "sifat"],
    ["环境", "huán jìng", "atrof-muhit", "окружающая среда", "society", "ot"],
    ["换", "huàn", "almashtirmoq", "менять", "verb", "fe’l"],
    ["黄河", "huáng hé", "Xuanxe daryosi", "река Хуанхэ", "culture", "ot"],
    ["回答", "huí dá", "javob bermoq", "отвечать", "study", "fe’l"],
    ["会议", "huì yì", "yig‘ilish", "совещание", "work", "ot"],
    ["或者", "huò zhě", "yoki", "или", "grammar-function", "bog‘lovchi"],
    ["机会", "jī huì", "imkoniyat", "возможность", "work", "ot"],
    ["几乎", "jī hū", "deyarli", "почти", "grammar-function", "ravish"],
    ["记得", "jì de", "eslamoq", "помнить", "study", "fe’l"],
    ["季节", "jì jié", "fasl", "сезон", "weather", "ot"],
    ["检查", "jiǎn chá", "tekshirmoq", "проверять", "health", "fe’l"],
    ["简单", "jiǎn dān", "oddiy", "простой", "adjective", "sifat"],
    ["健康", "jiàn kāng", "sog‘lom", "здоровый", "health", "sifat"],
    ["见面", "jiàn miàn", "uchrashmoq", "встречаться", "person", "fe’l"],
    ["讲", "jiǎng", "gapirmoq, tushuntirmoq", "говорить, объяснять", "study", "fe’l"],
    ["教", "jiāo", "o‘rgatmoq", "обучать", "school", "fe’l"],
    ["脚", "jiǎo", "oyoq", "нога", "health", "ot"],
    ["接", "jiē", "kutib olmoq, qabul qilmoq", "встречать, принимать", "verb", "fe’l"],
    ["街道", "jiē dào", "ko‘cha", "улица", "place", "ot"],
    ["节目", "jié mù", "dastur", "программа", "media", "ot"],
    ["节日", "jié rì", "bayram", "праздник", "culture", "ot"],
    ["解决", "jiě jué", "hal qilmoq", "решать", "work", "fe’l"],
    ["借", "jiè", "qarzga olmoq", "брать взаймы", "daily-life", "fe’l"],
    ["经常", "jīng cháng", "tez-tez", "часто", "time", "ravish"],
    ["经过", "jīng guò", "orqali o‘tmoq", "проходить через", "travel", "fe’l"],
    ["经理", "jīng lǐ", "menejer", "менеджер", "work", "ot"],
    ["久", "jiǔ", "uzoq vaqt", "долго", "time", "ravish"],
    ["旧", "jiù", "eski", "старый", "adjective", "sifat"],
    ["决定", "jué dìng", "qaror qilmoq", "решать", "verb", "fe’l"],
    ["客人", "kè rén", "mehmon", "гость", "person", "ot"],
    ["刻", "kè", "chorak soat", "четверть часа", "time", "o‘lchov so‘zi"]
  ],
  4: [
    ["刚刚", "gāng gāng", "hozirgina", "только что", "time", "ravish"],
    ["高级", "gāo jí", "yuqori darajali", "высокого уровня", "adjective", "sifat"],
    ["各", "gè", "har bir", "каждый", "grammar-function", "olmosh"],
    ["工资", "gōng zī", "maosh", "зарплата", "work", "ot"],
    ["共同", "gòng tóng", "umumiy, birgalikdagi", "общий, совместный", "society", "sifat"],
    ["够", "gòu", "yetarli", "достаточно", "adjective", "sifat"],
    ["购物", "gòu wù", "xarid qilmoq", "делать покупки", "shopping", "fe’l"],
    ["估计", "gū jì", "taxmin qilmoq", "предполагать", "verb", "fe’l"],
    ["鼓励", "gǔ lì", "ruhlandirmoq", "поощрять", "emotion", "fe’l"],
    ["故意", "gù yì", "ataylab", "намеренно", "grammar-function", "ravish"],
    ["顾客", "gù kè", "mijoz", "клиент", "shopping", "ot"],
    ["挂", "guà", "osmoq", "вешать", "verb", "fe’l"],
    ["关键", "guān jiàn", "asosiy nuqta", "ключевой момент", "work", "ot"],
    ["观众", "guān zhòng", "tomoshabin", "зритель", "media", "ot"],
    ["管理", "guǎn lǐ", "boshqarmoq", "управлять", "work", "fe’l"],
    ["光", "guāng", "yorug‘lik", "свет", "daily-life", "ot"],
    ["广播", "guǎng bō", "radioeshittirish", "радиопередача", "media", "ot"],
    ["广告", "guǎng gào", "reklama", "реклама", "media", "ot"],
    ["逛", "guàng", "aylanib yurmoq", "прогуливаться", "daily-life", "fe’l"],
    ["规定", "guī dìng", "qoida, belgilamoq", "правило, устанавливать", "society", "ot"],
    ["国籍", "guó jí", "fuqarolik", "гражданство", "society", "ot"],
    ["果然", "guǒ rán", "kutilganidek", "как и ожидалось", "grammar-function", "ravish"],
    ["过程", "guò chéng", "jarayon", "процесс", "work", "ot"],
    ["海洋", "hǎi yáng", "okean", "океан", "place", "ot"],
    ["害羞", "hài xiū", "uyatchan", "стеснительный", "emotion", "sifat"],
    ["寒假", "hán jià", "qishki ta’til", "зимние каникулы", "school", "ot"],
    ["航班", "háng bān", "aviaqatnov", "авиарейс", "travel", "ot"],
    ["好处", "hǎo chu", "foyda", "польза", "daily-life", "ot"],
    ["好像", "hǎo xiàng", "go‘yo, o‘xshamoq", "как будто, похоже", "grammar-function", "ravish"],
    ["号码", "hào mǎ", "raqam", "номер", "daily-life", "ot"],
    ["合格", "hé gé", "talabga mos", "соответствующий норме", "work", "sifat"],
    ["合适", "hé shì", "mos", "подходящий", "adjective", "sifat"],
    ["后悔", "hòu huǐ", "afsuslanmoq", "сожалеть", "emotion", "fe’l"]
  ],
  5: [
    ["大方", "dà fang", "ochiqko‘ngil, saxiy", "щедрый, непринуждённый", "person", "sifat"],
    ["大型", "dà xíng", "yirik", "крупный", "adjective", "sifat"],
    ["呆", "dāi", "qolmoq", "оставаться", "verb", "fe’l"],
    ["贷款", "dài kuǎn", "kredit", "кредит", "business", "ot"],
    ["单纯", "dān chún", "sodda", "простой, наивный", "person", "sifat"],
    ["单调", "dān diào", "bir xil, zerikarli", "однообразный", "adjective", "sifat"],
    ["单独", "dān dú", "alohida", "отдельно", "grammar-function", "ravish"],
    ["单位", "dān wèi", "tashkilot, birlik", "организация, единица", "work", "ot"],
    ["单元", "dān yuán", "bo‘lim", "раздел, блок", "study", "ot"],
    ["耽误", "dān wu", "kechiktirmoq", "задерживать", "work", "fe’l"],
    ["胆小鬼", "dǎn xiǎo guǐ", "qo‘rqoq", "трус", "person", "ot"],
    ["淡", "dàn", "xira, ta’mi yengil", "слабый, пресный", "adjective", "sifat"],
    ["当地", "dāng dì", "mahalliy", "местный", "society", "sifat"],
    ["当心", "dāng xīn", "ehtiyot bo‘lmoq", "быть осторожным", "daily-life", "fe’l"],
    ["导致", "dǎo zhì", "olib kelmoq", "приводить к", "society", "fe’l"],
    ["岛屿", "dǎo yǔ", "orol", "остров", "place", "ot"],
    ["倒霉", "dǎo méi", "omadsiz", "невезучий", "emotion", "sifat"],
    ["道德", "dào dé", "axloq", "мораль", "society", "ot"],
    ["登记", "dēng jì", "ro‘yxatdan o‘tkazmoq", "регистрировать", "work", "fe’l"],
    ["等待", "děng dài", "kutmoq", "ожидать", "verb", "fe’l"],
    ["等候", "děng hòu", "kutib turmoq", "ожидать", "verb", "fe’l"],
    ["滴", "dī", "tomchi", "капля", "measure-word", "ot"],
    ["地道", "dì dao", "asl, haqiqiy", "настоящий, аутентичный", "culture", "sifat"],
    ["地理", "dì lǐ", "geografiya", "география", "study", "ot"],
    ["地区", "dì qū", "hudud", "район", "society", "ot"],
    ["地毯", "dì tǎn", "gilam", "ковёр", "daily-life", "ot"],
    ["地位", "dì wèi", "mavqe", "положение, статус", "society", "ot"],
    ["地震", "dì zhèn", "zilzila", "землетрясение", "society", "ot"],
    ["递", "dì", "uzatmoq", "передавать", "verb", "fe’l"],
    ["点心", "diǎn xin", "yengil tamaddi", "закуска, димсам", "food", "ot"],
    ["电池", "diàn chí", "batareya", "батарейка", "technology", "ot"],
    ["电台", "diàn tái", "radiostansiya", "радиостанция", "media", "ot"],
    ["钓", "diào", "baliq tutmoq", "ловить рыбу", "daily-life", "fe’l"],
    ["顶", "dǐng", "tepa, dona", "верхушка, счётное слово", "measure-word", "ot"]
  ],
  6: [
    ["包庇", "bāo bì", "yashirmoq, himoya qilib qolmoq", "укрывать, покрывать", "society", "fe’l"],
    ["包袱", "bāo fu", "yuk, og‘ir mas’uliyat", "ноша, бремя", "society", "ot"],
    ["包围", "bāo wéi", "o‘rab olmoq", "окружать", "verb", "fe’l"],
    ["包装", "bāo zhuāng", "qadoqlamoq", "упаковывать", "business", "fe’l"],
    ["饱和", "bǎo hé", "to‘yingan", "насыщенный", "science", "sifat"],
    ["保管", "bǎo guǎn", "saqlab turmoq", "хранить", "work", "fe’l"],
    ["保密", "bǎo mì", "sir saqlamoq", "сохранять тайну", "work", "fe’l"],
    ["保姆", "bǎo mǔ", "bola qarovchisi", "няня", "work", "ot"],
    ["保守", "bǎo shǒu", "konservativ", "консервативный", "society", "sifat"],
    ["保卫", "bǎo wèi", "himoya qilmoq", "защищать", "society", "fe’l"],
    ["保养", "bǎo yǎng", "parvarish qilmoq", "ухаживать, обслуживать", "health", "fe’l"],
    ["保障", "bǎo zhàng", "kafolatlamoq", "обеспечивать", "society", "fe’l"],
    ["报仇", "bào chóu", "qasos olmoq", "мстить", "culture", "fe’l"],
    ["报酬", "bào chou", "haq, mukofot", "вознаграждение", "work", "ot"],
    ["报答", "bào dá", "yaxshilikni qaytarmoq", "отблагодарить", "emotion", "fe’l"],
    ["报到", "bào dào", "ro‘yxatdan o‘tib kelganini bildirmoq", "явиться и зарегистрироваться", "work", "fe’l"],
    ["报复", "bào fù", "qasos qaytarmoq", "мстить", "society", "fe’l"],
    ["报销", "bào xiāo", "xarajatni qoplatmoq", "возмещать расходы", "business", "fe’l"],
    ["抱负", "bào fù", "katta maqsad", "стремление, амбиция", "work", "ot"],
    ["暴力", "bào lì", "zo‘ravonlik", "насилие", "society", "ot"],
    ["暴露", "bào lù", "oshkor qilmoq", "разоблачать, раскрывать", "society", "fe’l"],
    ["爆发", "bào fā", "to‘satdan boshlanmoq", "вспыхивать", "society", "fe’l"],
    ["爆炸", "bào zhà", "portlash", "взрыв", "society", "ot"],
    ["悲哀", "bēi āi", "chuqur qayg‘u", "печаль", "emotion", "ot"]
  ]
};

function exampleFor(level: HSKLevel, seed: WordSeed) {
  const [hanzi, pinyin, uz, ru] = seed;
  if (level <= 2) {
    return {
      zh: `我会用“${hanzi}”说一句话。`,
      pinyin: `wǒ huì yòng “${pinyin}” shuō yí jù huà.`,
      uz: `Men “${hanzi}” so‘zi bilan bitta gap ayta olaman.`,
      ru: `Я могу составить предложение со словом «${hanzi}».`
    };
  }
  if (level <= 4) {
    return {
      zh: `老师让我们用“${hanzi}”完成一个练习。`,
      pinyin: `lǎo shī ràng wǒ men yòng “${pinyin}” wán chéng yí ge liàn xí.`,
      uz: `O‘qituvchi bizga “${hanzi}” so‘zi bilan mashq bajarishni topshirdi.`,
      ru: `Учитель попросил нас выполнить упражнение со словом «${hanzi}».`
    };
  }
  return {
    zh: `理解“${hanzi}”的语境能让表达更加准确。`,
    pinyin: `lǐ jiě “${pinyin}” de yǔ jìng néng ràng biǎo dá gèng jiā zhǔn què.`,
    uz: `“${hanzi}” so‘zining kontekstini tushunish fikrni aniqroq ifodalashga yordam beradi.`,
    ru: `Понимание контекста слова «${hanzi}» помогает выражаться точнее.`
  };
}

export const curriculumVocabulary: HSKVocabularyEntry[] = (Object.entries(words) as Array<[`${HSKLevel}`, WordSeed[]]>).flatMap(
  ([levelValue, seeds]) => {
    const level = Number(levelValue) as HSKLevel;
    return seeds.map((seed, index) => {
      const [hanzi, pinyin, uz, ru, category, pos] = seed;
      const example = exampleFor(level, seed);
      return {
        id: `hsk${level}-curriculum-${String(index + 1).padStart(3, "0")}`,
        level,
        hanzi,
        pinyin,
        uz,
        ru,
        pos,
        category,
        exampleZh: example.zh,
        examplePinyin: example.pinyin,
        exampleUz: example.uz,
        exampleRu: example.ru,
        tags: [category, `hsk-${level}`, "lesson-curriculum"]
      };
    });
  }
);
