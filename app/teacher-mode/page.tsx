"use client";

import { GraduationCap } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useI18n } from "@/utils/i18n";

export default function TeacherModePage() {
  const { language } = useI18n();

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="rounded-[2.5rem] bg-white/88 p-10 text-center shadow-premium">
          <GraduationCap className="mx-auto mb-5 h-16 w-16 text-orange-brand" />
          <h1 className="text-5xl font-black text-ink">{language === "ru" ? "Режим преподавателя" : "O‘qituvchi rejimi"}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Панель преподавателя пока не создаётся. Сейчас приоритет — приложение для ученика." : "O‘qituvchi rejimi hozircha faqat joy sifatida turibdi. Avval o‘quvchi ilovasi to‘liq tugallanadi."}
          </p>
        </div>
      </section>
    </ProtectedRoute>
  );
}
