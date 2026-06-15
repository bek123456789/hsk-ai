"use client";

import { CheckCircle2, History } from "lucide-react";
import { useI18n } from "@/utils/i18n";

export default function ChangelogPage() {
  const { language } = useI18n();
  const items = language === "ru"
    ? ["Добавлены уровни HSK 1–6", "Добавлена система практики", "Добавлена проверка произношения", "Добавлен Premium Stripe в тестовом режиме", "Добавлены дневные лимиты AI"]
    : ["HSK 1–6 darajalari qo‘shildi", "Mashq tizimi qo‘shildi", "Talaffuz tekshiruvi qo‘shildi", "Stripe test Premium qo‘shildi", "Kunlik AI limitlari qo‘shildi"];
  return (
    <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-12 lg:py-14">
      <History className="h-12 w-12 text-orange-brand" />
      <h1 className="mt-5 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Обновления" : "Yangiliklar"}</h1>
      <div className="mt-8 rounded-[2.5rem] bg-white/88 p-7 shadow-premium sm:p-10">
        <p className="text-sm font-black text-orange-deep">0.2.0 · Beta</p>
        <div className="mt-5 space-y-3">{items.map((item) => <p key={item} className="flex items-center gap-3 rounded-3xl bg-cream px-5 py-4 font-black text-stone-700"><CheckCircle2 className="h-5 w-5 shrink-0 text-orange-brand" />{item}</p>)}</div>
      </div>
    </section>
  );
}
