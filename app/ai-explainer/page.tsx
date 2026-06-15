"use client";

import { Bot, Loader2, RotateCcw, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function AIExplainerPage() {
  const { language } = useI18n();
  const level = useProgressStore((state) => state.currentLevel);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(text = message) {
    const clean = text.trim();
    if (!clean || loading) return;
    setLoading(true); setError(""); setAnswer("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error(language === "ru" ? "Сессия не найдена. Войдите снова." : "Sessiya topilmadi. Qayta kiring.");
      const response = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: clean, language, hskLevel: level, usageType: "ai_lesson_explainer" })
      });
      const result = await response.json().catch(() => ({})) as { reply?: string; error?: string };
      if (!response.ok || !result.reply) throw new Error(result.error || (language === "ru" ? "AI не смог ответить." : "AI javob bera olmadi."));
      setAnswer(result.reply);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : language === "ru" ? "AI не смог ответить." : "AI javob bera olmadi.");
    } finally { setLoading(false); }
  }

  const suggestions = language === "ru"
    ? ["Объясни 了 простыми словами", "Объясни слово 你好 с примерами", "Покажи порядок слов в китайском предложении"]
    : ["了 ni oddiy qilib tushuntir", "你好 so‘zini misollar bilan tushuntir", "Xitoycha gapdagi so‘z tartibini tushuntir"];

  return (
    <ProtectedRoute>
      <PageShell className="max-w-5xl">
        <PageHeader eyebrow={language === "ru" ? "Лимиты AI применяются" : "AI limitlari amal qiladi"} title={language === "ru" ? "AI-объяснение" : "AI tushuntiruvchi"} description={language === "ru" ? "Введите слово, грамматику или предложение и получите объяснение по вашему уровню HSK." : "So‘z, grammatika yoki gapni kiriting va HSK darajangizga mos tushuntirish oling."} icon={Bot} />
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr]">
          <div className="rounded-[2rem] bg-white/88 p-6 shadow-premium">
            <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Готовые запросы" : "Tayyor savollar"}</h2>
            <div className="mt-5 grid gap-3">{suggestions.map((item) => <button key={item} onClick={() => { setMessage(item); void submit(item); }} className="warm-focus rounded-3xl border border-orange-soft bg-cream p-4 text-left text-sm font-black text-ink transition hover:bg-orange-soft">{item}</button>)}</div>
          </div>
          <div className="rounded-[2rem] bg-white/88 p-6 shadow-premium">
            <label className="text-sm font-black text-stone-600">{language === "ru" ? "Объясните слово или предложение" : "So‘z yoki gapni tushuntiring"}<textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} className="warm-focus mt-3 w-full resize-none rounded-3xl border border-orange-soft bg-cream p-5 font-semibold text-ink outline-none" /></label>
            <button onClick={() => void submit()} disabled={loading || !message.trim()} className="warm-focus mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-glow disabled:opacity-50">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} {language === "ru" ? "Объяснить" : "Tushuntirish"}</button>
            {answer ? <div className="mt-6 whitespace-pre-wrap break-words rounded-3xl border border-orange-soft bg-cream p-5 font-semibold leading-7 text-stone-700"><p className="mb-3 flex items-center gap-2 font-black text-orange-deep"><Sparkles className="h-5 w-5" /> HanziFlow AI</p>{answer}</div> : null}
            {error ? <div className="mt-6 rounded-3xl bg-rose-50 p-5 text-sm font-black text-rose-700"><p>{error}</p><button onClick={() => void submit()} className="mt-3 inline-flex items-center gap-2"><RotateCcw className="h-4 w-4" /> {language === "ru" ? "Попробовать снова" : "Qayta urinib ko‘rish"}</button></div> : null}
          </div>
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
