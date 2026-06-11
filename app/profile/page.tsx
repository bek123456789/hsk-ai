"use client";

import { Bell, Globe2, Map, NotebookTabs, RotateCcw, ShieldCheck, Trophy, UserRound } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function ProfilePage() {
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const user = useAuthStore((state) => state.user);
  const { t } = useI18n();

  return (
    <ProtectedRoute>
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
      <div className="rounded-[2.5rem] border border-white/70 bg-white/82 p-7 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-orange-soft text-orange-deep">
            <UserRound className="h-14 w-14" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{t("profile.title")}</p>
            <h1 className="mt-2 text-4xl font-black text-ink dark:text-cream sm:text-5xl">{user?.name || t("profile.learner")}</h1>
            <p className="mt-2 text-lg font-semibold text-stone-500 dark:text-stone-300">{user?.email || t("profile.language")}</p>
            <p className="mt-1 text-sm font-black text-orange-deep dark:text-orange-200">{t("profile.current")}: {user?.currentHSKLevel || 1} · {t("common.premium")}: {user?.premium ? t("common.unlocked") : t("common.locked")}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
        <h2 className="text-2xl font-black text-ink dark:text-cream">{t("profile.quickLinks")}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <AppButton href="/exam" variant="secondary"><Trophy className="h-5 w-5" /> {t("nav.exam")}</AppButton>
          <AppButton href="/roadmap" variant="secondary"><Map className="h-5 w-5" /> {t("nav.roadmap")}</AppButton>
          <AppButton href="/mistakes" variant="secondary"><NotebookTabs className="h-5 w-5" /> {t("mistakes.title")}</AppButton>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-mint text-emerald-700">
            <Globe2 className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-ink dark:text-cream">{t("profile.learningLanguage")}</h2>
          <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{t("profile.learningDetail")}</p>
        </div>
        <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-skysoft text-sky-700">
            <Bell className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-ink dark:text-cream">{t("profile.reminders")}</h2>
          <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{t("profile.remindersDetail")}</p>
        </div>
        <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-lavender text-violet-700">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-ink dark:text-cream">{t("profile.premiumPlan")}</h2>
          <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{t("profile.premiumDetail")}</p>
        </div>
        <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep">
            <RotateCcw className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-ink dark:text-cream">{t("settings.reset")}</h2>
          <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{t("settings.resetDetail")}</p>
          <div className="mt-5">
            <AppButton onClick={resetProgress} variant="secondary">{t("settings.reset")}</AppButton>
          </div>
        </div>
      </div>
    </section>
    </ProtectedRoute>
  );
}
