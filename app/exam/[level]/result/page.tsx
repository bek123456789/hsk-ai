"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Clock3, RotateCcw, Target, Trophy, XCircle } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { ProgressCard } from "@/components/ProgressCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { formatSeconds } from "@/utils/exam";
import { useI18n } from "@/utils/i18n";

function parseLevel(value: string | string[] | undefined): HSKLevel {
  const raw = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(raw);
  return numberValue >= 1 && numberValue <= 6 ? (numberValue as HSKLevel) : 1;
}

export default function ExamResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const level = parseLevel(params.level);
  const attemptId = searchParams.get("attempt");
  const attempts = useProgressStore((state) => state.examAttempts);
  const mistakes = useProgressStore((state) => state.mistakes);
  const { t } = useI18n();
  const attempt = attempts.find((item) => item.id === attemptId) ?? attempts.find((item) => item.hskLevel === level);
  const weakMistakes = mistakes.filter((mistake) => mistake.hskLevel === level && !mistake.learned).slice(0, 6);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        {attempt ? (
          <div className="rounded-[2.5rem] border border-white/70 bg-white/84 p-7 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:p-10">
            {attempt.accuracy >= 80 ? (
              <div className="pointer-events-none absolute inset-x-0 top-24 overflow-hidden">
                {Array.from({ length: 18 }).map((_, index) => (
                  <motion.span key={index} initial={{ y: 30, opacity: 0 }} animate={{ y: -120, opacity: [0, 1, 0], rotate: 180 }} transition={{ repeat: Infinity, duration: 2.4, delay: index * 0.08 }} className="absolute h-3 w-3 rounded-sm bg-orange-brand" style={{ left: `${5 + ((index * 7) % 88)}%` }} />
                ))}
              </div>
            ) : null}
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow">
                <Trophy className="h-11 w-11" />
              </div>
              <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">HSK {level}</p>
              <h1 className="mt-2 text-5xl font-black text-ink dark:text-cream">{t("exam.resultTitle")}</h1>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              <ProgressCard title={t("exam.score")} value={`${attempt.score}/${attempt.total}`} detail="HSK AI" icon={BadgeCheck} tone="orange" />
              <ProgressCard title={t("exam.accuracy")} value={`${attempt.accuracy}%`} detail={attempt.accuracy >= 70 ? t("common.unlocked") : t("common.retry")} icon={Target} tone="green" />
              <ProgressCard title={t("exam.correctAnswers")} value={`${attempt.correctAnswers}`} detail={t("quiz.correct")} icon={Trophy} tone="blue" />
              <ProgressCard title={t("exam.wrongAnswers")} value={`${attempt.wrongAnswers}`} detail={t("nav.mistakes")} icon={XCircle} tone="purple" />
              <ProgressCard title={t("exam.timeSpent")} value={formatSeconds(attempt.timeSpentSeconds)} detail={t("exam.timer")} icon={Clock3} tone="orange" />
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-[2rem] bg-cream p-6 shadow-soft dark:bg-obsidian/60">
                <h2 className="text-2xl font-black text-ink dark:text-cream">{t("exam.recommendedNext")}</h2>
                <p className="mt-3 font-semibold leading-7 text-stone-600 dark:text-stone-300">
                  {attempt.accuracy >= 70 ? t("roadmap.unlockRule") : t("review.subtitle")}
                </p>
              </div>
              <div className="rounded-[2rem] bg-white/70 p-6 shadow-soft dark:bg-white/8">
                <h2 className="text-2xl font-black text-ink dark:text-cream">{t("exam.weakWords")}</h2>
                <div className="mt-4 space-y-2">
                  {weakMistakes.length ? weakMistakes.map((mistake) => (
                    <div key={mistake.id} className="rounded-2xl bg-cream px-4 py-3 text-sm font-black text-ink dark:bg-white/8 dark:text-cream">{mistake.chinese} · {mistake.correctAnswer}</div>
                  )) : <p className="font-semibold text-stone-500 dark:text-stone-300">{t("mistakes.empty")}</p>}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <AppButton href={`/exam/${level}`} variant="secondary"><RotateCcw className="h-5 w-5" /> {t("common.retry")}</AppButton>
              <AppButton href="/review" variant="secondary">{t("exam.goReview")}</AppButton>
              {attempt.accuracy >= 70 ? <AppButton href={`/certificate/${level}`} variant="primary">{t("exam.certificate")}</AppButton> : null}
            </div>
          </div>
        ) : (
          <div className="rounded-[2.5rem] bg-white/84 p-10 text-center shadow-premium dark:bg-white/10">
            <h1 className="text-4xl font-black text-ink dark:text-cream">{t("common.results")}</h1>
            <div className="mt-6"><AppButton href={`/exam/${level}`}>{t("exam.start")}</AppButton></div>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
