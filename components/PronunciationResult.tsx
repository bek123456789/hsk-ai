"use client";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useI18n } from "@/utils/i18n";

export function PronunciationResult({
  score,
  isCorrect,
  feedback,
  onRetry,
  onNext
}: {
  score: number;
  isCorrect: boolean;
  feedback: string;
  onRetry: () => void;
  onNext?: () => void;
}) {
  const { language } = useI18n();
  const label = isCorrect ? (language === "ru" ? "Вы произнесли правильно" : "To‘g‘ri aytdingiz") : language === "ru" ? "Попробуйте ещё раз" : "Yana urinib ko‘ring";

  return (
    <div className={`rounded-[2rem] border p-5 shadow-soft ${isCorrect ? "border-orange-soft bg-orange-soft/80 text-orange-deep" : "border-rose-100 bg-rose-50 text-rose-700"}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-soft">
          {isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-black">{label}</p>
          <p className="mt-1 text-sm font-bold leading-6">{feedback}</p>
          <div className="mt-3 h-2 rounded-full bg-white/70">
            <div className="h-2 rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${Math.max(6, Math.min(100, score))}%` }} />
          </div>
          <p className="mt-2 text-xs font-black">{score}%</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button onClick={onRetry} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/85 px-4 py-2.5 text-sm font-black shadow-soft">
          <RotateCcw className="h-4 w-4" /> {language === "ru" ? "Повторить" : "Qayta urinish"}
        </button>
        {onNext ? (
          <button onClick={onNext} className="rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-4 py-2.5 text-sm font-black text-white shadow-card">
            {language === "ru" ? "Следующее слово" : "Keyingi so‘z"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
