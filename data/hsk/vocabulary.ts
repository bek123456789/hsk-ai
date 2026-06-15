import { hskVocabulary } from "@/data/hskVocabulary";
import { curriculumVocabulary } from "@/data/hsk/curriculumVocabulary";
import type { HSKVocabularyEntry } from "@/data/hsk/contentTypes";
import type { HSKLevel } from "@/types";

type CompactWord = [hanzi: string, pinyin: string, uz: string, ru: string, category: string, pos?: string];

const compactVocabulary: Record<HSKLevel, CompactWord[]> = {
  1: [
    ["爱", "ài", "sevmoq", "любить", "emotion", "fe’l"],
    ["八", "bā", "sakkiz", "восемь", "number", "son"],
    ["爸爸", "bà ba", "ota", "папа", "family", "ot"],
    ["杯子", "bēi zi", "stakan", "стакан", "daily-life", "ot"],
    ["北京", "běi jīng", "Pekin", "Пекин", "place", "ot"],
    ["本", "běn", "dona, kitob sanog‘i", "счётное слово для книг", "measure-word", "hisob so‘zi"],
    ["不客气", "bú kè qi", "arzimaydi", "пожалуйста, не стоит благодарности", "greeting", "ibora"],
    ["菜", "cài", "taom, sabzavot", "блюдо, овощи", "food", "ot"],
    ["茶", "chá", "choy", "чай", "drink", "ot"],
    ["出租车", "chū zū chē", "taksi", "такси", "transport", "ot"],
    ["打电话", "dǎ diàn huà", "telefon qilmoq", "звонить по телефону", "verb", "fe’l"],
    ["大", "dà", "katta", "большой", "adjective", "sifat"],
    ["的", "de", "egalik qo‘shimchasi", "частица принадлежности", "grammar-function", "yordamchi"],
    ["点", "diǎn", "soat, nuqta", "час, точка", "time", "ot"],
    ["电脑", "diàn nǎo", "kompyuter", "компьютер", "technology", "ot"],
    ["电视", "diàn shì", "televizor", "телевизор", "technology", "ot"],
    ["电影", "diàn yǐng", "kino", "фильм", "daily-life", "ot"],
    ["东西", "dōng xi", "narsa", "вещь", "daily-life", "ot"],
    ["都", "dōu", "hammasi", "все", "grammar-function", "ravish"],
    ["读", "dú", "o‘qimoq", "читать", "study", "fe’l"],
    ["对不起", "duì bu qǐ", "kechirasiz", "извините", "greeting", "ibora"],
    ["多", "duō", "ko‘p", "много", "adjective", "sifat"],
    ["儿子", "ér zi", "o‘g‘il", "сын", "family", "ot"],
    ["二", "èr", "ikki", "два", "number", "son"],
    ["饭店", "fàn diàn", "restoran, mehmonxona", "ресторан, гостиница", "place", "ot"],
    ["飞机", "fēi jī", "samolyot", "самолёт", "transport", "ot"],
    ["分钟", "fēn zhōng", "daqiqa", "минута", "time", "ot"],
    ["高兴", "gāo xìng", "xursand", "радостный", "emotion", "sifat"],
    ["个", "gè", "umumiy hisob so‘zi", "универсальное счётное слово", "measure-word", "hisob so‘zi"],
    ["工作", "gōng zuò", "ishlamoq, ish", "работать, работа", "work", "fe’l"],
    ["狗", "gǒu", "it", "собака", "daily-life", "ot"],
    ["好", "hǎo", "yaxshi", "хороший", "adjective", "sifat"],
    ["号", "hào", "raqam, sana", "номер, число месяца", "date", "ot"],
    ["回", "huí", "qaytmoq", "возвращаться", "verb", "fe’l"],
    ["会", "huì", "qila olmoq", "уметь", "grammar-function", "fe’l"],
    ["家", "jiā", "uy, oila", "дом, семья", "family", "ot"],
    ["叫", "jiào", "atalmoq, chaqirmoq", "называться, звать", "verb", "fe’l"],
    ["今天", "jīn tiān", "bugun", "сегодня", "time", "ot"],
    ["九", "jiǔ", "to‘qqiz", "девять", "number", "son"],
    ["开", "kāi", "ochmoq", "открывать", "verb", "fe’l"],
    ["看见", "kàn jiàn", "ko‘rib qolmoq", "увидеть", "verb", "fe’l"],
    ["块", "kuài", "yuan, bo‘lak", "юань, кусок", "measure-word", "hisob so‘zi"],
    ["里", "lǐ", "ichida", "внутри", "place", "ot"],
    ["六", "liù", "olti", "шесть", "number", "son"],
    ["妈妈", "mā ma", "ona", "мама", "family", "ot"],
    ["吗", "ma", "savol yuklamasi", "вопросительная частица", "grammar-function", "yordamchi"],
    ["猫", "māo", "mushuk", "кошка", "daily-life", "ot"],
    ["没关系", "méi guān xi", "hechqisi yo‘q", "ничего страшного", "greeting", "ibora"],
    ["米饭", "mǐ fàn", "guruchli ovqat", "рис", "food", "ot"],
    ["明天", "míng tiān", "ertaga", "завтра", "time", "ot"],
    ["名字", "míng zi", "ism", "имя", "person", "ot"],
    ["哪儿", "nǎr", "qayer", "где, куда", "question-word", "so‘roq"],
    ["呢", "ne", "savol/yumshatish yuklamasi", "частица вопроса", "grammar-function", "yordamchi"],
    ["能", "néng", "qila olmoq", "мочь", "grammar-function", "fe’l"],
    ["年", "nián", "yil", "год", "date", "ot"],
    ["女儿", "nǚ ér", "qiz farzand", "дочь", "family", "ot"],
    ["漂亮", "piào liang", "chiroyli", "красивый", "adjective", "sifat"],
    ["苹果", "píng guǒ", "olma", "яблоко", "food", "ot"],
    ["钱", "qián", "pul", "деньги", "shopping", "ot"],
    ["前面", "qián miàn", "old tomon", "передняя сторона", "place", "ot"],
    ["请", "qǐng", "iltimos", "пожалуйста", "greeting", "fe’l"],
    ["热", "rè", "issiq", "жаркий", "weather", "sifat"],
    ["三", "sān", "uch", "три", "number", "son"],
    ["商店", "shāng diàn", "do‘kon", "магазин", "shopping", "ot"],
    ["上", "shàng", "ustida, yuqorida", "на, сверху", "place", "ot"],
    ["上午", "shàng wǔ", "ertalab", "утро, до полудня", "time", "ot"],
    ["少", "shǎo", "kam", "мало", "adjective", "sifat"],
    ["十", "shí", "o‘n", "десять", "number", "son"],
    ["时候", "shí hou", "vaqt, payt", "время, момент", "time", "ot"],
    ["书", "shū", "kitob", "книга", "study", "ot"],
    ["水", "shuǐ", "suv", "вода", "drink", "ot"],
    ["水果", "shuǐ guǒ", "meva", "фрукты", "food", "ot"],
    ["睡觉", "shuì jiào", "uxlamoq", "спать", "daily-life", "fe’l"],
    ["说话", "shuō huà", "gapirmoq", "говорить", "verb", "fe’l"],
    ["四", "sì", "to‘rt", "четыре", "number", "son"],
    ["岁", "suì", "yosh", "лет возраста", "date", "ot"],
    ["太", "tài", "juda", "слишком", "grammar-function", "ravish"],
    ["听", "tīng", "tinglamoq", "слушать", "verb", "fe’l"],
    ["同学", "tóng xué", "sinfdosh, kursdosh", "одноклассник, сокурсник", "school", "ot"],
    ["喂", "wèi", "allo", "алло", "greeting", "ibora"],
    ["先生", "xiān sheng", "janob", "господин", "person", "ot"],
    ["现在", "xiàn zài", "hozir", "сейчас", "time", "ot"],
    ["想", "xiǎng", "xohlamoq, o‘ylamoq", "хотеть, думать", "verb", "fe’l"],
    ["小", "xiǎo", "kichik", "маленький", "adjective", "sifat"],
    ["小姐", "xiǎo jie", "xonim", "девушка, госпожа", "person", "ot"],
    ["些", "xiē", "bir nechta", "несколько", "measure-word", "hisob so‘zi"],
    ["写", "xiě", "yozmoq", "писать", "study", "fe’l"],
    ["星期", "xīng qī", "hafta", "неделя", "date", "ot"],
    ["学校", "xué xiào", "maktab", "школа", "school", "ot"],
    ["一", "yī", "bir", "один", "number", "son"],
    ["一点儿", "yì diǎnr", "ozgina", "немного", "measure-word", "ravish"],
    ["医生", "yī shēng", "shifokor", "врач", "health", "ot"],
    ["医院", "yī yuàn", "kasalxona", "больница", "health", "ot"],
    ["椅子", "yǐ zi", "stul", "стул", "daily-life", "ot"],
    ["有", "yǒu", "bor bo‘lmoq", "иметь, быть", "verb", "fe’l"],
    ["月", "yuè", "oy", "месяц", "date", "ot"],
    ["在", "zài", "joylashmoq, -da", "находиться, в", "place", "fe’l"],
    ["怎么", "zěn me", "qanday", "как", "question-word", "so‘roq"],
    ["怎么样", "zěn me yàng", "qanday, qalay", "как, как насчёт", "question-word", "so‘roq"],
    ["这儿", "zhèr", "bu yer", "здесь", "place", "ot"],
    ["中午", "zhōng wǔ", "tush payti", "полдень", "time", "ot"],
    ["住", "zhù", "yashamoq", "жить", "daily-life", "fe’l"],
    ["桌子", "zhuō zi", "stol", "стол", "daily-life", "ot"],
    ["字", "zì", "iyeroglif, harf", "иероглиф, знак", "study", "ot"],
    ["昨天", "zuó tiān", "kecha", "вчера", "time", "ot"],
    ["坐", "zuò", "o‘tirmoq, minmoq", "сидеть, ехать", "transport", "fe’l"]
  ],
  2: [
    ["白", "bái", "oq", "белый", "adjective", "sifat"], ["百", "bǎi", "yuz", "сто", "number", "son"], ["帮助", "bāng zhù", "yordam bermoq", "помогать", "verb", "fe’l"], ["报纸", "bào zhǐ", "gazeta", "газета", "daily-life", "ot"], ["比", "bǐ", "taqqoslash yuklamasi", "частица сравнения", "grammar-function", "yordamchi"], ["别", "bié", "qilmang", "не надо", "grammar-function", "ravish"], ["长", "cháng", "uzun", "длинный", "adjective", "sifat"], ["唱歌", "chàng gē", "qo‘shiq aytmoq", "петь", "daily-life", "fe’l"], ["出", "chū", "chiqmoq", "выходить", "verb", "fe’l"], ["穿", "chuān", "kiymoq", "надевать", "daily-life", "fe’l"], ["次", "cì", "marta", "раз", "measure-word", "hisob so‘zi"], ["从", "cóng", "-dan", "из, от", "grammar-function", "yordamchi"], ["错", "cuò", "xato", "ошибка, ошибочный", "study", "sifat"], ["打篮球", "dǎ lán qiú", "basketbol o‘ynamoq", "играть в баскетбол", "daily-life", "fe’l"], ["大家", "dà jiā", "hamma", "все", "person", "olmosh"], ["到", "dào", "yetib bormoq", "доходить, прибывать", "transport", "fe’l"], ["得", "de", "daraja qo‘shimchasi", "структурная частица", "grammar-function", "yordamchi"], ["等", "děng", "kutmoq", "ждать", "verb", "fe’l"], ["弟弟", "dì di", "uka", "младший брат", "family", "ot"], ["第一", "dì yī", "birinchi", "первый", "number", "son"], ["懂", "dǒng", "tushunmoq", "понимать", "study", "fe’l"], ["对", "duì", "to‘g‘ri", "правильный", "adjective", "sifat"], ["房间", "fáng jiān", "xona", "комната", "place", "ot"], ["非常", "fēi cháng", "juda", "очень", "adjective", "ravish"], ["服务员", "fú wù yuán", "xizmatchi", "официант, сотрудник", "work", "ot"], ["高", "gāo", "baland", "высокий", "adjective", "sifat"], ["告诉", "gào su", "aytmoq, xabar bermoq", "сообщать", "verb", "fe’l"], ["哥哥", "gē ge", "aka", "старший брат", "family", "ot"], ["给", "gěi", "bermoq", "давать", "verb", "fe’l"], ["公斤", "gōng jīn", "kilogramm", "килограмм", "measure-word", "ot"], ["公司", "gōng sī", "kompaniya", "компания", "work", "ot"], ["过", "guò", "boshdan kechirmoq", "проходить, опыт действия", "grammar-function", "yordamchi"], ["还", "hái", "hali, yana", "ещё", "grammar-function", "ravish"], ["孩子", "hái zi", "bola", "ребёнок", "family", "ot"], ["好吃", "hǎo chī", "mazali", "вкусный", "food", "sifat"], ["黑", "hēi", "qora", "чёрный", "adjective", "sifat"], ["红", "hóng", "qizil", "красный", "adjective", "sifat"], ["欢迎", "huān yíng", "xush kelibsiz", "добро пожаловать", "greeting", "fe’l"], ["回答", "huí dá", "javob bermoq", "отвечать", "study", "fe’l"], ["鸡蛋", "jī dàn", "tuxum", "яйцо", "food", "ot"], ["件", "jiàn", "kiyim/buyum sanog‘i", "счётное слово для вещей", "measure-word", "hisob so‘zi"], ["教室", "jiào shì", "sinf xonasi", "класс", "school", "ot"], ["姐姐", "jiě jie", "opa", "старшая сестра", "family", "ot"], ["介绍", "jiè shào", "tanishtirmoq", "представлять", "person", "fe’l"], ["近", "jìn", "yaqin", "близкий", "place", "sifat"], ["进", "jìn", "kirmoq", "входить", "verb", "fe’l"], ["就", "jiù", "darhol, aynan", "сразу, именно", "grammar-function", "ravish"], ["觉得", "jué de", "his qilmoq, deb o‘ylamoq", "считать, чувствовать", "emotion", "fe’l"], ["咖啡", "kā fēi", "qahva", "кофе", "drink", "ot"], ["开始", "kāi shǐ", "boshlamoq", "начинать", "verb", "fe’l"], ["考试", "kǎo shì", "imtihon", "экзамен", "study", "ot"], ["可能", "kě néng", "mumkin", "возможно", "grammar-function", "ravish"], ["可以", "kě yǐ", "mumkin, ruxsat", "можно", "grammar-function", "fe’l"], ["课", "kè", "dars", "урок", "school", "ot"], ["快", "kuài", "tez", "быстрый", "adjective", "sifat"], ["快乐", "kuài lè", "baxtli, quvnoq", "радостный", "emotion", "sifat"], ["累", "lèi", "charchagan", "уставший", "health", "sifat"], ["离", "lí", "-dan masofa", "от, расстояние", "place", "yordamchi"], ["两", "liǎng", "ikki dona", "два", "number", "son"], ["路", "lù", "yo‘l", "дорога", "transport", "ot"], ["旅游", "lǚ yóu", "sayohat qilmoq", "путешествовать", "travel", "fe’l"], ["妻子", "qī zi", "xotin", "жена", "family", "ot"], ["起床", "qǐ chuáng", "uyg‘onmoq", "вставать с постели", "daily-life", "fe’l"], ["千", "qiān", "ming", "тысяча", "number", "son"], ["晴", "qíng", "ochiq havo", "ясная погода", "weather", "sifat"], ["去年", "qù nián", "o‘tgan yil", "прошлый год", "date", "ot"], ["让", "ràng", "ruxsat bermoq, qildirmoq", "позволять, заставлять", "grammar-function", "fe’l"], ["日", "rì", "kun, sana", "день, дата", "date", "ot"], ["上班", "shàng bān", "ishga bormoq", "идти на работу", "work", "fe’l"], ["身体", "shēn tǐ", "tana, sog‘liq", "тело, здоровье", "health", "ot"], ["生病", "shēng bìng", "kasal bo‘lmoq", "болеть", "health", "fe’l"], ["生日", "shēng rì", "tug‘ilgan kun", "день рождения", "date", "ot"], ["时间", "shí jiān", "vaqt", "время", "time", "ot"], ["事情", "shì qing", "ish, voqea", "дело, событие", "daily-life", "ot"], ["手表", "shǒu biǎo", "qo‘l soati", "наручные часы", "daily-life", "ot"], ["手机", "shǒu jī", "telefon", "мобильный телефон", "technology", "ot"], ["送", "sòng", "sovg‘a qilmoq, yubormoq", "дарить, отправлять", "verb", "fe’l"], ["虽然", "suī rán", "garchi", "хотя", "grammar-function", "bog‘lovchi"], ["但是", "dàn shì", "lekin", "но", "grammar-function", "bog‘lovchi"], ["它", "tā", "u (narsa/hayvon)", "оно", "pronoun", "olmosh"], ["题", "tí", "savol, masala", "задание, вопрос", "study", "ot"], ["跳舞", "tiào wǔ", "raqsga tushmoq", "танцевать", "daily-life", "fe’l"], ["外", "wài", "tashqari", "снаружи", "place", "ot"], ["完", "wán", "tugatmoq", "заканчивать", "verb", "fe’l"], ["玩", "wán", "o‘ynamoq", "играть", "daily-life", "fe’l"], ["晚上", "wǎn shang", "kechqurun", "вечер", "time", "ot"], ["为什么", "wèi shén me", "nima uchun", "почему", "question-word", "so‘roq"], ["问", "wèn", "so‘ramoq", "спрашивать", "verb", "fe’l"], ["问题", "wèn tí", "savol, muammo", "вопрос, проблема", "study", "ot"], ["希望", "xī wàng", "umid qilmoq", "надеяться", "emotion", "fe’l"], ["西瓜", "xī guā", "tarvuz", "арбуз", "food", "ot"], ["洗", "xǐ", "yuvmoq", "мыть", "daily-life", "fe’l"], ["小时", "xiǎo shí", "soat (davomiylik)", "час", "time", "ot"], ["笑", "xiào", "kulmoq", "смеяться", "emotion", "fe’l"], ["新", "xīn", "yangi", "новый", "adjective", "sifat"], ["姓", "xìng", "familiya bo‘lmoq", "фамилия", "person", "ot"], ["休息", "xiū xi", "dam olmoq", "отдыхать", "daily-life", "fe’l"], ["雪", "xuě", "qor", "снег", "weather", "ot"], ["颜色", "yán sè", "rang", "цвет", "adjective", "ot"], ["眼睛", "yǎn jing", "ko‘z", "глаза", "health", "ot"], ["羊肉", "yáng ròu", "qo‘y go‘shti", "баранина", "food", "ot"], ["药", "yào", "dori", "лекарство", "health", "ot"], ["要", "yào", "xohlamoq, kerak", "хотеть, нужно", "grammar-function", "fe’l"], ["也", "yě", "ham", "тоже", "grammar-function", "ravish"], ["一下", "yí xià", "bir oz", "немного, разок", "grammar-function", "ravish"], ["已经", "yǐ jīng", "allaqachon", "уже", "time", "ravish"], ["意思", "yì si", "ma’no", "смысл", "study", "ot"], ["因为", "yīn wèi", "chunki", "потому что", "grammar-function", "bog‘lovchi"], ["所以", "suǒ yǐ", "shuning uchun", "поэтому", "grammar-function", "bog‘lovchi"], ["游泳", "yóu yǒng", "suzmoq", "плавать", "daily-life", "fe’l"], ["右边", "yòu bian", "o‘ng tomon", "справа", "place", "ot"], ["鱼", "yú", "baliq", "рыба", "food", "ot"], ["远", "yuǎn", "uzoq", "далёкий", "place", "sifat"], ["运动", "yùn dòng", "sport, harakat", "спорт, движение", "health", "ot"], ["再", "zài", "yana", "снова", "grammar-function", "ravish"], ["早上", "zǎo shang", "ertalab", "утро", "time", "ot"], ["丈夫", "zhàng fu", "er", "муж", "family", "ot"], ["找", "zhǎo", "qidirmoq", "искать", "verb", "fe’l"], ["着", "zhe", "davomiylik yuklamasi", "частица длительности", "grammar-function", "yordamchi"], ["真", "zhēn", "haqiqatan", "действительно", "adjective", "ravish"], ["正在", "zhèng zài", "ayni paytda", "прямо сейчас", "grammar-function", "ravish"], ["知道", "zhī dào", "bilmoq", "знать", "study", "fe’l"], ["准备", "zhǔn bèi", "tayyorlamoq", "готовить", "study", "fe’l"], ["走", "zǒu", "yurmoq, ketmoq", "идти, уходить", "verb", "fe’l"], ["最", "zuì", "eng", "самый", "grammar-function", "ravish"], ["左边", "zuǒ bian", "chap tomon", "слева", "place", "ot"]
  ],
  3: [
    ["阿姨", "ā yí", "xola, opa", "тётя", "person", "ot"], ["安静", "ān jìng", "tinch", "тихий", "adjective", "sifat"], ["爱好", "ài hào", "qiziqish", "хобби", "daily-life", "ot"], ["矮", "ǎi", "past bo‘yli", "низкий", "adjective", "sifat"], ["把", "bǎ", "obyektni oldinga chiqaruvchi yuklama", "частица 把", "grammar-function", "yordamchi"], ["班", "bān", "guruh, sinf", "класс, группа", "school", "ot"], ["搬", "bān", "ko‘chirmoq", "переезжать, переносить", "verb", "fe’l"], ["半", "bàn", "yarim", "половина", "number", "son"], ["办法", "bàn fǎ", "usul", "способ", "study", "ot"], ["办公室", "bàn gōng shì", "ofis", "офис", "work", "ot"], ["包", "bāo", "sumka", "сумка", "daily-life", "ot"], ["饱", "bǎo", "to‘q", "сытый", "food", "sifat"], ["北方", "běi fāng", "shimol", "север", "place", "ot"], ["被", "bèi", "majhul nisbat yuklamasi", "пассивная частица", "grammar-function", "yordamchi"], ["鼻子", "bí zi", "burun", "нос", "health", "ot"], ["笔记本", "bǐ jì běn", "daftar", "тетрадь", "study", "ot"], ["必须", "bì xū", "shart, kerak", "обязательно", "grammar-function", "ravish"], ["变化", "biàn huà", "o‘zgarish", "изменение", "daily-life", "ot"], ["表示", "biǎo shì", "bildirmoq", "выражать", "verb", "fe’l"], ["表演", "biǎo yǎn", "ijro etmoq", "выступать", "culture", "fe’l"], ["别人", "bié ren", "boshqalar", "другие люди", "person", "ot"], ["宾馆", "bīn guǎn", "mehmonxona", "гостиница", "travel", "ot"], ["冰箱", "bīng xiāng", "muzlatkich", "холодильник", "daily-life", "ot"], ["才", "cái", "endigina, faqat", "только, лишь", "grammar-function", "ravish"], ["菜单", "cài dān", "menyu", "меню", "food", "ot"], ["参加", "cān jiā", "qatnashmoq", "участвовать", "work", "fe’l"], ["草", "cǎo", "o‘t", "трава", "daily-life", "ot"], ["层", "céng", "qavat", "этаж, слой", "measure-word", "hisob so‘zi"], ["差", "chà", "yomon, farq", "плохой, разница", "adjective", "sifat"], ["超市", "chāo shì", "supermarket", "супермаркет", "shopping", "ot"], ["衬衫", "chèn shān", "ko‘ylak", "рубашка", "daily-life", "ot"], ["城市", "chéng shì", "shahar", "город", "place", "ot"], ["迟到", "chí dào", "kechikmoq", "опаздывать", "school", "fe’l"], ["出现", "chū xiàn", "paydo bo‘lmoq", "появляться", "verb", "fe’l"], ["厨房", "chú fáng", "oshxona", "кухня", "place", "ot"], ["春", "chūn", "bahor", "весна", "weather", "ot"], ["词语", "cí yǔ", "so‘z birikmasi", "слово, выражение", "study", "ot"], ["聪明", "cōng ming", "aqlli", "умный", "adjective", "sifat"], ["打扫", "dǎ sǎo", "tozalamoq", "убирать", "daily-life", "fe’l"], ["带", "dài", "olib kelmoq", "брать с собой", "verb", "fe’l"], ["担心", "dān xīn", "xavotirlanmoq", "волноваться", "emotion", "fe’l"], ["蛋糕", "dàn gāo", "tort", "торт", "food", "ot"], ["当然", "dāng rán", "albatta", "конечно", "grammar-function", "ravish"], ["地", "de", "ravish yasovchi qo‘shimcha", "частица наречия", "grammar-function", "yordamchi"], ["灯", "dēng", "chiroq", "лампа", "daily-life", "ot"], ["低", "dī", "past", "низкий", "adjective", "sifat"], ["地方", "dì fang", "joy", "место", "place", "ot"], ["地铁", "dì tiě", "metro", "метро", "transport", "ot"], ["地图", "dì tú", "xarita", "карта", "travel", "ot"], ["电梯", "diàn tī", "lift", "лифт", "place", "ot"], ["电子邮件", "diàn zǐ yóu jiàn", "elektron xat", "электронная почта", "technology", "ot"], ["东", "dōng", "sharq", "восток", "place", "ot"], ["冬", "dōng", "qish", "зима", "weather", "ot"], ["动物", "dòng wù", "hayvon", "животное", "daily-life", "ot"], ["短", "duǎn", "qisqa", "короткий", "adjective", "sifat"], ["段", "duàn", "bo‘lak, parcha", "отрезок, абзац", "measure-word", "hisob so‘zi"], ["锻炼", "duàn liàn", "mashq qilmoq", "тренироваться", "health", "fe’l"], ["多么", "duō me", "naqadar", "как же", "grammar-function", "ravish"], ["饿", "è", "och", "голодный", "food", "sifat"], ["耳朵", "ěr duo", "quloq", "ухо", "health", "ot"], ["发", "fā", "yubormoq", "отправлять", "technology", "fe’l"], ["发烧", "fā shāo", "isitma chiqmoq", "температурить", "health", "fe’l"], ["发现", "fā xiàn", "aniqlamoq", "обнаружить", "verb", "fe’l"], ["方便", "fāng biàn", "qulay", "удобный", "adjective", "sifat"], ["放", "fàng", "qo‘ymoq", "класть", "verb", "fe’l"], ["放心", "fàng xīn", "ko‘ngli tinch bo‘lmoq", "быть спокойным", "emotion", "fe’l"], ["分", "fēn", "ball, daqiqa", "балл, минута", "study", "ot"], ["附近", "fù jìn", "yaqin atrof", "поблизости", "place", "ot"], ["干净", "gān jìng", "toza", "чистый", "adjective", "sifat"], ["感冒", "gǎn mào", "shamollash", "простуда", "health", "ot"], ["感兴趣", "gǎn xìng qù", "qiziqmoq", "интересоваться", "emotion", "fe’l"], ["刚才", "gāng cái", "hozirgina", "только что", "time", "ot"], ["个子", "gè zi", "bo‘y", "рост", "person", "ot"], ["跟", "gēn", "bilan", "с", "grammar-function", "yordamchi"], ["更", "gèng", "yanada", "ещё более", "grammar-function", "ravish"], ["公园", "gōng yuán", "park", "парк", "place", "ot"], ["故事", "gù shi", "hikoya", "история", "culture", "ot"]
  ],
  4: [
    ["安排", "ān pái", "rejalashtirmoq", "планировать", "work", "fe’l"], ["安全", "ān quán", "xavfsiz", "безопасный", "daily-life", "sifat"], ["按时", "àn shí", "vaqtida", "вовремя", "time", "ravish"], ["保护", "bǎo hù", "himoya qilmoq", "защищать", "society", "fe’l"], ["保证", "bǎo zhèng", "kafolat bermoq", "гарантировать", "work", "fe’l"], ["抱歉", "bào qiàn", "uzr", "извиняться", "greeting", "ibora"], ["倍", "bèi", "baravar", "раз", "measure-word", "hisob so‘zi"], ["标准", "biāo zhǔn", "standart", "стандарт", "work", "ot"], ["表格", "biǎo gé", "jadval", "таблица", "work", "ot"], ["并且", "bìng qiě", "bundan tashqari", "и к тому же", "grammar-function", "bog‘lovchi"], ["材料", "cái liào", "material", "материал", "work", "ot"], ["参观", "cān guān", "tomosha qilmoq", "посещать, осматривать", "travel", "fe’l"], ["成功", "chéng gōng", "muvaffaqiyat", "успех", "work", "ot"], ["诚实", "chéng shí", "halol", "честный", "adjective", "sifat"], ["吃惊", "chī jīng", "hayron qolmoq", "удивляться", "emotion", "fe’l"], ["重新", "chóng xīn", "qaytadan", "заново", "grammar-function", "ravish"], ["抽烟", "chōu yān", "chekmoq", "курить", "health", "fe’l"], ["出差", "chū chāi", "xizmat safariga chiqmoq", "ехать в командировку", "work", "fe’l"], ["出发", "chū fā", "yo‘lga chiqmoq", "отправляться", "travel", "fe’l"], ["传真", "chuán zhēn", "faks", "факс", "technology", "ot"], ["窗户", "chuāng hu", "deraza", "окно", "daily-life", "ot"], ["词典", "cí diǎn", "lug‘at", "словарь", "study", "ot"], ["从来", "cóng lái", "hech qachon", "всегда/никогда в конструкции", "grammar-function", "ravish"], ["粗心", "cū xīn", "e’tiborsiz", "невнимательный", "adjective", "sifat"], ["答案", "dá àn", "javob", "ответ", "study", "ot"], ["打扮", "dǎ ban", "kiyinib bezanmoq", "наряжаться", "daily-life", "fe’l"], ["打扰", "dǎ rǎo", "bezovta qilmoq", "беспокоить", "verb", "fe’l"], ["打印", "dǎ yìn", "chop etmoq", "печатать", "technology", "fe’l"], ["打折", "dǎ zhé", "chegirma qilmoq", "делать скидку", "shopping", "fe’l"], ["大概", "dà gài", "taxminan", "примерно", "grammar-function", "ravish"], ["戴", "dài", "taqmoq", "носить аксессуар", "daily-life", "fe’l"], ["代表", "dài biǎo", "vakil", "представитель", "work", "ot"], ["大夫", "dài fu", "shifokor", "врач", "health", "ot"], ["当", "dāng", "bo‘lib ishlamoq", "быть кем-то", "work", "fe’l"], ["当时", "dāng shí", "o‘sha paytda", "тогда", "time", "ot"], ["刀", "dāo", "pichoq", "нож", "daily-life", "ot"], ["导游", "dǎo yóu", "gid", "гид", "travel", "ot"], ["到处", "dào chù", "hamma joyda", "повсюду", "place", "ravish"], ["到底", "dào dǐ", "aslida", "в конце концов", "grammar-function", "ravish"], ["道歉", "dào qiàn", "kechirim so‘ramoq", "извиняться", "greeting", "fe’l"], ["得意", "dé yì", "mamnun", "довольный собой", "emotion", "sifat"], ["等于", "děng yú", "teng bo‘lmoq", "равняться", "study", "fe’l"], ["底", "dǐ", "tag", "дно", "place", "ot"], ["地点", "dì diǎn", "manzil, joy", "место", "place", "ot"], ["调查", "diào chá", "tadqiq qilmoq", "исследовать", "work", "fe’l"], ["掉", "diào", "tushib ketmoq", "падать", "verb", "fe’l"], ["丢", "diū", "yo‘qotmoq", "терять", "daily-life", "fe’l"], ["动作", "dòng zuò", "harakat", "движение", "daily-life", "ot"], ["堵车", "dǔ chē", "tirbandlik", "пробка", "transport", "ot"], ["肚子", "dù zi", "qorin", "живот", "health", "ot"], ["短信", "duǎn xìn", "SMS xabar", "смс", "technology", "ot"], ["对话", "duì huà", "dialog", "диалог", "study", "ot"], ["对面", "duì miàn", "qarshi tomon", "напротив", "place", "ot"], ["顿", "dùn", "ovqatlanish sanog‘i", "счётное слово для приёма пищи", "measure-word", "hisob so‘zi"], ["而", "ér", "esa, va", "а, и", "grammar-function", "bog‘lovchi"], ["发生", "fā shēng", "sodir bo‘lmoq", "происходить", "verb", "fe’l"], ["法律", "fǎ lǜ", "qonun", "закон", "society", "ot"], ["翻译", "fān yì", "tarjima qilmoq", "переводить", "study", "fe’l"], ["烦恼", "fán nǎo", "tashvish", "беспокойство", "emotion", "ot"], ["反对", "fǎn duì", "qarshi bo‘lmoq", "быть против", "society", "fe’l"], ["方法", "fāng fǎ", "usul", "способ", "study", "ot"]
  ],
  5: [
    ["爱护", "ài hù", "asrab-avaylamoq", "беречь", "society", "fe’l"], ["岸", "àn", "qirg‘oq", "берег", "place", "ot"], ["把握", "bǎ wò", "egallamoq, imkonni ushlamoq", "ухватить, владеть", "work", "fe’l"], ["摆", "bǎi", "joylashtirmoq", "расставлять", "verb", "fe’l"], ["办理", "bàn lǐ", "rasmiylashtirmoq", "оформлять", "work", "fe’l"], ["棒", "bàng", "ajoyib", "отличный", "adjective", "sifat"], ["保持", "bǎo chí", "saqlamoq", "сохранять", "work", "fe’l"], ["保存", "bǎo cún", "saqlab qo‘ymoq", "сохранять", "technology", "fe’l"], ["宝贝", "bǎo bèi", "aziz narsa", "сокровище", "emotion", "ot"], ["悲观", "bēi guān", "pessimistik", "пессимистичный", "emotion", "sifat"], ["背景", "bèi jǐng", "fon, kelib chiqish", "фон, происхождение", "society", "ot"], ["被子", "bèi zi", "ko‘rpa", "одеяло", "daily-life", "ot"], ["本科", "běn kē", "bakalavriat", "бакалавриат", "study", "ot"], ["本领", "běn lǐng", "mahorat", "умение", "work", "ot"], ["比例", "bǐ lì", "nisbat", "пропорция", "study", "ot"], ["彼此", "bǐ cǐ", "bir-biri", "друг друга", "person", "olmosh"], ["必然", "bì rán", "muqarrar", "неизбежный", "grammar-function", "sifat"], ["避免", "bì miǎn", "oldini olmoq", "избегать", "work", "fe’l"], ["编辑", "biān jí", "muharrir", "редактор", "work", "ot"], ["辩论", "biàn lùn", "munozara", "дебаты", "culture", "ot"], ["标志", "biāo zhì", "belgi", "знак", "society", "ot"], ["表情", "biǎo qíng", "yuz ifodasi", "выражение лица", "emotion", "ot"], ["病毒", "bìng dú", "virus", "вирус", "health", "ot"], ["玻璃", "bō li", "shisha", "стекло", "daily-life", "ot"], ["博物馆", "bó wù guǎn", "muzey", "музей", "culture", "ot"], ["不断", "bú duàn", "uzluksiz", "непрерывно", "grammar-function", "ravish"], ["不得不", "bù dé bù", "majbur bo‘lmoq", "быть вынужденным", "grammar-function", "ibora"], ["不管", "bù guǎn", "qanday bo‘lmasin", "независимо от", "grammar-function", "bog‘lovchi"], ["部门", "bù mén", "bo‘lim", "отдел", "work", "ot"], ["财产", "cái chǎn", "mulk", "имущество", "society", "ot"], ["采访", "cǎi fǎng", "intervyu olmoq", "брать интервью", "media", "fe’l"], ["采取", "cǎi qǔ", "choralar ko‘rmoq", "принимать меры", "work", "fe’l"], ["参考", "cān kǎo", "ma’lumot sifatida ko‘rmoq", "использовать как справку", "study", "fe’l"], ["参与", "cān yù", "ishtirok etmoq", "участвовать", "society", "fe’l"], ["操作", "cāo zuò", "boshqarmoq", "управлять, оперировать", "technology", "fe’l"], ["测验", "cè yàn", "sinov testi", "проверочный тест", "study", "ot"], ["曾经", "céng jīng", "ilgari", "когда-то", "time", "ravish"], ["叉子", "chā zi", "sanchqi", "вилка", "food", "ot"], ["差距", "chā jù", "tafovut", "разрыв", "society", "ot"], ["产品", "chǎn pǐn", "mahsulot", "продукт", "business", "ot"]
  ],
  6: [
    ["挨", "ái", "chidamoq", "терпеть", "emotion", "fe’l"], ["癌症", "ái zhèng", "saraton", "рак", "health", "ot"], ["爱不释手", "ài bù shì shǒu", "qo‘ldan qo‘ygisi kelmaslik", "не выпускать из рук", "culture", "ibora"], ["爱戴", "ài dài", "hurmat va mehr qilmoq", "уважать и любить", "society", "fe’l"], ["暧昧", "ài mèi", "noaniq, mujmal", "двусмысленный", "adjective", "sifat"], ["安宁", "ān níng", "osoyishtalik", "спокойствие", "society", "ot"], ["安详", "ān xiáng", "xotirjam", "безмятежный", "emotion", "sifat"], ["按捺", "àn nà", "bosib turmoq", "сдерживать", "emotion", "fe’l"], ["暗示", "àn shì", "ishora qilmoq", "намекать", "verb", "fe’l"], ["案件", "àn jiàn", "ish, sud ishi", "дело", "society", "ot"], ["昂贵", "áng guì", "juda qimmat", "дорогостоящий", "shopping", "sifat"], ["凹凸", "āo tū", "notekis", "неровный", "adjective", "sifat"], ["熬夜", "áo yè", "tun bo‘yi uxlamaslik", "не спать ночью", "health", "fe’l"], ["把关", "bǎ guān", "nazorat qilmoq", "контролировать качество", "work", "fe’l"], ["罢工", "bà gōng", "ish tashlash", "забастовка", "society", "ot"], ["霸道", "bà dào", "zo‘ravon, hukmron", "властный", "adjective", "sifat"], ["掰", "bāi", "sindirmoq, ajratmoq", "разламывать", "verb", "fe’l"], ["百分点", "bǎi fēn diǎn", "foiz punkti", "процентный пункт", "business", "ot"], ["摆脱", "bǎi tuō", "qutulmoq", "избавиться", "verb", "fe’l"], ["拜访", "bài fǎng", "tashrif buyurmoq", "навещать", "greeting", "fe’l"], ["败坏", "bài huài", "buzmoq, putur yetkazmoq", "портить", "society", "fe’l"], ["颁布", "bān bù", "e’lon qilmoq", "обнародовать", "society", "fe’l"], ["颁发", "bān fā", "topshirmoq", "вручать", "work", "fe’l"], ["斑纹", "bān wén", "naqsh, chiziq", "полосатый узор", "culture", "ot"], ["版本", "bǎn běn", "versiya", "версия", "technology", "ot"], ["半途而废", "bàn tú ér fèi", "yarim yo‘lda tashlamoq", "бросить на полпути", "culture", "ibora"], ["伴侣", "bàn lǚ", "hamroh, juft", "партнёр", "person", "ot"], ["伴随", "bàn suí", "hamroh bo‘lmoq", "сопровождать", "verb", "fe’l"], ["绑架", "bǎng jià", "o‘g‘irlab ketmoq", "похищать", "society", "fe’l"], ["榜样", "bǎng yàng", "namuna", "пример для подражания", "society", "ot"]
  ]
};

function semanticExample(word: CompactWord, level: HSKLevel) {
  const [hanzi, pinyin, uz, ru, category, pos = "so‘z"] = word;
  if (category === "number") {
    return {
      zh: `这个数字读作“${hanzi}”。`,
      py: `zhè ge shù zì dú zuò “${pinyin}”.`,
      uz: `Bu raqam “${hanzi}” deb o‘qiladi.`,
      ru: `Это число читается как «${hanzi}».`
    };
  }
  if (category === "greeting") {
    return {
      zh: `这段对话中可以听到“${hanzi}”。`,
      py: `zhè duàn duì huà zhōng kě yǐ tīng dào “${pinyin}”.`,
      uz: `Bu dialogda “${hanzi}” iborasini eshitish mumkin.`,
      ru: `В этом диалоге можно услышать выражение «${hanzi}».`
    };
  }
  if (category === "measure-word") {
    return {
      zh: `数东西时可以用“${hanzi}”这个量词。`,
      py: `shǔ dōng xi shí kě yǐ yòng “${pinyin}” zhè ge liàng cí.`,
      uz: `Narsalarni sanashda “${hanzi}” hisob so‘zidan foydalanish mumkin.`,
      ru: `При счёте предметов можно использовать счётное слово «${hanzi}».`
    };
  }
  if (category === "grammar-function" || category === "question-word") {
    return {
      zh: `这个句子里用了“${hanzi}”。`,
      py: `zhè ge jù zi lǐ yòng le “${pinyin}”.`,
      uz: `Bu gapda “${hanzi}” ishlatilgan.`,
      ru: `В этом предложении используется «${hanzi}».`
    };
  }
  if (["verb", "study", "work", "transport", "travel"].includes(category) || pos === "fe’l") {
    return {
      zh: `请用“${hanzi}”描述一个动作。`,
      py: `qǐng yòng “${pinyin}” miáo shù yí ge dòng zuò.`,
      uz: `Biror harakatni “${hanzi}” so‘zi bilan tasvirlang.`,
      ru: `Опишите действие с помощью слова «${hanzi}».`
    };
  }
  if (["adjective", "emotion", "weather"].includes(category) || pos === "sifat") {
    return {
      zh: `请用“${hanzi}”描述一种感受或情况。`,
      py: `qǐng yòng “${pinyin}” miáo shù yì zhǒng gǎn shòu huò qíng kuàng.`,
      uz: `Biror his yoki holatni “${hanzi}” so‘zi bilan tasvirlang.`,
      ru: `Опишите чувство или ситуацию с помощью слова «${hanzi}».`
    };
  }
  if (["time", "date"].includes(category)) {
    return {
      zh: `课文中出现了时间词“${hanzi}”。`,
      py: `kè wén zhōng chū xiàn le shí jiān cí “${pinyin}”.`,
      uz: `Matnda “${hanzi}” vaqt ifodasi uchradi.`,
      ru: `В тексте встретилось обозначение времени «${hanzi}».`
    };
  }
  if (level >= 5) {
    return {
      zh: `理解“${hanzi}”的语境有助于准确表达。`,
      py: `lǐ jiě “${pinyin}” de yǔ jìng yǒu zhù yú zhǔn què biǎo dá.`,
      uz: `“${hanzi}” so‘zining kontekstini tushunish fikrni aniq ifodalashga yordam beradi.`,
      ru: `Понимание контекста слова «${hanzi}» помогает выражаться точнее.`
    };
  }
  if (level >= 3) {
    return {
      zh: `老师用“${hanzi}”造了一个句子。`,
      py: `lǎo shī yòng “${pinyin}” zào le yí ge jù zi.`,
      uz: `O‘qituvchi “${hanzi}” so‘zi bilan gap tuzdi.`,
      ru: `Учитель составил предложение со словом «${hanzi}».`
    };
  }
  return {
    zh: `我会读“${hanzi}”这个词。`,
    py: `wǒ huì dú “${pinyin}” zhè ge cí.`,
    uz: `Men “${hanzi}” so‘zini o‘qiy olaman.`,
    ru: `Я умею читать слово «${hanzi}».`
  };
}

const baseVocabularyEntries: HSKVocabularyEntry[] = hskVocabulary.map((word) => ({
  id: word.id,
  level: word.hskLevel,
  hanzi: word.chinese,
  pinyin: word.pinyin,
  uz: word.translationUz,
  ru: word.translationRu,
  pos: word.partOfSpeechUz,
  category: word.tags[0] ?? `hsk-${word.hskLevel}`,
  exampleZh: word.exampleChinese,
  examplePinyin: word.examplePinyin,
  exampleUz: word.exampleUz,
  exampleRu: word.exampleRu,
  tags: word.tags
}));

function createExtraEntries() {
  const existing = new Set(baseVocabularyEntries.map((word) => `${word.level}:${word.hanzi}`));
  return (Object.entries(compactVocabulary) as Array<[`${HSKLevel}`, CompactWord[]]>).flatMap(([levelKey, words]) => {
    const level = Number(levelKey) as HSKLevel;
    return words
      .filter((word) => !existing.has(`${level}:${word[0]}`))
      .map((word, index) => {
        const [hanzi, pinyin, uz, ru, category, pos = "so‘z"] = word;
        const example = semanticExample(word, level);
        return {
          id: `hsk${level}-extra-${String(index + 1).padStart(3, "0")}`,
          level,
          hanzi,
          pinyin,
          uz,
          ru,
          pos,
          category,
          exampleZh: example.zh,
          examplePinyin: example.py,
          exampleUz: example.uz,
          exampleRu: example.ru,
          tags: [category, `hsk-${level}`, "expanded-vocabulary"]
        } satisfies HSKVocabularyEntry;
      });
  });
}

const expandedVocabularyEntries = [...baseVocabularyEntries, ...createExtraEntries()];
const expandedKeys = new Set(expandedVocabularyEntries.map((word) => `${word.level}:${word.hanzi}`));

export const vocabularyEntries: HSKVocabularyEntry[] = [
  ...expandedVocabularyEntries,
  ...curriculumVocabulary.filter((word) => !expandedKeys.has(`${word.level}:${word.hanzi}`))
];

export function getVocabularyEntriesByLevel(level: HSKLevel) {
  return vocabularyEntries.filter((word) => word.level === level);
}

export function getVocabularyEntryById(id: string) {
  return vocabularyEntries.find((word) => word.id === id);
}
