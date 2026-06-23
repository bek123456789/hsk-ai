import type { HSKReadingPassage } from "@/data/hsk/contentTypes";
import { advancedScenarios } from "@/data/hsk/advancedScenarios";
import { difficultyForLevel, levels, passageQuestion, wordsFor } from "@/data/hsk/contentFactory";
import type { HSKLevel } from "@/types";

const readingTopics = [
  {
    tag: "self-intro",
    titleUz: "Tanishuv",
    titleRu: "Знакомство",
    titleZh: "介绍",
    zh: (a: string, b: string) => `我叫安娜。我是学生。我每天学习汉语。今天老师教我们“${a}”和“${b}”。我觉得汉语很有意思。`,
    py: (a: string, b: string) => `wǒ jiào ān nà. wǒ shì xué sheng. wǒ měi tiān xué xí hàn yǔ. jīn tiān lǎo shī jiāo wǒ men “${a}” hé “${b}”. wǒ jué de hàn yǔ hěn yǒu yì si.`,
    uz: (a: string, b: string) => `Anna talaba. U har kuni xitoy tilini o‘rganadi. Bugun o‘qituvchi ularga “${a}” va “${b}” so‘zlarini o‘rgatdi. Anna xitoy tilini qiziqarli deb hisoblaydi.`,
    ru: (a: string, b: string) => `Анна студентка. Она каждый день изучает китайский. Сегодня учитель объяснил слова «${a}» и «${b}». Анна считает китайский интересным.`,
    answerUz: "Anna xitoy tilini o‘rganadi",
    answerRu: "Анна изучает китайский",
    distractors: [
      ["Anna restoran ochadi", "Анна открывает ресторан"],
      ["Anna taksida aeroportga boradi", "Анна едет на такси в аэропорт"],
      ["Anna futbol mashq qiladi", "Анна тренируется играть в футбол"]
    ]
  },
  {
    tag: "family",
    titleUz: "Oila haqida",
    titleRu: "О семье",
    titleZh: "家人",
    zh: (a: string, b: string) => `周末我在家。我和妈妈一起看书，爸爸去商店买水果。晚上我们喝茶，也复习“${a}”和“${b}”。`,
    py: (a: string, b: string) => `zhōu mò wǒ zài jiā. wǒ hé mā ma yì qǐ kàn shū, bà ba qù shāng diàn mǎi shuǐ guǒ. wǎn shang wǒ men hē chá, yě fù xí “${a}” hé “${b}”.`,
    uz: (a: string, b: string) => `Dam olish kuni men uyda bo‘ldim. Onam bilan kitob o‘qidim, otam do‘konga meva olishga bordi. Kechqurun choy ichdik va “${a}”, “${b}” so‘zlarini takrorladik.`,
    ru: (a: string, b: string) => `В выходные я был дома. С мамой читал книгу, папа пошёл в магазин за фруктами. Вечером мы пили чай и повторяли слова «${a}» и «${b}».`,
    answerUz: "oilasi bilan uyda bo‘ladi",
    answerRu: "проводит время дома с семьёй",
    distractors: [
      ["oilasi bilan restoranga boradi", "идёт с семьёй в ресторан"],
      ["do‘sti bilan sport qiladi", "занимается спортом с другом"],
      ["o‘qituvchiga telefon qiladi", "звонит учителю"]
    ]
  },
  {
    tag: "school",
    titleUz: "Maktab kuni",
    titleRu: "Учебный день",
    titleZh: "上课",
    zh: (a: string, b: string) => `今天我们有汉语课。老师先让大家读课文，然后问问题。下课以后，我把“${a}”写在本子上，也用“${b}”造了一个句子。`,
    py: (a: string, b: string) => `jīn tiān wǒ men yǒu hàn yǔ kè. lǎo shī xiān ràng dà jiā dú kè wén, rán hòu wèn wèn tí. xià kè yǐ hòu, wǒ bǎ “${a}” xiě zài běn zi shang, yě yòng “${b}” zào le yí ge jù zi.`,
    uz: (a: string, b: string) => `Bugun xitoy tili darsi bo‘ldi. O‘qituvchi avval matn o‘qitdi, keyin savol berdi. Darsdan keyin men “${a}” so‘zini daftarimga yozdim va “${b}” bilan bitta gap tuzdim.`,
    ru: (a: string, b: string) => `Сегодня был урок китайского. Сначала учитель попросил прочитать текст, потом задал вопросы. После урока я записал слово «${a}» и составил предложение со словом «${b}».`,
    answerUz: "matn o‘qiydi va gap tuzadi",
    answerRu: "читает текст и составляет предложение",
    distractors: [
      ["darsdan oldin uxlaydi", "спит перед уроком"],
      ["faqat choy ichadi", "только пьёт чай"],
      ["kitobni do‘konda sotadi", "продаёт книгу в магазине"]
    ]
  },
  {
    tag: "shopping",
    titleUz: "Do‘konda",
    titleRu: "В магазине",
    titleZh: "买东西",
    zh: (a: string, b: string) => `小李去商店买东西。他想买一本书和一瓶水。售货员说今天有优惠。小李一边付款，一边练习“${a}”和“${b}”的发音。`,
    py: (a: string, b: string) => `xiǎo lǐ qù shāng diàn mǎi dōng xi. tā xiǎng mǎi yì běn shū hé yì píng shuǐ. shòu huò yuán shuō jīn tiān yǒu yōu huì. xiǎo lǐ yì biān fù kuǎn, yì biān liàn xí “${a}” hé “${b}” de fā yīn.`,
    uz: (a: string, b: string) => `Syao Li do‘konga xarid qilishga bordi. U bitta kitob va bir shisha suv olmoqchi. Sotuvchi bugun chegirma borligini aytdi. Syao Li to‘lov qilayotib “${a}” va “${b}” talaffuzini mashq qildi.`,
    ru: (a: string, b: string) => `Сяо Ли пошёл в магазин. Он хочет купить книгу и бутылку воды. Продавец сказал, что сегодня есть скидка. Во время оплаты Сяо Ли тренировался произносить «${a}» и «${b}».`,
    answerUz: "kitob va suv sotib oladi",
    answerRu: "покупает книгу и воду",
    distractors: [
      ["kino ko‘rishga boradi", "идёт смотреть фильм"],
      ["maktabda imtihon topshiradi", "сдаёт экзамен в школе"],
      ["uyda xat yozadi", "пишет письмо дома"]
    ]
  },
  {
    tag: "travel",
    titleUz: "Sayohat rejasi",
    titleRu: "План поездки",
    titleZh: "旅行计划",
    zh: (a: string, b: string) => `这个月我打算去中国旅行。我先坐公共汽车到机场，再坐飞机。朋友提醒我带护照，也让我复习“${a}”和“${b}”。`,
    py: (a: string, b: string) => `zhè ge yuè wǒ dǎ suàn qù zhōng guó lǚ xíng. wǒ xiān zuò gōng gòng qì chē dào jī chǎng, zài zuò fēi jī. péng you tí xǐng wǒ dài hù zhào, yě ràng wǒ fù xí “${a}” hé “${b}”.`,
    uz: (a: string, b: string) => `Bu oy men Xitoyga sayohat qilishni rejalashtiryapman. Avval avtobusda aeroportga boraman, keyin samolyotga chiqaman. Do‘stim pasport olishni eslatdi va “${a}”, “${b}” so‘zlarini takrorlashni maslahat berdi.`,
    ru: (a: string, b: string) => `В этом месяце я планирую поездку в Китай. Сначала поеду на автобусе в аэропорт, потом полечу самолётом. Друг напомнил взять паспорт и повторить слова «${a}» и «${b}».`,
    answerUz: "Xitoyga sayohat qiladi",
    answerRu: "едет в Китай",
    distractors: [
      ["kompyuter sotib oladi", "покупает компьютер"],
      ["oilasiga ovqat tayyorlaydi", "готовит еду семье"],
      ["darsni bekor qiladi", "отменяет урок"]
    ]
  },
  {
    tag: "work",
    titleUz: "Ishdagi reja",
    titleRu: "План на работе",
    titleZh: "工作安排",
    zh: (a: string, b: string) => `经理上午开会，说明这个星期的工作重点。大家要提高效率，也要按时完成报告。我负责整理资料，并把“${a}”和“${b}”写进学习笔记。`,
    py: (a: string, b: string) => `jīng lǐ shàng wǔ kāi huì, shuō míng zhè ge xīng qī de gōng zuò zhòng diǎn. dà jiā yào tí gāo xiào lǜ, yě yào àn shí wán chéng bào gào. wǒ fù zé zhěng lǐ zī liào, bìng bǎ “${a}” hé “${b}” xiě jìn xué xí bǐ jì.`,
    uz: (a: string, b: string) => `Menejer ertalab majlis o‘tkazib, bu haftadagi asosiy ishlarni tushuntirdi. Hamma samaradorlikni oshirishi va hisobotni vaqtida tugatishi kerak. Men ma’lumotlarni tartiblayman va “${a}”, “${b}” so‘zlarini o‘quv daftarimga yozaman.`,
    ru: (a: string, b: string) => `Утром менеджер провёл совещание и объяснил главные задачи недели. Всем нужно повысить эффективность и вовремя закончить отчёт. Я отвечаю за материалы и записываю «${a}», «${b}» в учебные заметки.`,
    answerUz: "ish rejasini tushuntiradi",
    answerRu: "объясняет рабочий план",
    distractors: [
      ["sayohat uchun chipta oladi", "покупает билет для поездки"],
      ["kasalxonaga boradi", "идёт в больницу"],
      ["yangi telefon tanlaydi", "выбирает новый телефон"]
    ]
  },
  {
    tag: "culture",
    titleUz: "Madaniyat darsi",
    titleRu: "Урок культуры",
    titleZh: "文化课",
    zh: (a: string, b: string) => `今天的文化课讨论节日和习惯。老师说，学习语言不能只背单词，还要了解社会和文化。课后我们用“${a}”和“${b}”写了两句话。`,
    py: (a: string, b: string) => `jīn tiān de wén huà kè tǎo lùn jié rì hé xí guàn. lǎo shī shuō, xué xí yǔ yán bù néng zhǐ bèi dān cí, hái yào liǎo jiě shè huì hé wén huà. kè hòu wǒ men yòng “${a}” hé “${b}” xiě le liǎng jù huà.`,
    uz: (a: string, b: string) => `Bugungi madaniyat darsida bayramlar va odatlar muhokama qilindi. O‘qituvchi til o‘rganishda faqat so‘z yodlash yetarli emas, jamiyat va madaniyatni ham tushunish kerak dedi. Darsdan keyin “${a}” va “${b}” bilan ikki gap yozdik.`,
    ru: (a: string, b: string) => `На уроке культуры обсуждали праздники и привычки. Учитель сказал, что при изучении языка важно понимать общество и культуру, а не только учить слова. После урока мы написали два предложения со словами «${a}» и «${b}».`,
    answerUz: "til va madaniyat bog‘liqligini o‘rganadi",
    answerRu: "изучает связь языка и культуры",
    distractors: [
      ["faqat sonlarni sanaydi", "только считает числа"],
      ["poyezd jadvalini tekshiradi", "проверяет расписание поезда"],
      ["meva narxini so‘raydi", "спрашивает цену фруктов"]
    ]
  },
  {
    tag: "opinion",
    titleUz: "Fikr bildirish",
    titleRu: "Выражение мнения",
    titleZh: "表达看法",
    zh: (a: string, b: string) => `有人认为线上学习更方便，也有人觉得面对面交流更有效。我的观点是，两种方式都有价值。关键是坚持复习，并把“${a}”“${b}”这样的词用在真实句子里。`,
    py: (a: string, b: string) => `yǒu rén rèn wéi xiàn shàng xué xí gèng fāng biàn, yě yǒu rén jué de miàn duì miàn jiāo liú gèng yǒu xiào. wǒ de guān diǎn shì, liǎng zhǒng fāng shì dōu yǒu jià zhí. guān jiàn shì jiān chí fù xí, bìng bǎ “${a}”“${b}” zhè yàng de cí yòng zài zhēn shí jù zi lǐ.`,
    uz: (a: string, b: string) => `Ba’zilar onlayn o‘qish qulayroq, boshqalar yuzma-yuz muloqot samaraliroq deb hisoblaydi. Mening fikrimcha, ikkala usulning ham qadri bor. Muhimi, muntazam takrorlash va “${a}”, “${b}” kabi so‘zlarni haqiqiy gaplarda ishlatish.`,
    ru: (a: string, b: string) => `Кто-то считает онлайн-обучение удобнее, а кто-то думает, что личное общение эффективнее. По моему мнению, оба способа ценны. Главное — регулярно повторять и использовать слова вроде «${a}», «${b}» в настоящих предложениях.`,
    answerUz: "ikkala o‘qish usuli foydali",
    answerRu: "оба способа обучения полезны",
    distractors: [
      ["faqat yuzma-yuz o‘qish zararli", "только очное обучение вредно"],
      ["onlayn o‘qish doim bekor qilinadi", "онлайн-обучение всегда отменяют"],
      ["takrorlash kerak emas", "повторять не нужно"]
    ]
  },
  {
    tag: "advanced",
    titleUz: "O‘qish usuli tahlili",
    titleRu: "Анализ способа обучения",
    titleZh: "学习方法分析",
    zh: (a: string, b: string) => `有效的语言学习不只是记住词义，还包括在语境中理解表达。学习者如果能够综合听、说、读、写的训练，就会逐渐形成稳定的语感。因此，“${a}”和“${b}”不应只停留在词表里，而要进入真实交流。`,
    py: (a: string, b: string) => `yǒu xiào de yǔ yán xué xí bù zhǐ shì jì zhù cí yì, hái bāo kuò zài yǔ jìng zhōng lǐ jiě biǎo dá. xué xí zhě rú guǒ néng gòu zōng hé tīng, shuō, dú, xiě de xùn liàn, jiù huì zhú jiàn xíng chéng wěn dìng de yǔ gǎn. yīn cǐ, “${a}” hé “${b}” bù yīng zhǐ tíng liú zài cí biǎo lǐ, ér yào jìn rù zhēn shí jiāo liú.`,
    uz: (a: string, b: string) => `Samarali til o‘rganish faqat so‘z ma’nosini yodlash emas, balki ifodani kontekstda tushunishdir. O‘quvchi tinglash, gapirish, o‘qish va yozishni birlashtirsa, barqaror til sezgisi shakllanadi. Shuning uchun “${a}” va “${b}” faqat ro‘yxatda qolmasdan, haqiqiy muloqotga kirishi kerak.`,
    ru: (a: string, b: string) => `Эффективное изучение языка — это не только запоминание значения слов, но и понимание выражений в контексте. Если учащийся объединяет аудирование, говорение, чтение и письмо, постепенно формируется устойчивое языковое чувство. Поэтому «${a}» и «${b}» должны перейти из списка слов в реальное общение.`,
    answerUz: "so‘zlarni kontekstda ishlatish kerak",
    answerRu: "слова нужно использовать в контексте",
    distractors: [
      ["faqat ro‘yxat yodlash yetarli", "достаточно только заучивать список"],
      ["gapirish va tinglash kerak emas", "говорение и аудирование не нужны"],
      ["so‘zlarni haqiqiy gapda ishlatmaslik kerak", "не нужно использовать слова в настоящих предложениях"]
    ]
  }
];

const targetCounts: Record<HSKLevel, number> = { 1: 30, 2: 30, 3: 30, 4: 30, 5: 30, 6: 30 };

const foundationalReadingContent: HSKReadingPassage[] = levels.flatMap((level) => {
  const count = targetCounts[level];
  return Array.from({ length: count }, (_, index) => {
    const topic = readingTopics[(index + level - 1) % readingTopics.length];
    const [first, second] = wordsFor(level, 2, index * 2);
    const firstLabelUz = first?.uz ?? "yangi so‘z";
    const secondLabelUz = second?.uz ?? "mashq";
    const firstLabelRu = first?.ru ?? "новое слово";
    const secondLabelRu = second?.ru ?? "практика";
    const firstZh = first?.hanzi ?? "汉语";
    const secondZh = second?.hanzi ?? "学习";
    const firstPy = first?.pinyin ?? "hàn yǔ";
    const secondPy = second?.pinyin ?? "xué xí";

    return {
      id: `reading-hsk${level}-${String(index + 1).padStart(2, "0")}`,
      level,
      titleUz: `HSK ${level}: ${topic.titleUz}`,
      titleRu: `HSK ${level}: ${topic.titleRu}`,
      titleZh: topic.titleZh,
      passageZh: topic.zh(firstZh, secondZh),
      passagePinyin: topic.py(firstPy, secondPy),
      passageUz: topic.uz(firstLabelUz, secondLabelUz),
      passageRu: topic.ru(firstLabelRu, secondLabelRu),
      vocabularyIds: [first?.id, second?.id].filter(Boolean) as string[],
      questions: [
        passageQuestion({
          id: `reading-hsk${level}-${String(index + 1).padStart(2, "0")}-q1`,
          level,
          questionUz: "Matnga ko‘ra, asosiy fikrni tanlang.",
          questionRu: "Выберите главную мысль текста.",
          correctUz: topic.answerUz,
          correctRu: topic.answerRu,
          explanationUz: `Matnda asosiy fikr “${topic.answerUz}” ekanini bildiruvchi gaplar bor. Boshqa variantlar matndagi asosiy mazmunga mos emas.`,
          explanationRu: `В тексте есть фразы, которые показывают главную мысль: «${topic.answerRu}». Другие варианты не соответствуют основному смыслу текста.`,
          distractors: topic.distractors.map(([uz, ru]) => ({ uz, ru }))
        })
      ],
      difficulty: difficultyForLevel(level),
      estimatedMinutes: level <= 2 ? 4 : level <= 4 ? 6 : 8,
      tags: [topic.tag, `hsk-${level}`, "reading"]
    };
  });
});

const advancedReadingContent: HSKReadingPassage[] = advancedScenarios.map((scenario, index) => ({
  id: `reading-advanced-hsk${scenario.level}-${String(advancedScenarios.filter((item) => item.level === scenario.level).findIndex((item) => item.id === scenario.id) + 1).padStart(2, "0")}`,
  level: scenario.level,
  titleUz: `HSK ${scenario.level}: ${scenario.titleUz}`,
  titleRu: `HSK ${scenario.level}: ${scenario.titleRu}`,
  titleZh: scenario.titleZh,
  passageZh: scenario.passageZh,
  passagePinyin: scenario.passagePinyin,
  passageUz: scenario.passageUz,
  passageRu: scenario.passageRu,
  vocabularyIds: wordsFor(scenario.level, 3, index * 3).map((word) => word.id),
  questions: [
    passageQuestion({
      id: `reading-${scenario.id}-q1`,
      level: scenario.level,
      questionUz: "Matnning asosiy xulosasini tanlang.",
      questionRu: "Выберите главный вывод текста.",
      correctUz: scenario.summaryUz,
      correctRu: scenario.summaryRu,
      explanationUz: `Matnning asosiy xulosasi: ${scenario.summaryUz}`,
      explanationRu: `Главный вывод текста: ${scenario.summaryRu}`
    })
  ],
  difficulty: difficultyForLevel(scenario.level),
  estimatedMinutes: scenario.level === 4 ? 7 : scenario.level === 5 ? 9 : 11,
  tags: [scenario.tag, `hsk-${scenario.level}`, "reading", "original"]
}));

export const hskReadingContent: HSKReadingPassage[] = [...foundationalReadingContent, ...advancedReadingContent];

export function getReadingByLevel(level: HSKLevel) {
  return hskReadingContent.filter((item) => item.level === level);
}
