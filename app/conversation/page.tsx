"use client";

import { ConversationPractice } from "@/components/ConversationPractice";
import { PremiumLock } from "@/components/PremiumLock";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

export default function ConversationPage() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const premium = isPremiumProfile(user);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        {!premium ? <PremiumLock featureKey="conversation" /> : (
        <>
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Практика диалога" : "Suhbat mashqi"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">{language === "ru" ? "Выберите тему и отвечайте короткими китайскими фразами." : "Mavzuni tanlang va qisqa xitoycha iboralar bilan javob bering."}</p>
        </div>
        <ConversationPractice />
        </>
        )}
      </section>
    </ProtectedRoute>
  );
}
