"use client";

import { ArrowLeft, Bot, Brain, CalendarDays, Headphones, RotateCcw, Target } from "lucide-react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { PremiumLock } from "@/components/PremiumLock";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { parseHskLevel } from "@/utils/level";
import { calculateExamReadiness } from "@/utils/readinessScore";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

export default function ExamCoachLevelPage() {
  const params = useParams();
  const level = parseHskLevel(params.level);
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const progress = useProgressStore();
  const premium = isPremiumProfile(user);
  const readiness = calculateExamReadiness({
    level,
    knownWordIds: progress.knownWordIds,
    weakWordIds: progress.weakWordIds,
    mistakes: progress.mistakes,
    quizResults: progress.quizResults,
    examAttempts: progress.examAttempts,
    practiceResults: progress.practiceResults,
    streak: progress.streak
  });
  const actions = [
    { href: "/review", icon: RotateCcw, uz: "Zaif so‘zlarni takrorlash", ru: "Повторить слабые слова" },
    { href: `/listening/${level}`, icon: Headphones, uz: "Tinglash mashqi", ru: "Практика аудирования" },
    { href: `/grammar/${level}`, icon: Brain, uz: "Grammatika mashqi", ru: "Практика грамматики" },
    { href: `/exam/${level}`, icon: Target, uz: "Imtihonni qayta topshirish", ru: "Повторить экзамен" }
  ];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        {!premium ? <PremiumLock featureKey="examCoach" /> : (
        <>
        <div className="mb-6"><AppButton href="/exam-coach" variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> {language === "ru" ? "Экзаменационный наставник" : "Imtihon murabbiyi"}</AppButton></div>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-7">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft"><Bot className="h-8 w-8" /></div>
            <p className="text-sm font-black text-orange-deep">HSK {level}</p>
            <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Готовность к экзамену" : "Imtihonga tayyorlik"}</h1>
            <p className="mt-5 text-7xl font-black text-orange-brand">{readiness.score}%</p>
            <p className="mt-4 text-base font-bold leading-7 text-stone-600">{language === "ru" ? readiness.recommendationRu : readiness.recommendationUz}</p>
          </Card>
          <Card className="p-7">
            <h2 className="text-3xl font-black text-ink">{language === "ru" ? "План на следующие 7 дней" : "Keyingi 7 kunlik reja"}</h2>
            <div className="mt-5 space-y-3">
              {[
                language === "ru" ? "Сегодня повторите 10 слабых слов." : "Bugun 10 ta zaif so‘zni takrorlang.",
                language === "ru" ? "Выполните 1 аудирование и 1 говорение." : "1 ta tinglash va 1 ta gapirish mashqi qiling.",
                language === "ru" ? "Разберите ошибки из последнего теста." : "Oxirgi test xatolarini tahlil qiling.",
                language === "ru" ? "Через 7 дней повторите тренировочный тест HSK." : "7 kundan keyin HSK uslubidagi testni qayta topshiring."
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-700 shadow-soft">
                  <CalendarDays className="mr-2 inline h-4 w-4 text-orange-brand" /> {item}
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {actions.map((action) => (
                <AppButton key={action.href} href={action.href} variant="secondary" className="justify-start">
                  <action.icon className="h-5 w-5" /> {language === "ru" ? action.ru : action.uz}
                </AppButton>
              ))}
            </div>
          </Card>
        </div>
        </>
        )}
      </section>
    </ProtectedRoute>
  );
}
