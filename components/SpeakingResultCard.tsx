"use client";

import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import type { AppLanguage } from "@/types";
import type { SpeakingEvaluationResult } from "@/utils/speakingProgress";

export function SpeakingResultCard({ result, language, onRetry, onNext }: { result: SpeakingEvaluationResult; language: AppLanguage; onRetry: () => void; onNext: () => void }) {
  const feedback = language === "ru" ? result.feedbackRu : result.feedbackUz;
  const explanation = language === "ru" ? result.explanationRu : result.explanationUz;
  const missing = language === "ru" ? result.missingPointsRu : result.missingPointsUz;
  const good = language === "ru" ? result.goodPointsRu : result.goodPointsUz;
  const tip = language === "ru" ? result.nextTipRu : result.nextTipUz;

  return (
    <div className={`rounded-[2rem] p-5 shadow-soft ${result.done ? "bg-emerald-50 text-emerald-900" : "bg-orange-soft/70 text-ink"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {result.done ? <CheckCircle2 className="h-7 w-7 text-emerald-600" /> : <Sparkles className="h-7 w-7 text-orange-deep" />}
          <div>
            <p className="text-sm font-black">{result.done ? (language === "ru" ? "Смысл понят правильно" : "Mazmun to‘g‘ri tushunilgan") : (language === "ru" ? "Смысл пока раскрыт не полностью" : "Mazmun hali to‘liq emas")}</p>
            <p className="text-3xl font-black">{result.score}%</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-black sm:grid-cols-4">
          <span>{language === "ru" ? "Смысл" : "Mazmun"} {result.meaningScore}%</span>
          <span>{language === "ru" ? "Грамматика" : "Grammatika"} {result.grammarScore}%</span>
          <span>{language === "ru" ? "Слова" : "So‘zlar"} {result.vocabularyScore}%</span>
          <span>{language === "ru" ? "Плавность" : "Ravonlik"} {result.fluencyScore}%</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-bold leading-6">{feedback}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-stone-700">{explanation}</p>
      {result.correctedAnswerZh ? (
        <div className="mt-4 rounded-3xl bg-white/80 p-4">
          <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Исправленный ответ" : "Tuzatilgan javob"}</p>
          <p className="mt-2 text-2xl font-black text-ink">{result.correctedAnswerZh}</p>
          {result.correctedAnswerPinyin ? <p className="mt-1 font-bold text-orange-brand">{result.correctedAnswerPinyin}</p> : null}
        </div>
      ) : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-3xl bg-white/70 p-4">
          <p className="text-sm font-black text-emerald-700">{language === "ru" ? "Хорошо" : "Yaxshi tomonlar"}</p>
          <ul className="mt-2 space-y-1 text-sm font-semibold">{good.length ? good.map((item) => <li key={item}>{item}</li>) : <li>{language === "ru" ? "Ответ принят." : "Javob qabul qilindi."}</li>}</ul>
        </div>
        <div className="rounded-3xl bg-white/70 p-4">
          <p className="text-sm font-black text-rose-700">{language === "ru" ? "Нужно добавить" : "Qo‘shish kerak"}</p>
          <ul className="mt-2 space-y-1 text-sm font-semibold">{missing.length ? missing.map((item) => <li key={item}>{item}</li>) : <li>{language === "ru" ? "Серьёзных пропусков нет." : "Katta kamchilik yo‘q."}</li>}</ul>
        </div>
      </div>
      <p className="mt-4 rounded-3xl bg-white/70 p-4 text-sm font-black text-stone-700">{tip}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <AppButton onClick={onRetry} variant="secondary"><RotateCcw className="h-4 w-4" /> {language === "ru" ? "Попробовать снова" : "Qayta urinib ko‘rish"}</AppButton>
        <AppButton onClick={onNext}>{language === "ru" ? "Следующее задание" : "Keyingi vazifa"}</AppButton>
      </div>
    </div>
  );
}
