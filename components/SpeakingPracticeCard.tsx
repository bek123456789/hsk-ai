"use client";

import { Loader2, Mic, Volume2 } from "lucide-react";
import { useState } from "react";
import { PronunciationResult } from "@/components/PronunciationResult";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { HSKLevel, SpeakingPracticeResult } from "@/types";
import { pronunciationFeedback, scorePronunciation } from "@/utils/pronunciationScoring";
import { hasSpeechRecognition, listenChineseSpeech } from "@/utils/speechRecognition";
import { speakChinese } from "@/utils/speechSynthesis";
import { useI18n } from "@/utils/i18n";
import { recordLocalAIUsage } from "@/utils/aiUsageClient";

type CheckResponse = {
  isCorrect: boolean;
  score: number;
  feedbackUz: string;
  feedbackRu: string;
  normalizedTarget: string;
  normalizedUserSpeech: string;
  error?: string;
  detail?: string;
  code?: string;
  usage?: { fallback?: boolean };
};

export function SpeakingPracticeCard({
  wordId,
  hanzi,
  pinyin,
  translationUz,
  translationRu,
  hskLevel,
  lessonId,
  onCorrect,
  onWrong,
  onNext
}: {
  wordId: string;
  hanzi: string;
  pinyin: string;
  translationUz: string;
  translationRu: string;
  hskLevel: HSKLevel;
  lessonId?: string;
  onCorrect?: (result: SpeakingPracticeResult) => void;
  onWrong?: (result: SpeakingPracticeResult) => void;
  onNext?: () => void;
}) {
  const { language } = useI18n();
  const [checking, setChecking] = useState(false);
  const [listening, setListening] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [recognizedText, setRecognizedText] = useState("");
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const translation = language === "ru" ? translationRu : translationUz;

  function play() {
    const status = speakChinese(hanzi);
    if (!status.ok) {
      setError(language === "ru" ? "Аудио недоступно" : "Ovoz mavjud emas");
    }
  }

  async function check(recognized: string) {
    setChecking(true);
    setError(null);
    const local = scorePronunciation({ targetHanzi: hanzi, targetPinyin: pinyin, recognizedText: recognized });
    let checked: CheckResponse = {
      isCorrect: local.isCorrect,
      score: local.score,
      feedbackUz: pronunciationFeedback(local.score, pinyin, "uz"),
      feedbackRu: pronunciationFeedback(local.score, pinyin, "ru"),
      normalizedTarget: local.normalizedTarget,
      normalizedUserSpeech: local.normalizedUserSpeech
    };

    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        const response = await fetch("/api/pronunciation-check", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ targetHanzi: hanzi, targetPinyin: pinyin, recognizedText: recognized, hskLevel })
        });
        const apiResult = (await response.json()) as CheckResponse;
        if (response.status === 429 && apiResult.code === "daily_ai_limit_reached") {
          setError([apiResult.error, apiResult.detail].filter(Boolean).join(". "));
          return;
        }
        if (response.ok) {
          checked = apiResult;
          if (apiResult.usage?.fallback) recordLocalAIUsage("pronunciation_check");
        }
      }
    } catch {
      // Local scoring still keeps the practice flow usable when the session check fails.
    } finally {
      setChecking(false);
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setResult(checked);
    const saved: SpeakingPracticeResult = {
      id: `speaking-${wordId}-${Date.now()}`,
      wordId,
      lessonId,
      hskLevel,
      targetHanzi: hanzi,
      targetPinyin: pinyin,
      recognizedText: recognized,
      score: checked.score,
      isCorrect: checked.isCorrect,
      attempts: nextAttempts,
      createdAt: new Date().toISOString()
    };

    if (checked.isCorrect) {
      onCorrect?.(saved);
      window.setTimeout(() => onNext?.(), 700);
    } else {
      onWrong?.(saved);
    }
  }

  async function startMic() {
    if (!hasSpeechRecognition()) {
      setError(language === "ru" ? "Ваш браузер не поддерживает распознавание речи" : "Brauzeringiz ovoz tanishni qo‘llab-quvvatlamaydi");
      return;
    }

    setListening(true);
    setResult(null);
    setError(null);
    try {
      const transcript = await listenChineseSpeech();
      if (!transcript) {
        setError(language === "ru" ? "Речь не распознана. Попробуйте ещё раз." : "Ovoz aniqlanmadi. Qayta urinib ko‘ring.");
        return;
      }
      setRecognizedText(transcript);
      await check(transcript);
    } catch {
      setError(language === "ru" ? "Разрешите доступ к микрофону" : "Mikrofon uchun ruxsat bering");
    } finally {
      setListening(false);
    }
  }

  function manualPractice() {
    setResult(null);
    setError(language === "ru" ? "Практика без микрофона не оценивается. Для результата используйте голосовой ввод." : "Mikrofonsiz mashq baholanmaydi. Natija uchun ovozli kiritishdan foydalaning.");
  }

  return (
    <div className="rounded-[2.5rem] border border-orange-soft/70 bg-white/88 p-6 shadow-premium backdrop-blur-xl">
      <div className="grid gap-5 sm:grid-cols-[0.85fr_1.15fr] sm:items-center">
        <div className="rounded-[2rem] bg-gradient-to-br from-cream to-orange-soft p-6 text-center shadow-soft">
          <p className="text-[5rem] font-black leading-none text-ink">{hanzi}</p>
          <p className="mt-3 text-2xl font-black text-orange-brand">{pinyin}</p>
          <p className="mt-2 text-base font-bold text-stone-600">{translation}</p>
        </div>
        <div>
          <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Практика произношения" : "Gapirib mashq qilish"}</p>
          <h3 className="mt-1 text-3xl font-black text-ink">{language === "ru" ? "Прослушайте слово" : "So‘zni eshiting"}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">{language === "ru" ? "Теперь повторите слово через микрофон." : "Endi siz mikrofon orqali so‘zni takrorlang."}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button onClick={play} className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-black text-ink shadow-soft">
              <Volume2 className="h-5 w-5 text-orange-brand" /> {language === "ru" ? "Прослушать снова" : "Qayta eshitish"}
            </button>
            <button onClick={startMic} disabled={listening || checking} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-5 py-3 text-sm font-black text-white shadow-card disabled:opacity-70">
              {listening || checking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
              {listening ? (language === "ru" ? "Вы говорите..." : "Gapiryapsiz...") : checking ? (language === "ru" ? "Проверяем..." : "Tekshirilmoqda...") : language === "ru" ? "Нажмите на микрофон" : "Mikrofonni bosing"}
            </button>
          </div>
          <button onClick={manualPractice} className="mt-3 text-sm font-black text-stone-500 hover:text-orange-deep">
            {language === "ru" ? "Я потренировался" : "Mashq qildim"}
          </button>
        </div>
      </div>

      {recognizedText ? <p className="mt-4 rounded-3xl bg-cream px-4 py-3 text-sm font-black text-stone-600">{recognizedText}</p> : null}
      {error ? <p className="mt-4 rounded-3xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{error}</p> : null}
      {result ? (
        <div className="mt-4">
          <PronunciationResult
            score={result.score}
            isCorrect={result.isCorrect}
            feedback={language === "ru" ? result.feedbackRu : result.feedbackUz}
            onRetry={() => {
              setResult(null);
              setRecognizedText("");
            }}
            onNext={onNext}
          />
        </div>
      ) : null}
    </div>
  );
}
