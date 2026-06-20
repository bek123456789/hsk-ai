"use client";

import { ArrowRight, Check, Eye, EyeOff, KeyRound, Loader2, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { signInWithGoogle } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import { getSafeNextPath } from "@/utils/authRedirect";
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
  const [oauthLoading, setOauthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    const referralCode = searchParams.get("ref");
    if (referralCode) localStorage.setItem("hsk-ai-referral", referralCode.slice(0, 32));
  }, [searchParams]);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError === "oauth_failed") setError(t("auth.googleCancelled"));
  }, [searchParams, t]);

  useEffect(() => {
    if (hasHydrated && user && mode !== "forgot") {
      const nextPath = getSafeNextPath(searchParams.get("next"), "");
      router.replace(nextPath || (user.onboardingCompleted === false ? "/onboarding" : "/dashboard"));
    }
  }, [hasHydrated, mode, router, searchParams, user]);

  async function loginWithGoogle() {
    setError(null);
    setOauthLoading(true);
    try {
      const nextPath = getSafeNextPath(searchParams.get("next"), mode === "register" ? "/onboarding" : "/dashboard");
      await signInWithGoogle(nextPath);
    } catch {
      setOauthLoading(false);
      setError(t("auth.googleError"));
    }
  }

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

      router.replace(getSafeNextPath(searchParams.get("next"), mode === "register" ? "/onboarding" : "/dashboard"));
    } catch (caught) {
      setError(getErrorMessage(caught, t("auth.error"), t));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-[1.5rem] border border-[#F3D8C3] bg-[#FFFDF9] p-6 text-center shadow-[0_16px_42px_rgba(120,74,28,0.08)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0DE] text-[#FF6B1A]">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl font-black text-[#241A14]">{t("auth.resetReady")}</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#6F625A]">{t("auth.resetDetail")}</p>
        <div className="mt-5">
          <AppButton href="/login" variant="primary">{t("auth.login")}</AppButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {mode !== "forgot" ? (
        <>
          <button
            type="button"
            onClick={loginWithGoogle}
            disabled={oauthLoading || loading}
            className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-[1.15rem] border border-[#F3D8C3] bg-white px-5 py-3.5 text-sm font-black text-[#241A14] shadow-[0_12px_32px_rgba(120,74,28,0.08)] transition hover:-translate-y-0.5 hover:border-[#FFB15C] hover:shadow-[0_18px_42px_rgba(120,74,28,0.12)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {oauthLoading ? <Loader2 className="h-5 w-5 animate-spin text-[#FF6B1A]" /> : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF7ED] text-base font-black text-[#FF6B1A]">G</span>}
            {mode === "register" ? t("auth.googleContinue") : t("auth.googleLogin")}
          </button>
          <div className="flex items-center gap-3 text-xs font-black text-[#9B8B7E]">
            <span className="h-px flex-1 bg-[#F3D8C3]" />
            <span>{t("auth.emailContinue")}</span>
            <span className="h-px flex-1 bg-[#F3D8C3]" />
          </div>
        </>
      ) : null}
      <form onSubmit={submit} className="space-y-4">
      {mode === "register" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-black text-[#241A14]">{t("auth.name")}</span>
          <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#F3D8C3] bg-[#FFFDF9] px-4 py-3 transition focus-within:border-[#FFB15C] focus-within:ring-4 focus-within:ring-[#FF6B1A]/10">
            <UserRound className="h-5 w-5 text-[#FF6B1A]" />
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Bekzod"
              className="min-w-0 flex-1 bg-transparent font-bold text-[#241A14] outline-none placeholder:text-[#B9A99A]"
              required
            />
          </div>
        </label>
      ) : null}
      <label className="block">
        <span className="mb-2 block text-sm font-black text-[#241A14]">{t("auth.email")}</span>
        <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#F3D8C3] bg-[#FFFDF9] px-4 py-3 transition focus-within:border-[#FFB15C] focus-within:ring-4 focus-within:ring-[#FF6B1A]/10">
          <Mail className="h-5 w-5 text-[#FF6B1A]" />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="pochta@namuna.uz"
            className="min-w-0 flex-1 bg-transparent font-bold text-[#241A14] outline-none placeholder:text-[#B9A99A]"
            required
          />
        </div>
      </label>
      {mode !== "forgot" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-black text-[#241A14]">{t("auth.password")}</span>
          <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#F3D8C3] bg-[#FFFDF9] px-4 py-3 transition focus-within:border-[#FFB15C] focus-within:ring-4 focus-within:ring-[#FF6B1A]/10">
            <KeyRound className="h-5 w-5 text-[#FF6B1A]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="min-w-0 flex-1 bg-transparent font-bold text-[#241A14] outline-none placeholder:text-[#B9A99A]"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="rounded-xl p-1.5 text-[#8C7A6C] transition hover:bg-[#FFF0DE] hover:text-[#FF6B1A]"
              aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </label>
      ) : null}
      {mode === "register" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-black text-[#241A14]">{t("auth.confirmPassword")}</span>
          <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#F3D8C3] bg-[#FFFDF9] px-4 py-3 transition focus-within:border-[#FFB15C] focus-within:ring-4 focus-within:ring-[#FF6B1A]/10">
            <KeyRound className="h-5 w-5 text-[#FF6B1A]" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              className="min-w-0 flex-1 bg-transparent font-bold text-[#241A14] outline-none placeholder:text-[#B9A99A]"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="rounded-xl p-1.5 text-[#8C7A6C] transition hover:bg-[#FFF0DE] hover:text-[#FF6B1A]"
              aria-label={showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </label>
      ) : null}
      {mode === "login" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-[#6F625A]">
            <span className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${remember ? "border-[#FF6B1A] bg-[#FF6B1A] text-white" : "border-[#F3D8C3] bg-white text-transparent"}`}>
              <Check className="h-3.5 w-3.5" />
            </span>
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="sr-only" />
            {t("auth.remember")}
          </label>
          <Link href="/forgot-password" className="text-sm font-black text-[#FF6B1A] transition hover:text-[#D94A13]">
            {t("auth.forgot")}
          </Link>
        </div>
      ) : null}
      {error ? <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black leading-6 text-red-600">{error}</p> : null}
      <button disabled={loading} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[1.15rem] bg-gradient-to-r from-[#FF7A1A] to-[#FF4D1D] px-6 py-4 text-sm font-black text-white shadow-[0_20px_45px_rgba(255,107,26,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(255,107,26,0.34)] disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === "forgot" ? t("auth.reset") : mode === "register" ? t("auth.register") : t("auth.login")}
        {!loading ? <ArrowRight className="h-5 w-5" /> : null}
      </button>
      </form>
    </div>
  );
}
