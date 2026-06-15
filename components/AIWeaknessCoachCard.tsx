"use client";

import { Brain, Sparkles } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { useProgressStore } from "@/store/progressStore";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";
import { buildWeaknessInsights } from "@/utils/weaknessAnalysis";
import type { HSKLevel } from "@/types";

export function AIWeaknessCoachCard() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const mistakes = useProgressStore((state) => state.mistakes);
  const quizResults = useProgressStore((state) => state.quizResults);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const storeLevel = useProgressStore((state) => state.currentLevel);
  const currentLevel = (user?.currentHSKLevel ?? storeLevel ?? 1) as HSKLevel;
  const insights = buildWeaknessInsights({
    weakWordCount: weakWordIds.length,
    mistakes,
    quizResults,
    examAttempts,
    currentLevel,
    language
  });

  return (
    <Card className="overflow-hidden border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/45 p-6 shadow-premium">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-3 py-1 text-xs font-black text-orange-deep">
            <Sparkles className="h-3.5 w-3.5" />
            {language === "ru" ? "AI-анализ" : "AI tahlil"}
          </p>
          <h2 className="mt-3 text-2xl font-black text-ink">
            {language === "ru" ? "Тренер слабых мест" : "Zaif joylar murabbiyi"}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
            {language === "ru"
              ? "AI анализирует ваши ошибки, слабые слова и экзамены."
              : "AI xatolar, zaif so‘zlar va imtihon natijalaringizni ko‘rib chiqadi."}
          </p>
        </div>
        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-orange-brand text-white shadow-glow sm:flex">
          <Brain className="h-7 w-7" />
        </div>
      </div>
      <div className="grid gap-3">
        {insights.map((insight) => (
          <div key={insight.title} className="rounded-3xl border border-orange-soft/70 bg-white/85 p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-ink">{insight.title}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-stone-500">{insight.detail}</p>
              </div>
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-black text-orange-deep">{insight.score}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-cream">
              <div className="h-2 rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${Math.min(100, insight.score)}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <AppButton href="/ai-tutor" variant="primary" className="w-full">
          {language === "ru" ? "Спросить AI" : "AI’dan so‘rash"}
        </AppButton>
      </div>
    </Card>
  );
}
