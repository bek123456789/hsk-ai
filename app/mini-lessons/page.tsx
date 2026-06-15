"use client";

import { BookOpen, Clock3, Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { useI18n } from "@/utils/i18n";

export default function MiniLessonsPage() {
  const { language } = useI18n();
  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader eyebrow="HSK 1–6" title={language === "ru" ? "Мини-уроки" : "Mini darslar"} description={language === "ru" ? "Короткие занятия со словами, грамматикой, диалогом и быстрым тестом." : "So‘zlar, grammatika, dialog va tezkor testdan iborat qisqa darslar."} icon={Sparkles} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <FeatureCard
              key={level}
              icon={level % 2 ? Clock3 : BookOpen}
              title={`HSK ${level}`}
              description={language === "ru" ? "Урок на 3–5 минут: новые слова, одна грамматическая модель и быстрый тест." : "3–5 daqiqalik dars: yangi so‘zlar, bitta grammatika qolipi va tezkor test."}
              href={`/mini-lessons/${level}`}
              action={language === "ru" ? "Начать урок" : "Darsni boshlash"}
            />
          ))}
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
