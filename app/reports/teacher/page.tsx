"use client";

import { Download, School } from "lucide-react";
import { AIWeaknessCoachCard } from "@/components/AIWeaknessCoachCard";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function TeacherReportPage() {
  const { language } = useI18n();
  const progress = useProgressStore();
  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <Card className="mb-6 p-8 print:shadow-none">
          <School className="h-12 w-12 text-orange-brand" />
          <h1 className="mt-4 text-5xl font-black text-ink">{language === "ru" ? "Отчёт для учителя" : "Ustoz hisoboti"}</h1>
          <p className="mt-3 text-lg font-semibold text-stone-600">
            {language === "ru" ? "Ошибки, слабые слова и готовность к следующему уровню." : "Xatolar, zaif so‘zlar va keyingi darajaga tayyorgarlik."}
          </p>
          <button onClick={() => window.print()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-brand px-6 py-3.5 text-sm font-black text-white shadow-glow">
            <Download className="h-5 w-5" /> {language === "ru" ? "Печать" : "Chop etish"}
          </button>
        </Card>
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="p-6"><p className="text-sm font-bold text-stone-500">{language === "ru" ? "Ошибки" : "Xatolar"}</p><p className="mt-2 text-4xl font-black text-orange-deep">{progress.mistakes.length}</p></Card>
          <Card className="p-6"><p className="text-sm font-bold text-stone-500">{language === "ru" ? "Слабые слова" : "Zaif so‘zlar"}</p><p className="mt-2 text-4xl font-black text-orange-deep">{progress.weakWordIds.length}</p></Card>
          <Card className="p-6"><p className="text-sm font-bold text-stone-500">{language === "ru" ? "Экзамены" : "Imtihonlar"}</p><p className="mt-2 text-4xl font-black text-orange-deep">{progress.examAttempts.length}</p></Card>
        </div>
        <div className="mt-6"><AIWeaknessCoachCard /></div>
      </section>
    </ProtectedRoute>
  );
}
