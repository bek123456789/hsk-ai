"use client";

import { Mic } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useI18n } from "@/utils/i18n";

export default function SpeakingChallengePage() {
  const { language } = useI18n();
  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-3xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <Card className="p-8 text-center">
          <Mic className="mx-auto h-16 w-16 text-orange-brand" />
          <h1 className="mt-4 text-5xl font-black text-ink">{language === "ru" ? "Челлендж говорения" : "Gapirish sinovi"}</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-stone-500">
            {language === "ru" ? "Повторите 5 коротких фраз и проверьте произношение." : "5 ta qisqa gapni takrorlang va talaffuzni tekshiring."}
          </p>
          <AppButton href="/speaking/1" className="mt-7">{language === "ru" ? "Начать" : "Boshlash"}</AppButton>
        </Card>
      </section>
    </ProtectedRoute>
  );
}
