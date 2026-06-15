"use client";

import { Download, HeartHandshake } from "lucide-react";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function ParentReportPage() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const progress = useProgressStore();
  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <Card className="p-8 print:shadow-none">
          <HeartHandshake className="h-12 w-12 text-orange-brand" />
          <h1 className="mt-4 text-5xl font-black text-ink">{language === "ru" ? "Отчёт для родителей" : "Ota-ona hisoboti"}</h1>
          <p className="mt-3 text-lg font-semibold text-stone-600">{user?.name ?? "HanziFlow AI"}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-cream p-5"><p className="text-sm font-bold text-stone-500">{language === "ru" ? "Изучено слов" : "O‘rganilgan so‘zlar"}</p><p className="mt-2 text-4xl font-black text-orange-deep">{progress.knownWordIds.length}</p></div>
            <div className="rounded-3xl bg-cream p-5"><p className="text-sm font-bold text-stone-500">{language === "ru" ? "Серия" : "Seriya"}</p><p className="mt-2 text-4xl font-black text-orange-deep">{progress.streak}</p></div>
          </div>
          <button onClick={() => window.print()} className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-brand px-6 py-3.5 text-sm font-black text-white shadow-glow">
            <Download className="h-5 w-5" /> {language === "ru" ? "Печать" : "Chop etish"}
          </button>
        </Card>
      </section>
    </ProtectedRoute>
  );
}
