"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { FloatingCharacters, MascotIllustration } from "@/components/PremiumIllustrations";
import { useI18n } from "@/utils/i18n";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  const { t } = useI18n();
  return (
    <section className="premium-grid relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 overflow-hidden px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.95fr]">
      <FloatingCharacters />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <Link href="/" className="mb-8 inline-flex rounded-[1.4rem] border border-white/70 bg-white/82 px-3 py-1.5 shadow-soft backdrop-blur">
          <BrandLogo variant="icon" size="md" showText />
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep shadow-soft">
          <Sparkles className="h-4 w-4" />
          {t("auth.beta")}
        </div>
        <h1 className="mt-5 max-w-2xl text-5xl font-black leading-tight text-ink sm:text-7xl">{title}</h1>
        <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-stone-600">{subtitle}</p>
        <div className="mt-8 hidden lg:block">
          <MascotIllustration />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
        <div className="rounded-[2.5rem] border border-white/70 bg-white/86 p-6 shadow-premium backdrop-blur-xl sm:p-8">
          {children}
          <div className="mt-6 text-center text-sm font-bold text-stone-500">{footer}</div>
        </div>
      </motion.div>
    </section>
  );
}
