"use client";

import { Gamepad2 } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useI18n } from "@/utils/i18n";

export default function GamesPage() {
  const { language } = useI18n();
  const games = [
    { href: "/games/matching", titleUz: "So‘zlarni moslashtirish", titleRu: "Сопоставление слов" },
    { href: "/games/speed-quiz", titleUz: "Tezkor test", titleRu: "Быстрый тест" },
    { href: "/games/memory", titleUz: "Xotira kartalari", titleRu: "Карты памяти" },
    { href: "/games/audio-match", titleUz: "Audio moslashtirish", titleRu: "Аудио-сопоставление" }
  ];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Игры" : "O‘yinlar"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">{language === "ru" ? "Играйте и закрепляйте HSK слова." : "O‘ynang va HSK so‘zlarini mustahkamlang."}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {games.map((game) => (
            <Card key={game.href} className="p-6">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft"><Gamepad2 className="h-7 w-7" /></div>
              <h2 className="text-2xl font-black text-ink">{language === "ru" ? game.titleRu : game.titleUz}</h2>
              <div className="mt-6"><AppButton href={game.href} variant="primary" className="w-full">{language === "ru" ? "Начать" : "Boshlash"}</AppButton></div>
            </Card>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}
