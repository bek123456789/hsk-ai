"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, BadgeCheck, PartyPopper, Trophy, Zap } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getQuizQuestionsByLevel, saveRecentlySeenContent } from "@/utils/contentPicker";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
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
  const questions = useMemo(() => getQuizQuestionsByLevel(level, "all", 12), [level]);
  const saveQuizResult = useProgressStore((state) => state.saveQuizResult);
  const addMistake = useProgressStore((state) => state.addMistake);
  const user = useAuthStore((state) => state.user);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];
  const correctOption = question?.options?.find((option) => option.id === question.correctOptionId);

  function choose(optionId: string) {
    if (!question || selected) return;
    setSelected(optionId);
    saveRecentlySeenContent("quiz", [question.id]);
    if (optionId === question.correctOptionId) {
      setScore((value) => value + 1);
    } else {
      const selectedOption = question.options?.find((option) => option.id === optionId);
      addMistake({
        source: "quiz",
        hskLevel: level,
        chinese: question.promptZh ?? "",
        pinyin: question.promptPinyin,
        wrongAnswer: language === "ru" ? selectedOption?.textRu ?? optionId : selectedOption?.textUz ?? optionId,
        correctAnswer: language === "ru" ? correctOption?.textRu ?? "" : correctOption?.textUz ?? "",
        explanation: language === "ru" ? question.explanationRu : question.explanationUz
      });
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      saveQuizResult({ level, score: score + (selected === question?.correctOptionId ? 0 : 0), total: questions.length, completedAt: new Date().toISOString() });
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
          <div className="rounded-5xl bg-white/82 p-10 shadow-premium backdrop-blur-xl">
            <h1 className="text-4xl font-black text-ink">{t("quiz.locked")}</h1>
            <p className="mt-3 font-semibold text-stone-500">{t("quiz.lockedDetail")}</p>
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
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/82 p-10 shadow-premium backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 20, rotate: 0 }} animate={{ opacity: [0, 1, 0], y: [-10, -130], rotate: 240 }} transition={{ duration: 1.8, delay: i * 0.05, repeat: Infinity, repeatDelay: 2.5 }} className="absolute h-3 w-3 rounded-sm bg-orange-brand" style={{ left: `${8 + (i * 5) % 84}%`, bottom: `${8 + (i % 5) * 9}%` }} />
              ))}
            </div>
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow">
              <Trophy className="h-10 w-10" />
            </div>
            <h1 className="text-5xl font-black text-ink">{t("quiz.score")}: {score}/{questions.length}</h1>
            <p className="mt-3 font-semibold text-stone-500">{t("quiz.saved")}</p>
            <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                [Zap, `+${score * 15} XP`, t("quiz.energy")],
                [BadgeCheck, score >= questions.length * 0.8 ? t("quiz.aceBadge") : t("quiz.practiceBadge"), t("quiz.achievement")],
                [Award, `HSK ${level}`, t("quiz.milestone")]
              ].map(([Icon, title, detail]) => (
                <div key={String(title)} className="rounded-[1.5rem] bg-cream p-4 shadow-soft">
                  <Icon className="mx-auto mb-2 h-6 w-6 text-orange-brand" />
                  <p className="font-black text-ink">{String(title)}</p>
                  <p className="text-xs font-bold text-stone-500">{String(detail)}</p>
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
            <p className="text-sm font-black text-stone-500">{t("quiz.question")} {index + 1} / {questions.length}</p>
            <div className="mt-2 h-3 rounded-full bg-white/80 shadow-soft">
              <div className="h-3 rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${Math.round(((index + 1) / questions.length) * 100)}%` }} />
            </div>
          </div>
        </div>
        <div className="rounded-[2.5rem] border border-white/70 bg-white/82 p-7 shadow-premium backdrop-blur-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{language === "ru" ? question.questionRu : question.questionUz}</p>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-xs font-black text-orange-deep">
              <PartyPopper className="h-4 w-4" />
              {score} {t("quiz.correctCount")}
            </span>
          </div>
          <h1 className="mt-6 text-center text-7xl font-black text-ink">{question.promptZh}</h1>
          {question.promptPinyin ? <p className="mt-4 text-center text-2xl font-black text-orange-brand">{question.promptPinyin}</p> : null}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {(question.options ?? []).map((option) => {
              const label = language === "ru" ? option.textRu ?? option.textZh : option.textUz ?? option.textZh;
              const isSelected = selected === option.id;
              const isCorrect = selected && option.id === question.correctOptionId;
              return (
                <button key={option.id} disabled={Boolean(selected)} onClick={() => choose(option.id)} className={`rounded-[1.5rem] border px-5 py-4 text-left text-sm font-black shadow-soft transition ${isCorrect ? "border-orange-brand bg-orange-soft text-orange-deep" : isSelected ? "border-rose-200 bg-rose-50 text-rose-700" : "border-white bg-cream text-ink hover:-translate-y-1"}`}>
                  {label}
                </button>
              );
            })}
          </div>
          {selected ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-7 flex flex-col justify-between gap-4 rounded-4xl bg-cream p-4 shadow-soft sm:flex-row sm:items-center">
              <p className="font-black text-ink">
                {selected === question.correctOptionId ? t("quiz.correct") : `${t("quiz.correct")}: ${language === "ru" ? correctOption?.textRu : correctOption?.textUz}`}
                <span className="mt-2 block text-sm font-semibold text-stone-600">{language === "ru" ? question.explanationRu : question.explanationUz}</span>
              </p>
              <button onClick={next} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-5 py-3 text-sm font-black text-white shadow-card">
                {t("common.next")} <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : null}
        </div>
      </section>
    </ProtectedRoute>
  );
}
