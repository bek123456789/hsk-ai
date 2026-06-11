"use client";

import { Bot, CornerDownRight, Send, Sparkles } from "lucide-react";
import { useI18n } from "@/utils/i18n";

export function AITutorCard({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const prompts = [t("ai.prompt1"), t("ai.prompt2"), t("ai.prompt3"), t("ai.prompt4")];

  return (
    <div className={`overflow-hidden rounded-5xl border border-white/70 bg-white/84 p-5 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10 ${compact ? "" : "sm:p-7"}`}>
      <div className="mb-5 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow">
          <Bot className="h-9 w-9" />
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-mint shadow-soft">
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </span>
        </div>
        <div>
          <h3 className="text-xl font-black text-ink dark:text-cream">{t("ai.title")}</h3>
          <p className="text-sm font-semibold text-stone-500 dark:text-stone-300">{t("ai.subtitle")}</p>
        </div>
      </div>
      <div className="mb-5 space-y-3">
        <div className="max-w-[86%] rounded-[1.4rem] rounded-tl-md bg-orange-soft px-4 py-3 text-sm font-bold leading-6 text-ink shadow-soft dark:bg-orange-brand/18 dark:text-cream">
          {t("ai.bubble")}
        </div>
        <div className="ml-auto max-w-[82%] rounded-[1.4rem] rounded-br-md bg-ink px-4 py-3 text-sm font-bold leading-6 text-white shadow-soft dark:bg-cream dark:text-ink">
          {t("ai.userBubble")}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-black text-stone-500 shadow-soft dark:bg-white/8 dark:text-stone-300">
          <span className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-orange-brand" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-orange-brand [animation-delay:120ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-orange-brand [animation-delay:240ms]" />
          </span>
          {t("ai.typing")}
        </div>
      </div>
      {!compact ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <span key={prompt} className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-2 text-xs font-black text-stone-600 shadow-soft dark:bg-white/8 dark:text-stone-300">
              <CornerDownRight className="h-3.5 w-3.5 text-orange-brand" />
              {prompt}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex items-center gap-3 rounded-full bg-cream p-2 pl-5 shadow-inner dark:bg-obsidian/60">
        <input
          readOnly
          placeholder={t("ai.ask")}
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none placeholder:text-stone-400 dark:text-cream"
        />
        <button aria-label={t("common.submit")} className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-brand to-orange-hot text-white shadow-card transition hover:scale-105">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
