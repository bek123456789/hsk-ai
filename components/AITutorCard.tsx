"use client";

import { Bot, CornerDownRight, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/utils/i18n";

export function AITutorCard({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const prompts = [t("ai.prompt1"), t("ai.prompt2"), t("ai.prompt3"), t("ai.prompt4"), t("ai.prompt5")];

  return (
    <div className={`overflow-hidden rounded-5xl border border-orange-soft/70 bg-white/88 p-5 shadow-premium backdrop-blur-xl ${compact ? "" : "sm:p-7"}`}>
      <div className="mb-5 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow">
          <Bot className="h-9 w-9" />
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-orange-soft shadow-soft">
            <Sparkles className="h-4 w-4 text-orange-deep" />
          </span>
        </div>
        <div>
          <h3 className="text-xl font-black text-ink">{t("ai.title")}</h3>
          <p className="text-sm font-semibold text-stone-500">{t("ai.subtitle")}</p>
        </div>
      </div>
      <div className="mb-5 space-y-3">
        <div className="max-w-[86%] rounded-[1.4rem] rounded-tl-md border border-orange-soft/70 bg-white/90 px-4 py-3 text-sm font-bold leading-6 text-ink shadow-soft">
          {t("ai.bubble")}
        </div>
        <div className="ml-auto max-w-[82%] rounded-[1.4rem] rounded-br-md bg-gradient-to-r from-orange-brand to-orange-hot px-4 py-3 text-sm font-bold leading-6 text-white shadow-card">
          {t("ai.userBubble")}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-black text-stone-500 shadow-soft">
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
            <span key={prompt} className="inline-flex items-center gap-1 rounded-full border border-orange-soft/60 bg-cream px-3 py-2 text-xs font-black text-stone-600 shadow-soft">
              <CornerDownRight className="h-3.5 w-3.5 text-orange-brand" />
              {prompt}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex items-center gap-3 rounded-full border border-orange-soft/70 bg-cream p-2 pl-5 shadow-inner">
        <input
          readOnly
          placeholder={t("ai.ask")}
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none placeholder:text-stone-400"
        />
        <Link href="/ai-tutor" aria-label={t("ai.open")} className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-brand to-orange-hot text-white shadow-card transition hover:scale-105">
          <Send className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
