"use client";

import { Coins, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { readLocalBonusTokens } from "@/utils/premiumTokens";
import type { AppLanguage } from "@/types";

export function PremiumTokenCard({ language }: { language: AppLanguage }) {
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    setTokens(readLocalBonusTokens());
  }, []);

  return (
    <Card className="border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/50 p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
          <Coins className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-black text-ink">{language === "ru" ? "Бонусные AI-токены" : "Bonus AI tokenlar"}</p>
          <p className="mt-1 text-xs font-bold text-stone-500">{language === "ru" ? "Награды и приглашения" : "Mukofot va takliflardan"}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-3xl bg-white/80 px-5 py-4 shadow-soft">
        <span className="text-3xl font-black text-orange-deep">{tokens}</span>
        <Sparkles className="h-6 w-6 text-orange-brand" />
      </div>
    </Card>
  );
}
