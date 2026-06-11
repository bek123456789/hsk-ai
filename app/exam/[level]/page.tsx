"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock3, Volume2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getExamQuestions } from "@/data/examQuestions";
import { saveExamResult as saveRemoteExamResult, saveMistake as saveRemoteMistake, saveWeakWord } from "@/lib/progressService";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { formatSeconds, getLocalizedQuestion, isExamUnlocked } from "@/utils/exam";
import { useI18n } from "@/utils/i18n";

function parseLevel(value: string | string[] | undefined): HSKLevel {
  const raw = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(raw);
  return numberValue >= 1 && numberValue <= 6 ? (numberValue as HSKLevel) : 1;
}

export default function ExamLevelPage() {
  const router = useRouter();
  const params = useParams();
  const level = parseLevel(params.level);
  const { language, t } = useI18n();
  const questions = useMemo(() => getExamQuestions(level).slice(0, 20), [level]);
  const bestScoreByLevel = useProgressStore((state) => state.bestScoreByLevel);
  const saveExamAttempt = useProgressStore((state) => state.saveExamAttempt);
  const addMistake = useProgressStore((state) => state.addMistake);
  const markWeak = useProgressStore((state) => state.markWeak);
  const user = useAuthStore((state) => state.user);
  const unlocked = isExamUnlocked(level, bestScoreByLevel ?? {});
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const question = questions[index];
  const localized = question ? getLocalizedQuestion(question, language) : null;

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  function speak() {
    if (!question || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(question.promptChinese);
    utterance.lang = "zh-CN";
    window.speechSynthesis.speak(utterance);
  }

  function submit() {
    if (!unlocked) return;
    const checkedAnswers = questions.map((item) => {
      const local = getLocalizedQuestion(item, language);
      const selectedAnswer = answers[item.id] ?? "";
      return {
        questionId: item.id,
        selectedAnswer,
        correctAnswer: local.correctAnswer,
        correct: selectedAnswer === local.correctAnswer
      };
    });
    const correctAnswers = checkedAnswers.filter((answer) => answer.correct).length;
    const wrongAnswers = checkedAnswers.length - correctAnswers;
    const accuracy = Math.round((correctAnswers / checkedAnswers.length) * 100);
    const id = `exam-${level}-${Date.now()}`;

    checkedAnswers.forEach((answer) => {
      if (!answer.correct) {
        const item = questions.find((candidate) => candidate.id === answer.questionId);
        if (!item) return;
        const local = getLocalizedQuestion(item, language);
        markWeak(item.id);
        saveWeakWord({ userId: user?.id, wordId: item.id, hskLevel: level, reason: "exam" }).catch(() => undefined);
        addMistake({
          source: "exam",
          hskLevel: level,
          chinese: item.promptChinese,
          pinyin: item.promptPinyin,
          wrongAnswer: answer.selectedAnswer || "—",
          correctAnswer: local.correctAnswer,
          explanation: local.explanation
        });
        saveRemoteMistake({
          userId: user?.id,
          questionId: item.id,
          mistake: {
            id: `exam-${item.id}-${Date.now()}`,
            source: "exam",
            hskLevel: level,
            chinese: item.promptChinese,
            pinyin: item.promptPinyin,
            wrongAnswer: answer.selectedAnswer || "—",
            correctAnswer: local.correctAnswer,
            explanation: local.explanation,
            createdAt: new Date().toISOString(),
            learned: false,
            wordId: item.id
          }
        }).catch(() => undefined);
      }
    });

    const attempt = {
      id,
      hskLevel: level,
      score: correctAnswers,
      total: checkedAnswers.length,
      accuracy,
      correctAnswers,
      wrongAnswers,
      timeSpentSeconds: Math.floor((Date.now() - startedAt) / 1000),
      completedAt: new Date().toISOString(),
      answers: checkedAnswers
    };

    saveExamAttempt(attempt);
    saveRemoteExamResult({ userId: user?.id, attempt }).catch(() => undefined);
    router.push(`/exam/${level}/result?attempt=${id}`);
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-6 flex items-center justify-between gap-3">
          <AppButton href="/exam" variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> {t("nav.exam")}</AppButton>
          <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-ink shadow-soft dark:bg-white/10 dark:text-cream">
            <Clock3 className="mr-2 inline h-4 w-4 text-orange-brand" />{t("exam.timer")} {formatSeconds(elapsed)}
          </div>
        </div>
        {!unlocked ? <div className="mb-5 rounded-4xl bg-orange-soft p-4 text-sm font-black text-orange-deep shadow-soft">{t("exam.previewLocked")}</div> : null}
        {question && localized ? (
          <div className="rounded-[2.5rem] border border-white/70 bg-white/84 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:p-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-orange-deep dark:text-orange-200">{t("exam.practice")} · HSK {level}</p>
                <h1 className="mt-1 text-3xl font-black text-ink dark:text-cream">{localized.question}</h1>
              </div>
              <span className="text-sm font-black text-stone-500 dark:text-stone-300">{index + 1}/{questions.length}</span>
            </div>
            <div className="h-3 rounded-full bg-cream shadow-inner dark:bg-white/10">
              <div className="h-3 rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${Math.round(((index + 1) / questions.length) * 100)}%` }} />
            </div>
            <div className="my-8 rounded-[2rem] bg-cream p-7 text-center shadow-soft dark:bg-obsidian/60">
              {question.type === "listening" ? (
                <button onClick={speak} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-brand text-white shadow-glow">
                  <Volume2 className="h-8 w-8" />
                </button>
              ) : null}
              <p className="text-6xl font-black text-ink dark:text-cream">{question.promptChinese}</p>
              {question.type !== "pinyin" ? <p className="mt-3 text-xl font-black text-orange-brand">{question.promptPinyin}</p> : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {localized.options.map((option) => {
                const selected = answers[question.id] === option;
                return (
                  <button
                    key={option}
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                    className={`rounded-4xl border p-4 text-left text-sm font-black shadow-soft transition hover:-translate-y-0.5 ${
                      selected ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-white/70 bg-white/80 text-ink dark:border-white/10 dark:bg-white/10 dark:text-cream"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-7 flex flex-col justify-between gap-3 sm:flex-row">
              <button disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))} className="rounded-full bg-white/80 px-5 py-3 text-sm font-black text-ink shadow-soft disabled:opacity-40 dark:bg-white/10 dark:text-cream">{t("common.back")}</button>
              {index + 1 === questions.length ? (
                <button disabled={!unlocked} onClick={submit} className="rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-card disabled:opacity-45">{t("common.submit")}</button>
              ) : (
                <button onClick={() => setIndex((value) => Math.min(questions.length - 1, value + 1))} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-card">{t("common.next")} <ArrowRight className="h-4 w-4" /></button>
              )}
            </motion.div>
          </div>
        ) : null}
      </section>
    </ProtectedRoute>
  );
}
