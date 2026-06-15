"use client";

import { AlertTriangle, FlaskConical, Rocket } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { useI18n } from "@/utils/i18n";

export default function BetaStatusPage() {
  const { language } = useI18n();
  return (
    <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-12 lg:py-14">
      <FlaskConical className="h-12 w-12 text-orange-brand" />
      <h1 className="mt-5 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Статус беты" : "Beta holati"}</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white/88 p-6 shadow-premium"><AlertTriangle className="h-7 w-7 text-orange-brand" /><h2 className="mt-4 text-2xl font-black text-ink">{language === "ru" ? "Известные проблемы" : "Ma’lum muammolar"}</h2><p className="mt-3 font-semibold leading-7 text-stone-600">{language === "ru" ? "Активация Premium зависит от настройки Stripe webhook. Распознавание речи зависит от браузера." : "Premium faollashuvi Stripe webhook sozlamasiga bog‘liq. Ovoz tanish brauzerga bog‘liq."}</p></div>
        <div className="rounded-[2rem] bg-white/88 p-6 shadow-premium"><Rocket className="h-7 w-7 text-orange-brand" /><h2 className="mt-4 text-2xl font-black text-ink">{language === "ru" ? "Следующие функции" : "Keyingi yangiliklar"}</h2><p className="mt-3 font-semibold leading-7 text-stone-600">{language === "ru" ? "Улучшенный поиск знаний, синхронизация без сети и расширенная аналитика." : "Kengaytirilgan bilim qidiruvi, oflayn sinxronlash va batafsil statistika."}</p></div>
      </div>
      <div className="mt-7"><AppButton href="/feedback">{language === "ru" ? "Сообщить об ошибке" : "Xato haqida xabar berish"}</AppButton></div>
    </section>
  );
}
