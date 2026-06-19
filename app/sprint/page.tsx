"use client";

import { CalendarDays, CheckCircle2, Flame, Headphones, Mic, RotateCcw, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getCurriculumLessonsByLevel } from "@/data/hsk/lessonCurriculum";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { getUnlockedHskLevels } from "@/utils/hskUnlock";
import { useI18n } from "@/utils/i18n";
import { getAllLessonProgressRecords } from "@/utils/lessonPlanner";
import { getCurrentAvailableLesson } from "@/utils/lessonUnlock";
import { readLocalObject, writeLocalObject } from "@/utils/localLearning";
import { syncOptionalFeatureResult } from "@/utils/featureProgressSync";

const sprintKey = "hanziflow_sprint_progress";

type SprintProgress = Record<string, string[]>;

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(new Date());
}

export default function SprintPage() {
  const { language } = useI18n();
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const saveLearningActivity = useProgressStore((state) => state.saveLearningActivity);
  const [mode, setMode] = useState("beginner");
  const [progress, setProgress] = useState<SprintProgress>({});
  const unlocked = getUnlockedHskLevels({ knownWordIds }, examAttempts);
  const level = (unlocked.at(-1) ?? 1) as HSKLevel;
  const lessonProgress = typeof window !== "undefined" ? getAllLessonProgressRecords() : {};
  const currentLesson = getCurrentAvailableLesson(level, { knownWordIds, lessonProgress }) ?? getCurriculumLessonsByLevel(level)[0];
  const day = todayKey();
  const completed = progress[day] ?? [];
  const tasks = useMemo(() => [
    { id: "lesson", href: currentLesson ? `/lesson/${level}/${currentLesson.id}` : `/lessons/${level}`, icon: Target, uz: "Joriy dars bo‘limi", ru: "Раздел текущего урока" },
    { id: "review", href: "/review", icon: RotateCcw, uz: "10 ta so‘zni takrorlash", ru: "Повторить 10 слов" },
    { id: "listening", href: `/listening/${level}`, icon: Headphones, uz: "1 ta tinglash", ru: "1 аудирование" },
    { id: "speaking", href: `/speaking/${level}`, icon: Mic, uz: "1 ta gapirish", ru: "1 говорение" },
    { id: "quiz", href: `/quiz/${level}`, icon: CheckCircle2, uz: "Mini test", ru: "Мини-тест" }
  ], [currentLesson, level]);
  const percent = Math.round((completed.length / tasks.length) * 100);

  useEffect(() => {
    setProgress(readLocalObject<SprintProgress>(sprintKey, {}));
  }, []);

  function toggle(taskId: string) {
    const current = progress[day] ?? [];
    const exists = current.includes(taskId);
    const next = {
      ...progress,
      [day]: exists ? current.filter((item) => item !== taskId) : [...current, taskId]
    };
    setProgress(next);
    writeLocalObject(sprintKey, next);
    if (!exists) {
      saveLearningActivity({ id: `sprint-${taskId}-${Date.now()}`, type: "sprint", hskLevel: level, score: 1, total: 1, completedAt: new Date().toISOString() });
      void syncOptionalFeatureResult("sprint_progress", {
        sprint_date: day,
        task_id: taskId,
        completed: true,
        completed_at: new Date().toISOString()
      });
    }
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "7-дневный HSK Sprint" : "7 kunlik HSK Sprint"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Короткий ежедневный план с уроком, повторением, аудированием, говорением и тестом." : "Har kuni dars, takrorlash, tinglash, gapirish va mini testdan iborat qisqa reja."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Card className="p-6">
            <Flame className="h-12 w-12 text-orange-brand" />
            <h2 className="mt-4 text-3xl font-black text-ink">{language === "ru" ? "Спринт продолжается" : "Sprint davom etmoqda"}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">HSK {level} · {currentLesson ? (language === "ru" ? currentLesson.titleRu : currentLesson.titleUz) : ""}</p>
            <div className="mt-5 rounded-[1.5rem] bg-orange-soft p-5">
              <div className="flex items-center justify-between text-sm font-black text-orange-deep">
                <span>{language === "ru" ? "Сегодня" : "Bugun"}</span>
                <span>{percent}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/80">
                <div className="h-full rounded-full bg-orange-brand" style={{ width: `${percent}%` }} />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {[
                ["beginner", language === "ru" ? "HSK 1 старт" : "HSK 1 boshlash"],
                ["review", language === "ru" ? "Повторение" : "Takrorlash"],
                ["exam", language === "ru" ? "Экзамен" : "Imtihon"],
                ["speaking", language === "ru" ? "Говорение" : "Gapirish"]
              ].map(([id, label]) => (
                <button key={id} onClick={() => setMode(id)} className={`rounded-2xl px-3 py-3 text-xs font-black ${mode === id ? "bg-orange-brand text-white" : "bg-cream text-stone-600"}`}>{label}</button>
              ))}
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep"><CalendarDays className="h-6 w-6" /></span>
              <div>
                <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Задание на сегодня" : "Bugungi vazifa"}</p>
                <h2 className="text-3xl font-black text-ink">{language === "ru" ? "День 1" : "1-kun"}</h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {tasks.map((task) => {
                const done = completed.includes(task.id);
                const Icon = task.icon;
                return (
                  <div key={task.id} className="flex flex-col gap-3 rounded-[1.5rem] border border-orange-soft/60 bg-white p-4 shadow-soft sm:flex-row sm:items-center">
                    <button onClick={() => toggle(task.id)} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${done ? "bg-emerald-100 text-emerald-700" : "bg-orange-soft text-orange-deep"}`}>
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-ink">{language === "ru" ? task.ru : task.uz}</p>
                      <p className="mt-1 text-xs font-bold text-stone-500">{done ? (language === "ru" ? "Выполнено" : "Bajarildi") : (language === "ru" ? "5–8 минут" : "5–8 daqiqa")}</p>
                    </div>
                    <AppButton href={task.href} variant="secondary" className="min-h-10 px-4 py-2">{language === "ru" ? "Открыть" : "Ochish"}</AppButton>
                  </div>
                );
              })}
            </div>
            {percent === 100 ? (
              <div className="mt-6 rounded-[1.5rem] bg-emerald-50 p-5 text-emerald-800">
                <p className="font-black">{language === "ru" ? "День завершён" : "Kun yakunlandi"}</p>
                <p className="mt-1 text-sm font-semibold">{language === "ru" ? "Вы получили XP и сохранили учебный ритм." : "XP oldingiz va o‘qish ritmini saqladingiz."}</p>
              </div>
            ) : null}
          </Card>
        </div>
      </section>
    </ProtectedRoute>
  );
}
