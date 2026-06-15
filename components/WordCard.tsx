"use client";

import { Mic, Volume2 } from "lucide-react";
import Link from "next/link";
import type { HSKWord } from "@/types";
import { getWordExample, getWordTranslation, useI18n } from "@/utils/i18n";
import { speakChinese } from "@/utils/speechSynthesis";

export function WordCard({ word }: { word: HSKWord }) {
  const { language, t } = useI18n();
  const translation = getWordTranslation(word, language);
  const example = getWordExample(word, language);

  return (
    <article className="group rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl transition hover:-translate-y-1">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-5xl font-black text-ink">{word.chinese}</h3>
          <p className="mt-2 text-lg font-black text-orange-brand">{word.pinyin}</p>
        </div>
        <button onClick={() => speakChinese(word.chinese)} aria-label={`${t("lesson.audio")}: ${word.chinese}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-soft text-orange-deep shadow-soft transition group-hover:scale-110">
          <Volume2 className="h-5 w-5" />
        </button>
      </div>
      <p className="rounded-3xl bg-cream px-4 py-3 text-lg font-black text-ink">{translation}</p>
      <div className="mt-5 border-t border-orange-soft pt-5">
        <p className="text-lg font-black text-ink">{word.exampleChinese}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">{example}</p>
      </div>
      <div className="mt-5">
        <Link href={`/speaking/${word.hskLevel}?word=${word.id}`} className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-xs font-black text-stone-600 shadow-soft transition hover:-translate-y-0.5 hover:text-orange-deep">
          <Mic className="h-4 w-4 text-orange-brand" />
          {language === "ru" ? "Тренировать произношение" : "Aytilishini mashq qilish"}
        </Link>
      </div>
    </article>
  );
}
