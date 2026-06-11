"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Lock, Trophy } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getExamQuestions } from "@/data/examQuestions";
import { useProgressStore } from "@/store/progressStore";
import { examMeta, hskLevels, isExamUnlocked } from "@/utils/exam";
import { useI18n } from "@/utils/i18n";

export default function ExamCenterPage() {
  const bestScoreByLevel = useProgressStore((state) => state.bestScoreByLevel);
  const { language, t } = useI18n();

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">{t("exam.practice")}</p>
          <h1 className="mt-2 text-5xl font-black text-ink dark:text-cream sm:text-7xl">{t("exam.title")}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">{t("exam.subtitle")}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hskLevels.map((level, index) => {
            const unlocked = isExamUnlocked(level, bestScoreByLevel ?? {});
            const score = bestScoreByLevel?.[level] ?? 0;
            const meta = examMeta[level];
            return (
              <motion.div key={level} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <Card className={`relative overflow-hidden p-6 ${unlocked ? "" : "opacity-78"}`}>
                  <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-orange-soft blur-2xl dark:bg-orange-brand/20" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-orange-deep dark:text-orange-200">{t("exam.practice")}</p>
                      <h2 className="mt-2 text-4xl font-black text-ink dark:text-cream">HSK {level}</h2>
                    </div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${unlocked ? "bg-mint text-emerald-700" : "bg-stone-100 text-stone-500 dark:bg-white/10"}`}>
                      {unlocked ? <CheckCircle2 className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
                    </div>
                  </div>
                  <div className="relative mt-6 grid grid-cols-2 gap-3 text-sm font-black text-stone-600 dark:text-stone-300">
                    <div className="rounded-3xl bg-cream p-4 dark:bg-white/8"><Clock3 className="mb-2 h-5 w-5 text-orange-brand" />{meta.minutes} {t("common.minutes")}</div>
                    <div className="rounded-3xl bg-cream p-4 dark:bg-white/8"><Trophy className="mb-2 h-5 w-5 text-orange-brand" />{getExamQuestions(level).length} {t("exam.questions")}</div>
                  </div>
                  <div className="relative mt-5">
                    <div className="mb-2 flex justify-between text-xs font-black text-stone-500 dark:text-stone-300">
                      <span>{language === "ru" ? meta.difficultyRu : meta.difficultyUz}</span>
                      <span>{score}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white shadow-soft dark:bg-white/10">
                      <div className="h-3 rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                  <div className="relative mt-6">
                    <AppButton href={`/exam/${level}`} variant={unlocked ? "primary" : "secondary"} className="w-full">
                      {unlocked ? t("exam.start") : t("common.preview")}
                    </AppButton>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </ProtectedRoute>
  );
}
