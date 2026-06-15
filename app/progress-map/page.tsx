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
import { getBestExamScore, getLevelLockReason, isLevelUnlocked, HSK_PASSING_SCORE } from "@/utils/hskUnlock";
import { getAllLessonProgressRecords } from "@/utils/lessonPlanner";
import { getCurrentAvailableLesson, getLevelCompletionStatus } from "@/utils/lessonUnlock";

export default function ProgressMapPage() {
  const { language } = useI18n();
  const known = useProgressStore((state) => state.knownWordIds);
  const best = useProgressStore((state) => state.bestScoreByLevel);
  const attempts = useProgressStore((state) => state.examAttempts);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const allLessonProgress = mounted ? getAllLessonProgressRecords() : {};
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
            const levelStatus = mounted ? getLevelCompletionStatus(level, { knownWordIds: known, lessonProgress: allLessonProgress }) : { total: lessons.length, completed: 0, allCompleted: false, currentLesson: lessons[0] ?? null, progressPercent: 0 };
            const completedLessons = levelStatus.completed;
            const lessonProgress = levelStatus.progressPercent;
            const readiness = Math.round(vocabularyProgress * 0.45 + lessonProgress * 0.3 + examScore * 0.25);
            const unlocked = isLevelUnlocked(level, { knownWordIds: known }, attempts);
            const currentLesson = unlocked ? getCurrentAvailableLesson(level, { knownWordIds: known, lessonProgress: allLessonProgress }) : null;
            const examPassed = getBestExamScore(level, attempts) >= HSK_PASSING_SCORE;
            const href = unlocked
              ? currentLesson
                ? `/lesson/${level}/${currentLesson.id}`
                : `/exam/${level}`
              : level > 1
                ? `/exam/${(level - 1) as HSKLevel}`
                : `/lessons/1`;
            const actionLabel = unlocked
              ? currentLesson
                ? (language === "ru" ? "Следующий урок" : "Keyingi dars")
                : examPassed
                  ? (language === "ru" ? "Пересдать экзамен" : "Imtihonni qayta topshirish")
                  : (language === "ru" ? "Открыть экзамен" : "Imtihonni ochish")
              : (language === "ru" ? "Требование" : "Talabni ko‘rish");
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
                    <p className="mt-3 text-sm font-bold text-stone-500">
                      {unlocked
                        ? currentLesson
                          ? `${language === "ru" ? "Текущий урок" : "Joriy dars"}: ${language === "ru" ? currentLesson.titleRu : currentLesson.titleUz}`
                          : examPassed
                            ? (language === "ru" ? "Уровень завершён." : "Daraja yakunlangan.")
                            : (language === "ru" ? "Все уроки завершены, экзамен открыт." : "Barcha darslar tugagan, imtihon ochiq.")
                        : getLevelLockReason(level, { knownWordIds: known }, attempts, language)}
                    </p>
                  </div>
                  <AppButton href={href} variant={unlocked ? "primary" : "secondary"}>
                    {actionLabel} <ArrowRight className="h-4 w-4" />
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
