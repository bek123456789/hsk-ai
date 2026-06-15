"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Mic, PartyPopper, Sparkles, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Flashcard } from "@/components/Flashcard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SpeakingPracticeCard } from "@/components/SpeakingPracticeCard";
import { getWordsByLevel } from "@/data/hskWords";
import { saveMistake as saveRemoteMistake, saveWeakWord, saveWordProgress } from "@/lib/progressService";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { getWordTranslation, useI18n } from "@/utils/i18n";
import { percent } from "@/utils/progress";
import { saveRecentlySeenContent } from "@/utils/contentPicker";

function parseLevel(value: string | string[] | undefined): HSKLevel {
  const raw = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(raw);
  return numberValue >= 1 && numberValue <= 6 ? (numberValue as HSKLevel) : 1;
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getFlashcardDeck(level: HSKLevel) {
  const words = getWordsByLevel(level);
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(new Date());
  let recentIds: string[] = [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem("hsk_recent_vocabulary") ?? "[]");
    recentIds = Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    recentIds = [];
  }
  const recent = new Set(recentIds);
  const fresh = words.filter((word) => !recent.has(word.id));
  const source = fresh.length >= 20 ? fresh : words;
  return [...source]
    .sort((left, right) => stableHash(`${date}:${level}:${left.id}`) - stableHash(`${date}:${level}:${right.id}`))
    .slice(0, 20);
}

export default function FlashcardPage() {
  const params = useParams();
  const level = parseLevel(params.level);
  const words = useMemo(() => getFlashcardDeck(level), [level]);
  const [index, setIndex] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [speakingOpen, setSpeakingOpen] = useState(false);
  const markKnown = useProgressStore((state) => state.markKnown);
  const markWeak = useProgressStore((state) => state.markWeak);
  const markReviewed = useProgressStore((state) => state.markReviewed);
  const saveSpeakingResult = useProgressStore((state) => state.saveSpeakingResult);
  const addMistake = useProgressStore((state) => state.addMistake);
  const user = useAuthStore((state) => state.user);
  const { language, t } = useI18n();
  const word = words[index];
  const done = !word;
  const progress = percent(Math.min(index + 1, words.length), words.length);

  function next(known: boolean) {
    if (!word) return;
    if (known) {
      markKnown(word.id);
      saveWordProgress({ userId: user?.id, wordId: word.id, hskLevel: level, lessonId: word.lessonId, status: "review", correctCount: 1, easeLevel: 2, lastReviewedAt: new Date().toISOString() }).catch(() => undefined);
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 900);
    } else {
      markWeak(word.id);
      saveWeakWord({ userId: user?.id, wordId: word.id, hskLevel: level, lessonId: word.lessonId, reason: "flashcard" }).catch(() => undefined);
      saveWordProgress({ userId: user?.id, wordId: word.id, hskLevel: level, lessonId: word.lessonId, status: "learning", wrongCount: 1, easeLevel: 1, lastReviewedAt: new Date().toISOString() }).catch(() => undefined);
      addMistake({
        source: "flashcard",
        hskLevel: level,
        chinese: word.chinese,
        pinyin: word.pinyin,
        wrongAnswer: t("flashcard.tap"),
        correctAnswer: getWordTranslation(word, language),
        explanation: `${word.chinese} — ${getWordTranslation(word, language)}.`,
        wordId: word.id
      });
      saveRemoteMistake({
        userId: user?.id,
        mistake: {
          id: `flashcard-${word.id}-${Date.now()}`,
          source: "flashcard",
          hskLevel: level,
          chinese: word.chinese,
          pinyin: word.pinyin,
          wrongAnswer: t("flashcard.tap"),
          correctAnswer: getWordTranslation(word, language),
          explanation: `${word.chinese} — ${getWordTranslation(word, language)}.`,
          createdAt: new Date().toISOString(),
          learned: false,
          wordId: word.id
        }
      }).catch(() => undefined);
    }
    markReviewed(word.id);
    saveRecentlySeenContent("vocabulary", [word.id]);
    setSpeakingOpen(false);
    setIndex((value) => value + 1);
  }

  return (
    <ProtectedRoute>
    <section className="premium-grid relative mx-auto max-w-5xl overflow-hidden px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
      <AnimatePresence>
        {celebrate ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="pointer-events-none fixed inset-x-0 top-28 z-50 mx-auto flex w-fit items-center gap-3 rounded-full bg-gradient-to-r from-orange-brand to-amber-300 px-6 py-4 text-sm font-black text-white shadow-glow"
          >
            <PartyPopper className="h-5 w-5" />
            +25 XP · {t("flashcard.masteredToast")}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="mb-8 flex items-center justify-between gap-4">
        <AppButton href={`/lesson/${level}`} variant="ghost" className="px-4">
          <ArrowLeft className="h-5 w-5" /> {t("lesson.vocabulary")}
        </AppButton>
        <div className="min-w-[160px] text-right">
          <p className="text-sm font-black text-stone-500">{Math.min(index + 1, words.length)} / {words.length}</p>
          <div className="mt-2 h-3 rounded-full bg-white/80 shadow-soft">
            <div className="h-3 rounded-full bg-gradient-to-r from-orange-brand to-amber-300 shadow-card" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {done ? (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/82 p-10 text-center shadow-premium backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow">
            <Sparkles className="h-10 w-10" />
          </div>
          <h1 className="text-5xl font-black text-ink">{t("flashcard.complete")}</h1>
          <p className="mt-3 font-semibold text-stone-500">{t("flashcard.saved")}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <AppButton href="/progress" variant="primary">{t("quiz.viewProgress")}</AppButton>
            <AppButton href={`/quiz/${level}`} variant="secondary">{t("common.quiz")}</AppButton>
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={word.id}
              initial={{ opacity: 0, x: 70, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -70, rotate: -2 }}
              transition={{ duration: 0.25 }}
            >
              <Flashcard word={word} />
            </motion.div>
          </AnimatePresence>
          {speakingOpen ? (
            <div className="mt-6">
              <SpeakingPracticeCard
                wordId={word.id}
                hanzi={word.chinese}
                pinyin={word.pinyin}
                translationUz={word.translationUz}
                translationRu={word.translationRu ?? word.translationUz}
                hskLevel={level}
                lessonId={word.lessonId}
                onCorrect={saveSpeakingResult}
                onWrong={saveSpeakingResult}
                onNext={() => next(true)}
              />
            </div>
          ) : null}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={() => next(false)} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/82 px-6 py-4 text-sm font-black text-ink shadow-soft backdrop-blur transition hover:-translate-y-1">
              <X className="h-5 w-5 text-red-500" /> {t("flashcard.dontKnow")}
            </button>
            <button onClick={() => next(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-4 text-sm font-black text-white shadow-glow transition hover:-translate-y-1">
              {t("flashcard.know")} <Check className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => setSpeakingOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-5 py-3 text-sm font-black text-orange-deep shadow-soft">
              <Mic className="h-4 w-4" /> {language === "ru" ? "Произношение" : "Gapirish"}
            </button>
            <button onClick={() => next(false)} className="inline-flex items-center gap-2 text-sm font-black text-stone-500 hover:text-orange-deep">
              {t("flashcard.skip")} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </section>
    </ProtectedRoute>
  );
}
