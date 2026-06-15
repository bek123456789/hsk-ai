"use client";

import { Lock, ShieldCheck, Sparkles, Unlock } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { ProgressRing } from "@/components/ProgressRing";
import type { HSKLevel, LevelMeta } from "@/types";
import { useI18n } from "@/utils/i18n";
import { percent } from "@/utils/progress";

export function HSKLevelCard({ meta, knownCount }: { meta: LevelMeta; knownCount: number }) {
  const { t } = useI18n();
  const progress = meta.level === 1 ? percent(knownCount, 30) : 0;
  const tones = {
    orange: "from-orange-brand via-orange-hot to-amber-300",
    green: "from-sky-300 via-orange-soft to-white",
    blue: "from-sky-400 via-skysoft to-white",
    purple: "from-violet-500 via-lavender to-white"
  };

  return (
    <div className={`group relative min-h-[360px] overflow-hidden rounded-[2.35rem] bg-gradient-to-br ${tones[meta.accent]} p-6 shadow-premium transition duration-300 hover:-translate-y-2 hover:shadow-glow ${meta.locked ? "grayscale-[0.25]" : ""}`}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/45 blur-sm" />
      <div className="absolute -bottom-10 left-8 h-32 w-32 rounded-full bg-white/25 blur-xl" />
      {meta.locked ? <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" /> : null}
      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <span className="rounded-full bg-white/82 px-4 py-2 text-sm font-black text-ink shadow-soft">HSK {meta.level}</span>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/82 shadow-soft">
            {meta.locked ? <Lock className="h-5 w-5 text-stone-500" /> : <Unlock className="h-5 w-5 text-orange-brand" />}
          </span>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-7xl font-black text-ink">HSK</p>
            <p className="text-8xl font-black leading-none text-white drop-shadow">{meta.level}</p>
          </div>
          <ProgressRing value={progress} label={t("common.done")} size={112} />
        </div>
        <div className="mt-7 rounded-[1.75rem] bg-white/70 p-4 shadow-soft backdrop-blur">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-orange-deep" />
            <div>
              <h2 className="text-2xl font-black text-ink">{meta.wordCount} {t("common.words")}</h2>
              <p className="text-sm font-bold text-stone-600">{t("roadmap.unlockRule")}</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-black text-ink/70">
            <span>{t("exam.progress")}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/55">
            <div className="h-3 rounded-full bg-gradient-to-r from-orange-brand to-amber-300 shadow-soft" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="mt-6">
          <AppButton href={meta.locked ? "/levels" : `/lesson/${meta.level as HSKLevel}`} variant={meta.locked ? "secondary" : "primary"} className="w-full">
            {meta.locked ? t("common.locked") : t("common.start")} <Sparkles className="h-4 w-4" />
          </AppButton>
        </div>
      </div>
    </div>
  );
}
