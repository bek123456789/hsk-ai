"use client";

import { ArrowRight, Award, BookOpen, Brain, Clock3, Flame, GraduationCap, Headphones, Map, NotebookTabs, PenLine, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { AchievementBadge } from "@/components/AchievementBadge";
import { AITutorCard } from "@/components/AITutorCard";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { MascotIllustration, StudyScene } from "@/components/PremiumIllustrations";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProgressCard } from "@/components/ProgressCard";
import { hskWords } from "@/data/hskWords";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { percent } from "@/utils/progress";

export default function DashboardPage() {
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const quizResults = useProgressStore((state) => state.quizResults);
  const streak = useProgressStore((state) => state.streak);
  const progress = percent(knownWordIds.length, hskWords.length);
  const totalAnswered = quizResults.reduce((sum, result) => sum + result.total, 0);
  const totalCorrect = quizResults.reduce((sum, result) => sum + result.score, 0);
  const accuracy = percent(totalCorrect, totalAnswered);
  const xp = knownWordIds.length * 25 + totalCorrect * 15 + streak * 40;
  const recommended = hskWords.find((word) => !knownWordIds.includes(word.id)) ?? hskWords[0];
  const user = useAuthStore((state) => state.user);
  const { t } = useI18n();

  return (
    <ProtectedRoute>
    <section className="premium-grid mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">{t("dashboard.mission")}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-ink dark:text-cream sm:text-6xl">{user?.name ? `${user.name}` : t("dashboard.titleFallback")}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">
            {t("dashboard.subtitle")}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AppButton href="/lesson/1" variant="primary">
              {t("common.continueLearning")} <ArrowRight className="h-5 w-5" />
            </AppButton>
            <AppButton href="/flashcard/1" variant="secondary">
              {t("common.flashcards")}
            </AppButton>
          </div>
        </div>
        <StudyScene />
      </div>

      <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
        <ProgressCard title={t("dashboard.xp")} value={`${xp}`} detail="XP" icon={Zap} tone="orange" />
        <ProgressCard title={t("common.dailyStreak")} value={`${streak}`} detail="HSK AI" icon={Flame} tone="orange" />
        <ProgressCard title={t("dashboard.currentLevel")} value="HSK 1" detail="HSK AI" icon={GraduationCap} tone="green" />
        <ProgressCard title={t("common.learnedWords")} value={`${knownWordIds.length}`} detail={`${progress}%`} icon={Target} tone="blue" />
        <ProgressCard title={t("dashboard.accuracy")} value={`${accuracy}%`} detail={t("common.quiz")} icon={Brain} tone="purple" />
        <ProgressCard title={t("dashboard.learningTime")} value={`${Math.max(8, knownWordIds.length * 3)}m`} detail={t("dashboard.weeklyProgress")} icon={Clock3} tone="green" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-orange-deep dark:text-orange-200">{t("dashboard.recommendedLesson")}</p>
              <h2 className="mt-1 text-3xl font-black text-ink dark:text-cream">{t("dashboard.masterWords")}</h2>
            </div>
            <div className="hidden h-16 w-16 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft sm:flex">
              <BookOpen className="h-8 w-8" />
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-cream via-orange-soft to-white p-6 shadow-soft dark:from-white/10 dark:via-orange-brand/14 dark:to-white/5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-7xl font-black text-ink dark:text-cream">{recommended.chinese}</p>
                <p className="mt-2 text-xl font-black text-orange-brand">{recommended.pinyin}</p>
                <p className="mt-3 text-lg font-bold text-stone-600 dark:text-stone-300">{recommended.translationUz}</p>
              </div>
              <div className="flex gap-3">
                <AppButton href="/flashcard/1" variant="secondary">{t("common.flashcards")}</AppButton>
                <AppButton href="/quiz/1" variant="primary">{t("common.quiz")}</AppButton>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between text-sm font-black text-stone-500 dark:text-stone-300">
              <span>{t("dashboard.weeklyProgress")}</span>
              <span>{progress}%</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[35, 52, 42, 74, 58, progress, 18].map((height, index) => (
                <div key={index} className="flex h-24 items-end rounded-2xl bg-cream p-1.5 dark:bg-white/8">
                  <div className="w-full rounded-xl bg-gradient-to-t from-orange-brand to-amber-300 shadow-card" style={{ height: `${Math.max(16, height)}%` }} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <AITutorCard compact />
          <Card className="p-6">
            <div className="grid gap-4 sm:grid-cols-[0.7fr_1fr]">
              <MascotIllustration compact />
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender text-violet-700">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-black text-ink dark:text-cream">{t("dashboard.dailyGoal")}</p>
                    <p className="text-sm font-semibold text-stone-500 dark:text-stone-300">{t("dashboard.dailyGoalDetail")}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <AchievementBadge icon={Award} title={t("ach.first10")} detail="10" unlocked={knownWordIds.length >= 10} />
                  <AchievementBadge icon={Trophy} title={t("ach.quizMaster")} detail="80%+" unlocked={accuracy >= 80} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-orange-deep dark:text-orange-200">{t("dashboard.todayPlan")}</p>
              <h2 className="mt-1 text-3xl font-black text-ink dark:text-cream">{t("dashboard.estimatedTime")}</h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft"><Sparkles className="h-7 w-7" /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[t("dashboard.newWordsPlan"), t("dashboard.reviewPlan"), t("dashboard.quizPlan"), t("dashboard.listeningPlan")].map((item) => (
              <div key={item} className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-700 shadow-soft dark:bg-white/8 dark:text-stone-200">{item}</div>
            ))}
          </div>
          <div className="mt-5 h-3 rounded-full bg-cream shadow-inner dark:bg-white/10">
            <div className="h-3 rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-black text-orange-deep dark:text-orange-200">{t("dashboard.dailyChallenge")}</p>
          <h2 className="mt-1 text-3xl font-black text-ink dark:text-cream">{t("dashboard.dailyChallengeDetail")}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              ["/placement-test", t("dashboard.placement"), Target],
              ["/exam", t("dashboard.examCenter"), Trophy],
              ["/roadmap", t("dashboard.roadmap"), Map],
              ["/mistakes", t("mistakes.title"), NotebookTabs],
              ["/listening/1", t("listening.title"), Headphones],
              ["/writing/1", t("writing.title"), PenLine]
            ].map(([href, label, Icon]) => (
              <AppButton key={String(href)} href={String(href)} variant="secondary" className="justify-start">
                <Icon className="h-5 w-5" /> {String(label)}
              </AppButton>
            ))}
          </div>
        </Card>
      </div>
    </section>
    </ProtectedRoute>
  );
}
