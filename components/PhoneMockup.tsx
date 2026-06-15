"use client";

import { motion } from "framer-motion";
import { Bot, CheckCircle2, Flame, Mic, Send, Sparkles, Trophy, Zap } from "lucide-react";
import { useI18n } from "@/utils/i18n";

export function PhoneMockup() {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ rotate: -10, y: 20, opacity: 0 }}
      animate={{ rotate: -7, y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mx-auto mt-2 w-[220px] max-w-[72vw] origin-center sm:mt-5 sm:w-[285px] lg:w-[305px]"
    >
      <div className="absolute -left-5 top-16 z-20 hidden rounded-3xl bg-white px-4 py-3 shadow-card sm:block">
        <div className="flex items-center gap-2 text-sm font-black">
          <Flame className="h-5 w-5 text-orange-brand" />
          {t("phone.streak")}
        </div>
      </div>
      <div className="absolute -right-5 bottom-24 z-20 hidden rounded-3xl bg-orange-soft px-4 py-3 shadow-soft sm:block">
        <div className="flex items-center gap-2 text-sm font-black">
          <CheckCircle2 className="h-5 w-5 text-orange-deep" />
          {t("phone.words")}
        </div>
      </div>
      <div className="rounded-[2.65rem] border-[8px] border-orange-deep bg-orange-deep shadow-phone sm:rounded-[3.25rem] sm:border-[10px]">
        <div className="overflow-hidden rounded-[2rem] bg-cream sm:rounded-[2.45rem]">
          <div className="mx-auto mt-3 h-4 w-20 rounded-full bg-orange-deep sm:h-5 sm:w-24" />
          <div className="p-4 sm:p-5">
            <div className="rounded-[1.6rem] bg-gradient-to-br from-orange-brand via-orange-hot to-amber-300 p-4 text-white shadow-glow sm:rounded-4xl sm:p-5">
              <div className="mb-4 flex items-center justify-between sm:mb-5">
                <div>
                  <p className="text-xs font-bold text-white/80">{t("phone.today")}</p>
                  <h3 className="text-xl font-black sm:text-2xl">HSK 1</h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/18 sm:h-12 sm:w-12">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/25">
                <div className="h-2 w-[62%] rounded-full bg-white" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-white p-3 shadow-soft sm:p-4">
                <p className="text-3xl font-black text-ink sm:text-4xl">你</p>
                <p className="text-sm font-bold text-stone-500">nǐ</p>
              </div>
              <div className="rounded-3xl bg-lavender p-3 shadow-soft sm:p-4">
                <p className="text-xs font-black text-stone-500">{t("phone.quiz")}</p>
                <p className="mt-2 text-xl font-black sm:text-2xl">92%</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                [Zap, "240 XP"],
                [Flame, "7d"],
                [Trophy, "HSK"]
              ].map(([Icon, label]) => (
                <div key={String(label)} className="rounded-2xl bg-white/80 p-2 text-center text-[9px] font-black text-ink shadow-soft sm:text-[10px]">
                  <Icon className="mx-auto mb-1 h-4 w-4 text-orange-brand" />
                  {String(label)}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[1.6rem] bg-white p-3 shadow-soft sm:rounded-4xl sm:p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep sm:h-10 sm:w-10">
                  <Bot className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-ink">{t("phone.tutor")}</p>
                  <p className="text-xs text-stone-500">{t("phone.ready")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-cream px-3 py-2">
                <Mic className="h-4 w-4 text-stone-400" />
                <span className="flex-1 text-xs font-bold text-stone-400">{t("phone.ask")}</span>
                <Send className="h-4 w-4 text-orange-brand" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
