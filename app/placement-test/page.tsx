"use client";

import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { examQuestions } from "@/data/examQuestions";
import { getLocalizedQuestion } from "@/utils/exam";
import { useI18n } from "@/utils/i18n";

function recommendation(score: number, t: ReturnType<typeof useI18n>["t"]) {
  if (score <= 20) return t("placement.startHsk1");
  if (score <= 40) return t("placement.reviewHsk1");
  if (score <= 60) return t("placement.hsk3");
  if (score <= 75) return t("placement.hsk4");
  if (score <= 90) return t("placement.hsk5");
  return t("placement.hsk6");
}

export default function PlacementTestPage() {
  const { language, t } = useI18n();
  const questions = useMemo(() => examQuestions.filter((_, index) => index % 3 === 0).slice(0, 20), []);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const question = questions[index];
  const localized = question ? getLocalizedQuestion(question, language) : null;
  const correct = questions.filter((item) => answers[item.id] === getLocalizedQuestion(item, language).correctAnswer).length;
  const score = Math.round((correct / questions.length) * 100);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        {finished ? (
          <div className="rounded-[2.5rem] bg-white/84 p-10 text-center shadow-premium dark:bg-white/10">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow">
              <Sparkles className="h-10 w-10" />
            </div>
            <p className="text-sm font-black text-orange-deep dark:text-orange-200">{score}%</p>
            <h1 className="mt-2 text-5xl font-black text-ink dark:text-cream">{t("placement.result")}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-xl font-black text-stone-600 dark:text-stone-300">{recommendation(score, t)}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <AppButton href="/dashboard" variant="secondary">{t("nav.learn")}</AppButton>
              <AppButton href="/roadmap" variant="primary">{t("nav.roadmap")}</AppButton>
            </div>
          </div>
        ) : question && localized ? (
          <div className="rounded-[2.5rem] bg-white/84 p-7 shadow-premium dark:bg-white/10 sm:p-10">
            <div className="mb-7 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-orange-deep dark:text-orange-200">{t("placement.title")}</p>
                <h1 className="mt-1 text-3xl font-black text-ink dark:text-cream">{t("placement.subtitle")}</h1>
              </div>
              <span className="text-sm font-black text-stone-500 dark:text-stone-300">{index + 1}/{questions.length}</span>
            </div>
            <div className="rounded-[2rem] bg-cream p-7 text-center shadow-soft dark:bg-obsidian/60">
              <p className="text-6xl font-black text-ink dark:text-cream">{question.promptChinese}</p>
              <p className="mt-3 text-xl font-black text-orange-brand">{question.promptPinyin}</p>
              <p className="mt-4 font-bold text-stone-600 dark:text-stone-300">{localized.question}</p>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {localized.options.map((option) => (
                <button key={option} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className={`rounded-4xl p-4 text-left text-sm font-black shadow-soft ${answers[question.id] === option ? "bg-orange-soft text-orange-deep" : "bg-white/80 text-ink dark:bg-white/10 dark:text-cream"}`}>{option}</button>
              ))}
            </div>
            <div className="mt-7 flex justify-between">
              <button disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-black shadow-soft disabled:opacity-40 dark:bg-white/10"><ArrowLeft className="h-4 w-4" /> {t("common.back")}</button>
              {index + 1 === questions.length ? (
                <button onClick={() => setFinished(true)} className="rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-card">{t("common.submit")}</button>
              ) : (
                <button onClick={() => setIndex((value) => value + 1)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-card">{t("common.next")} <ArrowRight className="h-4 w-4" /></button>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </ProtectedRoute>
  );
}
