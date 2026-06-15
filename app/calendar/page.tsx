"use client";

import { CalendarDays, Flame, Snowflake } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function LearningCalendarPage() {
  const { language } = useI18n();
  const quizResults = useProgressStore((state) => state.quizResults);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const practiceResults = useProgressStore((state) => state.practiceResults);
  const streak = useProgressStore((state) => state.streak);
  const dailyPlanCompletions = useProgressStore((state) => state.dailyPlanCompletions);
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - index));
    const key = date.toISOString().slice(0, 10);
    const active =
      quizResults.some((item) => item.completedAt.slice(0, 10) === key) ||
      examAttempts.some((item) => item.completedAt.slice(0, 10) === key) ||
      practiceResults.some((item) => item.completedAt.slice(0, 10) === key);
    const planDone = (dailyPlanCompletions?.[key]?.length ?? 0) > 0;
    return { key, day: date.getDate(), active: active || planDone, missed: !active && !planDone && date < today };
  });
  const activeCount = days.filter((day) => day.active).length;

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Учебный календарь" : "O‘quv kalendari"}</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr]">
          <div className="rounded-[2.5rem] bg-white/88 p-6 shadow-premium">
            <div className="mb-5 flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-orange-brand" />
              <h2 className="text-3xl font-black text-ink">{language === "ru" ? "Месячный вид" : "Oylik ko‘rinish"}</h2>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => (
                <div key={day.key} className={`grid aspect-square place-items-center rounded-2xl text-sm font-black shadow-soft ${day.active ? "bg-gradient-to-br from-orange-brand to-amber-300 text-white" : "bg-cream text-stone-500"}`}>
                  {day.day}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-[2.5rem] bg-white/88 p-6 shadow-premium">
              <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Итоги недели" : "Haftalik natija"}</p>
              <p className="mt-2 text-5xl font-black text-ink">{activeCount}</p>
              <p className="mt-2 font-semibold text-stone-500">{language === "ru" ? "Активный день" : "Faol kun"}</p>
            </div>
            <div className="rounded-[2.5rem] bg-white/88 p-6 shadow-premium">
              <Flame className="mb-4 h-10 w-10 text-orange-brand" />
              <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Серия дней" : "Davomiylik"}</p>
              <p className="mt-2 text-5xl font-black text-ink">{streak}</p>
              <p className="mt-3 flex items-center gap-2 text-sm font-bold text-stone-500"><Snowflake className="h-4 w-4 text-sky-500" /> {language === "ru" ? "Заморозка серии: подготовлено" : "Seriyani muzlatish: tayyor"}</p>
            </div>
            <AppButton href="/daily-plan" className="w-full">{language === "ru" ? "Открыть план на сегодня" : "Bugungi rejani ochish"}</AppButton>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
