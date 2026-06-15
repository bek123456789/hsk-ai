"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Bot, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { useI18n } from "@/utils/i18n";

export function ClosedBetaLanding() {
  const { t } = useI18n();
  const chars = ["你", "好", "学"];

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(255,122,26,0.2),transparent_28%),radial-gradient(circle_at_88%_78%,rgba(132,80,255,0.14),transparent_28%),linear-gradient(135deg,#fffdf8,#fff8ec_48%,#fff1df)] px-5 py-10 text-ink sm:px-8 lg:py-16">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,122,26,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,122,26,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
      {chars.map((char, index) => (
        <motion.span
          key={char}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0.14, 0.34, 0.14], y: [-8, -24, -8] }}
          transition={{ duration: 5 + index, repeat: Infinity, delay: index * 0.45 }}
          className="pointer-events-none absolute rounded-full bg-white/60 px-4 py-3 text-3xl font-black text-orange-deep shadow-soft backdrop-blur"
          style={{ left: `${12 + index * 18}%`, top: `${14 + index * 18}%` }}
        >
          {char}
        </motion.span>
      ))}

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <Link href="/" className="mb-5 inline-flex rounded-[1.5rem] border border-orange-soft bg-white/80 px-3 py-1.5 shadow-soft backdrop-blur">
            <BrandLogo variant="full" size="md" />
          </Link>
          <div className="mb-6 flex w-fit items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep shadow-soft">
            <Sparkles className="h-4 w-4" />
            {t("auth.beta")}
          </div>
          <h1 className="max-w-3xl break-words text-5xl font-black leading-[0.98] text-ink sm:text-7xl lg:text-8xl">
            {t("landing.titleLine1")}<br />
            {t("landing.titleLine2")}<br />
            <span className="bg-gradient-to-r from-orange-deep via-orange-brand to-amber-500 bg-clip-text text-transparent">{t("landing.titleLine3")}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-stone-600 sm:text-xl">
            {t("landing.subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-4 text-sm font-black text-white shadow-glow transition hover:-translate-y-1">
              {t("landing.create")} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-soft bg-white/85 px-6 py-4 text-sm font-black text-ink shadow-soft backdrop-blur transition hover:-translate-y-1 hover:bg-orange-soft">
              {t("landing.login")}
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.94, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -inset-8 rounded-[4rem] bg-orange-brand/18 blur-3xl" />
          <div className="relative overflow-hidden rounded-[3rem] border border-orange-soft bg-gradient-to-br from-orange-brand via-orange-hot to-amber-300 p-7 shadow-phone">
            <div className="absolute right-8 top-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/18 text-white backdrop-blur">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="grid min-h-[390px] place-items-center">
              <div className="relative flex h-64 w-64 items-center justify-center rounded-[3rem] bg-white/90 shadow-premium">
                <div className="absolute -top-8 left-6 rounded-3xl bg-orange-soft p-4 shadow-soft">
                  <BookOpen className="h-9 w-9 text-orange-deep" />
                </div>
                <div className="absolute -right-7 bottom-10 rounded-3xl bg-lavender p-4 shadow-soft">
                  <GraduationCap className="h-9 w-9 text-violet-700" />
                </div>
                <Bot className="h-28 w-28 text-orange-brand" />
              </div>
            </div>
            <div className="rounded-[2rem] bg-white/14 p-5 backdrop-blur-xl">
              <p className="text-2xl font-black text-white">{t("landing.robotTitle")}</p>
              <p className="mt-2 font-semibold leading-7 text-orange-50/84">{t("landing.robotDetail")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
