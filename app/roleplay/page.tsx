"use client";

import { MessageCircle, ShoppingBag, Utensils, Plane, School, BriefcaseBusiness, Crown } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

export default function RoleplayPage() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const premium = isPremiumProfile(user);
  const scenarios = [
    { id: "greeting", icon: MessageCircle, uz: "Salomlashish", ru: "Приветствие" },
    { id: "restaurant", icon: Utensils, uz: "Restoran", ru: "Ресторан" },
    { id: "shop", icon: ShoppingBag, uz: "Do‘kon", ru: "Магазин" },
    { id: "travel", icon: Plane, uz: "Sayohat", ru: "Путешествие" },
    { id: "school", icon: School, uz: "Maktab", ru: "Школа" },
    { id: "work", icon: BriefcaseBusiness, uz: "Ish", ru: "Работа" }
  ];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "AI ролевая практика" : "AI rol o‘yini"}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Практикуйте реальные ситуации с AI-наставником." : "Real vaziyatlarni AI yordamchi bilan mashq qiling."}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <Card key={scenario.id} className="p-6">
              <scenario.icon className="mb-5 h-10 w-10 text-orange-brand" />
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-ink">{language === "ru" ? scenario.ru : scenario.uz}</h2>
                {!premium && index > 0 ? <Crown className="h-5 w-5 text-orange-brand" /> : null}
              </div>
              <p className="mt-3 min-h-16 text-sm font-semibold leading-6 text-stone-500">
                {language === "ru" ? "Бесплатно доступен первый сценарий. Premium открывает все ситуации." : "Bepul birinchi scenario ochiq. Premium barcha vaziyatlarni ochadi."}
              </p>
              <AppButton href={`/roleplay/${scenario.id}`} className="mt-5 w-full" variant={premium || index === 0 ? "primary" : "secondary"}>
                {language === "ru" ? "Открыть" : "Ochish"}
              </AppButton>
            </Card>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}
