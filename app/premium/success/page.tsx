"use client";

import { CheckCircle2, Crown, Loader2, RefreshCcw, ShieldCheck } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";

type VerifyResult = {
  message?: string;
  error?: string;
  isPremium?: boolean;
  subscription_status?: string | null;
  subscription_plan?: string | null;
  stripeCustomerExists?: boolean;
  stripeSubscriptionExists?: boolean;
};

type SubscriptionStatusResult = {
  subscription_status?: string | null;
  subscription_plan?: string | null;
  isPremium?: boolean;
  stripeCustomerExists?: boolean;
  stripeSubscriptionExists?: boolean;
};

type HealthResult = {
  webhookSecretConfigured?: boolean;
  serviceRoleConfigured?: boolean;
  message?: string;
};

const isDevelopment = process.env.NODE_ENV === "development";

function PremiumSuccessContent() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const user = useAuthStore((state) => state.user);
  const { language } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatusResult | null>(null);
  const [health, setHealth] = useState<HealthResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");

  async function verifySession() {
    setLoading(true);
    setError(null);

    try {
      await initializeAuth();
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error(language === "ru" ? "Сначала войдите в аккаунт" : "Avval tizimga kiring");

      if (!sessionId) {
        throw new Error(language === "ru" ? "Сессия не найдена" : "Sessiya topilmadi");
      }

      const response = await fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, language })
      });
      const payload = (await response.json()) as VerifyResult;
      setResult(payload);

      if (!response.ok) throw new Error(payload.error || (language === "ru" ? "Не удалось проверить Premium" : "Premiumni tekshirib bo‘lmadi"));
      const statusResponse = await fetch("/api/subscription/status", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (statusResponse.ok) {
        setSubscriptionStatus((await statusResponse.json()) as SubscriptionStatusResult);
      }
      const healthResponse = await fetch(`/api/stripe/health?language=${language}`, { cache: "no-store" });
      if (healthResponse.ok) {
        setHealth((await healthResponse.json()) as HealthResult);
      }
      await initializeAuth();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : language === "ru" ? "Не удалось проверить Premium" : "Premiumni tekshirib bo‘lmadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, language]);

  const premiumOpened = Boolean(subscriptionStatus?.isPremium ?? result?.isPremium);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto grid min-h-[calc(100vh-5rem)] max-w-4xl place-items-center px-5 pb-36 pt-10 sm:px-8 md:pb-10">
        <div className="rounded-[2.5rem] border border-orange-soft/80 bg-white/90 p-8 text-center shadow-premium sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow">
            {loading ? <Loader2 className="h-11 w-11 animate-spin" /> : premiumOpened ? <ShieldCheck className="h-11 w-11" /> : <CheckCircle2 className="h-11 w-11" />}
          </div>
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">Premium</p>
          <h1 className="mt-2 text-5xl font-black text-ink">
            {loading
              ? language === "ru" ? "Premium активируется" : "Premium faollashtirilmoqda"
              : premiumOpened
                ? language === "ru" ? "Premium открыт" : "Premium ochildi"
                : language === "ru" ? "Premium активируется" : "Premium faollashtirilmoqda"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-8 text-stone-600">
            {premiumOpened
              ? language === "ru" ? "Теперь Premium-функции доступны в вашем аккаунте." : "Endi Premium funksiyalar akkauntingizda ochildi."
              : error
                ? error
                : language === "ru"
                  ? "Проверка webhook может занять несколько секунд. Обновите статус."
                  : "Webhook tasdiqlashi bir necha soniya olishi mumkin. Statusni yangilang."}
          </p>

          {!premiumOpened && !loading ? (
            <p className="mx-auto mt-4 max-w-xl rounded-3xl bg-amber-50 px-5 py-4 text-sm font-black leading-6 text-amber-800">
              {language === "ru"
                ? "Оплата Premium завершена, но статус ещё не обновился. Проверьте webhook или обновление профиля."
                : "Premium to‘lovi yakunlandi, lekin status hali yangilanmadi. Webhook yoki profil yangilanishini tekshiring."}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <AppButton href="/dashboard">{language === "ru" ? "Вернуться к обучению" : "O‘quv markaziga qaytish"}</AppButton>
            <AppButton href="/profile" variant="secondary">{language === "ru" ? "Открыть профиль" : "Profilni ko‘rish"}</AppButton>
            <AppButton href="/practice" variant="secondary"><Crown className="h-5 w-5" /> {language === "ru" ? "Открыть Premium-функции" : "Premium funksiyalarni ochish"}</AppButton>
            {!premiumOpened ? (
              <button onClick={() => void verifySession()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-6 py-3.5 text-sm font-black text-ink shadow-soft disabled:opacity-60">
                {loading ? <Loader2 className="h-5 w-5 animate-spin text-orange-brand" /> : <RefreshCcw className="h-5 w-5 text-orange-brand" />} {language === "ru" ? "Обновить статус" : "Statusni yangilash"}
              </button>
            ) : null}
          </div>

          {isDevelopment ? (
            <details className="mt-8 rounded-3xl border border-orange-soft/70 bg-cream p-4 text-left text-xs font-bold text-stone-600">
              <summary className="cursor-pointer text-sm font-black text-ink">Dasturchi diagnostikasi</summary>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p>Foydalanuvchi: {user?.id ? "ha" : "yo‘q"}</p>
                <p>Webhook secret: {health?.webhookSecretConfigured ? "bor" : "yo‘q"}</p>
                <p>Service role: {health?.serviceRoleConfigured ? "bor" : "yo‘q"}</p>
                <p>Webhook xabar: {health?.message ?? "—"}</p>
                <p>Status: {subscriptionStatus?.subscription_status ?? result?.subscription_status ?? user?.subscriptionStatus ?? "—"}</p>
                <p>Reja: {subscriptionStatus?.subscription_plan ?? result?.subscription_plan ?? user?.subscriptionPlan ?? "—"}</p>
                <p>Status tekshiruvi: {subscriptionStatus ? "o‘tdi" : "—"}</p>
                <p>Customer: {(subscriptionStatus?.stripeCustomerExists ?? result?.stripeCustomerExists) ? "ha" : "yo‘q"}</p>
                <p>Subscription: {(subscriptionStatus?.stripeSubscriptionExists ?? result?.stripeSubscriptionExists) ? "ha" : "yo‘q"}</p>
                <p>Premium: {premiumOpened ? "ha" : "yo‘q"}</p>
                <p>Xabar: {result?.message ?? result?.error ?? "—"}</p>
              </div>
            </details>
          ) : null}
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default function PremiumSuccessPage() {
  return (
    <Suspense fallback={<PremiumSuccessFallback />}>
      <PremiumSuccessContent />
    </Suspense>
  );
}

function PremiumSuccessFallback() {
  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto grid min-h-[calc(100vh-5rem)] max-w-4xl place-items-center px-5 pb-36 pt-10 sm:px-8 md:pb-10">
        <div className="rounded-[2.5rem] border border-orange-soft/80 bg-white/90 p-8 text-center shadow-premium sm:p-12">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-orange-brand" />
        </div>
      </section>
    </ProtectedRoute>
  );
}
