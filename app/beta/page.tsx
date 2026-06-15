"use client";

import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/utils/i18n";
import { writeLocalObject } from "@/utils/localLearning";

export default function BetaPage() {
  const { language } = useI18n();
  const [code, setCode] = useState("");
  const [saved, setSaved] = useState(false);

  function save() {
    writeLocalObject("hsk-ai-beta-invite", { code, createdAt: new Date().toISOString() });
    setSaved(true);
  }

  return (
    <section className="premium-grid mx-auto grid min-h-[calc(100vh-5rem)] max-w-4xl place-items-center px-5 py-10 sm:px-8">
      <div className="rounded-[2.5rem] bg-white/90 p-10 text-center shadow-premium">
        <KeyRound className="mx-auto mb-5 h-16 w-16 text-orange-brand" />
        <h1 className="text-5xl font-black text-ink">{language === "ru" ? "Код тестового доступа" : "Sinov taklif kodi"}</h1>
        <input value={code} onChange={(event) => setCode(event.target.value)} placeholder={language === "ru" ? "Введите код" : "Kodni kiriting"} className="mt-7 w-full rounded-full bg-cream px-5 py-4 text-center text-sm font-black text-ink outline-none" />
        <button onClick={save} className="mt-5 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3.5 text-sm font-black text-white shadow-card">{language === "ru" ? "Сохранить" : "Saqlash"}</button>
        {saved ? <p className="mt-4 text-sm font-black text-orange-deep">{language === "ru" ? "Код сохранён" : "Kod saqlandi"}</p> : null}
      </div>
    </section>
  );
}
