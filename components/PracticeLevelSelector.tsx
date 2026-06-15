"use client";

import { ArrowRight } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { hskLevelsData } from "@/data/hskLevels";
import { useI18n } from "@/utils/i18n";

export function PracticeLevelSelector({
  titleUz,
  titleRu,
  subtitleUz,
  subtitleRu,
  basePath
}: {
  titleUz: string;
  titleRu: string;
  subtitleUz: string;
  subtitleRu: string;
  basePath: string;
}) {
  const { language } = useI18n();

  return (
    <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
        <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? titleRu : titleUz}</h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">{language === "ru" ? subtitleRu : subtitleUz}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {hskLevelsData.map((level) => (
          <Card key={level.level} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-orange-deep">HSK {level.level}</p>
                <h2 className="mt-2 text-3xl font-black text-ink">{language === "ru" ? level.titleRu : level.titleUz}</h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-xl font-black text-orange-deep shadow-soft">{level.level}</div>
            </div>
            <p className="mt-4 min-h-16 text-sm font-semibold leading-6 text-stone-500">{language === "ru" ? level.descriptionRu : level.descriptionUz}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-black text-stone-600">
              <div className="rounded-3xl bg-cream p-4">{level.wordCount} {language === "ru" ? "слов" : "so‘z"}</div>
              <div className="rounded-3xl bg-cream p-4">{level.lessons} {language === "ru" ? "уроков" : "dars"}</div>
            </div>
            <div className="mt-6">
              <AppButton href={`${basePath}/${level.level}`} variant="primary" className="w-full">
                {language === "ru" ? "Начать" : "Boshlash"} <ArrowRight className="h-4 w-4" />
              </AppButton>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
