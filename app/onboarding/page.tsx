"use client";

import { ArrowLeft, ArrowRight, Check, Clock3, Globe2, GraduationCap, Loader2, Sparkles, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";
import type { AppLanguage } from "@/types";

const minutes = [5, 10, 15, 30] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const { language, setLanguage } = useI18n();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("exam");
  const [level, setLevel] = useState(1);
  const [levelChoice, setLevelChoice] = useState("beginner");
  const [dailyMinutes, setDailyMinutes] = useState(10);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const goals = language === "ru"
    ? [
        ["exam", "Подготовка к экзамену HSK"],
        ["travel", "Китайский для путешествий"],
        ["conversation", "Ежедневное общение"],
        ["work", "Работа или учёба"]
      ]
    : [
        ["exam", "HSK imtihoniga tayyorgarlik"],
        ["travel", "Sayohat uchun xitoy tili"],
        ["conversation", "Kundalik suhbat"],
        ["work", "Ish yoki o‘qish"]
      ];

  async function finish(skip = false) {
    setSaving(true);
    setNotice(null);
    const referredBy = typeof window !== "undefined" ? localStorage.getItem("hsk-ai-referral") : null;
    const localData = { language, goal, level, dailyMinutes, onboardingCompleted: true };
    localStorage.setItem("hsk-ai-onboarding", JSON.stringify(localData));

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
    <div key="language">
      <Globe2 className="h-8 w-8 text-orange-brand" />
      <h1 className="mt-5 text-4xl font-black text-ink sm:text-5xl">{language === "ru" ? "Настроим начало" : "Boshlashni sozlaymiz"}</h1>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {(["uz", "ru"] as AppLanguage[]).map((item) => (
          <button key={item} onClick={() => setLanguage(item)} className={`rounded-3xl border p-5 text-left text-lg font-black shadow-soft ${language === item ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-white bg-white text-ink"}`}>
            {item === "uz" ? "O‘zbekcha" : "Русский"}
          </button>
        ))}
      </div>
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
      <h1 className="mt-5 text-4xl font-black text-ink">{language === "ru" ? "Выберите уровень" : "Darajangizni tanlang"}</h1>
      <button onClick={() => router.push("/placement-test")} className="mt-5 w-full rounded-3xl border border-orange-soft bg-orange-soft/60 p-4 text-left font-black text-orange-deep shadow-soft">
        {language === "ru" ? "Определить уровень с помощью теста" : "Darajani test orqali aniqlash"}
      </button>
      <div className="mt-7 grid grid-cols-2 gap-3">
        {[
          { id: "beginner", value: 1, label: language === "ru" ? "Начинающий" : "Boshlovchi" },
          { id: "hsk1", value: 1, label: "HSK 1" },
          { id: "hsk2", value: 2, label: "HSK 2" },
          { id: "hsk3", value: 3, label: "HSK 3+" }
        ].map((item) => <button key={item.id} onClick={() => { setLevel(item.value); setLevelChoice(item.id); }} className={`rounded-3xl border p-5 font-black shadow-soft ${levelChoice === item.id ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-white bg-white text-ink"}`}>{item.label}</button>)}
      </div>
    </div>,
    <div key="time">
      <Clock3 className="h-8 w-8 text-orange-brand" />
      <h1 className="mt-5 text-4xl font-black text-ink">{language === "ru" ? "Ежедневная цель" : "Kunlik maqsad"}</h1>
      <div className="mt-7 grid grid-cols-2 gap-3">
        {minutes.map((item) => <button key={item} onClick={() => setDailyMinutes(item)} className={`rounded-3xl border p-5 text-lg font-black shadow-soft ${dailyMinutes === item ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-white bg-white text-ink"}`}>{item} {language === "ru" ? "минут" : "daqiqa"}</button>)}
      </div>
    </div>,
    <div key="finish" className="text-center">
      <Sparkles className="mx-auto h-10 w-10 text-orange-brand" />
      <h1 className="mt-5 text-4xl font-black text-ink">{language === "ru" ? "Всё готово" : "Hammasi tayyor"}</h1>
      <p className="mt-3 font-semibold text-stone-600">{language === "ru" ? "Ваш первый учебный план создан." : "Birinchi o‘quv rejangiz tayyorlandi."}</p>
      <div className="mt-6 grid gap-2 text-left text-sm font-black text-stone-600">
        <p className="rounded-2xl bg-cream p-3">10 {language === "ru" ? "новых слов" : "ta yangi so‘z"}</p>
        <p className="rounded-2xl bg-cream p-3">5 {language === "ru" ? "повторений" : "ta takrorlash"}</p>
        <p className="rounded-2xl bg-cream p-3">{language === "ru" ? "Аудирование и быстрый тест" : "Tinglash va tezkor test"}</p>
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
