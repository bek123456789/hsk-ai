"use client";

import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { HanziWritingPad } from "@/components/HanziWritingPad";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StrokeOrderCard } from "@/components/StrokeOrderCard";
import { hskWords } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function StrokeOrderWordPage() {
  const params = useParams();
  const wordId = Array.isArray(params.wordId) ? params.wordId[0] : params.wordId;
  const word = hskWords.find((item) => item.id === wordId) ?? hskWords[0];
  const { language } = useI18n();
  const markKnown = useProgressStore((state) => state.markKnown);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-6"><AppButton href={`/stroke-order/${word.hskLevel}`} variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> HSK {word.hskLevel}</AppButton></div>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <StrokeOrderCard word={word} />
          <div className="rounded-[2.5rem] border border-white/70 bg-white/88 p-6 shadow-premium backdrop-blur-xl">
            <HanziWritingPad onComplete={() => markKnown(word.id)} />
            <div className="mt-6">
              <AppButton href={`/stroke-order/${word.hskLevel}`} variant="primary">{language === "ru" ? "Следующий иероглиф" : "Keyingi iyeroglif"}</AppButton>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
