"use client";

import { ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WordCard } from "@/components/WordCard";
import { getWordsByLevel } from "@/data/hskWords";
import type { HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";

function parseLevel(value: string | string[] | undefined): HSKLevel {
  const raw = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(raw);
  return numberValue >= 1 && numberValue <= 6 ? (numberValue as HSKLevel) : 1;
}

export default function LessonPage() {
  const params = useParams();
  const level = parseLevel(params.level);
  const words = getWordsByLevel(level);
  const { t } = useI18n();

  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">HSK {level}</p>
            <h1 className="mt-2 text-5xl font-black text-ink dark:text-cream sm:text-7xl">HSK {level} {t("lesson.vocabulary")}</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">
              {t("hero.subtitle")}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <AppButton href={`/flashcard/${level}`} variant="secondary">{t("common.flashcards")}</AppButton>
            <AppButton href={`/listening/${level}`} variant="secondary">{t("listening.title")}</AppButton>
            <AppButton href={`/writing/${level}`} variant="secondary">{t("writing.title")}</AppButton>
            <AppButton href={`/exam/${level}`} variant="secondary">{t("nav.exam")}</AppButton>
            <AppButton href={`/quiz/${level}`} variant="primary">
              {t("common.quiz")} <ArrowRight className="h-5 w-5" />
            </AppButton>
          </div>
        </div>

        {words.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {words.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        ) : (
          <div className="rounded-5xl bg-white/82 p-10 text-center shadow-premium backdrop-blur-xl dark:bg-white/10">
            <p className="text-3xl font-black text-ink dark:text-cream">HSK {level}</p>
            <p className="mt-3 font-semibold text-stone-500 dark:text-stone-300">{t("roadmap.unlockRule")}</p>
            <div className="mt-6">
              <AppButton href="/lesson/1" variant="primary">HSK 1</AppButton>
            </div>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
