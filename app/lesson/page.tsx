"use client";

import { ArrowRight, BookOpen, Lock } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProgressRing } from "@/components/ProgressRing";
import { hskLessons } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { percent } from "@/utils/progress";

export default function LessonListPage() {
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const { t } = useI18n();
  const grouped = [1, 2, 3, 4, 5, 6].map((level) => ({
    level,
    lessons: hskLessons.filter((lesson) => lesson.hskLevel === level)
  }));

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-10 max-w-4xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">HSK</p>
          <h1 className="mt-2 text-5xl font-black leading-tight text-ink dark:text-cream sm:text-7xl">{t("lessons.title")}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">
            {t("lessons.subtitle")}
          </p>
        </div>

        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.level}>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-brand to-orange-hot text-lg font-black text-white shadow-card">
                  {group.level}
                </span>
                <h2 className="text-2xl font-black text-ink dark:text-cream">HSK {group.level}</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {group.lessons.map((lesson) => {
                  const learned = lesson.wordIds.filter((id) => knownWordIds.includes(id)).length;
                  const progress = percent(learned, lesson.wordIds.length);

                  return (
                    <article key={lesson.id} className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10">
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-orange-brand/12 blur-xl" />
                      <div className="relative">
                        <div className="mb-5 flex items-center justify-between">
                          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft">
                            {lesson.locked ? <Lock className="h-7 w-7" /> : <BookOpen className="h-7 w-7" />}
                          </div>
                          <ProgressRing value={progress} size={86} />
                        </div>
                        <h3 className="text-2xl font-black text-ink dark:text-cream">{lesson.title}</h3>
                        <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-stone-500 dark:text-stone-300">{lesson.description}</p>
                        <div className="mt-5 flex items-center justify-between rounded-3xl bg-cream px-4 py-3 text-sm font-black text-stone-600 dark:bg-obsidian/60 dark:text-stone-300">
                          <span>{lesson.wordIds.length || t("lessons.planned")} {t("common.words")}</span>
                          <span>{progress}% {t("lessons.done")}</span>
                        </div>
                        <div className="mt-5">
                          <AppButton href={lesson.locked ? "/lesson" : `/lesson/${lesson.hskLevel}`} variant={lesson.locked ? "secondary" : "primary"} className="w-full">
                            {lesson.locked ? t("lessons.soon") : t("lessons.start")} <ArrowRight className="h-4 w-4" />
                          </AppButton>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}
