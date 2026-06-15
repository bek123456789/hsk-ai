"use client";

import { Bot, Loader2, Mic, Send, Volume2 } from "lucide-react";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { HSKLevel } from "@/types";
import { hskLevelValues } from "@/utils/level";
import { useI18n } from "@/utils/i18n";
import { listenChineseSpeech } from "@/utils/speechRecognition";
import { speakChinese } from "@/utils/speechSynthesis";
import type { AIUsageType } from "@/utils/usageLimits";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function ConversationPractice({
  voice = false,
  initialScenario,
  usageType = "ai_conversation"
}: {
  voice?: boolean;
  initialScenario?: string;
  usageType?: AIUsageType;
}) {
  const { language } = useI18n();
  const [level, setLevel] = useState<HSKLevel>(1);
  const [scenario, setScenario] = useState(initialScenario ?? (language === "ru" ? "Приветствие" : "Salomlashish"));
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: language === "ru" ? "你好！nǐ hǎo! Ответьте коротко на китайском." : "你好！nǐ hǎo! Xitoycha qisqa javob bering."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scenarios = language === "ru" ? ["Приветствие", "Ресторан", "Магазин", "Путешествие", "Школа", "Работа"] : ["Salomlashish", "Restoran", "Do‘kon", "Sayohat", "Maktab", "Ish"];

  async function send(text = input) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    setLoading(true);
    setError(null);
    setMessages((current) => [...current, { role: "user", content: trimmed }]);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error(language === "ru" ? "Сессия не найдена." : "Sessiya topilmadi.");

      const prompt =
        language === "ru"
          ? `Практика диалога. Уровень HSK ${level}. Сценарий: ${scenario}. Задавайте один короткий китайский вопрос за раз. Исправляйте мягко. Ответ пользователя: ${trimmed}`
          : `Suhbat mashqi. HSK ${level}. Mavzu: ${scenario}. Bitta qisqa xitoycha savol bering. Xatolarni muloyim tuzating. Foydalanuvchi javobi: ${trimmed}`;

      const response = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, language, hskLevel: level, usageType })
      });
      const result = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !result.reply) throw new Error(result.error || (language === "ru" ? "Ответ не получен." : "Javob olinmadi."));
      setMessages((current) => [...current, { role: "assistant", content: result.reply ?? "" }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : language === "ru" ? "Произошла ошибка." : "Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }

  async function recordVoice() {
    try {
      const transcript = await listenChineseSpeech();
      setInput(transcript);
      await send(transcript);
    } catch {
      setError(language === "ru" ? "Можно ответить текстом." : "Matn bilan javob berishingiz mumkin.");
    }
  }

  return (
    <div className="rounded-[2.5rem] border border-orange-soft/70 bg-white/90 p-5 shadow-premium backdrop-blur-xl sm:p-7">
      <div className="mb-5 grid gap-3 sm:grid-cols-[160px_1fr]">
        <select value={level} onChange={(event) => setLevel(Number(event.target.value) as HSKLevel)} className="rounded-full bg-cream px-4 py-3 text-sm font-black text-ink outline-none">
          {hskLevelValues.map((item) => <option key={item} value={item}>HSK {item}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((item) => (
            <button key={item} onClick={() => setScenario(item)} className={`rounded-full px-4 py-2 text-xs font-black shadow-soft ${scenario === item ? "bg-orange-brand text-white" : "bg-cream text-stone-600"}`}>{item}</button>
          ))}
        </div>
      </div>
      <div className="max-h-[520px] space-y-4 overflow-y-auto rounded-[2rem] bg-cream p-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[86%] whitespace-pre-wrap break-words rounded-[1.5rem] px-5 py-4 text-sm font-bold leading-7 [overflow-wrap:anywhere] ${message.role === "user" ? "bg-gradient-to-r from-orange-brand to-orange-hot text-white" : "bg-white text-ink shadow-soft"}`}>
              {message.role === "assistant" ? <Bot className="mb-2 h-5 w-5 text-orange-brand" /> : null}
              {message.content}
            </div>
          </div>
        ))}
        {loading ? <p className="rounded-full bg-white px-4 py-2 text-sm font-black text-stone-500">{language === "ru" ? "ИИ пишет..." : "Yordamchi yozmoqda..."}</p> : null}
      </div>
      {error ? <p className="mt-4 rounded-3xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{error}</p> : null}
      <div className="mt-4 flex gap-3 rounded-[2rem] bg-cream p-2 pl-5 shadow-inner">
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={language === "ru" ? "Ответьте" : "Javob bering"} className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none" />
        {voice ? <button onClick={recordVoice} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-deep shadow-soft"><Mic className="h-5 w-5" /></button> : null}
        {voice ? <button onClick={() => speakChinese(messages[messages.length - 1]?.content ?? "你好")} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-deep shadow-soft"><Volume2 className="h-5 w-5" /></button> : null}
        <button onClick={() => void send()} disabled={loading || !input.trim()} className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-brand to-orange-hot text-white shadow-card disabled:opacity-50">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
