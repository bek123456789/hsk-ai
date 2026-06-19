"use client";

import { GraduationCap, Map } from "lucide-react";
import { AppButton } from "@/components/AppButton";
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
        <div className="mb-6 flex justify-end">
          <AppButton href="/learning-path" variant="secondary">
            <Map className="h-4 w-4" /> {language === "ru" ? "Учебный путь" : "O‘quv yo‘li"}
          </AppButton>
        </div>
        <LessonCurriculumList />
      </PageShell>
    </ProtectedRoute>
  );
}
