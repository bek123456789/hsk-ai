"use client";

import { ArrowLeft, Lock, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { getLevelLockReason, isLevelUnlocked } from "@/utils/hskUnlock";
import { useI18n } from "@/utils/i18n";

export function HskLevelGuard({ level, children }: { level: HSKLevel; children: ReactNode }) {
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const { language } = useI18n();
  const unlocked = isLevelUnlocked(level, { knownWordIds }, examAttempts);

  if (unlocked) return children;

  return (
    <section className="mx-auto max-w-3xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
      <Card className="p-7 text-center sm:p-10">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-orange-soft text-orange-deep"><Lock className="h-9 w-9" /></span>
        <p className="mt-5 text-sm font-black text-orange-deep">HSK {level}</p>
        <h1 className="mt-2 text-4xl font-black text-ink">{language === "ru" ? "Этот уровень пока закрыт" : "Bu daraja hali yopiq"}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-stone-600">
          {getLevelLockReason(level, { knownWordIds }, examAttempts, language)}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <AppButton href={`/exam/${level - 1}`}><Trophy className="h-4 w-4" /> {language === "ru" ? "Посмотреть экзамен" : "Imtihonni ko‘rish"}</AppButton>
          <AppButton href={`/lessons/${level - 1}`} variant="secondary"><ArrowLeft className="h-4 w-4" /> {language === "ru" ? "Предыдущий этап" : "Avvalgi bosqich"}</AppButton>
        </div>
      </Card>
    </section>
  );
}
