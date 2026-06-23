import type { HSKListeningPrompt } from "@/data/hsk/contentTypes";
import { advancedScenarios } from "@/data/hsk/advancedScenarios";
import { difficultyForLevel, levels, passageQuestion, wordsFor } from "@/data/hsk/contentFactory";
import type { HSKLevel } from "@/types";

const listeningTemplates = [
  {
    tag: "single-sentence",
    titleUz: "Qisqa gap",
    titleRu: "Короткое предложение",
    zh: (a: string, b: string) => `我今天学习${a}，也复习${b}。`,
    py: (a: string, b: string) => `wǒ jīn tiān xué xí ${a}, yě fù xí ${b}.`,
    uz: (a: string, b: string) => `Men bugun “${a}” so‘zini o‘rgandim va “${b}” so‘zini takrorladim.`,
    ru: (a: string, b: string) => `Сегодня я выучил слово «${a}» и повторил слово «${b}».`,
    hintUz: "Bir kishi bugungi o‘qishi haqida gapiryapti.",
    hintRu: "Один человек говорит о сегодняшней учёбе.",
    answerUz: "u bugun o‘qiydi va takrorlaydi",
    answerRu: "он сегодня учится и повторяет",
    distractors: [
      ["u bugun xarid qiladi", "он сегодня делает покупки"],
      ["u bugun shifokorga boradi", "он сегодня идёт к врачу"],
      ["u bugun televizor sotadi", "он сегодня продаёт телевизор"]
    ]
  },
  {
    tag: "dialogue",
    titleUz: "Qisqa dialog",
    titleRu: "Короткий диалог",
    zh: (a: string, b: string) => `A：你今天忙吗？B：不忙，我想去学校学习${a}。A：好，我们一起复习${b}吧。`,
    py: (a: string, b: string) => `A: nǐ jīn tiān máng ma? B: bù máng, wǒ xiǎng qù xué xiào xué xí ${a}. A: hǎo, wǒ men yì qǐ fù xí ${b} ba.`,
    uz: (a: string, b: string) => `A bugun bandmisiz deb so‘raydi. B band emasligini, maktabga borib “${a}” ni o‘rganmoqchiligini aytadi. Keyin ular “${b}” ni birga takrorlashga kelishadi.`,
    ru: (a: string, b: string) => `A спрашивает, занят ли B сегодня. B говорит, что не занят и хочет пойти в школу учить «${a}». Затем они договариваются вместе повторить «${b}».`,
    hintUz: "Ikki kishi reja haqida gaplashyapti.",
    hintRu: "Два человека говорят о плане.",
    answerUz: "ular birga o‘qishni rejalashtiradi",
    answerRu: "они планируют учиться вместе",
    distractors: [
      ["ular uchrashuvni bekor qiladi", "они отменяют встречу"],
      ["ular restoranda ishlaydi", "они работают в ресторане"],
      ["ular aeroportga kechikadi", "они опаздывают в аэропорт"]
    ]
  },
  {
    tag: "question-answer",
    titleUz: "Savol-javob",
    titleRu: "Вопрос и ответ",
    zh: (a: string, b: string) => `老师问：这个词是什么意思？学生说：${a}的意思我知道，可是${b}还要再练习。`,
    py: (a: string, b: string) => `lǎo shī wèn: zhè ge cí shì shén me yì si? xué sheng shuō: ${a} de yì si wǒ zhī dào, kě shì ${b} hái yào zài liàn xí.`,
    uz: (a: string, b: string) => `O‘qituvchi so‘z ma’nosini so‘raydi. Talaba “${a}” ma’nosini bilishini, lekin “${b}” ni yana mashq qilishi kerakligini aytadi.`,
    ru: (a: string, b: string) => `Учитель спрашивает значение слова. Студент говорит, что знает значение «${a}», но «${b}» ещё нужно потренировать.`,
    hintUz: "Talaba qaysi so‘zni yana mashq qilishini tinglang.",
    hintRu: "Послушайте, какое слово студенту нужно повторить.",
    answerUz: "talaba bir so‘zni yana mashq qilishi kerak",
    answerRu: "студенту нужно ещё потренировать одно слово",
    distractors: [
      ["talaba hamma so‘zni unutgan", "студент забыл все слова"],
      ["o‘qituvchi darsni tugatdi", "учитель закончил урок"],
      ["talaba savol bermadi", "студент не задавал вопрос"]
    ]
  },
  {
    tag: "mini-story",
    titleUz: "Mini hikoya",
    titleRu: "Мини-история",
    zh: (a: string, b: string) => `早上小王起得很早。他喝水，吃饭，然后坐车去上课。路上他听录音，练习${a}和${b}。`,
    py: (a: string, b: string) => `zǎo shang xiǎo wáng qǐ de hěn zǎo. tā hē shuǐ, chī fàn, rán hòu zuò chē qù shàng kè. lù shang tā tīng lù yīn, liàn xí ${a} hé ${b}.`,
    uz: (a: string, b: string) => `Syao Van ertalab erta turadi. Suv ichadi, ovqatlanadi, keyin darsga boradi. Yo‘lda audio tinglab “${a}” va “${b}” ni mashq qiladi.`,
    ru: (a: string, b: string) => `Сяо Ван утром рано встаёт. Он пьёт воду, ест, потом едет на урок. По дороге слушает запись и тренирует «${a}» и «${b}».`,
    hintUz: "Qahramon yo‘lda nima qilayotganini tinglang.",
    hintRu: "Послушайте, что герой делает по дороге.",
    answerUz: "yo‘lda audio tinglab mashq qiladi",
    answerRu: "по дороге слушает аудио и тренируется",
    distractors: [
      ["yo‘lda uxlab qoladi", "по дороге засыпает"],
      ["yo‘lda ovqat sotib oladi", "по дороге покупает еду"],
      ["yo‘lda telefonini yo‘qotadi", "по дороге теряет телефон"]
    ]
  },
  {
    tag: "announcement",
    titleUz: "E’lon",
    titleRu: "Объявление",
    zh: (a: string, b: string) => `请同学们注意，今天下午三点有汉语练习。请带课本，准备${a}和${b}的例句。`,
    py: (a: string, b: string) => `qǐng tóng xué men zhù yì, jīn tiān xià wǔ sān diǎn yǒu hàn yǔ liàn xí. qǐng dài kè běn, zhǔn bèi ${a} hé ${b} de lì jù.`,
    uz: (a: string, b: string) => `Diqqat: bugun tushdan keyin soat uchda xitoy tili mashqi bor. Darslik olib kelish va “${a}”, “${b}” uchun misol gap tayyorlash kerak.`,
    ru: (a: string, b: string) => `Внимание: сегодня в три часа дня будет практика китайского. Нужно принести учебник и подготовить примеры со словами «${a}» и «${b}».`,
    hintUz: "Vaqt va tayyorgarlik talabini tinglang.",
    hintRu: "Послушайте время и требования к подготовке.",
    answerUz: "soat uchda xitoy tili mashqi bor",
    answerRu: "в три часа практика китайского",
    distractors: [
      ["ertalab sakkizda sport bor", "в восемь утра спорт"],
      ["kechqurun kino ko‘rish bor", "вечером просмотр фильма"],
      ["darslik olib kelish shart emas", "учебник приносить не нужно"]
    ]
  },
  {
    tag: "exam-style",
    titleUz: "Imtihon uslubidagi audio",
    titleRu: "Аудио в стиле экзамена",
    zh: (a: string, b: string) => `女：你为什么每天复习？男：因为我下个月要参加HSK练习测试。我想把${a}和${b}用得更自然。`,
    py: (a: string, b: string) => `nǚ: nǐ wèi shén me měi tiān fù xí? nán: yīn wèi wǒ xià ge yuè yào cān jiā HSK liàn xí cè shì. wǒ xiǎng bǎ ${a} hé ${b} yòng de gèng zì rán.`,
    uz: (a: string, b: string) => `Ayol nima uchun har kuni takrorlashini so‘raydi. Erkak keyingi oy HSK tayyorgarlik testida qatnashishini va “${a}”, “${b}” so‘zlarini tabiiyroq ishlatmoqchiligini aytadi.`,
    ru: (a: string, b: string) => `Женщина спрашивает, почему он повторяет каждый день. Мужчина говорит, что в следующем месяце будет тренировочный тест HSK, и он хочет естественнее использовать «${a}», «${b}».`,
    hintUz: "Nima uchun takrorlayotganini tinglang.",
    hintRu: "Послушайте, зачем он повторяет.",
    answerUz: "HSK tayyorgarlik testiga tayyorlanyapti",
    answerRu: "готовится к тренировочному тесту HSK",
    distractors: [
      ["u ish uchrashuviga tayyorlanyapti", "он готовится к рабочей встрече"],
      ["u sayohat chiptasini qidiryapti", "он ищет билет для поездки"],
      ["u xitoycha o‘qishni to‘xtatmoqchi", "он хочет прекратить учить китайский"]
    ]
  }
];

const targetCounts: Record<HSKLevel, number> = { 1: 12, 2: 12, 3: 8, 4: 0, 5: 0, 6: 0 };

const foundationalListeningContent: HSKListeningPrompt[] = levels.flatMap((level) =>
  Array.from({ length: targetCounts[level] }, (_, index) => {
    const template = listeningTemplates[(index + level - 1) % listeningTemplates.length];
    const [first, second] = wordsFor(level, 2, index * 2);
    const firstZh = first?.hanzi ?? "汉语";
    const secondZh = second?.hanzi ?? "学习";
    const firstPy = first?.pinyin ?? "hàn yǔ";
    const secondPy = second?.pinyin ?? "xué xí";

    return {
      id: `listening-hsk${level}-${String(index + 1).padStart(2, "0")}`,
      level,
      titleUz: `HSK ${level}: ${template.titleUz}`,
      titleRu: `HSK ${level}: ${template.titleRu}`,
      audioTextZh: template.zh(firstZh, secondZh),
      audioTextPinyin: template.py(firstPy, secondPy),
      transcriptUz: template.uz(first?.uz ?? "yangi so‘z", second?.uz ?? "mashq"),
      transcriptRu: template.ru(first?.ru ?? "новое слово", second?.ru ?? "практика"),
      speakerHintUz: template.hintUz,
      speakerHintRu: template.hintRu,
      vocabularyIds: [first?.id, second?.id].filter(Boolean) as string[],
      questions: [
        passageQuestion({
          id: `listening-hsk${level}-${String(index + 1).padStart(2, "0")}-q1`,
          level,
          questionUz: "Eshitgan matnga mos javobni tanlang.",
          questionRu: "Выберите ответ по услышанному тексту.",
          correctUz: template.answerUz,
          correctRu: template.answerRu,
          explanationUz: `Audio mazmuni “${template.answerUz}” degan fikrni beradi. Noto‘g‘ri variantlar audiodagi vaqt, harakat yoki maqsadga mos emas.`,
          explanationRu: `Смысл аудио: «${template.answerRu}». Неверные варианты не совпадают с временем, действием или целью в аудио.`,
          distractors: template.distractors.map(([uz, ru]) => ({ uz, ru }))
        })
      ],
      replayLimit: index % 2 === 0 ? 2 : 3,
      difficulty: difficultyForLevel(level),
      estimatedMinutes: level <= 2 ? 4 : level <= 4 ? 6 : 8,
      tags: [template.tag, `hsk-${level}`, "listening"]
    };
  })
);

const advancedListeningContent: HSKListeningPrompt[] = advancedScenarios.map((scenario, index) => {
  const itemNumber = advancedScenarios.filter((item) => item.level === scenario.level).findIndex((item) => item.id === scenario.id) + 1;
  return {
    id: `listening-hsk${scenario.level}-${String(itemNumber).padStart(2, "0")}`,
    level: scenario.level,
    titleUz: `HSK ${scenario.level}: ${scenario.titleUz}`,
    titleRu: `HSK ${scenario.level}: ${scenario.titleRu}`,
    audioTextZh: `主持人：请介绍一下你的看法。嘉宾：${scenario.summaryZh}`,
    audioTextPinyin: `zhǔ chí rén: qǐng jiè shào yí xià nǐ de kàn fǎ. jiā bīn: ${scenario.summaryPinyin}`,
    transcriptUz: `Boshlovchi fikr bildirishni so‘raydi. Mehmon shunday deydi: ${scenario.summaryUz}`,
    transcriptRu: `Ведущий просит высказать мнение. Гость отвечает: ${scenario.summaryRu}`,
    speakerHintUz: "Mehmonning asosiy xulosasiga e’tibor bering.",
    speakerHintRu: "Обратите внимание на главный вывод гостя.",
    vocabularyIds: wordsFor(scenario.level, 3, index * 3 + 1).map((word) => word.id),
    questions: [
      passageQuestion({
        id: `listening-${scenario.id}-q1`,
        level: scenario.level,
        questionUz: "Mehmonning asosiy fikrini tanlang.",
        questionRu: "Выберите главную мысль гостя.",
        correctUz: scenario.summaryUz,
        correctRu: scenario.summaryRu,
        explanationUz: `Audio xulosasi: ${scenario.summaryUz}`,
        explanationRu: `Вывод аудио: ${scenario.summaryRu}`
      })
    ],
    replayLimit: scenario.level === 6 ? 2 : 3,
    difficulty: difficultyForLevel(scenario.level),
    estimatedMinutes: scenario.level === 4 ? 7 : scenario.level === 5 ? 9 : 11,
    tags: [scenario.tag, `hsk-${scenario.level}`, "listening", "original"]
  };
});

export const hskListeningContent: HSKListeningPrompt[] = [...foundationalListeningContent, ...advancedListeningContent];

export function getListeningByLevel(level: HSKLevel) {
  return hskListeningContent.filter((item) => item.level === level);
}
