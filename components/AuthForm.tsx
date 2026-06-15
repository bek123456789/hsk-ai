"use client";

import { ArrowRight, KeyRound, Loader2, Mail, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";

function getErrorMessage(caught: unknown, fallback: string, translate: (key: keyof typeof import("@/locales/uz.json")) => string) {
  let message = "";
  if (caught instanceof Error) message = caught.message;
  if (caught && typeof caught === "object" && "message" in caught) {
    const value = (caught as { message?: unknown }).message;
    if (typeof value === "string") message = value;
  }
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) return translate("auth.invalidCredentials");
  if (normalized.includes("email address") && normalized.includes("invalid")) return translate("auth.invalidEmail");
  if (normalized.includes("invalid email")) return translate("auth.invalidEmail");
  if (normalized.includes("email not confirmed")) return translate("auth.emailNotConfirmed");
  if (normalized.includes("already registered") || normalized.includes("user already registered")) return translate("auth.userExists");
  if (normalized.includes("too many requests") || normalized.includes("rate limit") || normalized.includes("429")) return translate("auth.rateLimited");

  return message || fallback;
}

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const referralCode = searchParams.get("ref");
    if (referralCode) localStorage.setItem("hsk-ai-referral", referralCode.slice(0, 32));
  }, [searchParams]);

  useEffect(() => {
    if (hasHydrated && user && mode !== "forgot") {
      router.replace(user.onboardingCompleted === false ? "/onboarding" : "/dashboard");
    }
  }, [hasHydrated, mode, router, user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register" && password !== confirmPassword) {
        setError(t("auth.passwordMismatch"));
        return;
      }

      if (mode === "forgot") {
        await forgotPassword(email);
        setSent(true);
        return;
      }

      if (mode === "register") {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }

      router.replace(searchParams.get("next") || (mode === "register" ? "/onboarding" : "/dashboard"));
    } catch (caught) {
      setError(getErrorMessage(caught, t("auth.error"), t));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-[2rem] bg-cream p-6 text-center shadow-soft">
        <Mail className="mx-auto h-10 w-10 text-orange-brand" />
        <h2 className="mt-4 text-2xl font-black text-ink">{t("auth.resetReady")}</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">{t("auth.resetDetail")}</p>
        <div className="mt-5">
          <AppButton href="/login" variant="primary">{t("auth.login")}</AppButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "register" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-black text-ink">{t("auth.name")}</span>
          <div className="flex items-center gap-3 rounded-3xl bg-cream px-4 py-3 shadow-inner">
            <UserRound className="h-5 w-5 text-orange-brand" />
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Bekzod"
              className="min-w-0 flex-1 bg-transparent font-bold text-ink outline-none placeholder:text-stone-400"
              required
            />
          </div>
        </label>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm font-black text-ink">{t("auth.email")}</span>
        <div className="flex items-center gap-3 rounded-3xl bg-cream px-4 py-3 shadow-inner">
          <Mail className="h-5 w-5 text-orange-brand" />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@namuna.uz"
            className="min-w-0 flex-1 bg-transparent font-bold text-ink outline-none placeholder:text-stone-400"
            required
          />
        </div>
      </label>
      {mode !== "forgot" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-black text-ink">{t("auth.password")}</span>
          <div className="flex items-center gap-3 rounded-3xl bg-cream px-4 py-3 shadow-inner">
            <KeyRound className="h-5 w-5 text-orange-brand" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="min-w-0 flex-1 bg-transparent font-bold text-ink outline-none placeholder:text-stone-400"
              required
              minLength={6}
            />
          </div>
        </label>
      ) : null}
      {mode === "register" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-black text-ink">{t("auth.confirmPassword")}</span>
          <div className="flex items-center gap-3 rounded-3xl bg-cream px-4 py-3 shadow-inner">
            <KeyRound className="h-5 w-5 text-orange-brand" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              className="min-w-0 flex-1 bg-transparent font-bold text-ink outline-none placeholder:text-stone-400"
              required
              minLength={6}
            />
          </div>
        </label>
      ) : null}
      {error ? <p className="rounded-3xl bg-red-50 px-4 py-3 text-sm font-black text-red-600">{error}</p> : null}
      <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-4 text-sm font-black text-white shadow-glow transition hover:-translate-y-1 disabled:opacity-70">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === "forgot" ? t("auth.reset") : mode === "register" ? t("auth.register") : t("auth.login")}
        {!loading ? <ArrowRight className="h-5 w-5" /> : null}
      </button>
    </form>
  );
}
