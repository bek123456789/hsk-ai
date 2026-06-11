"use client";

import { Bell, CloudUpload, Crown, Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeToggle } from "@/components/ThemeToggle";
import { migrateLocalProgressToSupabase } from "@/lib/progressService";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { languageOptions, useI18n } from "@/utils/i18n";

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const { language, setLanguage, t } = useI18n();
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);

  async function handleMigrateProgress() {
    if (!user?.id) return;
    setMigrating(true);
    setMigrationStatus(null);

    try {
      await migrateLocalProgressToSupabase(user.id);
      setMigrationStatus(t("settings.connectSuccess"));
    } catch (error) {
      setMigrationStatus(error instanceof Error ? error.message : t("auth.error"));
    } finally {
      setMigrating(false);
    }
  }

  const cards = [
    { icon: Bell, title: t("settings.notifications"), detail: t("settings.notificationsDetail"), action: t("settings.betaTag") },
    { icon: Crown, title: t("common.premium"), detail: "HSK AI", action: user?.premium ? t("common.premium") : t("settings.betaTag") },
    { icon: ShieldCheck, title: t("settings.browserStorage"), detail: user?.email || "HSK AI", action: "MVP" }
  ];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep dark:text-orange-200">{t("nav.settings")}</p>
          <h1 className="mt-2 text-5xl font-black text-ink dark:text-cream sm:text-7xl">{t("settings.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">{t("settings.subtitle")}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <h2 className="text-2xl font-black text-ink dark:text-cream">{t("settings.language")}</h2>
            <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{t("settings.languageDetail")}</p>
            <div className="mt-5 grid gap-2">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLanguage(option.value)}
                  className={`rounded-3xl px-4 py-3 text-left text-sm font-black shadow-soft transition hover:-translate-y-0.5 ${
                    language === option.value
                      ? "bg-gradient-to-r from-orange-brand to-orange-hot text-white"
                      : "bg-cream text-ink dark:bg-obsidian/60 dark:text-cream"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <h2 className="text-2xl font-black text-ink dark:text-cream">{t("settings.appearance")}</h2>
            <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{t("settings.appearanceDetail")}</p>
            <div className="mt-5"><ThemeToggle /></div>
          </div>
          <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <h2 className="text-2xl font-black text-ink dark:text-cream">{t("settings.reset")}</h2>
            <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{t("settings.resetDetail")}</p>
            <div className="mt-5">
              <AppButton onClick={resetProgress} variant="secondary">
                <RotateCcw className="h-5 w-5" /> {t("settings.reset")}
              </AppButton>
            </div>
          </div>
          <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-mint text-emerald-700">
              <CloudUpload className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-ink dark:text-cream">{t("settings.connectProgress")}</h2>
            <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{t("settings.connectProgressDetail")}</p>
            <div className="mt-5">
              <button
                onClick={handleMigrateProgress}
                disabled={migrating}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3.5 text-sm font-black text-white shadow-glow transition hover:-translate-y-1 disabled:opacity-70"
              >
                {migrating ? <Loader2 className="h-5 w-5 animate-spin" /> : <CloudUpload className="h-5 w-5" />}
                {t("settings.connectProgress")}
              </button>
            </div>
            {migrationStatus ? <p className="mt-4 rounded-3xl bg-cream px-4 py-3 text-sm font-black text-stone-600 dark:bg-obsidian/60 dark:text-stone-300">{migrationStatus}</p> : null}
          </div>
          {cards.map((card) => (
            <div key={card.title} className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep">
                <card.icon className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-ink dark:text-cream">{card.title}</h2>
              <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{card.detail}</p>
              <p className="mt-4 rounded-full bg-cream px-4 py-2 text-sm font-black text-stone-600 dark:bg-obsidian/60 dark:text-stone-300">{card.action}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <h2 className="text-2xl font-black text-ink dark:text-cream">{t("settings.session")}</h2>
          <p className="mt-2 font-semibold text-stone-500 dark:text-stone-300">{t("settings.loggedInAs")}: {user?.name}</p>
          <div className="mt-5">
            <AppButton
              onClick={() => {
                logout().finally(() => router.replace("/login"));
              }}
              variant="dark"
            >
              {t("settings.logout")}
            </AppButton>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
