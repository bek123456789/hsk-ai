"use client";

import { ArrowRight, BadgeCheck, Brain, RotateCcw, Target } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WordCard } from "@/components/WordCard";
import { hskWords } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function ReviewPage() {
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const wordReviews = useProgressStore((state) => state.wordReviews);
  const { t } = useI18n();
  const today = Date.now();
  const dueWords = hskWords.filter((word) => {
    const review = wordReviews?.[word.id];
    return review?.nextReviewAt ? new Date(review.nextReviewAt).getTime() <= today : weakWordIds.includes(word.id);
  });
  const weakWords = hskWords.filter((word) => weakWordIds.includes(word.id) || wordReviews?.[word.id]?.status === "learning");
  const masteredWords = hskWords.filter((word) => wordReviews?.[word.id]?.status === "mastered");
  const recentWords = hskWords.filter((word) => Boolean(wordReviews?.[word.id]?.lastReviewedAt)).slice(0, 6);
  const sections = [
    { title: t("review.title"), icon: RotateCcw, words: dueWords },
    { title: t("review.weak"), icon: Target, words: weakWords },
    { title: t("review.mastered"), icon: BadgeCheck, words: masteredWords },
    { title: t("review.recent"), icon: Brain, words: recentWords }
  ];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">{t("nav.review")}</p>
            <h1 className="mt-2 text-5xl font-black text-ink dark:text-cream sm:text-7xl">{t("review.title")}</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">
              {t("review.subtitle")}
            </p>
          </div>
          <AppButton href="/flashcard/1" variant="primary">
            {t("review.practice")} <ArrowRight className="h-5 w-5" />
          </AppButton>
        </div>

        {dueWords.length || weakWords.length || masteredWords.length || recentWords.length ? (
          <div className="space-y-8">
            {sections.map((section) => section.words.length ? (
              <div key={section.title}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep shadow-soft"><section.icon className="h-6 w-6" /></div>
                  <h2 className="text-3xl font-black text-ink dark:text-cream">{section.title}</h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {section.words.map((word) => <WordCard key={`${section.title}-${word.id}`} word={word} />)}
                </div>
              </div>
            ) : null)}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-white/70 bg-white/82 p-10 text-center shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-mint text-emerald-700 shadow-soft">
              <RotateCcw className="h-10 w-10" />
            </div>
            <h2 className="text-4xl font-black text-ink dark:text-cream">{t("review.empty")}</h2>
            <p className="mx-auto mt-3 max-w-xl font-semibold leading-7 text-stone-500 dark:text-stone-300">
              {t("review.subtitle")}
            </p>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
