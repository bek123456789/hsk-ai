"use client";

import { Download } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function ProgressExportPage() {
  const { language } = useI18n();
  const progress = useProgressStore();

  function download() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hanziflow-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="rounded-[2.5rem] bg-white/88 p-10 text-center shadow-premium">
          <Download className="mx-auto mb-5 h-16 w-16 text-orange-brand" />
          <h1 className="text-5xl font-black text-ink">{language === "ru" ? "Экспорт прогресса" : "Rivojlanish eksporti"}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-8 text-stone-600">{language === "ru" ? "Скачайте локальную копию вашего учебного прогресса." : "O‘quv progressingizning lokal nusxasini yuklab oling."}</p>
          <button onClick={download} className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3.5 text-sm font-black text-white shadow-card">
            <Download className="h-5 w-5" /> {language === "ru" ? "Скачать" : "Yuklab olish"}
          </button>
        </div>
      </section>
    </ProtectedRoute>
  );
}
