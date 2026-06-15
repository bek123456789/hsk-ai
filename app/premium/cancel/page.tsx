"use client";

import { XCircle } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useI18n } from "@/utils/i18n";

export default function PremiumCancelPage() {
  const { language } = useI18n();

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto grid min-h-[calc(100vh-5rem)] max-w-4xl place-items-center px-5 pb-36 pt-10 sm:px-8 md:pb-10">
        <div className="rounded-[2.5rem] border border-orange-soft/80 bg-white/90 p-8 text-center shadow-premium sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-orange-soft text-orange-deep shadow-soft">
            <XCircle className="h-11 w-11" />
          </div>
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">Premium</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Платёж отменён" : "To‘lov bekor qilindi"}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Вы можете попробовать снова в любое время." : "Siz istalgan vaqtda qayta urinishingiz mumkin."}
          </p>
          <div className="mt-7">
            <AppButton href="/premium">{language === "ru" ? "Вернуться на страницу Premium" : "Premium sahifasiga qaytish"}</AppButton>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
