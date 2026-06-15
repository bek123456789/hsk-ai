"use client";

import { BookOpenCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function MistakesPage() {
  const mistakes = useProgressStore((state) => state.mistakes);
  const markMistakeLearned = useProgressStore((state) => state.markMistakeLearned);
  const { language, t } = useI18n();
  const [source, setSource] = useState("all");
  const [level, setLevel] = useState(0);
  const activeMistakes = mistakes.filter((mistake) => !mistake.learned && (source === "all" || mistake.source === source) && (!level || mistake.hskLevel === level));

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{t("nav.mistakes")}</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{t("mistakes.title")}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">{t("mistakes.subtitle")}</p>
        </div>
        <div className="mb-6 flex flex-wrap gap-2 rounded-[2rem] bg-white/88 p-4 shadow-soft">
          {["all", "quiz", "exam", "speaking", "dictation", "sentence-builder"].map((item) => (
            <button key={item} onClick={() => setSource(item)} className={`rounded-full px-4 py-2 text-xs font-black ${source === item ? "bg-orange-brand text-white" : "bg-cream text-stone-600"}`}>
              {language === "ru"
                ? item === "all" ? "Все" : item === "sentence-builder" ? "Предложения" : item === "speaking" ? "Говорение" : item === "dictation" ? "Диктант" : item === "exam" ? "Экзамен" : "Тест"
                : item === "all" ? "Barchasi" : item === "sentence-builder" ? "Gap tuzish" : item === "speaking" ? "Gapirish" : item === "dictation" ? "Diktant" : item === "exam" ? "Imtihon" : "Test"}
            </button>
          ))}
          <select value={level} onChange={(event) => setLevel(Number(event.target.value))} className="rounded-full border border-orange-soft bg-cream px-4 py-2 text-xs font-black text-stone-600">
            <option value={0}>HSK 1–6</option>
            {[1,2,3,4,5,6].map((item) => <option key={item} value={item}>HSK {item}</option>)}
          </select>
        </div>
        {activeMistakes.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {activeMistakes.map((mistake) => (
              <div key={mistake.id} className="rounded-[2rem] border border-white/70 bg-white/84 p-6 shadow-premium backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-4xl font-black text-ink">{mistake.chinese}</p>
                    {mistake.pinyin ? <p className="mt-1 text-lg font-black text-orange-brand">{mistake.pinyin}</p> : null}
                  </div>
                  <span className="rounded-full bg-orange-soft px-3 py-1 text-xs font-black text-orange-deep">HSK {mistake.hskLevel}</span>
                </div>
                <div className="mt-5 grid gap-3 text-sm font-bold text-stone-600">
                  <p className="rounded-2xl bg-cream p-3">{mistake.wrongAnswer}</p>
                  <p className="rounded-2xl bg-orange-soft p-3 text-orange-deep">{mistake.correctAnswer}</p>
                  <p className="leading-7">{mistake.explanation}</p>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <AppButton href="/review" variant="secondary"><RotateCcw className="h-5 w-5" /> {t("mistakes.retry")}</AppButton>
                  <button onClick={() => markMistakeLearned(mistake.id)} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-5 py-3 text-sm font-black text-white shadow-card">
                    <BookOpenCheck className="h-5 w-5" /> {t("mistakes.markLearned")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] bg-white/84 p-10 text-center shadow-premium">
            <BookOpenCheck className="mx-auto mb-4 h-12 w-12 text-orange-brand" />
            <h2 className="text-4xl font-black text-ink">{t("mistakes.empty")}</h2>
            <div className="mt-6"><AppButton href="/quiz/1">{t("common.quiz")}</AppButton></div>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
