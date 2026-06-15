"use client";

import { GraduationCap } from "lucide-react";
import { LessonCurriculumList } from "@/components/LessonCurriculumList";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { useI18n } from "@/utils/i18n";

export default function LessonListPage() {
  const { language } = useI18n();

  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader
          eyebrow="HSK 1 → HSK 6"
          title={language === "ru" ? "Ваш путь уроков HSK" : "HSK dars yo‘lingiz"}
          description={language === "ru" ? "Последовательные уроки со словами, грамматикой, чтением, аудированием, говорением и мини-тестом." : "So‘zlar, grammatika, o‘qish, tinglash, gapirish va mini testdan iborat izchil darslar."}
          icon={GraduationCap}
        />
        <LessonCurriculumList />
      </PageShell>
    </ProtectedRoute>
  );
}
