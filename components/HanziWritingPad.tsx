"use client";

import { Eraser, PenLine } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/utils/i18n";

export function HanziWritingPad({ onComplete }: { onComplete?: () => void }) {
  const { language } = useI18n();
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);

  function clear() {
    setActive(false);
    setDone(false);
  }

  function mark() {
    setActive(true);
    setDone(true);
    onComplete?.();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-black text-ink">{language === "ru" ? "Практикуйте письмо" : "Yozib mashq qiling"}</p>
        <button onClick={clear} className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-stone-600 shadow-soft">
          <Eraser className="h-5 w-5" />
        </button>
      </div>
      <button
        onClick={mark}
        className="relative grid aspect-square w-full touch-none place-items-center overflow-hidden rounded-[2rem] border-2 border-dashed border-orange-brand/35 bg-cream shadow-inner"
      >
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <span className="border-r border-b border-orange-brand/20" />
          <span className="border-b border-orange-brand/20" />
          <span className="border-r border-orange-brand/20" />
          <span />
        </div>
        <PenLine className={`h-16 w-16 transition ${active ? "scale-125 text-orange-brand" : "text-stone-300"}`} />
      </button>
      {done ? <p className="mt-3 rounded-3xl bg-orange-soft px-4 py-3 text-sm font-black text-orange-deep">{language === "ru" ? "Практика завершена" : "Mashq tugadi"}</p> : null}
    </div>
  );
}
