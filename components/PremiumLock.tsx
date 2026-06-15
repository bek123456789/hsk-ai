"use client";

import { Crown, Loader2, LockKeyhole, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";
import { getPremiumLockMessage } from "@/utils/premium";

export function PremiumLock({ featureKey = "hskFull", title }: { featureKey?: string; title?: string }) {
  const { language } = useI18n();
  const router = useRouter();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [checking, setChecking] = useState(true);
  const [premiumOpened, setPremiumOpened] = useState(false);

  useEffect(() => {
    let active = true;
    async function checkStatus() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;
        const response = await fetch("/api/subscription/status", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        const result = (await response.json()) as { isPremium?: boolean };
        if (active && result.isPremium) {
          setPremiumOpened(true);
          await initializeAuth();
          router.refresh();
        }
      } finally {
        if (active) setChecking(false);
      }
    }
    void checkStatus();
    return () => {
      active = false;
    };
  }, [initializeAuth, router]);

  if (checking || premiumOpened) {
    return (
      <div className="rounded-[2.5rem] border border-orange-soft/80 bg-white/90 p-8 text-center shadow-premium">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-brand" />
        <p className="mt-4 text-sm font-black text-stone-600">
          {premiumOpened ? (language === "ru" ? "Premium открыт. Страница обновляется." : "Premium ochildi. Sahifa yangilanmoqda.") : (language === "ru" ? "Статус Premium проверяется" : "Premium holati tekshirilmoqda")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2.5rem] border border-orange-soft/80 bg-gradient-to-br from-white via-cream to-orange-soft/50 p-7 text-center shadow-premium backdrop-blur-xl sm:p-10">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow">
        <LockKeyhole className="h-10 w-10" />
      </div>
      <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{language === "ru" ? "Нужен Premium" : "Premium kerak"}</p>
      <h2 className="mt-2 text-4xl font-black text-ink">{title ?? (language === "ru" ? "Эта функция доступна в Premium" : "Bu funksiya Premium uchun")}</h2>
      <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-stone-600">{getPremiumLockMessage(featureKey, language)}</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <AppButton href="/premium">
          <Crown className="h-5 w-5" /> {language === "ru" ? "Открыть Premium" : "Premiumni ochish"}
        </AppButton>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black text-orange-deep shadow-soft">
          <Sparkles className="h-4 w-4" /> {language === "ru" ? "Пока в тестовом режиме · Реальные деньги не списываются" : "Hozircha test rejimida · Real pul yechilmaydi"}
        </span>
      </div>
    </div>
  );
}
