"use client";

import {
  ArrowRight,
  BookOpen,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Crown,
  Flame,
  Gauge,
  GraduationCap,
  Headphones,
  LifeBuoy,
  Loader2,
  LogOut,
  Map,
  MessageSquareText,
  Mic,
  Pencil,
  Save,
  Settings,
  Target,
  Trophy,
  UserRound,
  Zap,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getCurriculumLessonsByLevel } from "@/data/hsk/lessonCurriculum";
import { vocabularyEntries } from "@/data/hsk/vocabulary";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { AppLanguage, HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { getLearningProgress } from "@/utils/learningProgress";
import { calculateLessonProgress, getAllLessonProgressRecords } from "@/utils/lessonPlanner";
import { getBestExamScore, getUnlockedHskLevels, HSK_PASSING_SCORE } from "@/utils/hskUnlock";
import { getCurrentAvailableLesson, getLevelCompletionStatus } from "@/utils/lessonUnlock";
import { getSubscriptionStatusLabel, isPremiumProfile } from "@/utils/premium";
import { getSpeakingTaskProgress } from "@/utils/speakingProgress";

type ProfileStat = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
};

function formatDate(value: string | null | undefined, _language: AppLanguage) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function initials(name: string | undefined) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (!parts.length) return "HF";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function StatTile({ item }: { item: ProfileStat }) {
  const Icon = item.icon;
  return (
    <div className="rounded-[1.4rem] border border-stone-200/70 bg-white/88 p-4 shadow-soft">
      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-2xl font-black text-ink">{item.value}</p>
      <p className="mt-1 text-xs font-black leading-5 text-stone-500">{item.label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const mistakes = useProgressStore((state) => state.mistakes);
  const quizResults = useProgressStore((state) => state.quizResults);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const currentStoreLevel = useProgressStore((state) => state.currentLevel);
  const setCurrentLevel = useProgressStore((state) => state.setCurrentLevel);
  const streak = useProgressStore((state) => state.streak);
  const xp = useProgressStore((state) => state.xp);
  const { language } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [revision, setRevision] = useState(0);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [targetLevel, setTargetLevel] = useState<HSKLevel>(1);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener("hsk-progress-synced", refresh);
    return () => window.removeEventListener("hsk-progress-synced", refresh);
  }, []);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setTargetLevel(user.currentHSKLevel ?? 1);
    setDailyGoalMinutes(user.dailyGoalMinutes ?? 15);
  }, [user]);

  const unlockedLevels = getUnlockedHskLevels({ knownWordIds }, examAttempts);
  const requestedLevel = (user?.currentHSKLevel ?? currentStoreLevel ?? 1) as HSKLevel;
  const currentLevel = (unlockedLevels.includes(requestedLevel) ? requestedLevel : unlockedLevels.at(-1) ?? 1) as HSKLevel;
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
  const readingDone = mounted ? getLearningProgress("reading").filter((record) => record.done && record.level === currentLevel).length : 0;
  const listeningDone = mounted ? getLearningProgress("listening").filter((record) => record.done && record.level === currentLevel).length : 0;
  const speakingDone = mounted ? getSpeakingTaskProgress().filter((record) => record.done && record.level === currentLevel).length : 0;
  const activeMistakes = mistakes.filter((mistake) => !mistake.learned).length;
  const latestExam = examAttempts.find((attempt) => attempt.hskLevel === currentLevel);
  const levelQuizResults = quizResults.filter((result) => result.level === currentLevel);
  const quizCorrect = levelQuizResults.reduce((sum, result) => sum + result.score, 0);
  const quizTotal = levelQuizResults.reduce((sum, result) => sum + result.total, 0);
  const assessment = latestExam?.accuracy ?? (quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : 0);
  const hasReadinessData = learnedLevelWords > 0 || completedLessons > 0 || quizTotal > 0 || Boolean(latestExam);
  const examReadiness = hasReadinessData ? Math.round(vocabularyProgress * 0.45 + lessonProgress * 0.35 + assessment * 0.2) : 0;
  const currentProgress = Math.round(vocabularyProgress * 0.55 + lessonProgress * 0.45);
  const premium = isPremiumProfile(user);
  const subscriptionEnd = formatDate(user?.premiumUntil ?? user?.currentPeriodEnd, language);
  const joinedDate = formatDate(user?.createdAt, language);
  void revision;

  const stats: ProfileStat[] = [
    { label: language === "ru" ? "Завершённые уроки" : "Yakunlangan darslar", value: `${completedLessons}/${lessons.length}`, icon: BookOpen, tone: "bg-orange-soft text-orange-deep" },
    { label: language === "ru" ? "Изученные слова" : "O‘rganilgan so‘zlar", value: String(knownWordIds.length), icon: Target, tone: "bg-skysoft text-sky-700" },
    { label: language === "ru" ? "Чтение" : "O‘qish", value: String(readingDone), icon: BookOpen, tone: "bg-emerald-50 text-emerald-700" },
    { label: language === "ru" ? "Аудирование" : "Tinglash", value: String(listeningDone), icon: Headphones, tone: "bg-violet-50 text-violet-700" },
    { label: language === "ru" ? "Говорение" : "Gapirish", value: String(speakingDone), icon: Mic, tone: "bg-rose-50 text-rose-700" },
    { label: language === "ru" ? "Нужно повторить" : "Takrorlash kerak", value: String(Math.max(weakWordIds.length, activeMistakes)), icon: Zap, tone: "bg-amber-50 text-amber-700" },
    { label: language === "ru" ? "Готовность к экзамену" : "Imtihon tayyorligi", value: `${examReadiness}%`, icon: Trophy, tone: "bg-orange-50 text-orange-700" }
  ];

  async function openPortal() {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error(language === "ru" ? "Сначала войдите в аккаунт" : "Avval tizimga kiring");
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ language })
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.error || (language === "ru" ? "Не удалось открыть страницу подписки" : "Obuna sahifasini ochib bo‘lmadi"));
      }
      window.location.href = result.url;
    } catch (error) {
      setPortalError(error instanceof Error ? error.message : language === "ru" ? "Не удалось открыть страницу подписки" : "Obuna sahifasini ochib bo‘lmadi");
    } finally {
      setPortalLoading(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage(null);
    setSaveError(null);
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setSaveError(language === "ru" ? "Введите имя не короче двух символов." : "Ism kamida ikki belgidan iborat bo‘lsin.");
      return;
    }

    setSaveLoading(true);
    try {
      const synced = await updateProfile({
        name: cleanName,
        currentHSKLevel: targetLevel,
        dailyGoalMinutes,
        preferredLanguage: "uz"
      });
      setCurrentLevel(targetLevel);
      setSaveMessage(
        synced
          ? language === "ru" ? "Профиль сохранён." : "Profil saqlandi."
          : language === "ru" ? "Сохранено на устройстве. Синхронизация повторится позже." : "Qurilmada saqlandi. Sinxronlash keyinroq qayta urinadi."
      );
      setEditing(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : language === "ru" ? "Не удалось сохранить профиль." : "Profilni saqlab bo‘lmadi.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <section className="mx-auto w-full max-w-7xl px-4 pb-32 pt-5 sm:px-6 sm:pt-8 md:pb-12 lg:px-8 lg:py-10">
        <Card className="overflow-hidden border-orange-soft/80 bg-gradient-to-br from-white via-orange-50/60 to-amber-100/70 p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-orange-brand to-orange-hot text-2xl font-black text-white shadow-glow">
                {user?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : initials(user?.name)}
                <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-2xl border-4 border-orange-50 bg-white text-orange-brand shadow-soft">
                  <UserRound className="h-4 w-4" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Профиль" : "Profil"}</p>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black ${premium ? "bg-amber-100 text-amber-800" : "bg-white text-stone-600"}`}>
                    {premium ? "Premium" : language === "ru" ? "Бесплатный" : "Bepul"}
                  </span>
                </div>
                <h1 className="mt-1 truncate text-3xl font-black text-ink sm:text-4xl">{user?.name || (language === "ru" ? "Ученик" : "O‘quvchi")}</h1>
                <p className="mt-1 truncate text-sm font-semibold text-stone-600">{user?.email}</p>
                {joinedDate ? <p className="mt-2 flex items-center gap-2 text-xs font-bold text-stone-500"><CalendarDays className="h-4 w-4 text-orange-brand" /> {language === "ru" ? `С нами с ${joinedDate}` : `${joinedDate} dan beri`}</p> : null}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:min-w-[330px]">
              {[
                { label: language === "ru" ? "Уровень" : "Daraja", value: `HSK ${currentLevel}`, icon: GraduationCap },
                { label: language === "ru" ? "Серия" : "Seriya", value: String(streak), icon: Flame },
                { label: "XP", value: String(xp), icon: Zap }
              ].map((item) => (
                <div key={item.label} className="rounded-[1.25rem] border border-white/80 bg-white/78 p-3 text-center shadow-soft">
                  <item.icon className="mx-auto h-4 w-4 text-orange-brand" />
                  <p className="mt-2 text-lg font-black text-ink">{item.value}</p>
                  <p className="text-[10px] font-black text-stone-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setEditing((value) => !value)} className="warm-focus inline-flex min-h-11 items-center gap-2 rounded-full bg-orange-brand px-5 py-3 text-sm font-black text-white shadow-card">
              <Pencil className="h-4 w-4" /> {language === "ru" ? "Редактировать" : "Tahrirlash"}
            </button>
            <AppButton href="/daily-plan" variant="secondary" className="min-h-11 px-5 py-3">
              <Clock3 className="h-4 w-4" /> {language === "ru" ? "План на сегодня" : "Bugungi reja"}
            </AppButton>
          </div>
        </Card>

        {editing ? (
          <Card className="mt-5 p-5 sm:p-7">
            <form onSubmit={saveProfile}>
              <div className="mb-5">
                <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Настройки аккаунта" : "Hisob sozlamalari"}</p>
                <h2 className="mt-1 text-2xl font-black text-ink">{language === "ru" ? "Редактировать профиль" : "Profilni tahrirlash"}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-black text-ink">{language === "ru" ? "Имя" : "Ism"}</span>
                  <input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} className="warm-focus min-h-12 w-full rounded-2xl border border-orange-soft bg-cream px-4 font-bold text-ink outline-none" />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-black text-ink">{language === "ru" ? "Целевой уровень HSK" : "Maqsad HSK darajasi"}</span>
                  <select value={targetLevel} onChange={(event) => setTargetLevel(Number(event.target.value) as HSKLevel)} className="warm-focus min-h-12 w-full rounded-2xl border border-orange-soft bg-cream px-4 font-bold text-ink outline-none">
                    {([1, 2, 3, 4, 5, 6] as HSKLevel[]).map((level) => <option key={level} value={level}>HSK {level}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-black text-ink">{language === "ru" ? "Цель на день" : "Kunlik maqsad"}</span>
                  <select value={dailyGoalMinutes} onChange={(event) => setDailyGoalMinutes(Number(event.target.value))} className="warm-focus min-h-12 w-full rounded-2xl border border-orange-soft bg-cream px-4 font-bold text-ink outline-none">
                    {[5, 10, 15, 30].map((minutes) => <option key={minutes} value={minutes}>{minutes} {language === "ru" ? "минут" : "daqiqa"}</option>)}
                  </select>
                </label>
              </div>
              {saveError ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{saveError}</p> : null}
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button disabled={saveLoading} className="warm-focus inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-brand px-6 py-3 text-sm font-black text-white shadow-card disabled:opacity-60">
                  {saveLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} {language === "ru" ? "Сохранить" : "Saqlash"}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="warm-focus min-h-12 rounded-full border border-orange-soft bg-white px-6 py-3 text-sm font-black text-ink">
                  {language === "ru" ? "Отмена" : "Bekor qilish"}
                </button>
              </div>
            </form>
          </Card>
        ) : null}

        {saveMessage ? <p className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700"><Check className="h-4 w-4" /> {saveMessage}</p> : null}

        <section className="mt-6">
          <div className="mb-4">
            <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Учебные результаты" : "O‘quv natijalari"}</p>
            <h2 className="mt-1 text-2xl font-black text-ink">{language === "ru" ? "Ваш прогресс" : "Sizning rivojlanishingiz"}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {stats.map((item) => <StatTile key={item.label} item={item} />)}
          </div>
          {knownWordIds.length === 0 && completedLessons === 0 && readingDone === 0 && listeningDone === 0 && speakingDone === 0 ? (
            <div className="mt-4 rounded-[1.5rem] border border-orange-soft bg-orange-50/60 p-5">
              <p className="font-black text-ink">{language === "ru" ? "Пока нет данных" : "Hali ma’lumot yo‘q"}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">{language === "ru" ? "Результаты появятся здесь после начала уроков." : "Darslarni boshlaganingizdan keyin bu yerda natijalar ko‘rinadi."}</p>
            </div>
          ) : null}
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Текущий уровень" : "Joriy daraja"}</p>
                <h2 className="mt-1 text-2xl font-black text-ink">HSK {currentLevel} · {currentProgress}%</h2>
              </div>
              <Map className="h-6 w-6 text-orange-brand" />
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-orange-soft">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-amber-400" style={{ width: `${currentProgress}%` }} />
            </div>
            <div className="mt-5 rounded-[1.4rem] border border-stone-200/70 bg-cream/65 p-4">
              <p className="text-xs font-black text-orange-deep">{language === "ru" ? "Следующий урок" : "Keyingi dars"}</p>
              <p className="mt-1 text-lg font-black text-ink">
                {nextLesson
                  ? (language === "ru" ? nextLesson.titleRu : nextLesson.titleUz)
                  : currentExamPassed && currentLevel < 6
                    ? (language === "ru" ? "Следующий уровень открыт" : "Keyingi daraja ochildi")
                    : (language === "ru" ? "Экзамен открыт" : "Imtihon ochildi")}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs font-black text-stone-500">
                <span>{nextLesson?.estimatedMinutes ?? 0} {language === "ru" ? "минут" : "daqiqa"}</span>
                <span>{nextLessonProgress}%</span>
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <AppButton href={nextLesson ? `/lesson/${currentLevel}/${nextLesson.id}` : `/exam/${currentLevel}`} className="min-h-11 px-4 py-3">
                {language === "ru" ? "Продолжить" : "Davom ettirish"}
              </AppButton>
              <AppButton href="/lessons" variant="secondary" className="min-h-11 px-4 py-3">
                {language === "ru" ? "Уроки" : "Darslar"}
              </AppButton>
              <AppButton href="/progress-map" variant="secondary" className="min-h-11 px-4 py-3">
                {language === "ru" ? "Карта пути" : "Yo‘l xaritasi"}
              </AppButton>
            </div>
          </Card>

          <Card className="border-orange-soft/80 bg-gradient-to-br from-white via-amber-50 to-orange-100 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Подписка" : "Obuna"}</p>
                <h2 className="mt-1 text-2xl font-black text-ink">{premium ? "Premium" : language === "ru" ? "Бесплатный план" : "Bepul reja"}</h2>
              </div>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${premium ? "bg-amber-100 text-amber-700" : "bg-white text-orange-brand"} shadow-soft`}>
                <Crown className="h-6 w-6" />
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
              {language === "ru" ? "Статус подписки" : "Obuna holati"}: {getSubscriptionStatusLabel(user?.subscriptionStatus, language)}
            </p>
            {user?.subscriptionPlan ? <p className="mt-2 text-sm font-semibold text-stone-600">{language === "ru" ? "Ваш план" : "Rejangiz"}: {user.subscriptionPlan === "yearly" ? (language === "ru" ? "Ежегодный" : "Yillik") : (language === "ru" ? "Ежемесячный" : "Oylik")}</p> : null}
            {subscriptionEnd ? <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-stone-600"><CalendarDays className="h-4 w-4 text-orange-brand" /> {subscriptionEnd}</p> : null}
            {portalError ? <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{portalError}</p> : null}
            <div className="mt-5">
              {premium && user?.stripeCustomerId ? (
                <button onClick={() => void openPortal()} disabled={portalLoading} className="warm-focus inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-ink shadow-soft disabled:opacity-60">
                  {portalLoading ? <Loader2 className="h-5 w-5 animate-spin text-orange-brand" /> : <CreditCard className="h-5 w-5 text-orange-brand" />}
                  {language === "ru" ? "Управлять подпиской" : "Obunani boshqarish"}
                </button>
              ) : premium ? (
                <AppButton href="/usage" variant="secondary" className="w-full">{language === "ru" ? "Возможности Premium" : "Premium imkoniyatlar"}</AppButton>
              ) : (
                <AppButton href="/premium" className="w-full">{language === "ru" ? "Перейти на Premium" : "Premiumga o‘tish"} <ArrowRight className="h-4 w-4" /></AppButton>
              )}
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-5 sm:p-6">
          <div className="mb-4">
            <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Управление аккаунтом" : "Hisob boshqaruvi"}</p>
            <h2 className="mt-1 text-2xl font-black text-ink">{language === "ru" ? "Настройки и помощь" : "Sozlamalar va yordam"}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/settings", icon: Settings, uz: "Sozlamalar", ru: "Настройки" },
              { href: "/usage", icon: Gauge, uz: "AI limitlar", ru: "AI-лимиты" },
              { href: "/help", icon: LifeBuoy, uz: "Yordam", ru: "Помощь" },
              { href: "/feedback", icon: MessageSquareText, uz: "Fikr bildirish", ru: "Обратная связь" },
              { href: "/daily-plan", icon: Target, uz: "Kunlik reja", ru: "План на день" },
              { href: "/ai-tutor", icon: Bot, uz: "AI yordamchi", ru: "AI-помощник" }
            ].map((item) => (
              <Link key={`${item.href}-${item.uz}`} href={item.href} className="warm-focus group flex min-h-16 items-center gap-3 rounded-[1.25rem] border border-stone-200/70 bg-white/88 px-4 py-3 shadow-soft transition hover:border-orange-soft hover:bg-orange-50/40">
                <item.icon className="h-5 w-5 shrink-0 text-orange-brand" />
                <span className="min-w-0 flex-1 text-sm font-black text-ink">{language === "ru" ? item.ru : item.uz}</span>
                <ChevronRight className="h-4 w-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-orange-brand" />
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 border-t border-orange-soft/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-black text-ink"><LogOut className="h-4 w-4 text-orange-brand" /> {language === "ru" ? "Сессия" : "Sessiya"}</p>
              <p className="mt-1 text-xs font-semibold text-stone-500">{language === "ru" ? "Выход не удаляет учебные данные." : "Chiqish o‘quv ma’lumotlarini o‘chirmaydi."}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button onClick={() => void handleLogout()} className="warm-focus inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-rose-50 px-5 py-3 text-sm font-black text-rose-700">
                <LogOut className="h-4 w-4" /> {language === "ru" ? "Выйти" : "Chiqish"}
              </button>
            </div>
          </div>
        </Card>
      </section>
    </ProtectedRoute>
  );
}
