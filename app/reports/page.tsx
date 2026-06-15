"use client";

import { BarChart3, Download, GraduationCap, Users } from "lucide-react";
import { AIWeaknessCoachCard } from "@/components/AIWeaknessCoachCard";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

export default function ReportsPage() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const progress = useProgressStore();
  const premium = isPremiumProfile(user);
  const accuracy = Math.round((progress.quizResults.reduce((sum, item) => sum + item.score, 0) / Math.max(1, progress.quizResults.reduce((sum, item) => sum + item.total, 0))) * 100);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
            <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Отчёты" : "Hisobotlar"}</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
              {language === "ru" ? "Понятный отчёт для ученика, родителей и учителя." : "O‘quvchi, ota-ona va ustoz uchun tushunarli hisobot."}
            </p>
          </div>
          <button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-brand px-6 py-3.5 text-sm font-black text-white shadow-glow">
            <Download className="h-5 w-5" /> {language === "ru" ? "Печать" : "Chop etish"}
          </button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: GraduationCap, label: language === "ru" ? "Уровень" : "Daraja", value: `HSK ${user?.currentHSKLevel ?? progress.currentLevel}` },
            { icon: BarChart3, label: language === "ru" ? "Точность" : "Aniqlik", value: `${accuracy}%` },
            { icon: Users, label: language === "ru" ? "План" : "Reja", value: premium ? "Premium" : language === "ru" ? "Бесплатно" : "Bepul" }
          ].map((item) => (
            <Card key={item.label} className="p-6">
              <item.icon className="mb-4 h-8 w-8 text-orange-brand" />
              <p className="text-sm font-black text-stone-500">{item.label}</p>
              <p className="mt-2 text-4xl font-black text-ink">{item.value}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <AIWeaknessCoachCard />
          <Card className="p-6">
            <h2 className="text-3xl font-black text-ink">{language === "ru" ? "Экспорт" : "Eksport"}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-stone-500">
              {language === "ru" ? "Premium открывает детальные родительские и учительские отчёты." : "Premium ota-ona va ustoz uchun batafsil hisobotlarni ochadi."}
            </p>
            <div className="mt-5 grid gap-3">
              <AppButton href="/reports/parent" variant="secondary">{language === "ru" ? "Отчёт для родителей" : "Ota-ona hisoboti"}</AppButton>
              <AppButton href="/reports/teacher" variant="secondary">{language === "ru" ? "Отчёт для учителя" : "Ustoz hisoboti"}</AppButton>
            </div>
          </Card>
        </div>
      </section>
    </ProtectedRoute>
  );
}
