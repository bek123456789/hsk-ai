"use client";

import { CheckCircle2, Crown, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { BrandLogo } from "@/components/BrandLogo";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UsageLimitCard } from "@/components/UsageLimitCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import type { AIUsageType } from "@/utils/usageLimits";
import { logAppError } from "@/utils/appLogger";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

type Plan = "monthly" | "yearly";

type HealthResponse = {
  ok: boolean;
  deploymentReady?: boolean;
  stripeSecretConfigured?: boolean;
  publishableKeyConfigured?: boolean;
  monthlyPriceConfigured?: boolean;
  yearlyPriceConfigured?: boolean;
  appUrlConfigured?: boolean;
  webhookSecretConfigured?: boolean;
  serviceRoleConfigured?: boolean;
  message?: string;
};

type UsageItem = {
  usageType: AIUsageType;
  used: number;
  limit: number;
  remaining: number;
};

const isDevelopment = process.env.NODE_ENV === "development";
const trialEnabled = process.env.NEXT_PUBLIC_ENABLE_TRIAL === "true";

export default function PremiumPage() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [trialLoading, setTrialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [usage, setUsage] = useState<UsageItem[]>([]);
  const [subscriptionDebug, setSubscriptionDebug] = useState<{ status?: string | null; isPremium?: boolean; ok?: boolean } | null>(null);
  const premium = isPremiumProfile(user);

  const labels = {
    title: "HanziFlow AI Premium",
    subtitle: language === "ru" ? "Подписка в тестовом режиме. Реальные деньги не списываются." : "Obuna test rejimida. Real pul yechilmaydi.",
    monthly: language === "ru" ? "Ежемесячно" : "Oylik",
    yearly: language === "ru" ? "Ежегодно" : "Yillik",
    try: language === "ru" ? "Попробовать Premium" : "Premiumni sinab ko‘rish",
    start: language === "ru" ? "Начать" : "Boshlash",
    active: language === "ru" ? "Premium уже активен" : "Premium allaqachon faol",
    error: language === "ru" ? "Не удалось открыть страницу оплаты Stripe" : "Stripe to‘lov sahifasini ochib bo‘lmadi"
  };
  const features =
    language === "ru"
      ? ["AI-наставник", "Проверка произношения", "HSK 2–6", "Полные экзамены", "Сертификаты", "Расширенная статистика"]
      : ["AI yordamchi", "Talaffuz tekshiruvi", "HSK 2–6", "To‘liq imtihonlar", "Sertifikatlar", "Kengaytirilgan statistika"];

  useEffect(() => {
    let active = true;
    async function loadStatus() {
      try {
        const healthResponse = await fetch(`/api/stripe/health?language=${language}`, { cache: "no-store" });
        const healthResult = (await healthResponse.json()) as HealthResponse;
        if (active) setHealth(healthResult);

        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;
        const subscriptionResponse = await fetch("/api/subscription/status", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        if (subscriptionResponse.ok) {
          const subscriptionResult = (await subscriptionResponse.json()) as { subscription_status?: string | null; isPremium?: boolean };
          if (active) setSubscriptionDebug({ status: subscriptionResult.subscription_status, isPremium: subscriptionResult.isPremium, ok: true });
        } else if (active) {
          setSubscriptionDebug({ ok: false });
        }
        const usageResponse = await fetch("/api/usage", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        if (usageResponse.ok) {
          const usageResult = (await usageResponse.json()) as { usage?: UsageItem[] };
          if (active) setUsage(usageResult.usage ?? []);
        }
      } catch {
        if (active && isDevelopment) setHealth({ ok: false });
      }
    }
    void loadStatus();
    return () => {
      active = false;
    };
  }, [language]);

  async function startCheckout(plan: Plan) {
    setLoadingPlan(plan);
    setError(null);
    setDebugCode(null);
    setApiStatus(null);

    let token: string | null = null;
    let lastStatus: number | null = null;
    let lastCode: string | null = null;
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token ?? null;
      if (!token) {
        window.location.href = "/login?next=%2Fpremium";
        return;
      }

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan, language })
      });
      lastStatus = response.status;
      setApiStatus(lastStatus);
      const result = (await response.json()) as { url?: string; error?: string; code?: string };
      lastCode = result.code ?? null;
      setDebugCode(lastCode);

      if (response.status === 401) {
        window.location.href = "/login?next=%2Fpremium";
        return;
      }
      if (!response.ok || !result.url) throw new Error(result.error || labels.error);
      window.location.href = result.url;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : labels.error;
      setError(message);
      await logAppError({
        eventType: "stripe_checkout_error",
        message,
        metadata: { plan, status: lastStatus, code: lastCode },
        accessToken: token
      });
    } finally {
      setLoadingPlan(null);
    }
  }

  async function startTrial() {
    setTrialLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        window.location.href = "/login?next=%2Fpremium";
        return;
      }
      const response = await fetch("/api/premium/start-trial", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ language })
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || labels.error);
      await initializeAuth();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : labels.error);
    } finally {
      setTrialLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <BrandLogo variant="full" size="md" className="mx-auto mb-5" />
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow">
            <Crown className="h-8 w-8" />
          </div>
          <p className="text-sm font-black uppercase text-orange-deep">Premium</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{labels.title}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">{labels.subtitle}</p>
        </div>

        {premium ? (
          <Card className="mb-6 border-orange-soft/80 bg-white/88 p-6 text-center">
            <p className="text-lg font-black text-orange-deep">
              <ShieldCheck className="mr-2 inline h-5 w-5" /> {labels.active}
            </p>
            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
              <AppButton href="/usage">{language === "ru" ? "Посмотреть лимиты AI" : "AI limitlarini ko‘rish"}</AppButton>
              <AppButton href="/dashboard" variant="secondary">{language === "ru" ? "Вернуться к обучению" : "O‘qishga qaytish"}</AppButton>
            </div>
          </Card>
        ) : null}

        {error ? <p className="mb-5 rounded-3xl bg-rose-50 px-5 py-4 text-center text-sm font-black text-rose-700">{error}</p> : null}

        {trialEnabled && !premium ? (
          <Card className="mb-6 border-orange-soft/70 bg-gradient-to-r from-white via-cream to-orange-soft/50 p-6 shadow-premium">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-orange-deep">{language === "ru" ? "3-дневный пробный доступ" : "3 kunlik sinov"}</p>
                <h2 className="mt-1 text-2xl font-black text-ink">{language === "ru" ? "Попробовать без оплаты" : "To‘lovsiz sinab ko‘rish"}</h2>
              </div>
              <button onClick={() => void startTrial()} disabled={trialLoading} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-orange-deep shadow-soft disabled:opacity-60">
                {trialLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {language === "ru" ? "Начать пробный доступ" : "Sinovni boshlash"}
              </button>
            </div>
          </Card>
        ) : null}

        {!premium ? <div className="grid gap-6 md:grid-cols-2">
          {[
            { plan: "monthly" as const, label: labels.monthly, accent: language === "ru" ? "Гибкий старт" : "Moslashuvchan boshlash" },
            { plan: "yearly" as const, label: labels.yearly, accent: language === "ru" ? "Лучшее для роста" : "Rivojlanish uchun qulay" }
          ].map((item) => (
            <Card key={item.plan} className="relative overflow-hidden border-orange-soft/70 bg-white/90 p-7 shadow-premium sm:p-8">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-orange-brand/16 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-xs font-black text-orange-deep shadow-soft">
                  <Sparkles className="h-4 w-4" /> {item.accent}
                </span>
                <h2 className="mt-5 text-4xl font-black text-ink">{item.label}</h2>
                <p className="mt-3 text-sm font-black text-stone-500">{language === "ru" ? "Подписка в тестовом режиме" : "Obuna test rejimida"}</p>
                <div className="mt-6 space-y-3">
                  {features.map((feature) => (
                    <p key={feature} className="flex items-center gap-3 rounded-3xl bg-cream px-4 py-3 text-sm font-black text-stone-700 shadow-soft">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-brand" /> {feature}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => void startCheckout(item.plan)}
                  disabled={Boolean(loadingPlan)}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-4 text-sm font-black text-white shadow-glow transition hover:-translate-y-1 disabled:opacity-60"
                >
                  {loadingPlan === item.plan ? <Loader2 className="h-5 w-5 animate-spin" /> : <Crown className="h-5 w-5" />}
                  {labels.try}
                </button>
              </div>
            </Card>
          ))}
        </div> : null}

        {usage.length ? (
          <div className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Использование AI" : "AI foydalanish"}</p>
                <h2 className="mt-1 text-2xl font-black text-ink">{language === "ru" ? "Дневной лимит" : "Bugungi limit"}</h2>
              </div>
              <AppButton href="/usage" variant="secondary">{language === "ru" ? "Подробнее" : "Batafsil"}</AppButton>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {usage.slice(0, 3).map((item) => <UsageLimitCard key={item.usageType} {...item} language={language} compact />)}
            </div>
          </div>
        ) : null}

        {isDevelopment ? (
          <details className="mt-8 rounded-3xl border border-orange-soft/70 bg-white/80 p-4 text-sm shadow-soft">
            <summary className="cursor-pointer font-black text-ink">Dasturchi diagnostikasi</summary>
            <div className="mt-4 grid gap-2 text-xs font-bold text-stone-600 sm:grid-cols-2">
              <p>Foydalanuvchi: {user ? "ha" : "yo‘q"}</p>
              <p>Checkout tayyor: {health?.ok ? "ha" : "yo‘q"}</p>
              <p>Stripe server kaliti: {health?.stripeSecretConfigured ? "bor" : "yo‘q"}</p>
              <p>Stripe public kaliti: {health?.publishableKeyConfigured ? "bor" : "yo‘q"}</p>
              <p>Oylik narx: {health?.monthlyPriceConfigured ? "bor" : "yo‘q"}</p>
              <p>Yillik narx: {health?.yearlyPriceConfigured ? "bor" : "yo‘q"}</p>
              <p>Ilova manzili: {health?.appUrlConfigured ? "bor" : "yo‘q"}</p>
              <p>Webhook secret: {health?.webhookSecretConfigured ? "bor" : "yo‘q"}</p>
              <p>Service role: {health?.serviceRoleConfigured ? "bor" : "yo‘q"}</p>
              <p>Webhook xabar: {health?.message ?? "—"}</p>
              <p>Obuna tekshiruvi: {subscriptionDebug?.ok ? "o‘tdi" : subscriptionDebug?.ok === false ? "xato" : "—"}</p>
              <p>Obuna statusi: {subscriptionDebug?.status ?? user?.subscriptionStatus ?? "—"}</p>
              <p>Premium hisob: {subscriptionDebug?.isPremium ?? premium ? "ha" : "yo‘q"}</p>
              <p>Oxirgi holat: {apiStatus ?? "—"}</p>
              <p>Oxirgi kod: {debugCode ?? "—"}</p>
            </div>
          </details>
        ) : null}

        <div className="mt-8 flex justify-center">
          <AppButton href="/dashboard" variant="secondary">{labels.start}</AppButton>
        </div>
      </section>
    </ProtectedRoute>
  );
}
