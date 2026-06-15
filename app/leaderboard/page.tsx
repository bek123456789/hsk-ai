"use client";

import { Medal, Trophy } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function LeaderboardPage() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const xp = useProgressStore((state) => state.xp);
  const rows = [
    { name: user?.name || (language === "ru" ? "Ученик HSK" : "HSK o‘rganuvchi"), xp: xp || 420, level: user?.currentHSKLevel ?? 1 },
    { name: language === "ru" ? "Ученик HSK 2" : "HSK o‘rganuvchi 2", xp: 390, level: 2 },
    { name: language === "ru" ? "Ученик HSK 3" : "HSK o‘rganuvchi 3", xp: 310, level: 1 }
  ].sort((left, right) => right.xp - left.xp);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Рейтинг" : "Reyting"}</h1>
          <p className="mt-4 text-lg font-semibold text-stone-600">{language === "ru" ? "Самые активные ученики" : "Eng faol o‘quvchilar"}</p>
        </div>
        <div className="rounded-[2.5rem] bg-white/88 p-6 shadow-premium">
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-orange-soft p-4 text-sm font-black text-orange-deep"><Trophy className="mb-2 h-6 w-6" /> {language === "ru" ? "XP за неделю" : "Haftalik XP"}</div>
            <div className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600 shadow-soft">{language === "ru" ? "XP за месяц" : "Oylik XP"}</div>
            <div className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600 shadow-soft">{language === "ru" ? "Рейтинг друзей скоро" : "Do‘stlar reytingi tez orada"}</div>
          </div>
          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={row.name} className="flex items-center justify-between rounded-3xl bg-cream p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep"><Medal className="h-6 w-6" /></div>
                  <div>
                    <p className="font-black text-ink">{index + 1}. {row.name}</p>
                    <p className="text-xs font-bold text-stone-500">HSK {row.level}</p>
                  </div>
                </div>
                <p className="font-black text-orange-deep">{row.xp} XP</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
