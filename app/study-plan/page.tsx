"use client";

import { CalendarDays, Clock3, ListChecks, Sparkles, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getCurriculumLessonsByLevel } from "@/data/hsk/lessonCurriculum";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel, SkillType } from "@/types";
import { calculateExamReadiness } from "@/utils/readinessScore";
import { useI18n } from "@/utils/i18n";
import { getAllLessonProgressRecords } from "@/utils/lessonPlanner";
import { getCurrentAvailableLesson } from "@/utils/lessonUnlock";
import { readLocalObject, writeLocalObject } from "@/utils/localLearning";
import { syncOptionalFeatureResult } from "@/utils/featureProgressSync";

const planKey = "hanziflow_study_plans";

type PlanDay = {
  day: number;
  minutes: number;
  tasksUz: string[];
  tasksRu: string[];
};

function createPlan(input: {
  level: HSKLevel;
  daysPerWeek: number;
  minutesPerDay: number;
  weakSkill: string;
  nextLessonTitleUz: string;
  nextLessonTitleRu: string;
}): PlanDay[] {
  return Array.from({ length: input.daysPerWeek }, (_, index) => {
    const baseUz = [`${input.nextLessonTitleUz} bo‘yicha 1 bo‘lim`, "10 ta so‘zni takrorlash"];
    const baseRu = [`1 раздел урока: ${input.nextLessonTitleRu}`, "Повторить 10 слов"];
    const skillUz = input.weakSkill === "listening" ? "1 ta tinglash mashqi" : input.weakSkill === "speaking" ? "1 ta gapirish vazifasi" : input.weakSkill === "reading" ? "1 ta o‘qish mashqi" : "1 ta gap tuzish mashqi";
    const skillRu = input.weakSkill === "listening" ? "1 задание по аудированию" : input.weakSkill === "speaking" ? "1 задание по говорению" : input.weakSkill === "reading" ? "1 задание по чтению" : "1 задание на составление предложений";
    return {
      day: index + 1,
      minutes: input.minutesPerDay,
      tasksUz: [...baseUz, skillUz, index % 2 === 0 ? "Mini test" : "Hanzi yoki ton mashqi"],
      tasksRu: [...baseRu, skillRu, index % 2 === 0 ? "Мини-тест" : "Иероглифы или тоны"]
    };
  });
}

export default function StudyPlanPage() {
  const { language } = useI18n();
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const mistakes = useProgressStore((state) => state.mistakes);
  const quizResults = useProgressStore((state) => state.quizResults);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const practiceResults = useProgressStore((state) => state.practiceResults);
  const streak = useProgressStore((state) => state.streak);
  const saveLearningActivity = useProgressStore((state) => state.saveLearningActivity);
  const currentLevel = useProgressStore((state) => state.currentLevel);
  const [level, setLevel] = useState<HSKLevel>(currentLevel ?? 1);
  const [minutes, setMinutes] = useState(20);
  const [days, setDays] = useState(5);
  const [weakSkill, setWeakSkill] = useState<SkillType>("listening");
  const [plan, setPlan] = useState<PlanDay[]>([]);
  const lessonProgress = typeof window !== "undefined" ? getAllLessonProgressRecords() : {};
  const nextLesson = getCurrentAvailableLesson(level, { knownWordIds, lessonProgress }) ?? getCurriculumLessonsByLevel(level)[0];
  const readiness = useMemo(() => calculateExamReadiness({ level, knownWordIds, weakWordIds, mistakes, quizResults, examAttempts, practiceResults, streak }), [examAttempts, knownWordIds, level, mistakes, practiceResults, quizResults, streak, weakWordIds]);

  useEffect(() => {
    const stored = readLocalObject<{ latest?: PlanDay[] }>(planKey, {});
    if (stored.latest?.length) setPlan(stored.latest);
  }, []);

  function generate() {
    const next = createPlan({
      level,
      daysPerWeek: days,
      minutesPerDay: minutes,
      weakSkill,
      nextLessonTitleUz: nextLesson?.titleUz ?? `HSK ${level}`,
      nextLessonTitleRu: nextLesson?.titleRu ?? `HSK ${level}`
    });
    setPlan(next);
    writeLocalObject(planKey, { latest: next, updated_at: new Date().toISOString(), level, minutes, days, weakSkill });
    void syncOptionalFeatureResult("study_plans", {
      target_level: level,
      days_per_week: days,
      minutes_per_day: minutes,
      weak_skill: weakSkill,
      plan: next
    });
    saveLearningActivity({ id: `study-plan-${Date.now()}`, type: "study-plan", hskLevel: level, score: 1, total: 1, completedAt: new Date().toISOString() });
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Персональный учебный план" : "Shaxsiy o‘quv reja"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Создайте недельный план по текущему уроку, слабым навыкам и времени." : "Joriy dars, zaif ko‘nikma va vaqtingizga mos haftalik reja yarating."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <Card className="p-6">
            <Sparkles className="h-12 w-12 text-orange-brand" />
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-black text-stone-600">HSK
                <select value={level} onChange={(event) => setLevel(Number(event.target.value) as HSKLevel)} className="mt-2 w-full rounded-2xl border border-orange-soft bg-cream px-4 py-3 font-black text-ink">
                  {([1, 2, 3, 4, 5, 6] as HSKLevel[]).map((item) => <option key={item} value={item}>HSK {item}</option>)}
                </select>
              </label>
              <label className="text-sm font-black text-stone-600">{language === "ru" ? "Сколько минут в день?" : "Kuniga necha daqiqa?"}
                <input type="number" min={5} max={120} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-orange-soft bg-cream px-4 py-3 font-black text-ink" />
              </label>
              <label className="text-sm font-black text-stone-600">{language === "ru" ? "Сколько дней в неделю?" : "Haftasiga necha kun?"}
                <input type="number" min={2} max={7} value={days} onChange={(event) => setDays(Math.max(2, Math.min(7, Number(event.target.value))))} className="mt-2 w-full rounded-2xl border border-orange-soft bg-cream px-4 py-3 font-black text-ink" />
              </label>
              <label className="text-sm font-black text-stone-600">{language === "ru" ? "Слабый навык" : "Zaif ko‘nikma"}
                <select value={weakSkill} onChange={(event) => setWeakSkill(event.target.value as SkillType)} className="mt-2 w-full rounded-2xl border border-orange-soft bg-cream px-4 py-3 font-black text-ink">
                  <option value="listening">{language === "ru" ? "Аудирование" : "Tinglash"}</option>
                  <option value="speaking">{language === "ru" ? "Говорение" : "Gapirish"}</option>
                  <option value="reading">{language === "ru" ? "Чтение" : "O‘qish"}</option>
                  <option value="writing">{language === "ru" ? "Письмо" : "Yozish"}</option>
                </select>
              </label>
              <AppButton onClick={generate}>{language === "ru" ? "Создать план" : "Reja yaratish"}</AppButton>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] bg-orange-soft p-4"><Target className="h-5 w-5 text-orange-deep" /><p className="mt-2 text-2xl font-black text-ink">{readiness.score}%</p><p className="text-xs font-black text-stone-600">{language === "ru" ? "Готовность" : "Tayyorlik"}</p></div>
                <div className="rounded-[1.5rem] bg-cream p-4"><Clock3 className="h-5 w-5 text-orange-brand" /><p className="mt-2 text-2xl font-black text-ink">{minutes}</p><p className="text-xs font-black text-stone-600">{language === "ru" ? "минут" : "daqiqa"}</p></div>
                <div className="rounded-[1.5rem] bg-cream p-4"><CalendarDays className="h-5 w-5 text-orange-brand" /><p className="mt-2 text-2xl font-black text-ink">{days}</p><p className="text-xs font-black text-stone-600">{language === "ru" ? "дней" : "kun"}</p></div>
              </div>
              <p className="mt-5 rounded-[1.5rem] bg-white p-4 text-sm font-semibold leading-6 text-stone-700 shadow-soft">
                {readiness.score < 20
                  ? (language === "ru" ? "Пока недостаточно данных для точной оценки. Начните с текущего урока и повторения." : "Hali baholash uchun ma’lumot yetarli emas. Joriy dars va takrorlashdan boshlang.")
                  : (language === "ru" ? readiness.recommendationRu : readiness.recommendationUz)}
              </p>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {plan.map((day) => (
                <Card key={day.day} className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep"><ListChecks className="h-5 w-5" /></span>
                    <div>
                      <h2 className="text-xl font-black text-ink">{language === "ru" ? `${day.day}-й день` : `${day.day}-kun`}</h2>
                      <p className="text-xs font-black text-stone-500">{day.minutes} {language === "ru" ? "минут" : "daqiqa"}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {(language === "ru" ? day.tasksRu : day.tasksUz).map((task) => (
                      <li key={task} className="rounded-2xl bg-cream px-4 py-3 text-sm font-black text-stone-700">{task}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
