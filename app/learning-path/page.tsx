"use client";

import { ArrowRight, BookOpen, CheckCircle2, Lock, Map, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getCurriculumLessonsByLevel } from "@/data/hsk/lessonCurriculum";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { getBestExamScore, getLevelLockReason, HSK_PASSING_SCORE, isLevelUnlocked } from "@/utils/hskUnlock";
import { useI18n } from "@/utils/i18n";
import { getAllLessonProgressRecords } from "@/utils/lessonPlanner";
import { getCurrentAvailableLesson, getLessonLockReason, getLevelCompletionStatus, isLessonCompleted, isLessonUnlocked } from "@/utils/lessonUnlock";

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];

export default function LearningPathPage() {
  const { language } = useI18n();
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const lessonProgress = mounted ? getAllLessonProgressRecords() : {};

  return (
    <ProtectedRoute>
      <PageShell className="max-w-7xl">
        <PageHeader
          eyebrow="HSK 1 → HSK 6"
          title={language === "ru" ? "Учебный путь" : "O‘quv yo‘li"}
          description={language === "ru" ? "Ваш путь HSK: уроки открываются по порядку, а следующий уровень открывается после экзамена на 80% или выше." : "Sizning HSK sayohatingiz: darslar ketma-ket ochiladi, keyingi bosqich esa imtihondan 80% yoki undan yuqori ball olgandan keyin ochiladi."}
          icon={Map}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          {levels.map((level) => {
            const lessons = getCurriculumLessonsByLevel(level);
            const unlocked = isLevelUnlocked(level, { knownWordIds }, examAttempts);
            const status = mounted
              ? getLevelCompletionStatus(level, { knownWordIds, lessonProgress })
              : { total: lessons.length, completed: 0, allCompleted: false, currentLesson: lessons[0] ?? null, progressPercent: 0 };
            const currentLesson = unlocked ? getCurrentAvailableLesson(level, { knownWordIds, lessonProgress }) : null;
            const examScore = getBestExamScore(level, examAttempts);
            const examPassed = examScore >= HSK_PASSING_SCORE;
            const examOpen = unlocked && status.allCompleted;
            const levelLock = getLevelLockReason(level, { knownWordIds }, examAttempts, language);

            return (
              <section key={level} className="overflow-hidden rounded-[2rem] border border-orange-soft/70 bg-white/90 shadow-premium">
                <div className="flex flex-col gap-4 bg-gradient-to-br from-white via-cream to-orange-soft/45 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl text-lg font-black shadow-soft ${unlocked ? "bg-gradient-to-br from-orange-brand to-orange-hot text-white" : "bg-stone-100 text-stone-400"}`}>
                      {unlocked ? level : <Lock className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-normal text-orange-deep">HSK {level}</p>
                      <h2 className="text-2xl font-black text-ink">
                        {unlocked
                          ? currentLesson
                            ? `${language === "ru" ? "Текущий урок" : "Joriy dars"}: ${language === "ru" ? currentLesson.titleRu : currentLesson.titleUz}`
                            : examPassed
                              ? (language === "ru" ? "Уровень завершён" : "Daraja yakunlandi")
                              : (language === "ru" ? "Экзамен открыт" : "Imtihon ochildi")
                          : (language === "ru" ? "Уровень закрыт" : "Daraja yopiq")}
                      </h2>
                    </div>
                  </div>
                  <div className="min-w-[140px] rounded-3xl bg-white/85 p-4 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-black text-stone-500">
                      <span>{status.completed}/{status.total}</span>
                      <span>{status.progressPercent}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-orange-soft/70">
                      <div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${status.progressPercent}%` }} />
                    </div>
                  </div>
                </div>

                {!unlocked ? (
                  <div className="mx-5 mt-5 rounded-3xl border border-orange-soft bg-cream/85 p-4 text-sm font-bold leading-6 text-stone-600 sm:mx-6">
                    {levelLock}
                  </div>
                ) : null}

                <div className="space-y-3 p-5 sm:p-6">
                  {lessons.map((lesson, index) => {
                    const completed = mounted && isLessonCompleted(level, lesson.id, { knownWordIds, lessonProgress });
                    const lessonUnlocked = mounted && isLessonUnlocked(level, lesson.id, { knownWordIds, lessonProgress }, examAttempts);
                    const current = lessonUnlocked && !completed && currentLesson?.id === lesson.id;
                    const locked = !unlocked || !lessonUnlocked;
                    const reason = locked ? getLessonLockReason(level, lesson.id, { knownWordIds, lessonProgress }, examAttempts, language) : "";

                    return (
                      <div key={lesson.id} className="relative flex gap-3">
                        {index < lessons.length - 1 ? <span className="absolute left-6 top-12 h-[calc(100%-1rem)] w-0.5 bg-orange-soft" /> : null}
                        <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-soft ${completed ? "bg-amber-100 text-amber-800" : current ? "bg-orange-brand text-white shadow-glow" : locked ? "bg-stone-100 text-stone-400" : "bg-orange-soft text-orange-deep"}`}>
                          {completed ? <CheckCircle2 className="h-5 w-5" /> : locked ? <Lock className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                        </div>
                        <div className={`min-w-0 flex-1 rounded-[1.5rem] border p-4 ${current ? "border-orange-brand/50 bg-orange-50/75" : "border-orange-soft/55 bg-white"}`}>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase tracking-normal text-orange-deep">
                                {language === "ru" ? "Урок" : "Dars"} {lesson.order}
                              </p>
                              <h3 className="mt-1 text-lg font-black leading-tight text-ink">{language === "ru" ? lesson.titleRu : lesson.titleUz}</h3>
                              <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-stone-600">{language === "ru" ? lesson.descriptionRu : lesson.descriptionUz}</p>
                              {reason ? <p className="mt-2 text-xs font-bold leading-5 text-stone-500">{reason}</p> : null}
                            </div>
                            {locked ? (
                              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-xs font-black text-stone-500">
                                <Lock className="h-4 w-4" /> {language === "ru" ? "Закрыто" : "Yopiq"}
                              </span>
                            ) : (
                              <Link href={`/lesson/${level}/${lesson.id}`} className={`warm-focus inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-black ${current ? "bg-orange-brand text-white" : "bg-cream text-orange-deep"}`}>
                                {completed ? (language === "ru" ? "Повторить" : "Qaytarish") : current ? (language === "ru" ? "Продолжить" : "Davom etish") : (language === "ru" ? "Открыть" : "Ochish")}
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="relative flex gap-3 pt-2">
                    <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-soft ${examPassed ? "bg-amber-100 text-amber-800" : examOpen ? "bg-orange-brand text-white shadow-glow" : "bg-stone-100 text-stone-400"}`}>
                      {examPassed ? <CheckCircle2 className="h-5 w-5" /> : examOpen ? <Trophy className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1 rounded-[1.5rem] border border-orange-soft/55 bg-gradient-to-br from-white to-cream p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-normal text-orange-deep">{language === "ru" ? "Экзамен" : "Imtihon"}</p>
                          <h3 className="mt-1 text-lg font-black text-ink">HSK {level} {language === "ru" ? "подготовительный экзамен" : "tayyorgarlik imtihoni"}</h3>
                          <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">
                            {examPassed
                              ? `${language === "ru" ? "Сдано" : "O‘tildi"}: ${examScore}%`
                              : examOpen
                                ? (language === "ru" ? "Следующий этап откроется после 80% или выше." : "80% yoki undan yuqori ball keyingi bosqichni ochadi.")
                                : (language === "ru" ? "Экзамен откроется после завершения уроков." : "Imtihon darslar yakunlangandan keyin ochiladi.")}
                          </p>
                        </div>
                        {examOpen ? (
                          <AppButton href={`/exam/${level}`} variant={examPassed ? "secondary" : "primary"}>
                            {examPassed ? (language === "ru" ? "Пересдать" : "Qayta topshirish") : (language === "ru" ? "Начать экзамен" : "Imtihonni boshlash")}
                            <ArrowRight className="h-4 w-4" />
                          </AppButton>
                        ) : (
                          <span className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-xs font-black text-stone-500">
                            <Lock className="h-4 w-4" /> {language === "ru" ? "Закрыто" : "Yopiq"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-6 rounded-[2rem] border border-orange-soft/70 bg-white/88 p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="font-black text-ink">{language === "ru" ? "Следующий этап" : "Keyingi bosqich"}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">
                  {language === "ru" ? "Продолжайте текущий открытый урок. Следующий урок и экзамен откроются только после реального завершения." : "Joriy ochiq darsni davom ettiring. Keyingi dars va imtihon faqat real yakunlangandan keyin ochiladi."}
                </p>
              </div>
            </div>
            <AppButton href="/dashboard" variant="secondary">{language === "ru" ? "На главную" : "Bosh sahifa"}</AppButton>
          </div>
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
