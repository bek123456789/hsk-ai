"use client";

import { PracticeLevelSelector } from "@/components/PracticeLevelSelector";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UsageLimitOverview } from "@/components/UsageLimitOverview";

export default function SpeakingLevelsPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
        <div className="grid gap-3 md:grid-cols-2">
          <UsageLimitOverview usageType="pronunciation_check" />
          <UsageLimitOverview usageType="speaking_meaning_check" />
        </div>
      </div>
      <PracticeLevelSelector
        basePath="/speaking"
        titleUz="Gapirish mashqi"
        titleRu="Практика говорения"
        subtitleUz="So‘z talaffuzi, matn mazmunini aytish, dialog va kundalik vaziyatlarni mashq qiling."
        subtitleRu="Тренируйте произношение слов, пересказ текста, диалог и ежедневные ситуации."
      />
    </ProtectedRoute>
  );
}
