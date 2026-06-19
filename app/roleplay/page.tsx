"use client";

import { MessageCircle, ShoppingBag, Utensils, MapPinned, School, HeartPulse, Clock3, Hotel, Crown } from "lucide-react";
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
    { id: "greeting", icon: MessageCircle, uz: "Tanishuv", ru: "Знакомство", detailUz: "Ism, millat va o‘qish haqida qisqa gapiring.", detailRu: "Коротко поговорите об имени, стране и учёбе." },
    { id: "shop", icon: ShoppingBag, uz: "Do‘konda narx so‘rash", ru: "Цена в магазине", detailUz: "Narx so‘rang, choy tanlang va kerak emasligini ayting.", detailRu: "Спросите цену, выберите чай и скажите, что не нужно." },
    { id: "restaurant", icon: Utensils, uz: "Restoranda buyurtma", ru: "Заказ в ресторане", detailUz: "Taom, suv va hisob haqida xitoycha javob bering.", detailRu: "Ответьте по-китайски о еде, воде и счёте." },
    { id: "school", icon: School, uz: "Maktabda tanishish", ru: "Знакомство в школе", detailUz: "Dars, o‘qituvchi va sinfdosh haqida gapiring.", detailRu: "Поговорите об уроке, учителе и однокласснике." },
    { id: "directions", icon: MapPinned, uz: "Yo‘l so‘rash", ru: "Спросить дорогу", detailUz: "Qayerdaligini, qanday borishni va masofani so‘rang.", detailRu: "Спросите, где находится место и как туда дойти." },
    { id: "appointment", icon: Clock3, uz: "Vaqt belgilash", ru: "Назначить время", detailUz: "Uchrashuv vaqti va joyini kelishing.", detailRu: "Договоритесь о времени и месте встречи." },
    { id: "hotel", icon: Hotel, uz: "Mehmonxona", ru: "Гостиница", detailUz: "Xona, pasport va narx haqida sodda gapiring.", detailRu: "Спросите о номере, паспорте и цене." },
    { id: "pharmacy", icon: HeartPulse, uz: "Dorixonada", ru: "В аптеке", detailUz: "Kasallik alomatlari va dori haqida so‘rang.", detailRu: "Спросите о симптомах и лекарстве." }
  ];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Реальная ситуация" : "Real vaziyat"}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Практикуйте реальные диалоги с AI-наставником и получайте исправленный ответ." : "Haqiqiy suhbatlarni AI yordamchi bilan mashq qiling va to‘g‘rilangan javob oling."}
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
                {language === "ru" ? scenario.detailRu : scenario.detailUz}
              </p>
              <AppButton href={`/roleplay/${scenario.id}`} className="mt-5 w-full" variant={premium || index === 0 ? "primary" : "secondary"}>
                {language === "ru" ? "Начать диалог" : "Suhbatni boshlash"}
              </AppButton>
            </Card>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}
