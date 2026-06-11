"use client";

import { BookOpenCheck, RotateCcw } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function MistakesPage() {
  const mistakes = useProgressStore((state) => state.mistakes);
  const markMistakeLearned = useProgressStore((state) => state.markMistakeLearned);
  const { t } = useI18n();
  const activeMistakes = mistakes.filter((mistake) => !mistake.learned);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">{t("nav.mistakes")}</p>
          <h1 className="mt-2 text-5xl font-black text-ink dark:text-cream sm:text-7xl">{t("mistakes.title")}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">{t("mistakes.subtitle")}</p>
        </div>
        {activeMistakes.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {activeMistakes.map((mistake) => (
              <div key={mistake.id} className="rounded-[2rem] border border-white/70 bg-white/84 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-4xl font-black text-ink dark:text-cream">{mistake.chinese}</p>
                    {mistake.pinyin ? <p className="mt-1 text-lg font-black text-orange-brand">{mistake.pinyin}</p> : null}
                  </div>
                  <span className="rounded-full bg-orange-soft px-3 py-1 text-xs font-black text-orange-deep">HSK {mistake.hskLevel}</span>
                </div>
                <div className="mt-5 grid gap-3 text-sm font-bold text-stone-600 dark:text-stone-300">
                  <p className="rounded-2xl bg-cream p-3 dark:bg-white/8">{mistake.wrongAnswer}</p>
                  <p className="rounded-2xl bg-mint p-3 text-emerald-800">{mistake.correctAnswer}</p>
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
          <div className="rounded-[2.5rem] bg-white/84 p-10 text-center shadow-premium dark:bg-white/10">
            <BookOpenCheck className="mx-auto mb-4 h-12 w-12 text-orange-brand" />
            <h2 className="text-4xl font-black text-ink dark:text-cream">{t("mistakes.empty")}</h2>
            <div className="mt-6"><AppButton href="/quiz/1">{t("common.quiz")}</AppButton></div>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
