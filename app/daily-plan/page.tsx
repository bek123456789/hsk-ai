"use client";

import { BookOpen, Bot, Check, Clock3, Headphones, HelpCircle, Mic, RotateCcw, Sparkles } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { generateDailyStudyPlan } from "@/utils/studyPlan";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

const icons = { lesson: BookOpen, review: RotateCcw, reading: BookOpen, listening: Headphones, speaking: Mic, quiz: HelpCircle, ai: Bot };

function localDateKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(new Date());
}

export default function DailyPlanPage() {
  const { language } = useI18n();
  const state = useProgressStore();
  const date = localDateKey();
  const completed = state.dailyPlanCompletions?.[date] ?? [];
  const plan = generateDailyStudyPlan(state, state.weakWordIds, state.mistakes, state.examAttempts);
  const completion = Math.round((completed.length / plan.tasks.length) * 100);

  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader
          eyebrow={language === "ru" ? "План на сегодня" : "Bugungi reja"}
          title={language === "ru" ? "Ваш личный учебный план" : "Shaxsiy o‘quv rejangiz"}
          description={language === "ru" ? "Задания подобраны по вашему уровню, слабым словам и последним результатам." : "Vazifalar darajangiz, zaif so‘zlaringiz va oxirgi natijalaringizga mos tanlandi."}
          icon={Sparkles}
        />
        <div className="mb-6 rounded-[2rem] border border-orange-soft/70 bg-white/88 p-6 shadow-premium">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-black text-ink">{language === "ru" ? "С чего начать сегодня?" : "Bugun nimadan boshlash kerak?"}</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-bold text-stone-500"><Clock3 className="h-4 w-4 text-orange-brand" /> {plan.estimatedMinutes} {language === "ru" ? "минут" : "daqiqa"}</p>
            </div>
            <span className="rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep">{completion}%</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream"><div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-amber-300 transition-all" style={{ width: `${completion}%` }} /></div>
          {completion > 0 ? (
            <p className="mt-3 rounded-full bg-orange-soft/70 px-4 py-2 text-sm font-black text-orange-deep">
              {language === "ru" ? "Вы получили XP · Серия продолжается" : "XP oldingiz · Seriya davom etmoqda"}
            </p>
          ) : null}
        </div>
        <h2 className="mb-4 text-2xl font-black text-ink">{language === "ru" ? "Ежедневные задания" : "Kunlik topshiriqlar"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {plan.tasks.map((task) => {
            const Icon = icons[task.id as keyof typeof icons] ?? Sparkles;
            const done = completed.includes(task.id);
            return (
              <article key={task.id} className={`rounded-[2rem] border p-5 shadow-soft transition ${done ? "border-emerald-200 bg-emerald-50" : "border-white/85 bg-white/88"}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${done ? "bg-emerald-100 text-emerald-700" : "bg-orange-soft text-orange-deep"}`}><Icon className="h-6 w-6" /></div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-black leading-6 text-ink">{language === "ru" ? task.titleRu : task.titleUz}</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <AppButton href={task.href} variant="secondary" className="min-h-10 px-4 py-2">{language === "ru" ? "Начать план" : "Rejani boshlash"}</AppButton>
                      <button onClick={() => state.toggleDailyTask(date, task.id)} className={`warm-focus inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${done ? "bg-emerald-600 text-white" : "bg-orange-soft text-orange-deep"}`}>
                        <Check className="h-4 w-4" /> {done ? (language === "ru" ? "Задание выполнено" : "Vazifa tugallandi") : (language === "ru" ? "Отметить" : "Belgilash")}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
