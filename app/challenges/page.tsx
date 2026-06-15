"use client";

import { Clock3, Headphones, Mic, Timer, Trophy } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useI18n } from "@/utils/i18n";

export default function ChallengesPage() {
  const { language } = useI18n();
  const cards = [
    { href: "/challenges/vocabulary", icon: Trophy, uz: "Lug‘at challenge", ru: "Словарный челлендж", detailUz: "60 soniyada 10 so‘z.", detailRu: "10 слов за 60 секунд." },
    { href: "/challenges/listening", icon: Headphones, uz: "Tinglash challenge", ru: "Челлендж аудирования", detailUz: "Eshitib ma’noni toping.", detailRu: "Слушайте и выбирайте значение." },
    { href: "/challenges/speaking", icon: Mic, uz: "Gapirish challenge", ru: "Челлендж говорения", detailUz: "Qisqa gaplarni takrorlang.", detailRu: "Повторяйте короткие фразы." },
    { href: "/challenges/speed", icon: Timer, uz: "Tezkor challenge", ru: "Скоростной челлендж", detailUz: "Xatoga yo‘l qo‘ymasdan tez javob bering.", detailRu: "Отвечайте быстро без ошибок." }
  ];
  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Челленджи" : "Kunlik sinovlar"}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Короткие задания на скорость, память и уверенность." : "Tezlik, xotira va ishonch uchun qisqa topshiriqlar."}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Card key={card.href} className="p-6">
              <card.icon className="mb-5 h-10 w-10 text-orange-brand" />
              <h2 className="text-2xl font-black text-ink">{language === "ru" ? card.ru : card.uz}</h2>
              <p className="mt-3 min-h-16 text-sm font-semibold leading-6 text-stone-500">{language === "ru" ? card.detailRu : card.detailUz}</p>
              <div className="mt-5 flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-black text-orange-deep">
                <Clock3 className="h-4 w-4" /> {language === "ru" ? "Ежедневный результат" : "Kunlik natija"}
              </div>
              <AppButton href={card.href} className="mt-5 w-full">{language === "ru" ? "Начать" : "Boshlash"}</AppButton>
            </Card>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}
