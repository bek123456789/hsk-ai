import type { HSKSpeakingTask } from "@/data/hsk/contentTypes";
import { advancedScenarios } from "@/data/hsk/advancedScenarios";
import { difficultyForLevel, levels, wordsFor } from "@/data/hsk/contentFactory";
import type { HSKLevel } from "@/types";

const speakingTemplates = [
  {
    type: "retell" as const,
    tag: "retell",
    titleUz: "Matn mazmunini aytish",
    titleRu: "Пересказ текста",
    instructionUz: "Matnni o‘qing va mazmunini xitoycha qisqa aytib bering.",
    instructionRu: "Прочитайте текст и кратко перескажите смысл на китайском.",
    zh: (a: string, b: string) => `我今天在学校学习汉语。老师教了${a}，也让我们用${b}造句。下课以后，我和朋友一起复习。`,
    py: (a: string, b: string) => `wǒ jīn tiān zài xué xiào xué xí hàn yǔ. lǎo shī jiāo le ${a}, yě ràng wǒ men yòng ${b} zào jù. xià kè yǐ hòu, wǒ hé péng you yì qǐ fù xí.`,
    uz: (a: string, b: string) => `Bugun men maktabda xitoy tilini o‘rgandim. O‘qituvchi “${a}” ni tushuntirdi va “${b}” bilan gap tuzishni so‘radi. Darsdan keyin do‘stim bilan takrorladim.`,
    ru: (a: string, b: string) => `Сегодня я изучал китайский в школе. Учитель объяснил «${a}» и попросил составить предложение со словом «${b}». После урока я повторял с другом.`,
    sampleZh: "我在学校学习汉语，老师教新词，我和朋友一起复习。",
    samplePy: "wǒ zài xué xiào xué xí hàn yǔ, lǎo shī jiāo xīn cí, wǒ hé péng you yì qǐ fù xí.",
    meaningUz: "O‘quvchi maktabda xitoy tili o‘rganadi, yangi so‘zlarni ishlatadi va do‘sti bilan takrorlaydi.",
    meaningRu: "Учащийся изучает китайский в школе, использует новые слова и повторяет с другом."
  },
  {
    type: "dialogue_summary" as const,
    tag: "dialogue",
    titleUz: "Dialog mazmuni",
    titleRu: "Смысл диалога",
    instructionUz: "Dialogni o‘qing va kim nima qilmoqchi ekanini xitoycha ayting.",
    instructionRu: "Прочитайте диалог и скажите по-китайски, кто что собирается делать.",
    zh: (a: string, b: string) => `A：周末你做什么？B：我想去图书馆学习${a}。A：我也去，我们可以一起练习${b}。`,
    py: (a: string, b: string) => `A: zhōu mò nǐ zuò shén me? B: wǒ xiǎng qù tú shū guǎn xué xí ${a}. A: wǒ yě qù, wǒ men kě yǐ yì qǐ liàn xí ${b}.`,
    uz: (a: string, b: string) => `A dam olish kuni nima qilasan deb so‘raydi. B kutubxonaga borib “${a}” ni o‘rganmoqchi. A ham borib “${b}” ni birga mashq qilishni taklif qiladi.`,
    ru: (a: string, b: string) => `A спрашивает, что B будет делать в выходные. B хочет пойти в библиотеку учить «${a}». A тоже пойдёт и предлагает вместе тренировать «${b}».`,
    sampleZh: "他们周末去图书馆学习，也一起练习汉语。",
    samplePy: "tā men zhōu mò qù tú shū guǎn xué xí, yě yì qǐ liàn xí hàn yǔ.",
    meaningUz: "Ikki kishi dam olish kuni kutubxonada o‘qish va birga mashq qilish haqida kelishadi.",
    meaningRu: "Два человека договариваются в выходные учиться в библиотеке и тренироваться вместе."
  },
  {
    type: "daily_situation" as const,
    tag: "daily-situation",
    titleUz: "Kundalik vaziyat",
    titleRu: "Ежедневная ситуация",
    instructionUz: "Vaziyatni tushunib, javobni xitoycha ayting.",
    instructionRu: "Поймите ситуацию и ответьте по-китайски.",
    zh: (a: string, b: string) => `你在商店买东西。你想问价格，也想说明你要买${a}，不要${b}。`,
    py: (a: string, b: string) => `nǐ zài shāng diàn mǎi dōng xi. nǐ xiǎng wèn jià gé, yě xiǎng shuō míng nǐ yào mǎi ${a}, bú yào ${b}.`,
    uz: (a: string, b: string) => `Siz do‘kondasiz. Narxni so‘rashingiz, “${a}” ni olmoqchi ekaningizni va “${b}” kerak emasligini aytishingiz kerak.`,
    ru: (a: string, b: string) => `Вы в магазине. Нужно спросить цену, сказать, что хотите купить «${a}», а «${b}» не нужно.`,
    sampleZh: "这个多少钱？我要买这个，不要那个。",
    samplePy: "zhè ge duō shao qián? wǒ yào mǎi zhè ge, bú yào nà ge.",
    meaningUz: "Foydalanuvchi do‘konda narx so‘raydi va nimani sotib olishini aytadi.",
    meaningRu: "Пользователь в магазине спрашивает цену и говорит, что хочет купить."
  },
  {
    type: "opinion" as const,
    tag: "opinion",
    titleUz: "Fikr bildirish",
    titleRu: "Выражение мнения",
    instructionUz: "Matndagi fikrni xitoycha umumlashtiring va qisqa fikringizni qo‘shing.",
    instructionRu: "Кратко перескажите мысль текста на китайском и добавьте своё мнение.",
    zh: (a: string, b: string) => `有些学生喜欢每天背单词，有些学生喜欢通过句子学习。我觉得两种方法都重要，因为${a}和${b}只有在真实表达中才容易记住。`,
    py: (a: string, b: string) => `yǒu xiē xué sheng xǐ huan měi tiān bèi dān cí, yǒu xiē xué sheng xǐ huan tōng guò jù zi xué xí. wǒ jué de liǎng zhǒng fāng fǎ dōu zhòng yào, yīn wèi ${a} hé ${b} zhǐ yǒu zài zhēn shí biǎo dá zhōng cái róng yì jì zhù.`,
    uz: (a: string, b: string) => `Ba’zi talabalar har kuni so‘z yodlashni, boshqalar gap orqali o‘rganishni yoqtiradi. Menimcha, ikkala usul ham muhim, chunki “${a}” va “${b}” haqiqiy ifodada osonroq esda qoladi.`,
    ru: (a: string, b: string) => `Некоторые студенты любят каждый день учить слова, другие — учиться через предложения. Я думаю, оба способа важны, потому что «${a}» и «${b}» легче запомнить в реальном выражении.`,
    sampleZh: "我觉得背单词和造句都重要，真实表达可以帮助记忆。",
    samplePy: "wǒ jué de bèi dān cí hé zào jù dōu zhòng yào, zhēn shí biǎo dá kě yǐ bāng zhù jì yì.",
    meaningUz: "So‘z yodlash va gaplarda ishlatish birga foydali ekani aytiladi.",
    meaningRu: "Говорится, что полезно и учить слова, и использовать их в предложениях."
  },
  {
    type: "picture_like_prompt" as const,
    tag: "exam-speaking",
    titleUz: "Imtihon speaking",
    titleRu: "Экзаменационное говорение",
    instructionUz: "Tasavvur qilingan rasmni xitoycha tasvirlang: odamlar qayerda va nima qilyapti?",
    instructionRu: "Опишите воображаемую картинку по-китайски: где люди и что они делают?",
    zh: (a: string, b: string) => `图里有两个学生。他们坐在教室里，一个人在读书，另一个人在写${a}。桌子上有水和${b}。`,
    py: (a: string, b: string) => `tú lǐ yǒu liǎng ge xué sheng. tā men zuò zài jiào shì lǐ, yí ge rén zài dú shū, lìng yí ge rén zài xiě ${a}. zhuō zi shang yǒu shuǐ hé ${b}.`,
    uz: (a: string, b: string) => `Tasavvur qilingan rasmda ikki talaba sinfda o‘tirgan. Biri kitob o‘qiyapti, boshqasi “${a}” yozmoqda. Stol ustida suv va “${b}” bor.`,
    ru: (a: string, b: string) => `На воображаемой картинке два студента сидят в классе. Один читает книгу, другой пишет «${a}». На столе вода и «${b}».`,
    sampleZh: "图里有两个学生，他们在教室学习，一个读书，一个写字。",
    samplePy: "tú lǐ yǒu liǎng ge xué sheng, tā men zài jiào shì xué xí, yí ge dú shū, yí ge xiě zì.",
    meaningUz: "Ikki talaba sinfda o‘qiyotgani va buyumlar tasvirlanadi.",
    meaningRu: "Описываются два студента в классе и предметы на столе."
  }
];

const targetCounts: Record<HSKLevel, number> = { 1: 10, 2: 10, 3: 6, 4: 0, 5: 0, 6: 0 };

const foundationalSpeakingTasks: HSKSpeakingTask[] = levels.flatMap((level) =>
  Array.from({ length: targetCounts[level] }, (_, index) => {
    const template = speakingTemplates[(index + level - 1) % speakingTemplates.length];
    const [first, second] = wordsFor(level, 2, index * 2);
    const firstZh = first?.hanzi ?? "汉语";
    const secondZh = second?.hanzi ?? "学习";
    const firstPy = first?.pinyin ?? "hàn yǔ";
    const secondPy = second?.pinyin ?? "xué xí";

    return {
      id: `speaking-hsk${level}-${String(index + 1).padStart(2, "0")}`,
      level,
      type: template.type,
      titleUz: `HSK ${level}: ${template.titleUz}`,
      titleRu: `HSK ${level}: ${template.titleRu}`,
      instructionUz: template.instructionUz,
      instructionRu: template.instructionRu,
      textZh: template.zh(firstZh, secondZh),
      textPinyin: template.py(firstPy, secondPy),
      textUz: template.uz(first?.uz ?? "yangi so‘z", second?.uz ?? "mashq"),
      textRu: template.ru(first?.ru ?? "новое слово", second?.ru ?? "практика"),
      expectedMeaningUz: template.meaningUz,
      expectedMeaningRu: template.meaningRu,
      sampleAnswerZh: template.sampleZh,
      sampleAnswerPinyin: template.samplePy,
      sampleAnswerUz: template.meaningUz,
      sampleAnswerRu: template.meaningRu,
      keywordsZh: [firstZh, secondZh, "学习", "复习"].filter((value, itemIndex, array) => array.indexOf(value) === itemIndex),
      allowedAnswerHintsZh: [firstZh, secondZh, "学校", "朋友", "练习"],
      difficulty: difficultyForLevel(level),
      estimatedMinutes: level <= 2 ? 5 : level <= 4 ? 7 : 9,
      tags: [template.tag, `hsk-${level}`, "speaking"]
    };
  })
);

const advancedSpeakingTargets: Record<4 | 5 | 6, number> = { 4: 10, 5: 8, 6: 6 };

const advancedSpeakingTasks: HSKSpeakingTask[] = advancedScenarios
  .filter((scenario) => {
    const position = advancedScenarios.filter((item) => item.level === scenario.level).findIndex((item) => item.id === scenario.id);
    return position < advancedSpeakingTargets[scenario.level];
  })
  .map((scenario) => {
    const itemNumber = advancedScenarios.filter((item) => item.level === scenario.level).findIndex((item) => item.id === scenario.id) + 1;
    return {
      id: `speaking-hsk${scenario.level}-${String(itemNumber).padStart(2, "0")}`,
      level: scenario.level,
      type: scenario.speakingType,
      titleUz: `HSK ${scenario.level}: ${scenario.titleUz}`,
      titleRu: `HSK ${scenario.level}: ${scenario.titleRu}`,
      instructionUz: "Matnni o‘qing, asosiy fikrni xitoycha ayting va qisqa izoh qo‘shing.",
      instructionRu: "Прочитайте текст, передайте главную мысль по-китайски и добавьте краткий комментарий.",
      textZh: scenario.passageZh,
      textPinyin: scenario.passagePinyin,
      textUz: scenario.passageUz,
      textRu: scenario.passageRu,
      expectedMeaningUz: scenario.summaryUz,
      expectedMeaningRu: scenario.summaryRu,
      sampleAnswerZh: scenario.summaryZh,
      sampleAnswerPinyin: scenario.summaryPinyin,
      sampleAnswerUz: scenario.summaryUz,
      sampleAnswerRu: scenario.summaryRu,
      keywordsZh: scenario.keywordsZh,
      allowedAnswerHintsZh: [...scenario.keywordsZh, "因为", "所以", "我认为"],
      difficulty: difficultyForLevel(scenario.level),
      estimatedMinutes: scenario.level === 4 ? 8 : scenario.level === 5 ? 10 : 12,
      tags: [scenario.tag, `hsk-${scenario.level}`, "speaking", "original"]
    };
  });

export const hskSpeakingTasks: HSKSpeakingTask[] = [...foundationalSpeakingTasks, ...advancedSpeakingTasks];

export function getSpeakingTasksByLevel(level: HSKLevel) {
  return hskSpeakingTasks.filter((task) => task.level === level);
}

export function getSpeakingTaskById(taskId: string) {
  return hskSpeakingTasks.find((task) => task.id === taskId);
}
