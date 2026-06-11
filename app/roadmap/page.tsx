"use client";

import { CheckCircle2, Lock, Map, Trophy } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import { examMeta, hskLevels, isExamUnlocked } from "@/utils/exam";
import { useI18n } from "@/utils/i18n";

export default function RoadmapPage() {
  const bestScoreByLevel = useProgressStore((state) => state.bestScoreByLevel);
  const { t } = useI18n();

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">{t("roadmap.unlockRule")}</p>
          <h1 className="mt-2 text-5xl font-black text-ink dark:text-cream sm:text-7xl">{t("roadmap.title")}</h1>
          <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">{t("roadmap.subtitle")}</p>
        </div>
        <div className="relative space-y-5 before:absolute before:left-8 before:top-8 before:h-[calc(100%-4rem)] before:w-1 before:rounded-full before:bg-orange-soft dark:before:bg-white/10">
          {hskLevels.map((level) => {
            const meta = examMeta[level];
            const unlocked = isExamUnlocked(level, bestScoreByLevel ?? {});
            const band = level <= 2 ? t("roadmap.beginner") : level <= 4 ? t("roadmap.middle") : t("roadmap.advanced");
            return (
              <Card key={level} className="relative ml-16 p-6">
                <div className={`absolute -left-[4.45rem] top-6 flex h-16 w-16 items-center justify-center rounded-3xl shadow-card ${unlocked ? "bg-gradient-to-br from-orange-brand to-amber-300 text-white" : "bg-white text-stone-400 dark:bg-white/10"}`}>
                  {unlocked ? <CheckCircle2 className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
                </div>
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-black text-orange-deep dark:text-orange-200">{band}</p>
                    <h2 className="mt-1 text-4xl font-black text-ink dark:text-cream">HSK {level}</h2>
                    <p className="mt-3 font-semibold text-stone-600 dark:text-stone-300">{meta.lessons} {t("roadmap.lessons")} · {meta.words} {t("roadmap.words")}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    <div className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-black text-stone-600 shadow-soft dark:bg-white/8 dark:text-stone-300">
                      <Trophy className="h-4 w-4 text-orange-brand" /> {bestScoreByLevel?.[level] ?? 0}%
                    </div>
                    <AppButton href={unlocked ? `/lesson/${level}` : `/exam/${level}`} variant={unlocked ? "primary" : "secondary"}>
                      <Map className="h-5 w-5" /> {unlocked ? t("common.continueLearning") : t("common.preview")}
                    </AppButton>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </ProtectedRoute>
  );
}
