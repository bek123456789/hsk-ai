"use client";

import { PracticeLevelSelector } from "@/components/PracticeLevelSelector";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ListeningLevelsPage() {
  return (
    <ProtectedRoute>
      <PracticeLevelSelector
        basePath="/listening"
        titleUz="Tinglab tushunish"
        titleRu="Аудирование"
        subtitleUz="Audioni eshiting, javobni tanlang va listening ko‘nikmasini mustahkamlang."
        subtitleRu="Прослушайте аудио, выберите ответ и укрепляйте навык аудирования."
      />
    </ProtectedRoute>
  );
}
