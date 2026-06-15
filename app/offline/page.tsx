"use client";

import { RefreshCcw, WifiOff } from "lucide-react";
import { useI18n } from "@/utils/i18n";

export default function OfflinePage() {
  const { language } = useI18n();

  return (
    <section className="premium-grid mx-auto grid min-h-[calc(100vh-5rem)] max-w-4xl place-items-center px-5 py-10 sm:px-8">
      <div className="rounded-[2.5rem] bg-white/90 p-10 text-center shadow-premium">
        <WifiOff className="mx-auto mb-5 h-16 w-16 text-orange-brand" />
        <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Офлайн режим" : "Internetsiz rejim"}</p>
        <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Нет интернета" : "Internet yo‘q"}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-8 text-stone-600">
          {language === "ru" ? "Некоторые уроки доступны офлайн. Прогресс синхронизируется позже." : "Ba’zi darslar internetsiz ham ochiladi. Rivojlanish keyin sinxronlanadi."}
        </p>
        <button onClick={() => window.location.reload()} className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3.5 text-sm font-black text-white shadow-card">
          <RefreshCcw className="h-5 w-5" /> {language === "ru" ? "Повторить" : "Qayta urinish"}
        </button>
      </div>
    </section>
  );
}
