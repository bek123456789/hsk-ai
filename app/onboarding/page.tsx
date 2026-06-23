"use client";

import { ArrowLeft, ArrowRight, Check, Clock3, GraduationCap, HelpCircle, Loader2, Sparkles, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import type { AppLanguage, HSKLevel } from "@/types";

const minutes = [5, 10, 20, 30] as const;
const hskLevels = [1, 2, 3, 4, 5, 6] as HSKLevel[];

const placementQuestions = [
  { id: "p1", zh: "你好", uz: "salom", ru: "привет", en: "hello", correct: "hello" },
  { id: "p2", zh: "我学习汉语。", uz: "Men xitoy tilini o‘rganaman.", ru: "Я изучаю китайский.", en: "I study Chinese.", correct: "study" },
  { id: "p3", zh: "今天几月几号？", uz: "Bugun nechanchi sana?", ru: "Какое сегодня число?", en: "What is today’s date?", correct: "date" },
  { id: "p4", zh: "他比我高。", uz: "U mendan balandroq.", ru: "Он выше меня.", en: "He is taller than me.", correct: "compare" },
  { id: "p5", zh: "虽然下雨，但是我们还去学校。", uz: "Yomg‘ir yog‘sa ham, biz baribir maktabga boramiz.", ru: "Хотя идёт дождь, мы всё равно идём в школу.", en: "Although it is raining, we still go to school.", correct: "although" },
  { id: "p6", zh: "这个决定会影响我们的计划。", uz: "Bu qaror rejamizga ta’sir qiladi.", ru: "Это решение повлияет на наш план.", en: "This decision will affect our plan.", correct: "influence" },
  { id: "p7", zh: "他提出了一个值得讨论的观点。", uz: "U muhokama qilishga arziydigan fikr bildirdi.", ru: "Он высказал идею, которую стоит обсудить.", en: "He proposed an idea worth discussing.", correct: "opinion" },
  { id: "p8", zh: "我们应该从不同角度分析这个问题。", uz: "Bu muammoni turli tomondan tahlil qilishimiz kerak.", ru: "Нужно анализировать этот вопрос с разных сторон.", en: "We should analyze this problem from different angles.", correct: "analysis" }
] as const;

function tr(language: AppLanguage, uz: string, ru: string, en: string) {
  if (language === "ru") return ru;
  if (language === "en") return en;
  return uz;
}

export default function OnboardingPage() {
  const router = useRouter();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const savePlacementResult = useProgressStore((state) => state.savePlacementResult);
  const setCurrentLevel = useProgressStore((state) => state.setCurrentLevel);
  const { language } = useI18n();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("exam");
  const [level, setLevel] = useState<HSKLevel>(1);
  const [dailyMinutes, setDailyMinutes] = useState(10);
  const [placementMode, setPlacementMode] = useState<"beginner" | "test" | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const goals = [
    ["exam", tr(language, "HSK imtihoniga tayyorgarlik", "Подготовка к экзамену HSK", "HSK exam preparation")],
    ["travel", tr(language, "Sayohat uchun xitoy tili", "Китайский для путешествий", "Chinese for travel")],
    ["conversation", tr(language, "Kundalik suhbat", "Ежедневное общение", "Daily conversation")],
    ["work", tr(language, "Ish yoki o‘qish", "Работа или учёба", "Work or study")]
  ];

  const placementScore = Object.values(answers).filter(Boolean).length;
  const recommendedLevel = useMemo<HSKLevel>(() => {
    if (placementMode === "beginner") return 1;
    if (placementScore <= 2) return 1;
    if (placementScore <= 4) return 2;
    if (placementScore <= 6) return 3;
    return 4;
  }, [placementMode, placementScore]);

  async function finish(skip = false) {
    setSaving(true);
    setNotice(null);
    const referredBy = typeof window !== "undefined" ? localStorage.getItem("hsk-ai-referral") : null;
    const finalLevel = (placementMode ? recommendedLevel : level) as HSKLevel;
    const localData = {
      language: "uz" as const,
      goal,
      level: finalLevel,
      targetHskLevel: finalLevel,
      dailyMinutes,
      placementMode,
      placementScore,
      onboardingCompleted: true
    };
    localStorage.setItem("hsk-ai-onboarding", JSON.stringify(localData));
    if (placementMode === "test") {
      savePlacementResult({
        id: `onboarding-placement-${Date.now()}`,
        score: placementScore,
        total: placementQuestions.length,
        recommendedLevel: finalLevel,
        skillScores: {
          vocabulary: Math.round((placementScore / placementQuestions.length) * 100),
          grammar: Math.round((placementScore / placementQuestions.length) * 100),
          reading: Math.round((placementScore / placementQuestions.length) * 100)
        },
        completedAt: new Date().toISOString()
      });
    }
    setCurrentLevel(finalLevel);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ ...localData, referredBy, skip })
        });
        if (!response.ok) {
          const result = (await response.json()) as { error?: string };
          setNotice(result.error ?? null);
        }
      }
      await initializeAuth();
      router.replace("/dashboard");
    } finally {
      setSaving(false);
    }
  }

  const panels = [
    <div key="welcome" className="text-center">
      <Sparkles className="mx-auto h-10 w-10 text-orange-brand" />
      <h1 className="mt-5 text-4xl font-black text-ink sm:text-5xl">{language === "ru" ? "Добро пожаловать" : "Xush kelibsiz"}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-8 text-stone-600">
        Maqsad, kunlik vaqt va boshlang‘ich o‘quv yo‘lingizni sozlaymiz.
      </p>
    </div>,
    <div key="goal">
      <Target className="h-8 w-8 text-orange-brand" />
      <h1 className="mt-5 text-4xl font-black text-ink">{language === "ru" ? "Выберите цель" : "Maqsadingizni tanlang"}</h1>
      <div className="mt-7 grid gap-3">
        {goals.map(([value, label]) => <button key={value} onClick={() => setGoal(value)} className={`flex items-center justify-between rounded-3xl border p-5 text-left font-black shadow-soft ${goal === value ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-white bg-white text-ink"}`}>{label}{goal === value ? <Check className="h-5 w-5" /> : null}</button>)}
      </div>
    </div>,
    <div key="level">
      <GraduationCap className="h-8 w-8 text-orange-brand" />
      <h1 className="mt-5 text-4xl font-black text-ink">{language === "ru" ? "Выберите цель HSK" : "HSK maqsadingizni tanlang"}</h1>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {hskLevels.map((item) => <button key={item} onClick={() => { setLevel(item); setPlacementMode(null); }} className={`rounded-3xl border p-5 font-black shadow-soft ${level === item && !placementMode ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-white bg-white text-ink"}`}>HSK {item}</button>)}
      </div>
    </div>,
    <div key="time">
      <Clock3 className="h-8 w-8 text-orange-brand" />
      <h1 className="mt-5 text-4xl font-black text-ink">{language === "ru" ? "Цель на день" : "Kunlik maqsad"}</h1>
      <div className="mt-7 grid grid-cols-2 gap-3">
        {minutes.map((item) => <button key={item} onClick={() => setDailyMinutes(item)} className={`rounded-3xl border p-5 text-lg font-black shadow-soft ${dailyMinutes === item ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-white bg-white text-ink"}`}>{item} {language === "ru" ? "минут" : "daqiqa"}</button>)}
      </div>
    </div>,
    <div key="placement">
      <HelpCircle className="h-8 w-8 text-orange-brand" />
      <h1 className="mt-5 text-4xl font-black text-ink">{language === "ru" ? "Определим начальный путь?" : "Boshlanish yo‘lini tanlaymizmi?"}</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button onClick={() => { setPlacementMode("beginner"); setLevel(1); }} className={`rounded-3xl border p-5 text-left font-black shadow-soft ${placementMode === "beginner" ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-white bg-white text-ink"}`}>
          {language === "ru" ? "Начать с начального уровня" : "Boshlang‘ich darajadan boshlash"}
        </button>
        <button onClick={() => setPlacementMode("test")} className={`rounded-3xl border p-5 text-left font-black shadow-soft ${placementMode === "test" ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-white bg-white text-ink"}`}>
          {language === "ru" ? "Пройти короткий тест" : "Qisqa test topshirish"}
        </button>
      </div>
      {placementMode === "test" ? (
        <div className="mt-6 space-y-3">
          {placementQuestions.map((question, index) => (
            <div key={question.id} className="rounded-3xl bg-cream p-4">
              <p className="text-lg font-black text-ink">{index + 1}. {question.zh}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button onClick={() => setAnswers((current) => ({ ...current, [question.id]: true }))} className={`rounded-2xl px-4 py-3 text-left text-sm font-black shadow-soft ${answers[question.id] === true ? "bg-orange-brand text-white" : "bg-white text-ink"}`}>
                  {language === "ru" ? question.ru : language === "en" ? question.en : question.uz}
                </button>
                <button onClick={() => setAnswers((current) => ({ ...current, [question.id]: false }))} className={`rounded-2xl px-4 py-3 text-left text-sm font-black shadow-soft ${answers[question.id] === false ? "bg-stone-700 text-white" : "bg-white text-ink"}`}>
                  {tr(language, "Boshqa ma’no", "Другое значение", "Different meaning")}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {placementMode ? (
        <p className="mt-5 rounded-3xl bg-orange-soft/70 px-4 py-3 text-sm font-black text-orange-deep">
          {language === "ru" ? "Рекомендуемый уровень" : "Tavsiya qilingan daraja"}: HSK {recommendedLevel}
        </p>
      ) : null}
    </div>,
    <div key="finish" className="text-center">
      <Sparkles className="mx-auto h-10 w-10 text-orange-brand" />
      <h1 className="mt-5 text-4xl font-black text-ink">{language === "ru" ? "Всё готово" : "Hammasi tayyor"}</h1>
      <p className="mt-3 font-semibold text-stone-600">{language === "ru" ? "Ваш первый учебный план создан." : "Birinchi o‘quv rejangiz tayyorlandi."}</p>
      <div className="mt-6 grid gap-2 text-left text-sm font-black text-stone-600">
        <p className="rounded-2xl bg-cream p-3">{language === "ru" ? "Текущий путь" : "Boshlanish yo‘li"}: HSK {placementMode ? recommendedLevel : level}</p>
        <p className="rounded-2xl bg-cream p-3">{language === "ru" ? "Цель на день" : "Kunlik maqsad"}: {dailyMinutes} {language === "ru" ? "минут" : "daqiqa"}</p>
        <p className="rounded-2xl bg-cream p-3">{language === "ru" ? "План на сегодня откроется на Dashboard." : "Bugungi reja Dashboard’da ochiladi."}</p>
      </div>
    </div>
  ];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto grid min-h-[calc(100vh-5rem)] max-w-3xl place-items-center px-5 pb-32 pt-8 sm:px-8 md:pb-10">
        <div className="w-full rounded-[2.5rem] border border-white/80 bg-white/88 p-6 shadow-premium backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex gap-2">{panels.map((_, index) => <span key={index} className={`h-2 flex-1 rounded-full ${index <= step ? "bg-orange-brand" : "bg-orange-soft"}`} />)}</div>
          {panels[step]}
          {notice ? <p className="mt-5 rounded-3xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-800">{notice}</p> : null}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => step === 0 ? void finish(true) : setStep((value) => value - 1)} className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-black text-stone-600">
              {step === 0 ? (language === "ru" ? "Пропустить" : "O‘tkazib yuborish") : <><ArrowLeft className="h-4 w-4" /> {language === "ru" ? "Назад" : "Orqaga"}</>}
            </button>
            <button onClick={() => step === panels.length - 1 ? void finish() : setStep((value) => value + 1)} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3.5 text-sm font-black text-white shadow-glow disabled:opacity-60">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : step === panels.length - 1 ? (language === "ru" ? "Перейти к обучению" : "Bosh sahifaga o‘tish") : <>{language === "ru" ? "Продолжить" : "Davom etish"} <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
