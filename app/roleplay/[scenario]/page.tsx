"use client";

import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { ConversationPractice } from "@/components/ConversationPractice";
import { PremiumLock } from "@/components/PremiumLock";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

const names = {
  greeting: { uz: "Salomlashish", ru: "Приветствие" },
  restaurant: { uz: "Restoran", ru: "Ресторан" },
  shop: { uz: "Do‘kon", ru: "Магазин" },
  directions: { uz: "Yo‘l so‘rash", ru: "Спросить дорогу" },
  appointment: { uz: "Vaqt belgilash", ru: "Назначить время" },
  hotel: { uz: "Mehmonxona", ru: "Гостиница" },
  pharmacy: { uz: "Dorixona", ru: "Аптека" },
  travel: { uz: "Sayohat", ru: "Путешествие" },
  school: { uz: "Maktab", ru: "Школа" },
  work: { uz: "Ish", ru: "Работа" }
};

export default function RoleplayScenarioPage() {
  const params = useParams();
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const scenario = String(params.scenario ?? "greeting");
  const premium = isPremiumProfile(user);
  const freePreview = scenario === "greeting";
  const name = names[scenario as keyof typeof names] ?? names.greeting;

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-6">
          <AppButton href="/roleplay" variant="ghost" className="px-4">
            <ArrowLeft className="h-5 w-5" /> {language === "ru" ? "Ролевая практика" : "Rol o‘yini"}
          </AppButton>
        </div>
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? name.ru : name.uz}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Напишите ответ на китайском. AI оценит смысл и покажет исправленный ответ." : "Javobni xitoycha yozing. AI ma’noni baholaydi va to‘g‘rilangan javobni ko‘rsatadi."}
          </p>
        </div>
        {premium || freePreview ? (
          <ConversationPractice initialScenario={language === "ru" ? name.ru : name.uz} usageType="ai_roleplay" />
        ) : (
          <PremiumLock featureKey="conversation" title={language === "ru" ? "Все сценарии доступны в Premium" : "Barcha scenariylar Premium uchun"} />
        )}
      </section>
    </ProtectedRoute>
  );
}
