"use client";

import { Bot, CheckCircle2, Eye, Mic, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { SpeakingResultCard } from "@/components/SpeakingResultCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AppLanguage } from "@/types";
import type { HSKSpeakingTask } from "@/data/hsk/contentIndex";
import { isSpeakingTaskDone, saveSpeakingTaskProgress, type SpeakingEvaluationResult } from "@/utils/speakingProgress";

type SpeechRecognitionConstructor = new () => {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  const maybe = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return maybe.SpeechRecognition ?? maybe.webkitSpeechRecognition ?? null;
}

export function SpeakingRetellTask({
  task,
  language,
  onNext,
  onEvaluated
}: {
  task: HSKSpeakingTask;
  language: AppLanguage;
  onNext: () => void;
  onEvaluated?: (done: boolean) => void;
}) {
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SpeakingEvaluationResult | null>(null);
  const [persistedDone, setPersistedDone] = useState(false);
  const Recognition = useMemo(() => getSpeechRecognition(), []);

  useEffect(() => {
    setAnswer("");
    setResult(null);
    setError("");
    setShowPinyin(false);
    setShowTranslation(false);
    setPersistedDone(isSpeakingTaskDone(task.id));
  }, [task.id]);

  function startVoiceInput() {
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript ?? "";
      setAnswer((current) => `${current} ${text}`.trim());
    };
    recognition.onend = () => setRecording(false);
    setRecording(true);
    recognition.start();
  }

  async function submit() {
    if (!answer.trim()) {
      setError(language === "ru" ? "Ответ не может быть пустым." : "Javob bo‘sh bo‘lishi mumkin emas.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error(language === "ru" ? "Сначала войдите в аккаунт." : "Avval tizimga kiring.");
      const response = await fetch("/api/speaking/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ taskId: task.id, level: task.level, userAnswerZh: answer, locale: language })
      });
      const payload = (await response.json().catch(() => ({}))) as SpeakingEvaluationResult & { error?: string };
      if (!response.ok || payload.ok === false) throw new Error(payload.error || (language === "ru" ? "AI проверка не сработала." : "AI tekshiruv ishlamadi."));
      setResult(payload);
      saveSpeakingTaskProgress({
        taskId: task.id,
        level: task.level,
        score: payload.score,
        userAnswerZh: answer,
        correctedAnswerZh: payload.correctedAnswerZh,
        done: payload.done,
        feedback: payload
      });
      setPersistedDone(payload.done);
      onEvaluated?.(payload.done);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : language === "ru" ? "AI не смог проверить ответ." : "AI javobni tekshira olmadi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] bg-white/88 p-5 shadow-premium sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-orange-deep">{language === "ru" ? task.instructionRu : task.instructionUz}</p>
            <h2 className="mt-2 text-3xl font-black text-ink">{language === "ru" ? task.titleRu : task.titleUz}</h2>
          </div>
          {result?.done || persistedDone ? <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {language === "ru" ? "Выполнено" : "Bajarildi"}</span> : null}
        </div>

        <div className="mt-6 rounded-[2rem] bg-gradient-to-br from-cream to-orange-soft/50 p-5">
          <p className="text-3xl font-black leading-relaxed text-ink sm:text-4xl">{task.textZh}</p>
          {showPinyin ? <p className="mt-4 font-bold leading-7 text-orange-brand">{task.textPinyin}</p> : null}
          {showTranslation ? <p className="mt-4 font-semibold leading-7 text-stone-700">{language === "ru" ? task.textRu : task.textUz}</p> : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <AppButton variant="secondary" onClick={() => setShowPinyin((value) => !value)}><Eye className="h-4 w-4" /> {language === "ru" ? "Показать pinyin" : "Pinyinni ko‘rsatish"}</AppButton>
          <AppButton variant="secondary" onClick={() => setShowTranslation((value) => !value)}><Eye className="h-4 w-4" /> {language === "ru" ? "Показать перевод" : "Tarjimani ko‘rsatish"}</AppButton>
        </div>

        <div className="mt-5">
          <p className="text-sm font-black text-stone-600">{language === "ru" ? "Ключевые слова" : "Kalit so‘zlar"}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {task.keywordsZh.map((keyword) => <span key={keyword} className="rounded-full bg-white px-3 py-2 text-sm font-black text-orange-deep shadow-soft">{keyword}</span>)}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white/88 p-5 shadow-premium sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-ink">{language === "ru" ? "AI проверка смысла" : "AI mazmun tekshiruvi"}</h3>
            <p className="text-sm font-semibold text-stone-500">{language === "ru" ? "Перескажите смысл на китайском." : "Mazmunini xitoycha aytib bering."}</p>
          </div>
        </div>

        <textarea
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setError("");
          }}
          className="warm-focus mt-5 min-h-36 w-full resize-none rounded-[1.5rem] border border-orange-soft bg-cream px-5 py-4 text-lg font-bold leading-7 text-ink outline-none"
          placeholder={language === "ru" ? "Напишите ответ на китайском..." : "Javobni xitoycha yozing..."}
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <AppButton onClick={submit} disabled={loading} className="flex-1">
            {loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? (language === "ru" ? "AI проверяет" : "AI tekshiryapti") : (language === "ru" ? "Проверить ответ" : "Javobni tekshirish")}
          </AppButton>
          {Recognition ? (
            <AppButton variant="secondary" onClick={startVoiceInput} disabled={recording || loading}>
              <Mic className="h-4 w-4" /> {recording ? (language === "ru" ? "Запись началась" : "Yozuv boshladi") : (language === "ru" ? "Ответить голосом" : "Ovoz bilan javob berish")}
            </AppButton>
          ) : (
            <span className="rounded-full bg-cream px-4 py-3 text-xs font-black text-stone-500">{language === "ru" ? "Ваш браузер не поддерживает голосовой ввод" : "Browseringiz ovozli kiritishni qo‘llab-quvvatlamaydi"}</span>
          )}
        </div>
        {error ? <p className="mt-4 rounded-3xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{error}</p> : null}
        {result ? (
          <div className="mt-5 rounded-3xl bg-cream p-4">
            <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Пример ответа" : "Namuna javob"}</p>
            <p className="mt-2 text-xl font-black text-ink">{task.sampleAnswerZh}</p>
            <p className="mt-1 font-bold text-orange-brand">{task.sampleAnswerPinyin}</p>
          </div>
        ) : null}
        {result ? <div className="mt-5"><SpeakingResultCard result={result} language={language} onRetry={() => setResult(null)} onNext={onNext} /></div> : null}
      </div>
    </div>
  );
}
