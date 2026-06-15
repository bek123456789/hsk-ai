"use client";

import { Target } from "lucide-react";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { readLocalObject, writeLocalObject } from "@/utils/localLearning";
import { useI18n } from "@/utils/i18n";

type Goals = { minutes: string; words: string; mainGoal: string; targetLevel: string; targetDate: string };
const defaultGoals: Goals = { minutes: "15", words: "10", mainGoal: "hsk", targetLevel: "3", targetDate: "" };

export default function GoalsPage() {
  const { language } = useI18n();
  const [goals, setGoals] = useState<Goals>(defaultGoals);
  const [saved, setSaved] = useState(false);

  useEffect(() => setGoals(readLocalObject("hsk-ai-goals", defaultGoals)), []);

  function save() {
    writeLocalObject("hsk-ai-goals", goals);
    setSaved(true);
  }

  const mainGoalOptions = language === "ru"
    ? [["hsk", "Подготовка к экзамену HSK"], ["travel", "Китайский для путешествий"], ["daily", "Ежедневное общение"], ["work", "Для работы или учёбы"], ["fun", "Для личного интереса"]]
    : [["hsk", "HSK imtihoniga tayyorgarlik"], ["travel", "Sayohat uchun xitoy tili"], ["daily", "Kundalik suhbat"], ["work", "Ish yoki o‘qish uchun"], ["fun", "Qiziqish uchun o‘rganish"]];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="rounded-[2.5rem] bg-white/88 p-7 shadow-premium sm:p-10">
          <Target className="mb-5 h-12 w-12 text-orange-brand" />
          <h1 className="text-5xl font-black text-ink">{language === "ru" ? "Цели" : "Maqsadlar"}</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600">
              {language === "ru" ? "Ежедневное время обучения" : "Kunlik o‘qish vaqti"}
              <select value={goals.minutes} onChange={(event) => setGoals({ ...goals, minutes: event.target.value })} className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-ink outline-none">
                {["5", "10", "15", "30"].map((item) => <option key={item} value={item}>{item} {language === "ru" ? "мин" : "daq"}</option>)}
              </select>
            </label>
            <label className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600">
              {language === "ru" ? "Ежедневная цель по словам" : "Kunlik so‘z maqsadi"}
              <select value={goals.words} onChange={(event) => setGoals({ ...goals, words: event.target.value })} className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-ink outline-none">
                {["5", "10", "20"].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600 sm:col-span-2">
              {language === "ru" ? "Основная цель" : "Asosiy maqsad"}
              <select value={goals.mainGoal} onChange={(event) => setGoals({ ...goals, mainGoal: event.target.value })} className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-ink outline-none">
                {mainGoalOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600">
              {language === "ru" ? "Целевой уровень HSK" : "Maqsad HSK daraja"}
              <select value={goals.targetLevel} onChange={(event) => setGoals({ ...goals, targetLevel: event.target.value })} className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-ink outline-none">
                {[1, 2, 3, 4, 5, 6].map((item) => <option key={item} value={item}>HSK {item}</option>)}
              </select>
            </label>
            <label className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600">
              {language === "ru" ? "Целевая дата" : "Maqsad sana"}
              <input type="date" value={goals.targetDate} onChange={(event) => setGoals({ ...goals, targetDate: event.target.value })} className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-ink outline-none" />
            </label>
          </div>
          <div className="mt-7 flex items-center gap-3">
            <AppButton onClick={save}>{language === "ru" ? "Сохранить цель" : "Maqsadni saqlash"}</AppButton>
            {saved ? <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Сохранено" : "Saqlandi"}</p> : null}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
