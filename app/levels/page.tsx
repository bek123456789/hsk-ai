"use client";

import { HSKLevelCard } from "@/components/HSKLevelCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { levelMeta } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function LevelsPage() {
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const { t } = useI18n();

  return (
    <ProtectedRoute>
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <div className="mb-10 max-w-4xl">
        <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">HSK</p>
        <h1 className="mt-2 text-5xl font-black leading-tight text-ink dark:text-cream sm:text-7xl">{t("levels.title")}</h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">
          HSK 1 is open with full mock vocabulary. HSK 2 to HSK 6 are visible and ready for future curriculum expansion.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {levelMeta.map((meta) => (
          <HSKLevelCard key={meta.level} meta={meta} knownCount={knownWordIds.length} />
        ))}
      </div>
    </section>
    </ProtectedRoute>
  );
}
