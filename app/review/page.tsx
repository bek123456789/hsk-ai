"use client";

import { ArrowRight, BadgeCheck, Brain, Check, HelpCircle, RotateCcw, Target, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WordCard } from "@/components/WordCard";
import { hskWords } from "@/data/hskWords";
import { saveWordProgress } from "@/lib/progressService";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useProgressStore } from "@/store/progressStore";
import type { HSKWord, WordReviewState } from "@/types";
import { useI18n } from "@/utils/i18n";
import { getReviewPrompt, getReviewQueue, saveReviewItemFallback, type ReviewQueueItem } from "@/utils/spacedReview";
import { speakChinese } from "@/utils/speechSynthesis";

type ReviewAnswer = "again" | "hard" | "easy" | "mastered";

async function syncReviewProgress(word: HSKWord, review: WordReviewState) {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    await saveWordProgress({
      userId,
      wordId: word.id,
      hskLevel: word.hskLevel,
      lessonId: word.lessonId,
      status: review.status,
      correctCount: review.correctCount,
      wrongCount: review.wrongCount,
      lastReviewedAt: review.lastReviewedAt,
      nextReviewAt: review.nextReviewAt,
      easeLevel: review.easeLevel
    });
  } catch {
    // LocalStorage fallback keeps the review session safe when Supabase tables are absent.
  }
}

export default function ReviewPage() {
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const wordReviews = useProgressStore((state) => state.wordReviews);
  const mistakes = useProgressStore((state) => state.mistakes);
  const markKnown = useProgressStore((state) => state.markKnown);
  const markWeak = useProgressStore((state) => state.markWeak);
  const updateWordReview = useProgressStore((state) => state.updateWordReview);
  const saveLearningActivity = useProgressStore((state) => state.saveLearningActivity);
  const { language, t } = useI18n();
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [queueReady, setQueueReady] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const builtQueue = useMemo(
    () => getReviewQueue({ words: hskWords, knownWordIds, weakWordIds, wordReviews, mistakes, limit: 12 }),
    [knownWordIds, mistakes, weakWordIds, wordReviews]
  );
  const dueWords = builtQueue.map((item) => item.word);
  const weakWords = hskWords.filter((word) => weakWordIds.includes(word.id) || wordReviews?.[word.id]?.status === "learning" || wordReviews?.[word.id]?.status === "weak");
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
      setReviewQueue(builtQueue);
      setQueueReady(true);
    }
  }, [builtQueue, queueReady]);

  const reviewItem = reviewQueue[0];
  const reviewWord = reviewItem?.word;

  function answer(value: ReviewAnswer) {
    if (!reviewWord) return;
    const correct = value === "easy" || value === "mastered";
    const hard = value === "hard";

    if (value === "mastered") {
      markKnown(reviewWord.id);
    } else if (correct || hard) {
      updateWordReview(reviewWord.id, correct);
    } else {
      markWeak(reviewWord.id);
    }

    const nextReview = useProgressStore.getState().wordReviews?.[reviewWord.id];
    if (nextReview) {
      saveReviewItemFallback(reviewWord, nextReview);
      void syncReviewProgress(reviewWord, nextReview);
    }

    const nextScore = sessionScore + (correct ? 1 : 0);
    const nextTotal = sessionTotal + 1;
    setSessionScore(nextScore);
    setSessionTotal(nextTotal);

    if (reviewQueue.length === 1) {
      saveLearningActivity({
        id: `review-${Date.now()}`,
        type: "review",
        hskLevel: reviewWord.hskLevel,
        score: nextScore,
        total: nextTotal,
        completedAt: new Date().toISOString()
      });
    }

    setShowAnswer(false);
    setReviewQueue((queue) => queue.slice(1));
  }

  function promptContent() {
    if (!reviewWord || !reviewItem) return null;
    if (reviewItem.cardType === "reverse") {
      return (
        <>
          <p className="mt-4 text-4xl font-black text-ink">{language === "ru" ? reviewWord.translationRu : reviewWord.translationUz}</p>
          <p className="mt-3 text-sm font-bold text-stone-500">{language === "ru" ? "Вспомните китайское слово." : "Xitoycha so‘zni eslang."}</p>
        </>
      );
    }
    if (reviewItem.cardType === "listening") {
      return (
        <>
          <button onClick={() => speakChinese(reviewWord.chinese)} className="mx-auto mt-5 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-orange-brand text-white shadow-glow">
            <Volume2 className="h-9 w-9" />
          </button>
          <p className="mt-4 text-lg font-black text-stone-600">{language === "ru" ? "Сначала послушайте, затем проверьте ответ." : "Avval eshiting, keyin javobni tekshiring."}</p>
        </>
      );
    }
    if (reviewItem.cardType === "sentence") {
      return (
        <>
          <p className="mt-4 text-3xl font-black leading-relaxed text-ink">{reviewWord.exampleChinese}</p>
          <p className="mt-3 text-sm font-bold text-stone-500">{language === "ru" ? "Главное слово в предложении." : "Gapdagi asosiy so‘zni toping."}</p>
        </>
      );
    }
    return (
      <>
        <p className="mt-4 text-7xl font-black text-ink">{reviewWord.chinese}</p>
        {reviewItem.cardType === "pinyin" ? null : <p className="mt-3 text-xl font-black text-orange-brand">{reviewWord.pinyin}</p>}
      </>
    );
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{t("nav.review")}</p>
            <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{t("review.title")}</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">{t("review.subtitle")}</p>
          </div>
          <AppButton href="/flashcard/1" variant="primary">
            {t("review.practice")} <ArrowRight className="h-5 w-5" />
          </AppButton>
        </div>

        {reviewWord && reviewItem ? (
          <div className="mb-8 rounded-[2rem] border border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/40 p-6 text-center shadow-premium sm:p-9">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-orange-deep shadow-soft">{language === "ru" ? "Сегодня" : "Bugun"} {builtQueue.length} {language === "ru" ? "слов" : "ta so‘z"}</p>
              <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-stone-600 shadow-soft">{language === "ru" ? "Осталось" : "Qoldi"}: {reviewQueue.length}</p>
            </div>
            <p className="mt-5 text-sm font-black text-orange-deep">{getReviewPrompt(reviewItem.cardType, language)}</p>
            {promptContent()}
            {showAnswer ? (
              <div className="mx-auto mt-6 max-w-xl rounded-[1.5rem] bg-white/88 p-5 shadow-soft">
                <p className="text-4xl font-black text-ink">{reviewWord.chinese}</p>
                <p className="mt-2 text-lg font-black text-orange-brand">{reviewWord.pinyin}</p>
                <p className="mt-2 font-bold text-stone-700">{language === "ru" ? reviewWord.translationRu : reviewWord.translationUz}</p>
                <p className="mt-3 text-sm font-semibold text-stone-500">{language === "ru" ? reviewWord.exampleRu : reviewWord.exampleUz}</p>
              </div>
            ) : (
              <button onClick={() => setShowAnswer(true)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-orange-deep shadow-soft">
                <HelpCircle className="h-4 w-4" /> {language === "ru" ? "Показать ответ" : "Javobni ko‘rsatish"}
              </button>
            )}
            <div className="mt-7 grid gap-3 sm:grid-cols-4">
              <button onClick={() => answer("again")} className="warm-focus inline-flex items-center justify-center gap-2 rounded-full bg-rose-50 px-5 py-3.5 text-sm font-black text-rose-700 shadow-soft"><X className="h-5 w-5" /> {language === "ru" ? "Не знаю" : "Bilmayman"}</button>
              <button onClick={() => answer("hard")} className="warm-focus inline-flex items-center justify-center gap-2 rounded-full bg-amber-50 px-5 py-3.5 text-sm font-black text-amber-800 shadow-soft"><RotateCcw className="h-5 w-5" /> {language === "ru" ? "Сложно" : "Qiyin"}</button>
              <button onClick={() => answer("easy")} className="warm-focus inline-flex items-center justify-center gap-2 rounded-full bg-orange-soft px-5 py-3.5 text-sm font-black text-orange-deep shadow-soft"><Check className="h-5 w-5" /> {language === "ru" ? "Легко" : "Oson"}</button>
              <button onClick={() => answer("mastered")} className="warm-focus inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-amber-400 px-5 py-3.5 text-sm font-black text-white shadow-soft"><BadgeCheck className="h-5 w-5" /> {language === "ru" ? "Выучено" : "Yodlandi"}</button>
            </div>
            <p className="mt-4 text-xs font-bold text-stone-500">{language === "ru" ? "Сложные слова вернутся завтра." : "Qiyin so‘zlar ertaga takrorlanadi."}</p>
          </div>
        ) : sessionTotal > 0 ? (
          <div className="mb-8 rounded-[2rem] bg-orange-soft/60 p-8 text-center shadow-soft">
            <BadgeCheck className="mx-auto h-12 w-12 text-orange-deep" />
            <h2 className="mt-3 text-3xl font-black text-ink">{language === "ru" ? "Повторение завершено" : "Takrorlash yakunlandi"}</h2>
            <p className="mt-2 font-bold text-stone-600">{sessionScore}/{sessionTotal}</p>
          </div>
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
            <p className="mx-auto mt-3 max-w-xl font-semibold leading-7 text-stone-500">{t("review.subtitle")}</p>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
