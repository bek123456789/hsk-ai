"use client";

import { Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { GrammarVisualizer } from "@/components/GrammarVisualizer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getSentenceBuilderByLevel } from "@/data/hsk/contentIndex";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { saveOptionalFeatureResult } from "@/utils/featureProgressSync";

export default function SentenceBuilderPage() {
  const { language } = useI18n();
  const addMistake = useProgressStore((state) => state.addMistake);
  const saveLearningActivity = useProgressStore((state) => state.saveLearningActivity);
  const currentLevel = useProgressStore((state) => state.currentLevel);
  const [level, setLevel] = useState<HSKLevel>(currentLevel ?? 1);
  const items = useMemo(() => getSentenceBuilderByLevel(level), [level]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const item = items[index];
  const parts = (item?.chunks ?? ["我", "今天", "学习", "汉语"]).map((text, partIndex) => ({ id: `${text}-${partIndex}`, text })).sort((a, b) => a.text.localeCompare(b.text));
  const correct = item?.sentenceZh ?? "我今天学习汉语";
  const joined = answer.join("");
  const submitted = checked;

  function submit() {
    if (!item || answer.length !== item.chunks.length) return;
    setChecked(true);
    const isCorrect = joined === correct;
    saveLearningActivity({ id: `sentence-${Date.now()}`, type: "sentence-builder", hskLevel: item.level, score: isCorrect ? 1 : 0, total: 1, completedAt: new Date().toISOString() });
    const localItem = {
      id: `sentence-builder-${Date.now()}`,
      item_id: item.id,
      level: item.level,
      answer: joined,
      correct_answer: correct,
      correct: isCorrect,
      created_at: new Date().toISOString()
    };
    void saveOptionalFeatureResult({
      localKey: "hanziflow_sentence_builder_results",
      table: "sentence_builder_results",
      localItem,
      supabasePayload: {
        item_id: item.id,
        level: item.level,
        answer: joined,
        correct_answer: correct,
        correct: isCorrect
      }
    });
    if (!isCorrect) {
      addMistake({ source: "sentence-builder", hskLevel: item.level, chinese: correct, pinyin: item.sentencePinyin, wrongAnswer: joined, correctAnswer: correct, explanation: language === "ru" ? item.explanationRu : item.explanationUz });
    }
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="rounded-[2.5rem] bg-white/88 p-7 shadow-premium sm:p-10">
          <Shuffle className="mb-5 h-12 w-12 text-orange-brand" />
          <h1 className="text-5xl font-black text-ink">{language === "ru" ? "Составьте предложение" : "Gap tuzing"}</h1>
          <p className="mt-4 text-lg font-semibold text-stone-600">{language === "ru" ? "Поставьте слова в правильном порядке и проверьте ответ." : "So‘zlarni to‘g‘ri tartibga qo‘ying va javobni tekshiring."}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {([1, 2, 3, 4, 5, 6] as HSKLevel[]).map((item) => (
              <button key={item} onClick={() => { setLevel(item); setIndex(0); setAnswer([]); setChecked(false); }} className={`rounded-full px-4 py-2 text-xs font-black ${level === item ? "bg-orange-brand text-white" : "bg-cream text-stone-600"}`}>HSK {item}</button>
            ))}
          </div>
          <div className="mt-7 rounded-[1.5rem] bg-orange-soft/55 p-5">
            <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Значение" : "Ma’no"}</p>
            <p className="mt-2 text-lg font-black text-ink">{language === "ru" ? item?.sentenceRu : item?.sentenceUz}</p>
          </div>
          <div className="mt-7 min-h-20 rounded-[2rem] bg-cream p-5 text-3xl font-black text-ink shadow-inner">{joined || "..."}</div>
          <div className="mt-5 flex flex-wrap gap-3">
            {parts.map((part) => (
              <button key={part.id} disabled={checked || answer.filter((item) => item === part.text).length >= parts.filter((item) => item.text === part.text).length} onClick={() => setAnswer((current) => [...current, part.text])} className="rounded-full bg-orange-soft px-5 py-3 text-xl font-black text-orange-deep shadow-soft disabled:opacity-35">{part.text}</button>
            ))}
          </div>
          {submitted ? (
            <div className="mt-5 space-y-4">
              <p className={`rounded-3xl p-4 text-sm font-black ${joined === correct ? "bg-orange-soft text-orange-deep" : "bg-rose-50 text-rose-700"}`}>
                {joined === correct ? (language === "ru" ? "Правильный порядок" : "To‘g‘ri tartib") : `${language === "ru" ? "Неправильный порядок" : "Noto‘g‘ri tartib"}: ${correct}`}
              </p>
              <GrammarVisualizer sentence={correct} language={language} />
              <p className="rounded-3xl bg-cream p-4 text-sm font-semibold leading-6 text-stone-700">
                <b>{language === "ru" ? "Объяснение грамматики" : "Grammatika izohi"}:</b> {language === "ru" ? item?.explanationRu : item?.explanationUz}
              </p>
            </div>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <AppButton onClick={submit} disabled={answer.length !== (item?.chunks.length ?? 4) || checked}>{language === "ru" ? "Проверить ответ" : "Javobni tekshirish"}</AppButton>
            <AppButton onClick={() => { setAnswer([]); setChecked(false); }} variant="secondary">{language === "ru" ? "Повторить" : "Qayta urinish"}</AppButton>
            <AppButton onClick={() => { setAnswer([]); setChecked(false); setIndex((value) => (value + 1) % items.length); }} variant="secondary">{language === "ru" ? "Далее" : "Keyingi"}</AppButton>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
