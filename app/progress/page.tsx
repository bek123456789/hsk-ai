"use client";

import { Award, BarChart3, Flame, ListChecks, Medal, Target, Zap } from "lucide-react";
import { AchievementBadge } from "@/components/AchievementBadge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProgressCard } from "@/components/ProgressCard";
import { hskWords } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { percent } from "@/utils/progress";

export default function ProgressPage() {
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const reviewedWordIds = useProgressStore((state) => state.reviewedWordIds);
  const quizResults = useProgressStore((state) => state.quizResults);
  const streak = useProgressStore((state) => state.streak);
  const { t } = useI18n();
  const learnedWords = hskWords.filter((word) => knownWordIds.includes(word.id));
  const recentWords = hskWords.filter((word) => reviewedWordIds.includes(word.id)).slice(-6).reverse();
  const totalAnswered = quizResults.reduce((sum, result) => sum + result.total, 0);
  const totalCorrect = quizResults.reduce((sum, result) => sum + result.score, 0);
  const accuracy = percent(totalCorrect, totalAnswered);
  const hskProgress = percent(knownWordIds.length, hskWords.length);

  return (
    <ProtectedRoute>
    <section className="premium-grid mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{t("progress.title")}</p>
        <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{t("progress.dashboard")}</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-5">
        <ProgressCard title={t("progress.xpTotal")} value={`${knownWordIds.length * 25 + totalCorrect * 15}`} detail={t("progress.rewards")} icon={Zap} tone="orange" />
        <ProgressCard title={t("common.learnedWords")} value={`${learnedWords.length}`} detail={t("common.flashcards")} icon={ListChecks} tone="orange" />
        <ProgressCard title={t("progress.hskProgress")} value={`${hskProgress}%`} detail={t("progress.currentSet")} icon={BarChart3} tone="blue" />
        <ProgressCard title={t("common.dailyStreak")} value={`${streak}`} detail={t("progress.localStreak")} icon={Flame} tone="orange" />
        <ProgressCard title={t("dashboard.accuracy")} value={`${accuracy}%`} detail={quizResults.length ? t("progress.quizBased") : t("progress.completeQuiz")} icon={Target} tone="purple" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-5xl border border-white/70 bg-white/82 p-7 shadow-premium backdrop-blur-xl">
          <h2 className="text-2xl font-black text-ink">{t("progress.hskProgress")}</h2>
          <div className="mt-6 rounded-4xl bg-cream p-5">
            <div className="mb-2 flex justify-between text-sm font-black text-stone-600">
              <span>HSK 1</span>
              <span>{hskProgress}%</span>
            </div>
            <div className="h-4 rounded-full bg-white">
              <div className="h-4 rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${hskProgress}%` }} />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {quizResults.slice(0, 3).map((result) => (
              <div key={result.completedAt} className="flex items-center justify-between rounded-3xl bg-orange-soft px-4 py-3 shadow-soft">
                <span className="font-black text-ink">HSK {result.level} {t("common.quiz")}</span>
                <span className="font-black text-orange-deep">{result.score}/{result.total}</span>
              </div>
            ))}
            {!quizResults.length ? <p className="text-sm font-semibold text-stone-500">{t("progress.completeQuiz")}</p> : null}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <AchievementBadge icon={Award} title={t("progress.wordBuilder")} detail={t("ach.first10")} unlocked={learnedWords.length >= 10} />
            <AchievementBadge icon={Medal} title={t("progress.sharpRecall")} detail={t("progress.reachAccuracy")} unlocked={accuracy >= 80} />
          </div>
        </div>

        <div className="rounded-5xl border border-white/70 bg-white/82 p-7 shadow-premium backdrop-blur-xl">
          <h2 className="text-2xl font-black text-ink">{t("progress.recentWords")}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {recentWords.length ? recentWords.map((word) => (
              <div key={word.id} className="rounded-4xl bg-cream p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-4xl font-black text-ink">{word.chinese}</p>
                    <p className="mt-1 font-black text-orange-brand">{word.pinyin}</p>
                  </div>
                  <p className="text-right text-sm font-black text-stone-600">{word.translationUz}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm font-semibold text-stone-500">{t("progress.emptyRecent")}</p>
            )}
          </div>
        </div>
      </div>
    </section>
    </ProtectedRoute>
  );
}
