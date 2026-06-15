"use client";

import { PracticeLevelSelector } from "@/components/PracticeLevelSelector";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function WritingLevelsPage() {
  return (
    <ProtectedRoute>
      <PracticeLevelSelector
        basePath="/writing"
        titleUz="Yozish mashqi"
        titleRu="Практика письма"
        subtitleUz="So‘zlardan gap tuzing, javob yozing va namunaviy javobni ko‘ring."
        subtitleRu="Составляйте предложения, пишите ответ и смотрите пример."
      />
    </ProtectedRoute>
  );
}
