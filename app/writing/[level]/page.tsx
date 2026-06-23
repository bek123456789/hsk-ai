"use client";

import { PenLine } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { HanziWritingPad } from "@/components/HanziWritingPad";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getWordsByLevel } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { getWordTranslation, useI18n } from "@/utils/i18n";

function parseLevel(value: string | string[] | undefined): HSKLevel {
  const raw = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(raw);
  return numberValue >= 1 && numberValue <= 6 ? (numberValue as HSKLevel) : 1;
}

export default function WritingPage() {
  const params = useParams();
  const level = parseLevel(params.level);
  const { language, t } = useI18n();
  const words = useMemo(() => getWordsByLevel(level), [level]);
  const [index, setIndex] = useState(0);
  const markKnown = useProgressStore((state) => state.markKnown);
  const word = words[index] ?? words[0];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-orange-deep">HSK {level}</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{t("writing.title")}</h1>
          <p className="mt-4 text-lg font-semibold text-stone-600">{t("writing.subtitle")}</p>
        </div>
        {word ? (
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2.5rem] bg-white/84 p-8 text-center shadow-premium">
              <p className="text-[7rem] font-black leading-none text-ink">{word.chinese}</p>
              <p className="mt-4 text-2xl font-black text-orange-brand">{word.pinyin}</p>
              <p className="mt-3 text-xl font-bold text-stone-600">{getWordTranslation(word, language)}</p>
              <div className="mt-7 rounded-[2rem] bg-cream p-5 shadow-soft">
                <PenLine className="mx-auto mb-3 h-8 w-8 text-orange-brand" />
                <p className="font-black text-ink">{t("writing.stroke")}</p>
              </div>
            </div>
            <div className="rounded-[2.5rem] bg-white/84 p-6 shadow-premium">
              <HanziWritingPad word={word} onComplete={() => markKnown(word.id)} />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <AppButton href={`/lesson/${level}`} variant="secondary">{t("common.back")}</AppButton>
                <button onClick={() => setIndex((value) => (value + 1) % words.length)} className="rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-4 text-sm font-black text-white shadow-card">{t("common.next")}</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[2.5rem] bg-white/84 p-10 text-center shadow-premium">
            <h2 className="text-3xl font-black text-ink">{t("review.empty")}</h2>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
