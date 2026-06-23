"use client";

import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Crown,
  Flame,
  GraduationCap,
  Headphones,
  Map,
  Mic,
  NotebookTabs,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Zap,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { BrandLogo } from "@/components/BrandLogo";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getCurriculumLessonsByLevel } from "@/data/hsk/lessonCurriculum";
import { vocabularyEntries } from "@/data/hsk/vocabulary";
import { hskWords } from "@/data/hskWords";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { AppLanguage, HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { calculateLessonProgress, getAllLessonProgressRecords } from "@/utils/lessonPlanner";
import { isPremiumProfile } from "@/utils/premium";
import { getBestExamScore, getUnlockedHskLevels, HSK_PASSING_SCORE } from "@/utils/hskUnlock";
import { getCurrentAvailableLesson, getLevelCompletionStatus } from "@/utils/lessonUnlock";
import { getReviewQueue } from "@/utils/spacedReview";

type LocalizedText = {
  uz: string;
  ru: string;
  en: string;
};

type QuickAction = LocalizedText & {
  href: string;
  icon: LucideIcon;
  tone: string;
};

type DailyTask = LocalizedText & {
  id: string;
  href: string;
  detailUz: string;
  detailRu: string;
  detailEn: string;
  icon: LucideIcon;
};

const quickActions: QuickAction[] = [
  { href: "/learning-path", uz: "O‘quv yo‘li", ru: "Учебный путь", en: "Learning Path", icon: Map, tone: "bg-orange-50 text-orange-700" },
  { href: "/review", uz: "Aqlli takrorlash", ru: "Умное повторение", en: "Smart Review", icon: RotateCcw, tone: "bg-skysoft text-sky-700" },
  { href: "/tone-trainer", uz: "Tonlar", ru: "Тоны", en: "Tones", icon: Headphones, tone: "bg-violet-50 text-violet-700" },
  { href: "/hanzi-builder", uz: "Hanzi Builder", ru: "Hanzi Builder", en: "Hanzi Builder", icon: NotebookTabs, tone: "bg-orange-soft text-orange-deep" },
  { href: "/sentence-builder", uz: "Gaplar", ru: "Предложения", en: "Sentences", icon: Brain, tone: "bg-emerald-50 text-emerald-700" },
  { href: "/roleplay", uz: "Vaziyatlar", ru: "Ситуации", en: "Roleplay", icon: Mic, tone: "bg-rose-50 text-rose-700" },
  { href: "/sprint", uz: "HSK Sprint", ru: "HSK Sprint", en: "HSK Sprint", icon: Flame, tone: "bg-amber-100 text-amber-700" },
  { href: "/exam", uz: "Tayyorlik", ru: "Готовность", en: "Readiness", icon: Trophy, tone: "bg-orange-50 text-orange-700" }
];

function localizedText(item: LocalizedText, language: AppLanguage) {
  if (language === "ru") return item.ru;
  if (language === "en") return item.en;
  return item.uz;
}

function localizedDetail(item: DailyTask, language: AppLanguage) {
  if (language === "ru") return item.detailRu;
  if (language === "en") return item.detailEn;
  return item.detailUz;
}

function getLocalDateKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(new Date());
}

function getDisplayName(name: string | undefined, language: AppLanguage) {
  const candidate = name?.trim().split(/\s+/)[0] ?? "";
  const looksLikePlaceholder = !candidate || /^(h+|test|demo|user|admin|name)$/i.test(candidate);
  if (looksLikePlaceholder) return language === "ru" ? "ученик" : "o‘quvchi";
  return candidate.charAt(0).toUpperCase() + candidate.slice(1);
}

function QuickActionCard({ action, language, level }: { action: QuickAction; language: AppLanguage; level: HSKLevel }) {
  const href = action.href.endsWith("/1") ? action.href.replace(/\/1$/, `/${level}`) : action.href;
  const Icon = action.icon;

  return (
    <Link
      href={href}
      className="warm-focus group flex min-h-[96px] min-w-0 items-center gap-3 rounded-[1.4rem] border border-stone-200/70 bg-white/90 p-3.5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-orange-soft hover:shadow-card"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${action.tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1 whitespace-normal break-words text-sm font-black leading-5 text-ink">{localizedText(action, language)}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-orange-brand" />
    </Link>
  );
}

function DailyTaskRow({ task, language, done }: { task: DailyTask; language: AppLanguage; done: boolean }) {
  const Icon = task.icon;

  return (
    <Link
      href={task.href}
      className="warm-focus group flex items-center gap-3 rounded-[1.4rem] border border-stone-200/70 bg-white/85 p-3.5 transition hover:border-orange-soft hover:bg-orange-50/40"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${done ? "bg-emerald-100 text-emerald-700" : "bg-orange-soft text-orange-deep"}`}>
        {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm font-black leading-5 text-ink">{localizedText(task, language)}</span>
        <span className="mt-0.5 block break-words text-xs font-bold text-stone-500">{localizedDetail(task, language)}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-orange-brand" />
    </Link>
  );
}

function DashboardHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase text-orange-deep">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-black leading-tight text-ink sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default function DashboardPage() {
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const wordReviews = useProgressStore((state) => state.wordReviews);
  const quizResults = useProgressStore((state) => state.quizResults);
  const mistakes = useProgressStore((state) => state.mistakes);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const storeCurrentLevel = useProgressStore((state) => state.currentLevel);
  const xp = useProgressStore((state) => state.xp);
  const streak = useProgressStore((state) => state.streak);
  const dailyPlanCompletions = useProgressStore((state) => state.dailyPlanCompletions);
  const user = useAuthStore((state) => state.user);
  const { language } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [progressRevision, setProgressRevision] = useState(0);

  useEffect(() => {
    setMounted(true);
    const refreshTimer = window.setTimeout(() => setProgressRevision((value) => value + 1), 1200);
    return () => window.clearTimeout(refreshTimer);
  }, []);

  const unlockedLevels = getUnlockedHskLevels({ knownWordIds }, examAttempts);
  const requestedLevel = (user?.currentHSKLevel ?? storeCurrentLevel ?? 1) as HSKLevel;
  const baseLevel = (unlockedLevels.includes(requestedLevel) ? requestedLevel : unlockedLevels.at(-1) ?? 1) as HSKLevel;
  const highestUnlockedLevel = (unlockedLevels.at(-1) ?? 1) as HSKLevel;
  const currentLevel = highestUnlockedLevel > baseLevel ? highestUnlockedLevel : baseLevel;
  const lessons = useMemo(() => getCurriculumLessonsByLevel(currentLevel), [currentLevel]);
  const allLessonProgress = mounted ? getAllLessonProgressRecords() : {};
  const levelWords = useMemo(() => vocabularyEntries.filter((word) => word.level === currentLevel), [currentLevel]);
  const learnedLevelWords = levelWords.filter((word) => knownWordIds.includes(word.id)).length;
  const vocabularyProgress = Math.round((learnedLevelWords / Math.max(1, levelWords.length)) * 100);
  const levelStatus = mounted ? getLevelCompletionStatus(currentLevel, { knownWordIds, lessonProgress: allLessonProgress }) : { total: lessons.length, completed: 0, allCompleted: false, currentLesson: lessons[0] ?? null, progressPercent: 0 };
  const completedLessons = levelStatus.completed;
  const lessonProgress = levelStatus.progressPercent;
  const nextLesson = mounted ? getCurrentAvailableLesson(currentLevel, { knownWordIds, lessonProgress: allLessonProgress }) : lessons[0];
  const nextLessonProgress = mounted && nextLesson ? calculateLessonProgress(nextLesson, knownWordIds) : 0;
  const currentExamPassed = getBestExamScore(currentLevel, examAttempts) >= HSK_PASSING_SCORE;
  const nextLevel = currentLevel < 6 ? ((currentLevel + 1) as HSKLevel) : currentLevel;
  const nextLessonHref = nextLesson
    ? `/lesson/${currentLevel}/${nextLesson.id}`
    : currentExamPassed && currentLevel < 6
      ? `/lesson/${nextLevel}/${getCurriculumLessonsByLevel(nextLevel)[0]?.id ?? ""}`
      : `/exam/${currentLevel}`;
  const nextLessonWords = nextLesson?.vocabularyIds.filter((id) => !knownWordIds.includes(id)).length ?? 0;
  const todayKey = getLocalDateKey();
  const completedTasks = dailyPlanCompletions?.[todayKey] ?? [];
  const activeMistakes = mistakes.filter((mistake) => !mistake.learned).length;
  const reviewDueCount = useMemo(
    () => getReviewQueue({ words: hskWords, knownWordIds, weakWordIds, wordReviews, mistakes, limit: 30 }).length,
    [knownWordIds, mistakes, weakWordIds, wordReviews]
  );
  const totalQuizAnswers = quizResults.reduce((sum, result) => sum + result.total, 0);
  const correctQuizAnswers = quizResults.reduce((sum, result) => sum + result.score, 0);
  const quizAccuracy = totalQuizAnswers ? Math.round((correctQuizAnswers / totalQuizAnswers) * 100) : 0;
  const latestExam = examAttempts.find((attempt) => attempt.hskLevel === currentLevel);
  const assessmentScore = latestExam?.accuracy ?? quizAccuracy;
  const hasReadinessData = learnedLevelWords > 0 || completedLessons > 0 || totalQuizAnswers > 0 || Boolean(latestExam);
  const examReadiness = hasReadinessData ? Math.round(vocabularyProgress * 0.45 + lessonProgress * 0.35 + assessmentScore * 0.2) : 0;
  const overallProgress = Math.round(vocabularyProgress * 0.55 + lessonProgress * 0.45);
  const dailyGoalMinutes = user?.dailyGoalMinutes ?? 15;
  const displayName = getDisplayName(user?.name, language);
  const premium = isPremiumProfile(user);
  void progressRevision;

  const dailyTasks: DailyTask[] = [
    {
      id: "lesson",
      href: nextLessonHref,
      uz: `${Math.min(8, nextLessonWords || nextLesson?.vocabularyIds.length || 0)} ta yangi so‘z`,
      ru: `${Math.min(8, nextLessonWords || nextLesson?.vocabularyIds.length || 0)} новых слов`,
      en: `${Math.min(8, nextLessonWords || nextLesson?.vocabularyIds.length || 0)} new words`,
      detailUz: "Keyingi darsdan • 6 daqiqa",
      detailRu: "Из следующего урока • 6 минут",
      detailEn: "From the next lesson • 6 minutes",
      icon: BookOpen
    },
    {
      id: "review",
      href: "/review",
      uz: `Bugun ${reviewDueCount} ta so‘z`,
      ru: `Сегодня ${reviewDueCount} слов`,
      en: `${reviewDueCount} words today`,
      detailUz: "Aqlli takrorlash • 5 daqiqa",
      detailRu: "Умное повторение • 5 минут",
      detailEn: "Smart Review • 5 minutes",
      icon: RotateCcw
    },
    {
      id: "reading",
      href: `/reading/${currentLevel}`,
      uz: "1 ta o‘qish mashqi",
      ru: "1 задание по чтению",
      en: "1 reading task",
      detailUz: "Matn va savollar • 4 daqiqa",
      detailRu: "Текст и вопросы • 4 минуты",
      detailEn: "Text and questions • 4 minutes",
      icon: BookOpen
    },
    {
      id: "listening",
      href: `/listening/${currentLevel}`,
      uz: "1 ta tinglash mashqi",
      ru: "1 задание по аудированию",
      en: "1 listening task",
      detailUz: "Eshiting va javob bering • 3 daqiqa",
      detailRu: "Прослушайте и ответьте • 3 минуты",
      detailEn: "Listen and answer • 3 minutes",
      icon: Headphones
    },
    {
      id: "speaking",
      href: `/speaking/${currentLevel}`,
      uz: "1 ta gapirish vazifasi",
      ru: "1 задание по говорению",
      en: "1 speaking task",
      detailUz: "Xitoycha javob bering • 3 daqiqa",
      detailRu: "Ответьте по-китайски • 3 минуты",
      detailEn: "Answer in Chinese • 3 minutes",
      icon: Mic
    },
    {
      id: "quiz",
      href: `/quiz/${currentLevel}`,
      uz: "Qisqa test",
      ru: "Короткий тест",
      en: "Short quiz",
      detailUz: "Bilimingizni tekshiring • 4 daqiqa",
      detailRu: "Проверьте знания • 4 минуты",
      detailEn: "Check your knowledge • 4 minutes",
      icon: Target
    },
    {
      id: "ai",
      href: "/ai-tutor",
      uz: "AI murabbiydan maslahat",
      ru: "Совет AI-тренера",
      en: "AI Coach advice",
      detailUz: "Bugungi rejangizni so‘rang • 2 daqiqa",
      detailRu: "Спросите план на сегодня • 2 минуты",
      detailEn: "Ask for today’s plan • 2 minutes",
      icon: Bot
    }
  ];

  const completedTaskCount = dailyTasks.filter((task) => completedTasks.includes(task.id)).length;
  const dailyCompletion = Math.round((completedTaskCount / dailyTasks.length) * 100);

  return (
    <ProtectedRoute>
      <section className="mx-auto w-full max-w-7xl px-4 pb-32 pt-5 sm:px-6 sm:pt-8 md:pb-12 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-4 border-b border-orange-soft/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <BrandLogo variant="icon" size="md" showText={false} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-black text-orange-deep">HanziFlow AI</p>
              <h1 className="mt-1 text-3xl font-black leading-tight text-ink sm:text-4xl">
                {language === "ru" ? `Здравствуйте, ${displayName}` : `Salom, ${displayName}`}
              </h1>
              <p className="mt-2 text-sm font-semibold text-stone-600 sm:text-base">
                {language === "ru" ? "Ваш план обучения на сегодня готов." : "Bugungi o‘qish rejangiz tayyor."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-orange-soft bg-white/90 px-3 text-xs font-black text-stone-700 shadow-soft">
              <Flame className="h-4 w-4 text-orange-brand" /> {streak} {language === "ru" ? "дней" : "kun"}
            </span>
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-orange-soft bg-white/90 px-3 text-xs font-black text-stone-700 shadow-soft">
              <Zap className="h-4 w-4 text-amber-500" /> {xp} XP
            </span>
            <Link
              href={premium ? "/profile" : "/premium"}
              className={`warm-focus inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-xs font-black shadow-soft ${premium ? "bg-amber-100 text-amber-800" : "bg-orange-brand text-white"}`}
            >
              <Crown className="h-4 w-4" /> {premium ? "Premium" : language === "ru" ? "Открыть Premium" : "Premium olish"}
            </Link>
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          <Card className="order-1 overflow-hidden border-orange-soft/80 bg-gradient-to-br from-white via-orange-50/70 to-amber-100/80 p-5 sm:p-7 lg:col-span-7">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-brand px-3 py-1.5 text-xs font-black text-white">HSK {currentLevel}</span>
                <span className="rounded-full border border-orange-soft bg-white/85 px-3 py-1.5 text-xs font-black text-stone-600">
                  {language === "ru" ? "Сегодняшний урок" : "Bugungi dars"}
                </span>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-black leading-[1.08] text-ink sm:text-4xl">
                    {language === "ru" ? "Продолжите свой путь HSK" : "HSK yo‘lingizni davom ettiring"}
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-6 text-stone-600 sm:text-base">
                    {language === "ru"
                      ? `Занимайтесь сегодня ${dailyGoalMinutes} минут, чтобы сохранить серию и приблизиться к следующему уровню.`
                      : `Bugun ${dailyGoalMinutes} daqiqa o‘qib, seriyangizni saqlang va keyingi bosqichga yaqinlashing.`}
                  </p>
                </div>
                <div className="hidden h-24 w-24 items-center justify-center rounded-[1.75rem] border border-white/80 bg-white/75 text-5xl font-black text-orange-brand shadow-soft sm:flex">
                  学
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/90 bg-white/82 p-4 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase text-orange-deep">
                      {language === "ru" ? "Следующий урок" : "Keyingi dars"}
                    </p>
                    <p className="mt-1 truncate text-base font-black text-ink">
                      {nextLesson
                        ? (language === "ru" ? nextLesson.titleRu : nextLesson.titleUz)
                        : currentExamPassed && currentLevel < 6
                          ? `HSK ${nextLevel} · ${language === "ru" ? "первый урок" : "birinchi dars"}`
                          : (language === "ru" ? "Экзамен открыт" : "Imtihon ochildi")}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-black text-orange-deep">{nextLessonProgress}%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-orange-soft/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-brand to-amber-400 transition-all"
                    style={{ width: `${nextLessonProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <AppButton href={nextLessonHref} className="min-h-11 px-5 py-3">
                  {!nextLesson
                    ? currentExamPassed && currentLevel < 6
                      ? (language === "ru" ? "Следующий уровень" : "Keyingi daraja")
                      : (language === "ru" ? "Начать экзамен" : "Imtihonni boshlash")
                    : nextLessonProgress > 0
                    ? language === "ru"
                      ? "Продолжить урок"
                      : "Darsni davom ettirish"
                    : language === "ru"
                      ? "Начать урок"
                      : "Darsni boshlash"}
                  <ArrowRight className="h-4 w-4" />
                </AppButton>
                <AppButton href="/daily-plan" variant="secondary" className="min-h-11 px-5 py-3">
                  {language === "ru" ? "Открыть план" : "Bugungi rejani ochish"}
                </AppButton>
              </div>
            </div>
          </Card>

          <Card className="order-6 p-5 sm:p-6 lg:order-2 lg:col-span-5">
            <DashboardHeading
              eyebrow={language === "ru" ? "Ваш результат" : "Sizning natijangiz"}
              title={language === "ru" ? "Краткий прогресс" : "Qisqa natija"}
              action={
                <Link href="/progress-map" className="warm-focus rounded-full p-2 text-orange-deep transition hover:bg-orange-soft" aria-label={language === "ru" ? "Открыть карту прогресса" : "Rivojlanish xaritasini ochish"}>
                  <Map className="h-5 w-5" />
                </Link>
              }
            />
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: GraduationCap, label: language === "ru" ? "Уровень" : "Daraja", value: `HSK ${currentLevel}` },
                { icon: Target, label: language === "ru" ? "Изучено слов" : "O‘rganilgan", value: `${learnedLevelWords}/${levelWords.length}` },
                { icon: BookOpen, label: language === "ru" ? "Уроки" : "Darslar", value: `${completedLessons}/${lessons.length}` },
                { icon: Flame, label: language === "ru" ? "Серия" : "Seriya", value: `${streak} ${language === "ru" ? "дн." : "kun"}` }
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.3rem] border border-stone-200/70 bg-cream/65 p-3.5">
                  <stat.icon className="h-4 w-4 text-orange-brand" />
                  <p className="mt-2 text-[11px] font-black text-stone-500">{stat.label}</p>
                  <p className="mt-0.5 text-lg font-black text-ink">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-[1.3rem] bg-orange-soft/55 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black text-ink">{language === "ru" ? "Готовность к экзамену" : "Imtihonga tayyorlik"}</span>
                <span className="text-sm font-black text-orange-deep">{examReadiness}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/80">
                <div className="h-full rounded-full bg-orange-brand" style={{ width: `${examReadiness}%` }} />
              </div>
            </div>
          </Card>

          <section className="order-2 lg:order-3 lg:col-span-12">
            <DashboardHeading
              eyebrow={language === "ru" ? "Быстрый доступ" : "Tezkor kirish"}
              title={language === "ru" ? "Выберите навык" : "Ko‘nikmani tanlang"}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
              {quickActions.map((action) => (
                <QuickActionCard key={action.href} action={action} language={language} level={currentLevel} />
              ))}
            </div>
          </section>

          <Card className="order-3 p-5 sm:p-6 lg:order-4 lg:col-span-7">
            <DashboardHeading
              eyebrow={language === "ru" ? "План на сегодня" : "Bugungi reja"}
              title={language === "ru" ? "Учитесь небольшими шагами" : "Kichik qadamlar bilan o‘rganing"}
              action={<span className="rounded-full bg-orange-soft px-3 py-1.5 text-xs font-black text-orange-deep">{dailyCompletion}%</span>}
            />
            <div className="space-y-2.5">
              {dailyTasks.map((task) => (
                <DailyTaskRow key={task.id} task={task} language={language} done={completedTasks.includes(task.id)} />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.25rem] bg-cream/75 px-4 py-3">
              <span className="flex items-center gap-2 text-xs font-black text-stone-600">
                <Clock3 className="h-4 w-4 text-orange-brand" />
                {language === "ru" ? `Примерное время: ${dailyGoalMinutes} минут` : `Taxminiy vaqt: ${dailyGoalMinutes} daqiqa`}
              </span>
              <Link href="/daily-plan" className="warm-focus text-xs font-black text-orange-deep hover:text-orange-brand">
                {language === "ru" ? "Весь план" : "To‘liq reja"}
              </Link>
            </div>
          </Card>

          <div className="order-4 space-y-5 lg:order-5 lg:col-span-5">
            <Card className="p-5 sm:p-6">
              <DashboardHeading
                eyebrow={language === "ru" ? "Продолжить обучение" : "O‘qishni davom ettirish"}
                title={nextLesson ? (language === "ru" ? nextLesson.titleRu : nextLesson.titleUz) : currentExamPassed && currentLevel < 6 ? `HSK ${nextLevel}` : (language === "ru" ? "Экзамен" : "Imtihon")}
              />
              <p className="text-sm font-semibold leading-6 text-stone-600">
                {nextLesson
                  ? (language === "ru" ? nextLesson.descriptionRu : nextLesson.descriptionUz)
                  : currentExamPassed && currentLevel < 6
                    ? (language === "ru" ? "Следующий уровень открыт. Начните первый урок." : "Keyingi daraja ochildi. Birinchi darsni boshlang.")
                    : (language === "ru" ? "Все уроки завершены. Теперь сдайте экзамен." : "Barcha darslar yakunlandi. Endi imtihonni topshiring.")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-stone-600">
                <span className="rounded-full bg-cream px-3 py-2">{nextLesson?.vocabularyIds.length ?? 0} {language === "ru" ? "слов" : "so‘z"}</span>
                <span className="rounded-full bg-cream px-3 py-2">{nextLesson?.grammarIds.length ?? 0} {language === "ru" ? "грамматика" : "grammatika"}</span>
                <span className="rounded-full bg-cream px-3 py-2">{nextLesson?.estimatedMinutes ?? 0} {language === "ru" ? "минут" : "daqiqa"}</span>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-orange-soft/70">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-amber-400" style={{ width: `${nextLessonProgress}%` }} />
              </div>
              <AppButton href={nextLessonHref} className="mt-4 w-full min-h-11 py-3">
                {language === "ru" ? "Продолжить" : "Davom ettirish"} <ArrowRight className="h-4 w-4" />
              </AppButton>
            </Card>

            <Card className="p-5 sm:p-6">
              <DashboardHeading
                eyebrow={language === "ru" ? "Умное повторение" : "Aqlli takrorlash"}
                title={language === "ru" ? "Закрепите слабые слова" : "Zaif so‘zlarni mustahkamlang"}
                action={<Brain className="h-6 w-6 text-orange-brand" />}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1.25rem] bg-orange-soft/60 p-4">
                  <p className="text-2xl font-black text-ink">{weakWordIds.length}</p>
                  <p className="mt-1 text-xs font-black text-stone-500">{language === "ru" ? "Слабые слова" : "Zaif so‘zlar"}</p>
                </div>
                <div className="rounded-[1.25rem] bg-rose-50 p-4">
                  <p className="text-2xl font-black text-ink">{activeMistakes}</p>
                  <p className="mt-1 text-xs font-black text-stone-500">{language === "ru" ? "Ошибки" : "Xatolar"}</p>
                </div>
              </div>
              <AppButton href="/review" variant="secondary" className="mt-4 w-full min-h-11 py-3">
                {language === "ru" ? "Начать повторение" : "Takrorlashni boshlash"} <ArrowRight className="h-4 w-4" />
              </AppButton>
            </Card>

            {!premium ? (
              <div className="rounded-[1.75rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 p-5 shadow-soft">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-brand shadow-soft">
                    <Crown className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-black text-ink">{language === "ru" ? "Больше возможностей с Premium" : "Premium bilan ko‘proq imkoniyat"}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-stone-600">
                      {language === "ru" ? "Откройте HSK 2–6, AI-тренера и полные экзамены." : "HSK 2–6, AI murabbiy va to‘liq imtihonlarni oching."}
                    </p>
                  </div>
                </div>
                <Link href="/premium" className="warm-focus mt-4 inline-flex items-center gap-2 text-sm font-black text-orange-deep">
                  {language === "ru" ? "Посмотреть Premium" : "Premiumni ko‘rish"} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </div>

          <Card className="order-5 p-5 sm:p-6 lg:order-6 lg:col-span-12">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Путь HSK" : "HSK dars yo‘lingiz"}</p>
                <h2 className="mt-1 text-2xl font-black text-ink">{language === "ru" ? "Ваш общий прогресс" : "Umumiy o‘quv rivojingiz"}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
                  {language === "ru"
                    ? `${overallProgress}% уровня завершено. Следующий шаг — продолжить текущий урок и повторить слабые слова.`
                    : `Darajaning ${overallProgress}% qismi yakunlangan. Keyingi qadam — joriy darsni davom ettirish va zaif so‘zlarni takrorlash.`}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <AppButton href="/learning-path" variant="secondary" className="min-h-11 py-3">
                  <Map className="h-4 w-4" /> {language === "ru" ? "Учебный путь" : "O‘quv yo‘li"}
                </AppButton>
                <AppButton href="/mistake-notebook" variant="secondary" className="min-h-11 py-3">
                  <NotebookTabs className="h-4 w-4" /> {language === "ru" ? "Тетрадь ошибок" : "Xatolar daftari"}
                </AppButton>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </ProtectedRoute>
  );
}
