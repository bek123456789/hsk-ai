"use client";

import { PenTool } from "lucide-react";
import type { HSKWord } from "@/types";
import { getStrokeSteps } from "@/utils/hanziWriting";
import { getWordTranslation, useI18n } from "@/utils/i18n";

export function StrokeOrderCard({ word }: { word: HSKWord }) {
  const { language } = useI18n();
  const steps = getStrokeSteps(word.chinese);

  return (
    <div className="rounded-[2.5rem] border border-orange-soft/70 bg-white/88 p-6 shadow-premium backdrop-blur-xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid h-40 w-full place-items-center rounded-[2rem] bg-gradient-to-br from-cream to-orange-soft sm:w-44">
          <span className="text-7xl font-black text-ink">{word.chinese}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Порядок черт" : "Chizish tartibi"}</p>
          <h3 className="mt-1 text-3xl font-black text-ink">{word.pinyin}</h3>
          <p className="mt-2 text-base font-bold text-stone-600">{getWordTranslation(word, language)}</p>
          <p className="mt-3 rounded-3xl bg-cream px-4 py-3 text-sm font-bold leading-6 text-stone-600">
            {language === "ru"
              ? "Данные порядка черт готовятся. Пока продолжайте в режиме практики письма."
              : "Stroke order ma’lumotlari tayyorlanmoqda. Hozircha yozish mashqi rejimida davom eting."}
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {steps.slice(0, 6).map((step) => (
          <div key={step.id} className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600 shadow-soft">
            <PenTool className="mb-2 h-5 w-5 text-orange-brand" />
            {language === "ru" ? step.titleRu : step.titleUz}
          </div>
        ))}
      </div>
    </div>
  );
}
