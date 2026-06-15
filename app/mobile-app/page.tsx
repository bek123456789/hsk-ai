"use client";

import { Bell, CheckCircle2, Smartphone } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/components/AppButton";
import { BrandLogo } from "@/components/BrandLogo";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";

export default function MobileAppPage() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  function join() {
    const value = email.trim();
    if (!value) return;
    const list = JSON.parse(localStorage.getItem("hsk-ai-mobile-waitlist") ?? "[]") as string[];
    localStorage.setItem("hsk-ai-mobile-waitlist", JSON.stringify(Array.from(new Set([...list, value]))));
    setSaved(true);
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <BrandLogo variant="full" size="md" />
            <h1 className="mt-2 text-5xl font-black leading-tight text-ink sm:text-7xl">
              {language === "ru" ? "Мобильное приложение скоро" : "Mobil ilova tez orada"}
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
              {language === "ru" ? "Запишитесь в список ожидания и получите уведомление о beta-доступе." : "Kutish ro‘yxatiga yoziling va beta kirish haqida xabar oling."}
            </p>
            <div className="mt-7 flex max-w-xl flex-col gap-3 rounded-[2rem] bg-white/90 p-3 shadow-premium sm:flex-row">
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="min-w-0 flex-1 rounded-full bg-cream px-5 py-4 text-sm font-bold text-ink outline-none" placeholder={language === "ru" ? "Email" : "Email"} />
              <button onClick={join} className="rounded-full bg-orange-brand px-6 py-4 text-sm font-black text-white shadow-glow">
                {language === "ru" ? "Записаться" : "Yozilish"}
              </button>
            </div>
            {saved ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep">
                <CheckCircle2 className="h-5 w-5" /> {language === "ru" ? "Вы в списке ожидания" : "Kutish ro‘yxatiga qo‘shildingiz"}
              </p>
            ) : null}
          </div>
          <Card className="p-8">
            <div className="mx-auto flex h-64 max-w-[220px] rotate-[-6deg] flex-col rounded-[2.5rem] border-[10px] border-ink bg-gradient-to-br from-orange-brand to-amber-300 p-5 text-white shadow-premium">
              <Smartphone className="h-10 w-10" />
              <p className="mt-auto text-3xl font-black">HanziFlow AI</p>
              <p className="mt-2 text-sm font-black">{language === "ru" ? "Учёба в кармане" : "O‘qish cho‘ntagingizda"}</p>
            </div>
            <div className="mt-8 grid gap-3">
              <AppButton href="/dashboard" variant="secondary"><Bell className="h-5 w-5" /> {language === "ru" ? "Вернуться" : "Qaytish"}</AppButton>
            </div>
          </Card>
        </div>
      </section>
    </ProtectedRoute>
  );
}
