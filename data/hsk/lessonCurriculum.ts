import { hskCentralGrammar } from "@/data/hsk/grammar";
import { hskListeningContent } from "@/data/hsk/listening";
import { hskQuizQuestions } from "@/data/hsk/quizQuestions";
import { hskReadingContent } from "@/data/hsk/reading";
import { hskSpeakingTasks } from "@/data/hsk/speakingTasks";
import { vocabularyEntries } from "@/data/hsk/vocabulary";
import type { HSKLevel } from "@/types";

export type LessonSkillFocus = "vocabulary" | "grammar" | "reading" | "listening" | "speaking" | "writing";

export type HSKLessonCurriculum = {
  id: string;
  level: HSKLevel;
  order: number;
  titleUz: string;
  titleRu: string;
  descriptionUz: string;
  descriptionRu: string;
  vocabularyIds: string[];
  grammarIds: string[];
  readingIds: string[];
  listeningIds: string[];
  speakingTaskIds: string[];
  quizQuestionIds: string[];
  estimatedMinutes: number;
  skillFocus: LessonSkillFocus[];
  isPremium?: boolean;
};

const lessonTargets: Record<HSKLevel, number> = { 1: 20, 2: 24, 3: 24, 4: 24, 5: 20, 6: 20 };

const themes: Record<HSKLevel, Array<[uz: string, ru: string]>> = {
  1: [
    ["Salomlashish va tanishuv", "Приветствие и знакомство"],
    ["Oila va odamlar", "Семья и люди"],
    ["Sonlar va yosh", "Числа и возраст"],
    ["Vaqt va kun tartibi", "Время и распорядок"],
    ["Maktab va o‘qish", "Школа и учёба"],
    ["Ovqat va ichimlik", "Еда и напитки"],
    ["Uy va buyumlar", "Дом и предметы"],
    ["Joy va yo‘nalish", "Место и направление"],
    ["Ob-havo va kiyim", "Погода и одежда"],
    ["Kundalik harakatlar", "Ежедневные действия"]
  ],
  2: [
    ["Kundalik suhbat", "Повседневный разговор"],
    ["Oila va munosabatlar", "Семья и отношения"],
    ["Vaqt va uchrashuv", "Время и встреча"],
    ["Do‘kon va narx", "Магазин и цена"],
    ["Transport va yo‘l", "Транспорт и дорога"],
    ["Ish va kasblar", "Работа и профессии"],
    ["Sog‘liq va tana", "Здоровье и тело"],
    ["Sport va dam olish", "Спорт и отдых"],
    ["Ob-havo va fasllar", "Погода и сезоны"],
    ["Taqqoslash", "Сравнение"],
    ["Reja va tayyorgarlik", "Планы и подготовка"],
    ["Qisqa dialoglar", "Короткие диалоги"]
  ],
  3: [
    ["Shaxsiy rejalar", "Личные планы"],
    ["Fikr va hislar", "Мнения и чувства"],
    ["Ish kuni", "Рабочий день"],
    ["O‘qish strategiyasi", "Стратегия учёбы"],
    ["Sog‘lom hayot", "Здоровый образ жизни"],
    ["Sayohat tayyorgarligi", "Подготовка к поездке"],
    ["Shahar hayoti", "Жизнь в городе"],
    ["Xizmat va xarid", "Услуги и покупки"],
    ["Tabiat va fasllar", "Природа и сезоны"],
    ["Tajriba va xotira", "Опыт и воспоминания"],
    ["Muammo va yechim", "Проблема и решение"],
    ["Qisqa hikoyalar", "Короткие истории"]
  ],
  4: [
    ["Sabab va natija", "Причина и следствие"],
    ["Taqqoslash va tanlov", "Сравнение и выбор"],
    ["Fikrni asoslash", "Обоснование мнения"],
    ["Ishdagi muloqot", "Общение на работе"],
    ["Ta’lim va maqsad", "Образование и цель"],
    ["Sog‘liq va odatlar", "Здоровье и привычки"],
    ["Safar va xizmat", "Поездка и сервис"],
    ["Jamiyat va qoida", "Общество и правила"],
    ["Media va reklama", "Медиа и реклама"],
    ["Madaniyat va an’ana", "Культура и традиции"],
    ["Jarayonni tushuntirish", "Описание процесса"],
    ["Kengaytirilgan dialog", "Расширенный диалог"]
  ],
  5: [
    ["Ta’lim va rivojlanish", "Образование и развитие"],
    ["Jamiyat va mas’uliyat", "Общество и ответственность"],
    ["Madaniyat va qadriyat", "Культура и ценности"],
    ["Media va axborot", "Медиа и информация"],
    ["Ish va boshqaruv", "Работа и управление"],
    ["Texnologiya va o‘zgarish", "Технологии и перемены"],
    ["Sog‘liq va turmush", "Здоровье и образ жизни"],
    ["Atrof-muhit", "Окружающая среда"],
    ["Munozara va dalil", "Дискуссия и аргумент"],
    ["Murakkab matn tahlili", "Анализ сложного текста"]
  ],
  6: [
    ["Rasmiy nutq", "Официальная речь"],
    ["Dalillash va xulosa", "Аргументация и вывод"],
    ["Jamiyatdagi jarayonlar", "Общественные процессы"],
    ["Madaniy tahlil", "Культурный анализ"],
    ["Ilm va innovatsiya", "Наука и инновации"],
    ["Iqtisod va boshqaruv", "Экономика и управление"],
    ["Huquq va mas’uliyat", "Право и ответственность"],
    ["Nuans va yashirin ma’no", "Нюанс и скрытый смысл"],
    ["Esse tuzilishi", "Структура эссе"],
    ["Ilg‘or matn tahlili", "Продвинутый анализ текста"]
  ]
};

function takeCircular<T>(items: T[], start: number, count: number) {
  if (!items.length) return [];
  return Array.from({ length: Math.min(count, items.length) }, (_, index) => items[(start + index) % items.length]);
}

function buildLessons(level: HSKLevel): HSKLessonCurriculum[] {
  const vocabulary = vocabularyEntries.filter((item) => item.level === level);
  const grammar = hskCentralGrammar.filter((item) => item.level === level);
  const reading = hskReadingContent.filter((item) => item.level === level);
  const listening = hskListeningContent.filter((item) => item.level === level);
  const speaking = hskSpeakingTasks.filter((item) => item.level === level);
  const quiz = hskQuizQuestions.filter((item) => item.level === level);
  const levelThemes = themes[level];

  return Array.from({ length: lessonTargets[level] }, (_, index) => {
    const order = index + 1;
    const [themeUz, themeRu] = levelThemes[index % levelThemes.length];
    const cycle = Math.floor(index / levelThemes.length);
    const phaseUz = cycle === 0 ? "Asoslar" : "Amaliyot";
    const phaseRu = cycle === 0 ? "Основы" : "Практика";
    const vocabularyIds = takeCircular(vocabulary, index * 7, 8).map((item) => item.id);
    return {
      id: `hsk${level}-lesson-${String(order).padStart(2, "0")}`,
      level,
      order,
      titleUz: `${order}-dars: ${themeUz}`,
      titleRu: `Урок ${order}: ${themeRu}`,
      descriptionUz: `${phaseUz}: so‘zlar, grammatika va to‘rtta asosiy ko‘nikmani bitta izchil darsda mashq qiling.`,
      descriptionRu: `${phaseRu}: изучайте слова, грамматику и четыре основных навыка в одном последовательном уроке.`,
      vocabularyIds,
      grammarIds: takeCircular(grammar, index, level >= 4 ? 2 : 1).map((item) => item.id),
      readingIds: takeCircular(reading, index, 1).map((item) => item.id),
      listeningIds: takeCircular(listening, index, 1).map((item) => item.id),
      speakingTaskIds: takeCircular(speaking, index, 1).map((item) => item.id),
      quizQuestionIds: takeCircular(quiz, index * 5, level <= 2 ? 5 : 7).map((item) => item.id),
      estimatedMinutes: level <= 2 ? 18 : level <= 4 ? 24 : 30,
      skillFocus: index % 4 === 3
        ? ["vocabulary", "grammar", "reading", "listening", "speaking", "writing"]
        : ["vocabulary", "grammar", "reading", "listening", "speaking"],
      isPremium: level > 1
    };
  });
}

export const hskLessonCurriculum = ([1, 2, 3, 4, 5, 6] as HSKLevel[]).flatMap(buildLessons);

export function getCurriculumLessonsByLevel(level: HSKLevel) {
  return hskLessonCurriculum.filter((lesson) => lesson.level === level);
}

export function getCurriculumLesson(level: HSKLevel, lessonId: string) {
  return hskLessonCurriculum.find((lesson) => lesson.level === level && lesson.id === lessonId);
}
