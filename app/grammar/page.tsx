"use client";

import { PracticeLevelSelector } from "@/components/PracticeLevelSelector";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function GrammarPage() {
  return (
    <ProtectedRoute>
      <PracticeLevelSelector
        basePath="/grammar"
        titleUz="Grammatika mashqi"
        titleRu="Тренажёр грамматики"
        subtitleUz="HSK 1–6 grammatik qoliplarini misollar, xatolar va mashqlar bilan o‘rganing."
        subtitleRu="Изучайте грамматические модели HSK 1–6 с примерами, ошибками и упражнениями."
      />
    </ProtectedRoute>
  );
}
