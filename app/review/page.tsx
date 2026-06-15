"use client";

import { ArrowRight, BadgeCheck, Brain, Check, RotateCcw, Target, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WordCard } from "@/components/WordCard";
import { hskWords } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function ReviewPage() {
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const wordReviews = useProgressStore((state) => state.wordReviews);
  const markKnown = useProgressStore((state) => state.markKnown);
  const markWeak = useProgressStore((state) => state.markWeak);
  const saveLearningActivity = useProgressStore((state) => state.saveLearningActivity);
  const { language, t } = useI18n();
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [queueReady, setQueueReady] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
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
  useEffect(() => {
    if (!queueReady) {
      setReviewQueue(dueWords.map((word) => word.id));
      setQueueReady(true);
    }
  }, [dueWords, queueReady]);
  const reviewWord = hskWords.find((word) => word.id === reviewQueue[0]);

  function answer(correct: boolean) {
    if (!reviewWord) return;
    if (correct) {
      markKnown(reviewWord.id);
      setSessionScore((value) => value + 1);
    } else {
      markWeak(reviewWord.id);
    }
    if (reviewQueue.length === 1) {
      saveLearningActivity({ id: `review-${Date.now()}`, type: "review", hskLevel: reviewWord.hskLevel, score: sessionScore + (correct ? 1 : 0), total: sessionScore + (correct ? 1 : 0) + (correct ? 0 : 1), completedAt: new Date().toISOString() });
    }
    setReviewQueue((queue) => queue.slice(1));
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{t("nav.review")}</p>
            <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{t("review.title")}</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
              {t("review.subtitle")}
            </p>
          </div>
          <AppButton href="/flashcard/1" variant="primary">
            {t("review.practice")} <ArrowRight className="h-5 w-5" />
          </AppButton>
        </div>

        {reviewWord ? (
          <div className="mb-8 rounded-[2rem] border border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/40 p-6 text-center shadow-premium sm:p-9">
            <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Осталось" : "Qoldi"}: {reviewQueue.length}</p>
            <p className="mt-4 text-7xl font-black text-ink">{reviewWord.chinese}</p>
            <p className="mt-3 text-xl font-black text-orange-brand">{reviewWord.pinyin}</p>
            <p className="mt-3 text-lg font-bold text-stone-600">{language === "ru" ? reviewWord.translationRu : reviewWord.translationUz}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => answer(false)} className="warm-focus inline-flex items-center justify-center gap-2 rounded-full bg-rose-50 px-6 py-3.5 text-sm font-black text-rose-700 shadow-soft"><X className="h-5 w-5" /> {language === "ru" ? "Нужно повторить" : "Yana takrorlash kerak"}</button>
              <button onClick={() => answer(true)} className="warm-focus inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-soft"><Check className="h-5 w-5" /> {language === "ru" ? "Освоено" : "O‘zlashtirildi"}</button>
            </div>
          </div>
        ) : sessionScore > 0 ? (
          <div className="mb-8 rounded-[2rem] bg-emerald-50 p-8 text-center shadow-soft"><BadgeCheck className="mx-auto h-12 w-12 text-emerald-600" /><h2 className="mt-3 text-3xl font-black text-ink">{language === "ru" ? "Повторение завершено" : "Takrorlash yakunlandi"}</h2><p className="mt-2 font-bold text-stone-600">{sessionScore}</p></div>
        ) : null}

        {dueWords.length || weakWords.length || masteredWords.length || recentWords.length ? (
          <div className="space-y-8">
            {sections.map((section) => section.words.length ? (
              <div key={section.title}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep shadow-soft"><section.icon className="h-6 w-6" /></div>
                  <h2 className="text-3xl font-black text-ink">{section.title}</h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {section.words.map((word) => <WordCard key={`${section.title}-${word.id}`} word={word} />)}
                </div>
              </div>
            ) : null)}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-white/70 bg-white/82 p-10 text-center shadow-premium backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-orange-soft text-orange-deep shadow-soft">
              <RotateCcw className="h-10 w-10" />
            </div>
            <h2 className="text-4xl font-black text-ink">{t("review.empty")}</h2>
            <p className="mx-auto mt-3 max-w-xl font-semibold leading-7 text-stone-500">
              {t("review.subtitle")}
            </p>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
