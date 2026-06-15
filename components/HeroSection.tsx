"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Crown, GraduationCap, Sparkles } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { PhoneMockup } from "@/components/PhoneMockup";
import { FloatingCharacters, MascotIllustration } from "@/components/PremiumIllustrations";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";

export function HeroSection() {
  const user = useAuthStore((state) => state.user);
  const { t } = useI18n();
  const appHref = user ? "/dashboard" : "/register";
  const skipHref = user ? "/dashboard" : "/login";

  return (
    <section className="premium-grid relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 overflow-hidden px-5 py-7 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
      <FloatingCharacters />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-gradient-to-br from-white via-champagne to-skysoft p-4 shadow-premium sm:rounded-[2.5rem] sm:p-8 lg:p-10"
      >
        <div className="relative z-20 mb-4 flex w-fit max-w-full items-center gap-2 rounded-full bg-white/82 px-4 py-2 text-xs font-black text-orange-deep shadow-soft backdrop-blur sm:mb-5 sm:px-5 sm:text-sm">
          <Crown className="h-4 w-4" />
          <span className="min-w-0 truncate">{t("hero.badge")}</span>
        </div>
        <div className="absolute -right-8 top-20 hidden lg:block">
          <MascotIllustration compact />
        </div>
        <PhoneMockup />
        <div className="relative z-20 mt-4 rounded-[1.5rem] border border-white/70 bg-white/86 p-4 shadow-premium backdrop-blur-xl sm:mt-6 sm:rounded-[2rem] sm:p-5">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-soft shadow-soft sm:h-14 sm:w-14 sm:rounded-3xl">
              <GraduationCap className="h-7 w-7 text-orange-deep" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-ink">{t("hero.visualTitle")}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-stone-500">{t("hero.visualSubtitle")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/82 px-4 py-2 text-sm font-black text-orange-deep shadow-soft backdrop-blur">
          <Sparkles className="h-4 w-4" />
          {t("hero.badge")}
        </div>
        <h1 className="text-balance max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-ink sm:text-7xl lg:text-8xl">
          {t("hero.titleStart")} <span className="bg-gradient-to-r from-orange-brand via-orange-hot to-amber-400 bg-clip-text text-transparent">{t("hero.titleHighlight")}</span> {t("hero.titleEnd")}
        </h1>
        <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
          {t("hero.subtitle")}
        </p>
        <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
          {[
            ["120", t("hero.words")],
            ["98%", t("hero.accuracy")],
            ["6", t("hero.paths")]
          ].map(([value, label]) => (
            <div key={label} className="rounded-[1.5rem] border border-white/70 bg-white/72 p-4 shadow-soft backdrop-blur">
              <p className="text-2xl font-black text-ink">{value}</p>
              <p className="mt-1 text-xs font-black text-stone-500">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <AppButton href={appHref} variant="primary">
            {t("common.getStarted")} <ArrowRight className="h-5 w-5" />
          </AppButton>
          <AppButton href={skipHref} variant="secondary">
            <BookOpen className="h-5 w-5" /> {t("common.skip")}
          </AppButton>
        </div>
      </motion.div>
    </section>
  );
}
