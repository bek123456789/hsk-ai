"use client";

import { Crown, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { AIWeaknessCoachCard } from "@/components/AIWeaknessCoachCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UsageLimitCard } from "@/components/UsageLimitCard";
import { PremiumTokenCard } from "@/components/PremiumTokenCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AIUsageType } from "@/utils/usageLimits";
import { useI18n } from "@/utils/i18n";

type UsageItem = {
  usageType: AIUsageType;
  used: number;
  limit: number;
  remaining: number;
};

export default function UsagePage() {
  const { language } = useI18n();
  const [usage, setUsage] = useState<UsageItem[]>([]);
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadUsage() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error(language === "ru" ? "Сессия не найдена" : "Sessiya topilmadi");
        const response = await fetch("/api/usage", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        const result = (await response.json()) as { usage?: UsageItem[]; premium?: boolean; error?: string };
        if (!response.ok) throw new Error(result.error);
        if (active) {
          setUsage(result.usage ?? []);
          setPremium(Boolean(result.premium));
        }
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : language === "ru" ? "Не удалось загрузить лимиты" : "Limitlarni yuklab bo‘lmadi");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadUsage();
    return () => {
      active = false;
    };
  }, [language]);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-12 lg:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-orange-deep">{language === "ru" ? "Дневной лимит" : "Bugungi limit"}</p>
            <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Использование AI" : "AI foydalanish"}</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold text-stone-600">
              <RotateCcw className="mr-2 inline h-5 w-5 text-orange-brand" />
              {language === "ru" ? "Лимит обновится завтра" : "Limit ertaga yangilanadi"}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep shadow-soft sm:self-auto">
            <Crown className="h-4 w-4" /> {premium ? "Premium" : language === "ru" ? "Бесплатный план" : "Bepul reja"}
          </span>
        </div>
        <div className="mt-6">
          <PremiumTokenCard language={language} />
        </div>
        <div className="mt-6">
          <AIWeaknessCoachCard />
        </div>

        {loading ? (
          <div className="mt-10 flex min-h-64 items-center justify-center rounded-[2rem] bg-white/80 shadow-soft">
            <Loader2 className="h-8 w-8 animate-spin text-orange-brand" />
          </div>
        ) : error ? (
          <p className="mt-8 rounded-3xl bg-rose-50 px-5 py-4 font-black text-rose-700">{error}</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {usage.map((item) => <UsageLimitCard key={item.usageType} {...item} language={language} />)}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!premium ? <AppButton href="/premium">{language === "ru" ? "Перейти на Premium" : "Premiumga o‘tish"}</AppButton> : null}
          <AppButton href="/profile" variant="secondary">{language === "ru" ? "Вернуться в профиль" : "Profilga qaytish"}</AppButton>
        </div>
      </section>
    </ProtectedRoute>
  );
}
