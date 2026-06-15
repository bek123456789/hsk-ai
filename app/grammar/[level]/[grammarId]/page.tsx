"use client";

import { ArrowLeft, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ReportContentButton } from "@/components/ReportContentButton";
import { getGrammarByLevel } from "@/data/hskGrammar";
import { useProgressStore } from "@/store/progressStore";
import { parseHskLevel } from "@/utils/level";
import { useI18n } from "@/utils/i18n";

export default function GrammarDetailPage() {
  const params = useParams();
  const level = parseHskLevel(params.level);
  const grammarId = Array.isArray(params.grammarId) ? params.grammarId[0] : params.grammarId;
  const { language } = useI18n();
  const addMistake = useProgressStore((state) => state.addMistake);
  const item = getGrammarByLevel(level).find((candidate) => candidate.grammarId === grammarId) ?? getGrammarByLevel(level)[0];
  const [selected, setSelected] = useState<string | null>(null);
  const question = item?.practiceQuestions[0];
  const example = item?.chineseExamples[0];
  const options = item ? [item.structure, "主语 + 随机 + 名词", "动词 + 动词 + 吗", "时间 + 的 + 人"] : [];

  function choose(option: string) {
    if (!item || selected) return;
    setSelected(option);
    if (option !== item.structure) {
      addMistake({
        source: "grammar",
        hskLevel: level,
        chinese: example?.chinese ?? item.structure,
        pinyin: example?.pinyin,
        wrongAnswer: option,
        correctAnswer: item.structure,
        explanation: language === "ru" ? item.explanationRu : item.explanationUz
      });
    }
  }

  if (!item) return null;

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-6">
          <AppButton href={`/grammar/${level}`} variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> HSK {level}</AppButton>
        </div>
        <div className="rounded-[2.5rem] border border-white/70 bg-white/88 p-7 shadow-premium backdrop-blur-xl sm:p-10">
          <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Тренажёр грамматики" : "Grammatika mashqi"}</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? item.titleRu : item.titleUz}</h1>
          <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] bg-cream p-6 shadow-soft">
              <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Структура" : "Tuzilma"}</p>
              <p className="mt-2 text-3xl font-black text-ink">{item.structure}</p>
              <p className="mt-4 text-sm font-semibold leading-7 text-stone-600">{language === "ru" ? item.explanationRu : item.explanationUz}</p>
            </div>
            <div className="rounded-[2rem] bg-white/80 p-6 shadow-soft">
              <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Примеры" : "Misollar"}</p>
              {item.chineseExamples.map((sample) => (
                <div key={sample.chinese} className="mt-4 rounded-3xl bg-cream p-4">
                  <p className="text-2xl font-black text-ink">{sample.chinese}</p>
                  <p className="mt-1 text-sm font-black text-orange-brand">{sample.pinyin}</p>
                  <p className="mt-2 text-sm font-semibold text-stone-600">{language === "ru" ? sample.ru : sample.uz}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-[2rem] bg-orange-soft/70 p-6 shadow-soft">
            <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Частые ошибки" : "Ko‘p uchraydigan xatolar"}</p>
            <ul className="mt-3 space-y-2 text-sm font-bold leading-6 text-stone-700">
              {item.commonMistakes.map((mistake) => <li key={mistake.uz}>{language === "ru" ? mistake.ru : mistake.uz}</li>)}
            </ul>
          </div>
          <div className="mt-6 rounded-[2rem] bg-white/80 p-6 shadow-soft">
            <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Упражнения" : "Mashqlar"}</p>
            <h2 className="mt-2 text-2xl font-black text-ink">{language === "ru" ? question?.questionRu : question?.questionUz}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {options.map((option) => {
                const correct = selected && option === item.structure;
                const wrong = selected === option && option !== item.structure;
                return (
                  <button key={option} onClick={() => choose(option)} className={`flex items-center justify-between rounded-3xl p-4 text-left text-sm font-black shadow-soft ${
                    correct ? "bg-orange-soft text-orange-deep" : wrong ? "bg-rose-50 text-rose-700" : "bg-cream text-ink"
                  }`}>
                    {option}
                    {correct ? <CheckCircle2 className="h-5 w-5" /> : wrong ? <XCircle className="h-5 w-5" /> : null}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <AppButton href={`/ai-tutor`} variant="secondary"><Sparkles className="h-5 w-5" /> {language === "ru" ? "Объяснить с AI" : "AI tushuntirsin"}</AppButton>
              <ReportContentButton itemId={item.grammarId} itemType="grammar" hskLevel={level} />
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
