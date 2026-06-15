"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StrokeOrderCard } from "@/components/StrokeOrderCard";
import { getWordsByLevel } from "@/data/hskWords";
import { parseHskLevel } from "@/utils/level";
import { useI18n } from "@/utils/i18n";

export default function StrokeOrderLevelPage() {
  const params = useParams();
  const level = parseHskLevel(params.level);
  const { language } = useI18n();
  const words = getWordsByLevel(level).slice(0, 18);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-6"><AppButton href="/stroke-order" variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> {language === "ru" ? "Написание иероглифов" : "Iyeroglif yozish"}</AppButton></div>
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-orange-deep">HSK {level}</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Порядок черт" : "Chizish tartibi"}</h1>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {words.map((word) => (
            <Link key={word.id} href={`/stroke-order/word/${word.id}`} className="block transition hover:-translate-y-1">
              <StrokeOrderCard word={word} />
            </Link>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}
