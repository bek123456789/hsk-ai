"use client";

import { ArrowLeft, ArrowRight, Brain } from "lucide-react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getGrammarByLevel } from "@/data/hskGrammar";
import { parseHskLevel } from "@/utils/level";
import { useI18n } from "@/utils/i18n";

export default function GrammarLevelPage() {
  const params = useParams();
  const level = parseHskLevel(params.level);
  const { language } = useI18n();
  const grammar = getGrammarByLevel(level);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-6">
          <AppButton href="/grammar" variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> {language === "ru" ? "Тренажёр грамматики" : "Grammatika mashqi"}</AppButton>
        </div>
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-orange-deep">HSK {level}</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Грамматика" : "Grammatika"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Выберите тему и выполните короткие упражнения." : "Mavzuni tanlang va qisqa mashqlarni bajaring."}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {grammar.map((item) => (
            <Card key={item.grammarId} className="p-6">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft">
                <Brain className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-ink">{language === "ru" ? item.titleRu : item.titleUz}</h2>
              <p className="mt-3 rounded-3xl bg-cream px-4 py-3 text-sm font-black text-stone-600">{item.structure}</p>
              <p className="mt-3 min-h-20 text-sm font-semibold leading-6 text-stone-500">{language === "ru" ? item.explanationRu : item.explanationUz}</p>
              <div className="mt-5">
                <AppButton href={`/grammar/${level}/${item.grammarId}`} variant="primary" className="w-full">
                  {language === "ru" ? "Упражнения" : "Mashqlar"} <ArrowRight className="h-4 w-4" />
                </AppButton>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}
