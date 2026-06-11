"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { FloatingCharacters, MascotIllustration } from "@/components/PremiumIllustrations";
import { useI18n } from "@/utils/i18n";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  const { t } = useI18n();
  return (
    <section className="premium-grid relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 overflow-hidden px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.95fr]">
      <FloatingCharacters />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <Link href="/" className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/82 px-4 py-2 font-black text-ink shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-cream">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-card">
            <Bot className="h-5 w-5" />
          </span>
          HSK AI
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep shadow-soft">
          <Sparkles className="h-4 w-4" />
          {t("auth.beta")}
        </div>
        <h1 className="mt-5 max-w-2xl text-5xl font-black leading-tight text-ink dark:text-cream sm:text-7xl">{title}</h1>
        <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-stone-600 dark:text-stone-300">{subtitle}</p>
        <div className="mt-8 hidden lg:block">
          <MascotIllustration />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
        <div className="rounded-[2.5rem] border border-white/70 bg-white/86 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:p-8">
          {children}
          <div className="mt-6 text-center text-sm font-bold text-stone-500 dark:text-stone-300">{footer}</div>
        </div>
      </motion.div>
    </section>
  );
}
