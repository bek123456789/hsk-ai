"use client";

import { Volume2 } from "lucide-react";
import type { HSKWord } from "@/types";
import { getWordExample, getWordTranslation, useI18n } from "@/utils/i18n";

export function WordCard({ word }: { word: HSKWord }) {
  const { language } = useI18n();
  const translation = getWordTranslation(word, language);
  const example = getWordExample(word, language);

  return (
    <article className="group rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-5xl font-black text-ink dark:text-cream">{word.chinese}</h3>
          <p className="mt-2 text-lg font-black text-orange-brand">{word.pinyin}</p>
        </div>
        <button aria-label={`Audio for ${word.chinese}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-soft text-orange-deep shadow-soft transition group-hover:scale-110">
          <Volume2 className="h-5 w-5" />
        </button>
      </div>
      <p className="rounded-3xl bg-cream px-4 py-3 text-lg font-black text-ink dark:bg-obsidian/60 dark:text-cream">{translation}</p>
      <div className="mt-5 border-t border-orange-soft pt-5 dark:border-white/10">
        <p className="text-lg font-black text-ink dark:text-cream">{word.exampleChinese}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-stone-500 dark:text-stone-300">{example}</p>
      </div>
    </article>
  );
}
