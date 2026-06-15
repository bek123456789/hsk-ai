"use client";

import { ArrowRight, BookOpen, Lock, Map, Target, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getCurriculumLessonsByLevel } from "@/data/hsk/lessonCurriculum";
import { vocabularyEntries } from "@/data/hsk/vocabulary";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import type { HSKLevel } from "@/types";
import { isLevelUnlocked } from "@/utils/hskUnlock";
import { calculateLessonProgress } from "@/utils/lessonPlanner";

export default function ProgressMapPage() {
  const { language } = useI18n();
  const known = useProgressStore((state) => state.knownWordIds);
  const best = useProgressStore((state) => state.bestScoreByLevel);
  const attempts = useProgressStore((state) => state.examAttempts);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <ProtectedRoute>
      <PageShell className="max-w-6xl">
        <PageHeader
          eyebrow="HSK 1 → HSK 6"
          title={language === "ru" ? "Карта прогресса" : "Progress xaritasi"}
          description={language === "ru" ? "Следите за словами, уроками и готовностью к следующему уровню." : "So‘zlar, darslar va keyingi bosqichga tayyorlikni bir joyda kuzating."}
          icon={Map}
        />
        <div className="space-y-4">
          {([1, 2, 3, 4, 5, 6] as HSKLevel[]).map((level) => {
            const words = vocabularyEntries.filter((word) => word.level === level);
            const learned = words.filter((word) => known.includes(word.id)).length;
            const vocabularyProgress = Math.round((learned / Math.max(1, words.length)) * 100);
            const examScore = best?.[level] ?? 0;
            const lessons = getCurriculumLessonsByLevel(level);
            const completedLessons = mounted ? lessons.filter((lesson) => calculateLessonProgress(lesson, known) === 100).length : 0;
            const lessonProgress = Math.round((completedLessons / Math.max(1, lessons.length)) * 100);
            const readiness = Math.round(vocabularyProgress * 0.45 + lessonProgress * 0.3 + examScore * 0.25);
            const unlocked = isLevelUnlocked(level, { knownWordIds: known }, attempts);
            return (
              <article key={level} className="rounded-[2rem] border border-orange-soft/60 bg-white/88 p-6 shadow-premium">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.7rem] text-2xl font-black shadow-soft ${unlocked ? "bg-gradient-to-br from-orange-brand to-amber-300 text-white" : "bg-cream text-stone-400"}`}>{unlocked ? `HSK ${level}` : <Lock className="h-8 w-8" />}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-3xl font-black text-ink">HSK {level}</h2><span className="rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep">{readiness}%</span></div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream"><div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${readiness}%` }} /></div>
                    <div className="mt-4 grid gap-2 text-sm font-bold text-stone-600 sm:grid-cols-3">
                      <span className="flex items-center gap-2"><Target className="h-4 w-4 text-orange-brand" /> {learned}/{words.length} {language === "ru" ? "слов" : "so‘z"}</span>
                      <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-orange-brand" /> {completedLessons}/{lessons.length} {language === "ru" ? "уроков" : "dars"}</span>
                      <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-orange-brand" /> {examScore}% {language === "ru" ? "экзамен" : "imtihon"}</span>
                    </div>
                  </div>
                  <AppButton href={unlocked ? `/lesson/${level}` : `/exam/${level}`} variant={unlocked ? "primary" : "secondary"}>
                    {unlocked ? (language === "ru" ? "Следующий этап" : "Keyingi bosqich") : (language === "ru" ? "Просмотр" : "Ko‘rib chiqish")} <ArrowRight className="h-4 w-4" />
                  </AppButton>
                </div>
              </article>
            );
          })}
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
