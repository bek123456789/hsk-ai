"use client";

import { Bot, CreditCard, LifeBuoy, Mic2, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/utils/i18n";

export default function HelpPage() {
  const { language } = useI18n();
  const [query, setQuery] = useState("");
  const topics = useMemo(() => [
    { href: "/help/ai", icon: Bot, title: language === "ru" ? "Как работает AI-наставник?" : "AI yordamchi qanday ishlaydi?", detail: language === "ru" ? "Контекст уроков, ошибок и лимиты." : "Darslar, xatolar konteksti va limitlar." },
    { href: "/help/premium", icon: Sparkles, title: language === "ru" ? "Как работает Premium?" : "Premium qanday ishlaydi?", detail: language === "ru" ? "Доступ, пробный период и управление." : "Kirish, sinov muddati va boshqaruv." },
    { href: "/help/speaking", icon: Mic2, title: language === "ru" ? "Не работает проверка произношения" : "Talaffuz tekshiruvi ishlamasa", detail: language === "ru" ? "Микрофон и поддержка браузера." : "Mikrofon va brauzer yordami." },
    { href: "/help/payment", icon: CreditCard, title: language === "ru" ? "Оплата и тестовый режим" : "To‘lov va test rejimi", detail: language === "ru" ? "Checkout, webhook и активация Premium." : "To‘lov sahifasi, webhook va Premium faollashuvi." }
  ], [language]);
  const filtered = topics.filter((topic) => `${topic.title} ${topic.detail}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-12 lg:py-14">
      <div className="max-w-3xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow"><LifeBuoy className="h-8 w-8" /></div>
        <h1 className="mt-6 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Центр помощи" : "Yordam markazi"}</h1>
        <p className="mt-4 text-lg font-semibold text-stone-600">{language === "ru" ? "Быстрые ответы по обучению, Premium и техническим вопросам." : "O‘qish, Premium va texnik savollar bo‘yicha tezkor javoblar."}</p>
      </div>
      <label className="mt-8 flex items-center gap-3 rounded-3xl border border-orange-soft/70 bg-white/90 px-5 py-4 shadow-soft">
        <Search className="h-5 w-5 text-orange-brand" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "ru" ? "Поиск по вопросам" : "Savollarni qidirish"} className="min-w-0 flex-1 bg-transparent font-bold text-ink outline-none" />
      </label>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {filtered.map((topic) => (
          <Link key={topic.href} href={topic.href} className="rounded-[2rem] border border-white/80 bg-white/88 p-6 shadow-premium transition hover:-translate-y-1">
            <topic.icon className="h-8 w-8 text-orange-brand" />
            <h2 className="mt-5 text-2xl font-black text-ink">{topic.title}</h2>
            <p className="mt-2 font-semibold leading-7 text-stone-500">{topic.detail}</p>
          </Link>
        ))}
      </div>
      {!filtered.length ? <p className="mt-6 rounded-3xl bg-white/80 p-6 text-center font-black text-stone-500">{language === "ru" ? "Ничего не найдено" : "Hech narsa topilmadi"}</p> : null}
    </section>
  );
}
