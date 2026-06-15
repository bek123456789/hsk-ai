"use client";

import { PracticeLevelSelector } from "@/components/PracticeLevelSelector";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function StrokeOrderPage() {
  return (
    <ProtectedRoute>
      <PracticeLevelSelector
        basePath="/stroke-order"
        titleUz="Iyeroglif yozish"
        titleRu="Написание иероглифов"
        subtitleUz="Belgilarni yozib mashq qiling va chizish tartibi uchun tayyorlangan bosqichlarni ko‘ring."
        subtitleRu="Практикуйте письмо и смотрите подготовленные шаги порядка черт."
      />
    </ProtectedRoute>
  );
}
