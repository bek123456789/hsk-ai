"use client";

import { CheckCircle2, Headphones, RefreshCcw, Volume2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { saveOptionalFeatureResult } from "@/utils/featureProgressSync";
import { getPrimaryTone, getTonePracticeWords, toneExplanation, toneLabel } from "@/utils/hanziTools";
import { useI18n } from "@/utils/i18n";
import { speakChinese } from "@/utils/speechSynthesis";

const tones = [1, 2, 3, 4, 5] as const;

function dateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ToneTrainerPage() {
  const { language } = useI18n();
  const addMistake = useProgressStore((state) => state.addMistake);
  const saveLearningActivity = useProgressStore((state) => state.saveLearningActivity);
  const [level, setLevel] = useState<HSKLevel>(1);
  const words = useMemo(() => getTonePracticeWords(level, 24), [level]);
  const [index, setIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const word = words[index % Math.max(1, words.length)];
  const correctTone = word ? getPrimaryTone(word.pinyin) : 1;
  const correct = checked && selectedTone === correctTone;

  function checkTone(tone: number) {
    if (!word || checked) return;
    setSelectedTone(tone);
    setChecked(true);
    const isCorrect = tone === correctTone;
    saveLearningActivity({
      id: dateId("tone"),
      type: "tone-trainer",
      hskLevel: word.level,
      score: isCorrect ? 1 : 0,
      total: 1,
      completedAt: new Date().toISOString()
    });
    const localItem = {
      id: dateId("tone-result"),
      word_id: word.id,
      level: word.level,
      selected_tone: tone,
      correct_tone: correctTone,
      correct: isCorrect,
      created_at: new Date().toISOString()
    };
    void saveOptionalFeatureResult({
      localKey: "hanziflow_tone_practice_results",
      table: "tone_practice_results",
      localItem,
      supabasePayload: {
        word_id: word.id,
        level: word.level,
        selected_tone: tone,
        correct_tone: correctTone,
        correct: isCorrect
      }
    });
    if (!isCorrect) {
      addMistake({
        source: "tone-trainer",
        hskLevel: word.level,
        chinese: word.hanzi,
        pinyin: word.pinyin,
        wrongAnswer: toneLabel(tone, language),
        correctAnswer: toneLabel(correctTone, language),
        explanation: toneExplanation(correctTone, language),
        wordId: word.id
      });
    }
  }

  function next() {
    setChecked(false);
    setSelectedTone(null);
    setIndex((value) => (value + 1) % Math.max(1, words.length));
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Тренировка тонов" : "Ton mashqi"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Слушайте слово, выбирайте тон и сразу исправляйте ошибки." : "So‘zni eshiting, tonni tanlang va xatoni darhol tuzating."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Послушайте и выберите тон" : "Eshiting va tonni tanlang"}</p>
                <h2 className="mt-3 text-7xl font-black text-ink sm:text-8xl">{word?.hanzi ?? "你"}</h2>
                <p className="mt-3 text-2xl font-black text-orange-brand">{checked ? word?.pinyin : "•••"}</p>
              </div>
              <button onClick={() => word ? speakChinese(word.hanzi) : undefined} className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-orange-soft text-orange-deep shadow-soft">
                <Volume2 className="h-7 w-7" />
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-5">
              {tones.map((tone) => {
                const active = selectedTone === tone;
                const state = checked && tone === correctTone ? "border-emerald-300 bg-emerald-50 text-emerald-700" : checked && active ? "border-rose-300 bg-rose-50 text-rose-700" : active ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-orange-soft bg-white text-ink hover:bg-orange-soft/50";
                return (
                  <button key={tone} onClick={() => checkTone(tone)} className={`min-h-24 rounded-[1.5rem] border p-3 text-center font-black transition ${state}`}>
                    <span className="block text-2xl">{tone === 5 ? "轻" : tone}</span>
                    <span className="mt-2 block text-xs">{toneLabel(tone, language)}</span>
                  </button>
                );
              })}
            </div>

            {checked ? (
              <div className={`mt-6 rounded-[1.5rem] p-5 ${correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                <p className="flex items-center gap-2 text-lg font-black">
                  {correct ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                  {correct ? (language === "ru" ? "Правильно" : "To‘g‘ri") : (language === "ru" ? "Ошибка" : "Xato")}
                </p>
                <p className="mt-2 font-semibold leading-7">
                  {language === "ru" ? "Правильный ответ" : "To‘g‘ri javob"}: {toneLabel(correctTone, language)}. {toneExplanation(correctTone, language)}
                </p>
              </div>
            ) : null}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AppButton onClick={() => word ? speakChinese(word.hanzi) : undefined} variant="secondary"><Headphones className="h-5 w-5" /> {language === "ru" ? "Слушать ещё" : "Qayta eshitish"}</AppButton>
              <AppButton onClick={next} disabled={!checked}><RefreshCcw className="h-5 w-5" /> {language === "ru" ? "Следующее слово" : "Keyingi so‘z"}</AppButton>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Режимы" : "Rejimlar"}</p>
            <div className="mt-4 space-y-3">
              {[language === "ru" ? "Слушать и выбрать тон" : "Eshitib tonni tanlash", language === "ru" ? "Правильный pinyin" : "To‘g‘ri pinyin belgisi", language === "ru" ? "Похожие тоны" : "O‘xshash tonlar", language === "ru" ? "Пары тонов" : "Ton juftliklari"].map((mode, modeIndex) => (
                <div key={mode} className={`rounded-2xl p-4 text-sm font-black ${modeIndex === 0 ? "bg-orange-soft text-orange-deep" : "bg-cream text-stone-600"}`}>
                  {mode}
                </div>
              ))}
            </div>
            <label className="mt-6 block text-sm font-black text-stone-600">
              HSK
              <select value={level} onChange={(event) => { setLevel(Number(event.target.value) as HSKLevel); setIndex(0); setChecked(false); setSelectedTone(null); }} className="mt-2 w-full rounded-2xl border border-orange-soft bg-cream px-4 py-3 font-black text-ink">
                {([1, 2, 3, 4, 5, 6] as HSKLevel[]).map((item) => <option key={item} value={item}>HSK {item}</option>)}
              </select>
            </label>
          </Card>
        </div>
      </section>
    </ProtectedRoute>
  );
}
