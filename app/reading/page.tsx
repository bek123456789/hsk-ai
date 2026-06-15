"use client";

import { PracticeLevelSelector } from "@/components/PracticeLevelSelector";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ReadingLevelsPage() {
  return (
    <ProtectedRoute>
      <PracticeLevelSelector
        basePath="/reading"
        titleUz="O‘qish mashqi"
        titleRu="Практика чтения"
        subtitleUz="Matnni o‘qing, to‘g‘ri javobni tanlang va xatolarni daftarga saqlang."
        subtitleRu="Прочитайте текст, выберите правильный ответ и сохраняйте ошибки."
      />
    </ProtectedRoute>
  );
}
