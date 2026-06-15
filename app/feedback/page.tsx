"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { appendLocalItem } from "@/utils/localLearning";
import { useI18n } from "@/utils/i18n";

export default function FeedbackPage() {
  const { language } = useI18n();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    appendLocalItem("hsk-ai-feedback", { id: `feedback-${Date.now()}`, message, createdAt: new Date().toISOString() });
    setMessage("");
    setSent(true);
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="rounded-[2.5rem] bg-white/88 p-7 shadow-premium sm:p-10">
          <h1 className="text-5xl font-black text-ink">{language === "ru" ? "Отзывы тестовой версии" : "Sinov fikr-mulohaza"}</h1>
          <p className="mt-4 text-lg font-semibold text-stone-600">{language === "ru" ? "Напишите, что нужно улучшить." : "Nimani yaxshilash kerakligini yozing."}</p>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-6 min-h-44 w-full resize-none rounded-[2rem] bg-cream p-5 text-sm font-bold text-ink outline-none" />
          <button onClick={submit} disabled={!message.trim()} className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3.5 text-sm font-black text-white shadow-card disabled:opacity-50">
            <Send className="h-5 w-5" /> {language === "ru" ? "Отправить" : "Yuborish"}
          </button>
          {sent ? <p className="mt-4 text-sm font-black text-orange-deep">{language === "ru" ? "Ваш отзыв сохранён" : "Fikringiz saqlandi"}</p> : null}
        </div>
      </section>
    </ProtectedRoute>
  );
}
