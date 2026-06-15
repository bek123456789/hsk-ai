"use client";

import { Gift, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { PremiumTokenCard } from "@/components/PremiumTokenCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useI18n } from "@/utils/i18n";
import { addLocalBonusTokens, getBonusTokenAmount } from "@/utils/premiumTokens";

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(new Date());
}

export default function RewardsPage() {
  const { language } = useI18n();
  const [claimed, setClaimed] = useState(false);
  const [message, setMessage] = useState("");
  const amount = getBonusTokenAmount("reward_chest");

  useEffect(() => {
    setClaimed(localStorage.getItem("hsk-ai-reward-chest-day") === todayKey());
  }, []);

  function claim() {
    if (claimed) return;
    addLocalBonusTokens(amount);
    localStorage.setItem("hsk-ai-reward-chest-day", todayKey());
    setClaimed(true);
    setMessage(language === "ru" ? `+${amount} бонусных AI-токенов начислено.` : `+${amount} bonus AI token qo‘shildi.`);
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Награды" : "Mukofotlar"}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Забирайте ежедневную награду и открывайте бонусные AI-токены." : "Kunlik mukofotni oling va bonus AI tokenlarni oching."}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card className="overflow-hidden p-8 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow">
              <Gift className="h-14 w-14" />
            </div>
            <h2 className="mt-6 text-4xl font-black text-ink">{language === "ru" ? "Ежедневный сундук" : "Kunlik sandiq"}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-stone-500">
              {language === "ru" ? "Один раз в день получите бонус для AI Tutor и премиум-функций." : "Har kuni bir marta AI Tutor va premium funksiyalar uchun bonus oling."}
            </p>
            <button
              onClick={claim}
              disabled={claimed}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-8 py-4 text-sm font-black text-white shadow-glow disabled:opacity-60"
            >
              <Sparkles className="h-5 w-5" /> {claimed ? (language === "ru" ? "Сегодня уже получено" : "Bugun olindi") : (language === "ru" ? "Получить награду" : "Mukofotni olish")}
            </button>
            {message ? <p className="mt-4 rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep">{message}</p> : null}
          </Card>
          <div className="space-y-5">
            <PremiumTokenCard language={language} />
            <Card className="p-6">
              <Trophy className="mb-4 h-8 w-8 text-orange-brand" />
              <h3 className="text-2xl font-black text-ink">{language === "ru" ? "Больше наград" : "Ko‘proq mukofot"}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">
                {language === "ru" ? "Выполняйте ежедневные задания и приглашайте друзей." : "Kunlik sinovlarni bajaring va do‘stlaringizni taklif qiling."}
              </p>
              <div className="mt-5 grid gap-3">
                <AppButton href="/challenges" variant="secondary">{language === "ru" ? "Ежедневные задания" : "Kunlik sinovlar"}</AppButton>
                <AppButton href="/referral" variant="secondary">{language === "ru" ? "Пригласить друга" : "Do‘st taklif qilish"}</AppButton>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
