"use client";

import { GraduationCap } from "lucide-react";
import { useParams } from "next/navigation";
import { LessonCurriculumList } from "@/components/LessonCurriculumList";
import { HskLevelGuard } from "@/components/HskLevelGuard";
import { PremiumLock } from "@/components/PremiumLock";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";
import { parseHskLevel } from "@/utils/level";
import { isPremiumProfile } from "@/utils/premium";

export default function LessonLevelPage() {
  const params = useParams();
  const level = parseHskLevel(params.level);
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const locked = level > 1 && !isPremiumProfile(user);

  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader
          eyebrow={`HSK ${level}`}
          title={language === "ru" ? `Уроки HSK ${level}` : `HSK ${level} darslari`}
          description={language === "ru" ? "Проходите уроки по порядку и развивайте все основные навыки." : "Darslarni ketma-ket o‘ting va barcha asosiy ko‘nikmalarni rivojlantiring."}
          icon={GraduationCap}
        />
        <HskLevelGuard level={level}>
          {locked ? <PremiumLock featureKey="hskFull" /> : <LessonCurriculumList levelOnly={level} />}
        </HskLevelGuard>
      </PageShell>
    </ProtectedRoute>
  );
}
