import type { HSKLevel } from "@/types";

export type ExamWritingPrompt = {
  id: string;
  level: HSKLevel;
  titleUz: string;
  titleRu: string;
  promptUz: string;
  promptRu: string;
  instructionZh?: string;
  expectedKeywordsZh: string[];
  sampleAnswerZh: string;
  sampleAnswerPinyin: string;
  sampleAnswerUz: string;
  sampleAnswerRu: string;
  minCharacters: number;
  difficulty: "easy" | "medium" | "hard";
};

const prompts: Record<HSKLevel, Array<Omit<ExamWritingPrompt, "id" | "level">>> = {
  1: [
    {
      titleUz: "O‘zingizni tanishtiring",
      titleRu: "Представьтесь",
      promptUz: "Ismingiz va kim ekaningiz haqida xitoycha ikki sodda gap yozing.",
      promptRu: "Напишите по-китайски два простых предложения о своём имени и о том, кто вы.",
      expectedKeywordsZh: ["我", "叫", "是"],
      sampleAnswerZh: "我叫安娜。我是学生。",
      sampleAnswerPinyin: "wǒ jiào ān nà. wǒ shì xué sheng.",
      sampleAnswerUz: "Mening ismim Anna. Men talabaman.",
      sampleAnswerRu: "Меня зовут Анна. Я студентка.",
      minCharacters: 7,
      difficulty: "easy"
    },
    {
      titleUz: "Kundalik harakat",
      titleRu: "Ежедневное действие",
      promptUz: "Bugun nima qilishingiz haqida xitoycha bitta sodda gap yozing.",
      promptRu: "Напишите одно простое предложение по-китайски о том, что вы делаете сегодня.",
      expectedKeywordsZh: ["今天", "我"],
      sampleAnswerZh: "今天我学习汉语。",
      sampleAnswerPinyin: "jīn tiān wǒ xué xí hàn yǔ.",
      sampleAnswerUz: "Bugun men xitoy tilini o‘rganaman.",
      sampleAnswerRu: "Сегодня я изучаю китайский язык.",
      minCharacters: 6,
      difficulty: "easy"
    }
  ],
  2: [
    {
      titleUz: "Uchrashuv vaqti",
      titleRu: "Время встречи",
      promptUz: "Do‘stingiz bilan qachon va qayerda uchrashishingizni ikki gapda yozing.",
      promptRu: "Напишите в двух предложениях, когда и где вы встретитесь с другом.",
      expectedKeywordsZh: ["朋友", "见面"],
      sampleAnswerZh: "明天下午我和朋友见面。我们在学校门口见。",
      sampleAnswerPinyin: "míng tiān xià wǔ wǒ hé péng you jiàn miàn. wǒ men zài xué xiào mén kǒu jiàn.",
      sampleAnswerUz: "Ertaga tushdan keyin do‘stim bilan uchrashaman. Maktab darvozasi oldida ko‘rishamiz.",
      sampleAnswerRu: "Завтра после обеда я встречусь с другом. Мы увидимся у входа в школу.",
      minCharacters: 14,
      difficulty: "easy"
    },
    {
      titleUz: "Xarid haqida",
      titleRu: "О покупке",
      promptUz: "Do‘konda nima sotib olmoqchi ekaningizni va narxini qanday so‘rashingizni yozing.",
      promptRu: "Напишите, что вы хотите купить в магазине и как спросите цену.",
      expectedKeywordsZh: ["买", "多少", "钱"],
      sampleAnswerZh: "我想买这本书。请问，多少钱？",
      sampleAnswerPinyin: "wǒ xiǎng mǎi zhè běn shū. qǐng wèn, duō shao qián?",
      sampleAnswerUz: "Men bu kitobni sotib olmoqchiman. Ayting-chi, qancha turadi?",
      sampleAnswerRu: "Я хочу купить эту книгу. Скажите, пожалуйста, сколько она стоит?",
      minCharacters: 10,
      difficulty: "easy"
    }
  ],
  3: [
    {
      titleUz: "O‘qish rejangiz",
      titleRu: "Ваш учебный план",
      promptUz: "Xitoy tilini qanday o‘rganishingiz haqida 3–4 gap yozing.",
      promptRu: "Напишите 3–4 предложения о том, как вы изучаете китайский язык.",
      expectedKeywordsZh: ["学习", "汉语", "每天"],
      sampleAnswerZh: "我每天学习汉语。我先复习生词，然后读课文。晚上我听录音，也练习说话。",
      sampleAnswerPinyin: "wǒ měi tiān xué xí hàn yǔ. wǒ xiān fù xí shēng cí, rán hòu dú kè wén. wǎn shang wǒ tīng lù yīn, yě liàn xí shuō huà.",
      sampleAnswerUz: "Men har kuni xitoy tilini o‘rganaman. Avval yangi so‘zlarni takrorlayman, keyin matn o‘qiyman. Kechqurun audio tinglab, gapirishni mashq qilaman.",
      sampleAnswerRu: "Я каждый день изучаю китайский. Сначала повторяю новые слова, затем читаю текст. Вечером слушаю запись и тренирую речь.",
      minCharacters: 24,
      difficulty: "medium"
    },
    {
      titleUz: "Sog‘lom odat",
      titleRu: "Полезная привычка",
      promptUz: "Sog‘lom bo‘lish uchun qiladigan ishlaringiz haqida qisqa matn yozing.",
      promptRu: "Напишите короткий текст о том, что вы делаете, чтобы быть здоровым.",
      expectedKeywordsZh: ["健康", "运动"],
      sampleAnswerZh: "为了身体健康，我每周运动三次。我也早睡早起，多喝水。",
      sampleAnswerPinyin: "wèi le shēn tǐ jiàn kāng, wǒ měi zhōu yùn dòng sān cì. wǒ yě zǎo shuì zǎo qǐ, duō hē shuǐ.",
      sampleAnswerUz: "Sog‘lom bo‘lish uchun haftada uch marta sport qilaman. Shuningdek, erta uxlab, erta turaman va ko‘proq suv ichaman.",
      sampleAnswerRu: "Чтобы быть здоровым, я занимаюсь спортом три раза в неделю. Ещё я рано ложусь, рано встаю и пью больше воды.",
      minCharacters: 24,
      difficulty: "medium"
    }
  ],
  4: [
    {
      titleUz: "Tanlovni asoslang",
      titleRu: "Обоснуйте выбор",
      promptUz: "Onlayn yoki an’anaviy o‘qishdan birini tanlab, sababini 4–5 gapda tushuntiring.",
      promptRu: "Выберите онлайн- или традиционное обучение и объясните причину в 4–5 предложениях.",
      expectedKeywordsZh: ["认为", "因为", "所以"],
      sampleAnswerZh: "我认为面对面学习更适合我，因为可以直接和老师交流。遇到问题时，我能马上得到帮助。所以我学习得更认真，效率也更高。",
      sampleAnswerPinyin: "wǒ rèn wéi miàn duì miàn xué xí gèng shì hé wǒ, yīn wèi kě yǐ zhí jiē hé lǎo shī jiāo liú. yù dào wèn tí shí, wǒ néng mǎ shàng dé dào bāng zhù. suǒ yǐ wǒ xué xí de gèng rèn zhēn, xiào lǜ yě gèng gāo.",
      sampleAnswerUz: "Menimcha, yuzma-yuz o‘qish menga mosroq, chunki o‘qituvchi bilan bevosita muloqot qilish mumkin. Muammo bo‘lsa, darhol yordam olaman. Shuning uchun jiddiyroq va samaraliroq o‘qiyman.",
      sampleAnswerRu: "Я считаю, что очное обучение подходит мне больше, потому что можно напрямую общаться с учителем. При трудностях я сразу получаю помощь. Поэтому учусь внимательнее и эффективнее.",
      minCharacters: 45,
      difficulty: "medium"
    },
    {
      titleUz: "Muammo va yechim",
      titleRu: "Проблема и решение",
      promptUz: "Shahardagi bitta muammo va uning yechimi haqida qisqa matn yozing.",
      promptRu: "Напишите короткий текст об одной городской проблеме и её решении.",
      expectedKeywordsZh: ["问题", "应该", "解决"],
      sampleAnswerZh: "城市里的交通问题越来越严重。大家应该多坐公共交通，也可以骑自行车。这样不但能解决堵车问题，还能保护环境。",
      sampleAnswerPinyin: "chéng shì lǐ de jiāo tōng wèn tí yuè lái yuè yán zhòng. dà jiā yīng gāi duō zuò gōng gòng jiāo tōng, yě kě yǐ qí zì xíng chē. zhè yàng bú dàn néng jiě jué dǔ chē wèn tí, hái néng bǎo hù huán jìng.",
      sampleAnswerUz: "Shahardagi transport muammosi tobora jiddiylashmoqda. Odamlar jamoat transportidan ko‘proq foydalanishi yoki velosiped minishi kerak. Bu tirbandlikni kamaytirib, atrof-muhitni ham asraydi.",
      sampleAnswerRu: "Проблема транспорта в городе становится серьёзнее. Нужно чаще пользоваться общественным транспортом или велосипедом. Это уменьшит пробки и поможет защитить окружающую среду.",
      minCharacters: 45,
      difficulty: "medium"
    }
  ],
  5: [
    {
      titleUz: "Texnologiya ta’siri",
      titleRu: "Влияние технологий",
      promptUz: "Texnologiyaning ta’limga ijobiy va salbiy ta’siri haqida 6–8 gap yozing.",
      promptRu: "Напишите 6–8 предложений о положительном и отрицательном влиянии технологий на образование.",
      expectedKeywordsZh: ["技术", "教育", "影响", "一方面", "另一方面"],
      sampleAnswerZh: "技术的发展给教育带来了很多变化。一方面，学生可以随时找到丰富的学习资料，提高学习效率。另一方面，过度依赖网络也会降低独立思考能力。因此，学校应该帮助学生合理使用技术。",
      sampleAnswerPinyin: "jì shù de fā zhǎn gěi jiào yù dài lái le hěn duō biàn huà. yì fāng miàn, xué sheng kě yǐ suí shí zhǎo dào fēng fù de xué xí zī liào, tí gāo xué xí xiào lǜ. lìng yì fāng miàn, guò dù yī lài wǎng luò yě huì jiàng dī dú lì sī kǎo néng lì. yīn cǐ, xué xiào yīng gāi bāng zhù xué sheng hé lǐ shǐ yòng jì shù.",
      sampleAnswerUz: "Texnologiya rivoji ta’limga ko‘p o‘zgarish olib keldi. Bir tomondan, o‘quvchilar boy manbalarni istalgan payt topib, samaradorlikni oshiradi. Boshqa tomondan, internetga ortiqcha tayanish mustaqil fikrlashni susaytiradi. Shu sababli texnologiyadan oqilona foydalanish kerak.",
      sampleAnswerRu: "Развитие технологий сильно изменило образование. С одной стороны, учащиеся получают доступ к богатым материалам и учатся эффективнее. С другой стороны, чрезмерная зависимость от интернета снижает самостоятельность мышления. Поэтому технологии нужно использовать разумно.",
      minCharacters: 70,
      difficulty: "hard"
    },
    {
      titleUz: "Qaror qabul qilish",
      titleRu: "Принятие решения",
      promptUz: "Muhim qaror qabul qilishda nimalarga e’tibor berish kerakligi haqida fikringizni yozing.",
      promptRu: "Напишите своё мнение о том, что важно учитывать при принятии серьёзного решения.",
      expectedKeywordsZh: ["决定", "考虑", "后果", "选择"],
      sampleAnswerZh: "做重要决定以前，我们应该全面考虑不同选择和可能的后果。除了听取别人的建议，还要了解自己的目标和能力。一个成熟的决定需要时间，也需要对结果负责。",
      sampleAnswerPinyin: "zuò zhòng yào jué dìng yǐ qián, wǒ men yīng gāi quán miàn kǎo lǜ bù tóng xuǎn zé hé kě néng de hòu guǒ. chú le tīng qǔ bié rén de jiàn yì, hái yào liǎo jiě zì jǐ de mù biāo hé néng lì. yí ge chéng shú de jué dìng xū yào shí jiān, yě xū yào duì jié guǒ fù zé.",
      sampleAnswerUz: "Muhim qarordan oldin turli tanlov va oqibatlarni har tomonlama ko‘rib chiqish kerak. Boshqalarning maslahatini tinglash bilan birga, o‘z maqsad va imkoniyatimizni bilish muhim. Yetuk qaror vaqt va mas’uliyat talab qiladi.",
      sampleAnswerRu: "Перед важным решением нужно всесторонне оценить варианты и возможные последствия. Важно не только слушать советы, но и понимать свои цели и возможности. Зрелое решение требует времени и ответственности.",
      minCharacters: 70,
      difficulty: "hard"
    }
  ],
  6: [
    {
      titleUz: "Ijtimoiy hodisani tahlil qiling",
      titleRu: "Проанализируйте общественное явление",
      promptUz: "Axborotning tez tarqalishi jamiyatga qanday ta’sir qilishini dalillar bilan tahlil qiling.",
      promptRu: "Проанализируйте с аргументами, как быстрое распространение информации влияет на общество.",
      expectedKeywordsZh: ["信息", "社会", "影响", "证据", "因此"],
      sampleAnswerZh: "信息传播速度的提高改变了社会讨论的方式。它使公众更快了解事件，也能推动问题得到关注。然而，未经证实的内容同样会迅速扩散，造成误解甚至冲突。因此，平台、媒体和个人都必须重视事实核查，并对传播行为负责。",
      sampleAnswerPinyin: "xìn xī chuán bō sù dù de tí gāo gǎi biàn le shè huì tǎo lùn de fāng shì. tā shǐ gōng zhòng gèng kuài liǎo jiě shì jiàn, yě néng tuī dòng wèn tí dé dào guān zhù. rán ér, wèi jīng zhèng shí de nèi róng tóng yàng huì xùn sù kuò sàn, zào chéng wù jiě shèn zhì chōng tū. yīn cǐ, píng tái, méi tǐ hé gè rén dōu bì xū zhòng shì shì shí hé chá, bìng duì chuán bō xíng wéi fù zé.",
      sampleAnswerUz: "Axborot tezligi jamiyatdagi muhokama usulini o‘zgartirdi. U voqealardan tez xabardor bo‘lish va muammolarga e’tibor qaratishga yordam beradi. Biroq tekshirilmagan ma’lumot ham tez tarqalib, tushunmovchilik va nizoga sabab bo‘lishi mumkin. Shu bois faktlarni tekshirish va tarqatilgan axborot uchun javobgarlik zarur.",
      sampleAnswerRu: "Скорость распространения информации изменила общественные дискуссии. Она помогает быстрее узнавать о событиях и привлекать внимание к проблемам. Но непроверенные сведения также быстро распространяются и вызывают конфликты. Поэтому необходимы проверка фактов и ответственность за публикации.",
      minCharacters: 100,
      difficulty: "hard"
    },
    {
      titleUz: "Dalilli xulosa yozing",
      titleRu: "Напишите аргументированный вывод",
      promptUz: "Ta’lim faqat bilim berishdan iboratmi? Qarama-qarshi fikrlarni ko‘rib chiqib, xulosa yozing.",
      promptRu: "Сводится ли образование только к передаче знаний? Рассмотрите разные позиции и сделайте вывод.",
      expectedKeywordsZh: ["教育", "知识", "能力", "观点", "结论"],
      sampleAnswerZh: "有人认为教育的主要任务是传授知识，因为知识是进一步发展的基础。也有人强调，教育更应该培养判断力、合作能力和责任感。实际上，这两种观点并不矛盾。高质量的教育既要提供可靠的知识，也要帮助学生形成独立思考和解决问题的能力。",
      sampleAnswerPinyin: "yǒu rén rèn wéi jiào yù de zhǔ yào rèn wù shì chuán shòu zhī shi, yīn wèi zhī shi shì jìn yí bù fā zhǎn de jī chǔ. yě yǒu rén qiáng diào, jiào yù gèng yīng gāi péi yǎng pàn duàn lì, hé zuò néng lì hé zé rèn gǎn. shí jì shang, zhè liǎng zhǒng guān diǎn bìng bù máo dùn. gāo zhì liàng de jiào yù jì yào tí gōng kě kào de zhī shi, yě yào bāng zhù xué sheng xíng chéng dú lì sī kǎo hé jiě jué wèn tí de néng lì.",
      sampleAnswerUz: "Ba’zilar ta’limning asosiy vazifasi bilim berish deb hisoblaydi. Boshqalar esa mulohaza, hamkorlik va mas’uliyatni rivojlantirish muhimligini ta’kidlaydi. Bu qarashlar zid emas: sifatli ta’lim bilim bilan birga mustaqil fikrlash va muammo yechish qobiliyatini ham shakllantiradi.",
      sampleAnswerRu: "Одни считают главной задачей образования передачу знаний. Другие подчёркивают развитие суждения, сотрудничества и ответственности. Эти позиции не противоречат друг другу: качественное образование даёт знания и одновременно формирует самостоятельное мышление и умение решать проблемы.",
      minCharacters: 100,
      difficulty: "hard"
    }
  ]
};

export const hskExamWritingPrompts: ExamWritingPrompt[] = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap((level) =>
  prompts[level].map((prompt, index) => ({
    ...prompt,
    id: `exam-writing-hsk${level}-${String(index + 1).padStart(2, "0")}`,
    level
  }))
);

export function getExamWritingPrompts(level: HSKLevel) {
  return hskExamWritingPrompts.filter((prompt) => prompt.level === level);
}
