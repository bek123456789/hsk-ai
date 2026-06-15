"use client";

import { ArrowLeft, LifeBuoy } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { useI18n } from "@/utils/i18n";

type HelpTopicPageProps = {
  titleUz: string;
  titleRu: string;
  introUz: string;
  introRu: string;
  stepsUz: string[];
  stepsRu: string[];
};

export function HelpTopicPage({ titleUz, titleRu, introUz, introRu, stepsUz, stepsRu }: HelpTopicPageProps) {
  const { language } = useI18n();
  const title = language === "ru" ? titleRu : titleUz;
  const intro = language === "ru" ? introRu : introUz;
  const steps = language === "ru" ? stepsRu : stepsUz;

  return (
    <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-12 lg:py-14">
      <AppButton href="/help" variant="ghost"><ArrowLeft className="h-4 w-4" /> {language === "ru" ? "Центр помощи" : "Yordam markazi"}</AppButton>
      <div className="mt-6 rounded-[2.5rem] border border-white/80 bg-white/88 p-7 shadow-premium sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep"><LifeBuoy className="h-7 w-7" /></div>
        <h1 className="mt-6 text-4xl font-black text-ink sm:text-6xl">{title}</h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">{intro}</p>
        <div className="mt-8 space-y-3">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-4 rounded-3xl bg-cream p-5 shadow-soft">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-orange-brand text-sm font-black text-white">{index + 1}</span>
              <p className="pt-1 font-bold leading-7 text-stone-700">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <AppButton href="/feedback">{language === "ru" ? "Написать отзыв" : "Fikr yuborish"}</AppButton>
          <AppButton href="/feedback" variant="secondary">{language === "ru" ? "Сообщить об ошибке" : "Xato haqida xabar berish"}</AppButton>
        </div>
      </div>
    </section>
  );
}
