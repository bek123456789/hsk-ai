"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, BadgeCheck, PartyPopper, Trophy, Zap } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { QuizOption } from "@/components/QuizOption";
import { getWordsByLevel } from "@/data/hskWords";
import { saveMistake as saveRemoteMistake, saveQuizResult as saveRemoteQuizResult, saveWeakWord } from "@/lib/progressService";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { createQuizQuestions } from "@/utils/quiz";
import { useI18n } from "@/utils/i18n";

function parseLevel(value: string | string[] | undefined): HSKLevel {
  const raw = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(raw);
  return numberValue >= 1 && numberValue <= 6 ? (numberValue as HSKLevel) : 1;
}

export default function QuizPage() {
  const params = useParams();
  const level = parseLevel(params.level);
  const { language, t } = useI18n();
  const words = useMemo(() => getWordsByLevel(level), [level]);
  const questions = useMemo(() => createQuizQuestions(words, 8, language), [language, words]);
  const saveQuizResult = useProgressStore((state) => state.saveQuizResult);
  const markKnown = useProgressStore((state) => state.markKnown);
  const markWeak = useProgressStore((state) => state.markWeak);
  const addMistake = useProgressStore((state) => state.addMistake);
  const user = useAuthStore((state) => state.user);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];

  function choose(option: string) {
    if (!question || selected) return;
    setSelected(option);
    if (option === question.correctAnswer) {
      setScore((value) => value + 1);
      markKnown(question.word.id);
    } else {
      markWeak(question.word.id);
      saveWeakWord({ userId: user?.id, wordId: question.word.id, hskLevel: level, lessonId: question.word.lessonId, reason: "quiz" }).catch(() => undefined);
      addMistake({
        source: "quiz",
        hskLevel: level,
        chinese: question.word.chinese,
        pinyin: question.word.pinyin,
        wrongAnswer: option,
        correctAnswer: question.correctAnswer,
        explanation: `${question.word.chinese} — ${question.correctAnswer}.`,
        wordId: question.word.id
      });
      saveRemoteMistake({
        userId: user?.id,
        mistake: {
          id: `quiz-${question.word.id}-${Date.now()}`,
          source: "quiz",
          hskLevel: level,
          chinese: question.word.chinese,
          pinyin: question.word.pinyin,
          wrongAnswer: option,
          correctAnswer: question.correctAnswer,
          explanation: `${question.word.chinese} — ${question.correctAnswer}.`,
          createdAt: new Date().toISOString(),
          learned: false,
          wordId: question.word.id
        }
      }).catch(() => undefined);
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      saveQuizResult({
        level,
        score,
        total: questions.length,
        completedAt: new Date().toISOString()
      });
      saveRemoteQuizResult({ userId: user?.id, level, score, total: questions.length }).catch(() => undefined);
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  if (!questions.length) {
    return (
      <ProtectedRoute>
      <section className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-8">
        <div className="rounded-5xl bg-white/82 p-10 shadow-premium backdrop-blur-xl dark:bg-white/10">
          <h1 className="text-4xl font-black text-ink dark:text-cream">{t("quiz.locked")}</h1>
          <p className="mt-3 font-semibold text-stone-500 dark:text-stone-300">{t("quiz.lockedDetail")}</p>
          <div className="mt-6"><AppButton href="/quiz/1">{t("quiz.openHsk1")}</AppButton></div>
        </div>
      </section>
      </ProtectedRoute>
    );
  }

  if (finished) {
    return (
      <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 text-center sm:px-8 md:pb-10 lg:py-14">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/82 p-10 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                animate={{ opacity: [0, 1, 0], y: [-10, -130], rotate: 240 }}
                transition={{ duration: 1.8, delay: i * 0.05, repeat: Infinity, repeatDelay: 2.5 }}
                className="absolute h-3 w-3 rounded-sm bg-orange-brand"
                style={{ left: `${8 + (i * 5) % 84}%`, bottom: `${8 + (i % 5) * 9}%` }}
              />
            ))}
          </div>
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow">
            <Trophy className="h-10 w-10" />
          </div>
          <h1 className="text-5xl font-black text-ink dark:text-cream">{t("quiz.score")}: {score}/{questions.length}</h1>
          <p className="mt-3 font-semibold text-stone-500 dark:text-stone-300">{t("quiz.saved")}</p>
          <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              [Zap, `+${score * 15} XP`, t("quiz.energy")],
              [BadgeCheck, score >= questions.length * 0.8 ? t("quiz.aceBadge") : t("quiz.practiceBadge"), t("quiz.achievement")],
              [Award, "HSK 1", t("quiz.milestone")]
            ].map(([Icon, title, detail]) => (
              <div key={String(title)} className="rounded-[1.5rem] bg-cream p-4 shadow-soft dark:bg-white/8">
                <Icon className="mx-auto mb-2 h-6 w-6 text-orange-brand" />
                <p className="font-black text-ink dark:text-cream">{String(title)}</p>
                <p className="text-xs font-bold text-stone-500 dark:text-stone-300">{String(detail)}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <AppButton href="/progress" variant="primary">{t("quiz.viewProgress")}</AppButton>
            <AppButton href={`/lesson/${level}`} variant="secondary">{t("quiz.backToLesson")}</AppButton>
          </div>
        </div>
      </section>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <AppButton href={`/lesson/${level}`} variant="ghost" className="px-4">
          <ArrowLeft className="h-5 w-5" /> {t("lesson.vocabulary")}
        </AppButton>
        <div className="min-w-[190px] text-right">
          <p className="text-sm font-black text-stone-500 dark:text-stone-300">{t("quiz.question")} {index + 1} / {questions.length}</p>
          <div className="mt-2 h-3 rounded-full bg-white/80 shadow-soft dark:bg-white/10">
            <div className="h-3 rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${Math.round(((index + 1) / questions.length) * 100)}%` }} />
          </div>
        </div>
      </div>
      <div className="rounded-[2.5rem] border border-white/70 bg-white/82 p-7 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">{t("quiz.chooseMeaning")}</p>
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-xs font-black text-orange-deep">
            <PartyPopper className="h-4 w-4" />
            {score} {t("quiz.correctCount")}
          </span>
        </div>
        <h1 className="mt-6 text-center text-8xl font-black text-ink dark:text-cream">{question.word.chinese}</h1>
        <p className="mt-4 text-center text-2xl font-black text-orange-brand">{question.word.pinyin}</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => (
            <QuizOption
              key={option}
              option={option}
              selected={selected === option}
              correct={option === question.correctAnswer}
              disabled={Boolean(selected)}
              onClick={() => choose(option)}
            />
          ))}
        </div>
        {selected ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-7 flex items-center justify-between gap-4 rounded-4xl bg-cream p-4 shadow-soft dark:bg-obsidian/60">
            <p className="font-black text-ink dark:text-cream">
              {selected === question.correctAnswer ? t("quiz.correct") : `${t("quiz.correct")}: ${question.correctAnswer}`}
            </p>
            <button onClick={next} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-5 py-3 text-sm font-black text-white shadow-card">
              {t("common.next")} <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        ) : null}
      </div>
    </section>
    </ProtectedRoute>
  );
}
