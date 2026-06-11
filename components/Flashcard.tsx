"use client";

import { motion } from "framer-motion";
import { Bookmark, RotateCcw, Volume2 } from "lucide-react";
import { useState } from "react";
import type { HSKWord } from "@/types";
import { getWordExample, getWordTranslation, useI18n } from "@/utils/i18n";

export function Flashcard({ word }: { word: HSKWord }) {
  const [revealed, setRevealed] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { language, t } = useI18n();
  const translation = getWordTranslation(word, language);
  const example = getWordExample(word, language);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      whileDrag={{ rotate: 4, scale: 0.98 }}
      className="perspective-1000 w-full max-w-full"
    >
      <motion.button
        onClick={() => setRevealed((value) => !value)}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="relative min-h-[470px] w-full rounded-[2.5rem] border border-white/70 bg-gradient-to-br from-white via-champagne to-orange-soft p-7 text-center shadow-premium transition hover:-translate-y-1 dark:border-white/10 dark:from-white/14 dark:via-orange-brand/12 dark:to-white/8"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
          <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black text-orange-deep shadow-soft backdrop-blur dark:bg-white/10 dark:text-orange-200">
            <RotateCcw className="h-4 w-4" />
            {t("flashcard.tap")}
          </span>
          <span className="flex gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/82 text-orange-deep shadow-soft dark:bg-white/10">
              <Volume2 className="h-5 w-5" />
            </span>
            <span
              onClick={(event) => {
                event.stopPropagation();
                setBookmarked((value) => !value);
              }}
              className={`flex h-11 w-11 items-center justify-center rounded-full shadow-soft ${bookmarked ? "bg-orange-brand text-white" : "bg-white/82 text-orange-deep dark:bg-white/10"}`}
            >
              <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-white" : ""}`} />
            </span>
          </span>
        </div>

        <div className="flex min-h-[400px] flex-col items-center justify-center [backface-visibility:hidden]">
          <p className="text-[7rem] font-black leading-none text-ink drop-shadow-sm dark:text-cream sm:text-[9rem]">{word.chinese}</p>
          <p className="mt-5 text-3xl font-black text-orange-brand">{word.pinyin}</p>
          <p className="mt-8 rounded-full bg-white/82 px-5 py-3 text-sm font-black text-stone-500 shadow-soft dark:bg-white/10 dark:text-stone-300">
            {t("flashcard.swipe")}
          </p>
        </div>

        <div className="absolute inset-0 flex min-h-[470px] rotate-y-180 flex-col items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-ink via-stone-900 to-orange-deep p-8 text-white [backface-visibility:hidden]">
          <p className="text-2xl font-black text-orange-200">{word.chinese} · {word.pinyin}</p>
          <p className="mt-7 text-5xl font-black">{translation}</p>
          <div className="mt-8 rounded-[2rem] bg-white/12 p-5 shadow-soft">
            <p className="text-xl font-black">{word.exampleChinese}</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">{example}</p>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
