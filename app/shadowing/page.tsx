"use client";

import { Headphones, Mic, RotateCcw, Send, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { saveOptionalFeatureResult } from "@/utils/featureProgressSync";
import { getShadowingSentences, normalizeHanzi } from "@/utils/hanziTools";
import { useI18n } from "@/utils/i18n";
import { hasSpeechRecognition, listenChineseSpeech } from "@/utils/speechRecognition";
import { speakChinese } from "@/utils/speechSynthesis";

function missingCharacters(target: string, answer: string) {
  const answerSet = new Set(Array.from(normalizeHanzi(answer)));
  return Array.from(normalizeHanzi(target)).filter((char) => !answerSet.has(char));
}

function scoreShadowing(target: string, answer: string) {
  const cleanTarget = normalizeHanzi(target);
  const cleanAnswer = normalizeHanzi(answer);
  if (!cleanAnswer) return 0;
  const matched = Array.from(cleanTarget).filter((char) => cleanAnswer.includes(char)).length;
  const lengthPenalty = Math.min(1, cleanAnswer.length / Math.max(1, cleanTarget.length));
  return Math.round((matched / Math.max(1, cleanTarget.length)) * 75 + lengthPenalty * 25);
}

export default function ShadowingPage() {
  const { language } = useI18n();
  const currentLevel = useProgressStore((state) => state.currentLevel);
  const addMistake = useProgressStore((state) => state.addMistake);
  const saveLearningActivity = useProgressStore((state) => state.saveLearningActivity);
  const [level, setLevel] = useState<HSKLevel>(currentLevel ?? 1);
  const sentences = useMemo(() => getShadowingSentences(level), [level]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [listening, setListening] = useState(false);
  const [showText, setShowText] = useState(true);
  const item = sentences[index % Math.max(1, sentences.length)];
  const score = checked && item ? scoreShadowing(item.zh, answer) : 0;
  const missing = checked && item ? missingCharacters(item.zh, answer).slice(0, 8) : [];

  async function useVoice() {
    setListening(true);
    try {
      const transcript = await listenChineseSpeech();
      setAnswer(transcript);
    } catch {
      setAnswer((current) => current);
    } finally {
      setListening(false);
    }
  }

  function submit() {
    if (!item) return;
    const finalScore = scoreShadowing(item.zh, answer);
    setChecked(true);
    saveLearningActivity({ id: `shadowing-${Date.now()}`, type: "shadowing", hskLevel: item.level, score: finalScore, total: 100, completedAt: new Date().toISOString() });
    const localItem = {
      id: `shadowing-${Date.now()}`,
      source_id: item.id,
      level: item.level,
      answer,
      score: finalScore,
      done: finalScore >= 70,
      created_at: new Date().toISOString()
    };
    void saveOptionalFeatureResult({
      localKey: "hanziflow_shadowing_results",
      table: "shadowing_results",
      localItem,
      supabasePayload: {
        source_id: item.id,
        level: item.level,
        answer,
        score: finalScore,
        done: finalScore >= 70
      }
    });
    if (finalScore < 70) {
      addMistake({
        source: "shadowing",
        hskLevel: item.level,
        chinese: item.zh,
        pinyin: item.pinyin,
        wrongAnswer: answer || (language === "ru" ? "Пустой ответ" : "Bo‘sh javob"),
        correctAnswer: item.zh,
        explanation: language === "ru" ? "Повторите фразу полностью и сохраните порядок слов." : "Gapni to‘liq takrorlang va so‘z tartibini saqlang."
      });
    }
  }

  function next() {
    setAnswer("");
    setChecked(false);
    setIndex((value) => (value + 1) % Math.max(1, sentences.length));
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Повторяйте за диктором" : "Ortimizdan takrorlang"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Слушайте китайскую фразу, повторяйте голосом или текстом и смотрите пропущенные слова." : "Xitoycha gapni eshiting, ovoz yoki matn bilan takrorlang va yetishmagan so‘zlarni ko‘ring."}
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {([1, 2, 3, 4, 5, 6] as HSKLevel[]).map((itemLevel) => (
                <button key={itemLevel} onClick={() => { setLevel(itemLevel); setIndex(0); setAnswer(""); setChecked(false); }} className={`rounded-full px-4 py-2 text-xs font-black ${level === itemLevel ? "bg-orange-brand text-white" : "bg-cream text-stone-600"}`}>HSK {itemLevel}</button>
              ))}
            </div>
            <button onClick={() => setShowText((value) => !value)} className="rounded-full bg-orange-soft px-4 py-2 text-xs font-black text-orange-deep">
              {showText ? (language === "ru" ? "Скрыть текст" : "Matnni yashirish") : (language === "ru" ? "Показать текст" : "Matnni ko‘rish")}
            </button>
          </div>

          <div className="mt-6 rounded-[2rem] bg-cream p-6">
            <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Послушайте" : "Eshiting"}</p>
            <p className="mt-3 text-3xl font-black leading-relaxed text-ink sm:text-4xl">{showText ? item?.zh : "••••••••"}</p>
            {checked || showText ? <p className="mt-2 font-black leading-7 text-orange-brand">{item?.pinyin}</p> : null}
            {checked ? <p className="mt-2 font-semibold leading-7 text-stone-700">{language === "ru" ? item?.ru : item?.uz}</p> : null}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <AppButton onClick={() => item ? speakChinese(item.zh) : undefined} variant="secondary"><Volume2 className="h-5 w-5" /> {language === "ru" ? "Послушать" : "Eshitish"}</AppButton>
            <AppButton onClick={useVoice} disabled={!hasSpeechRecognition() || listening} variant="secondary"><Mic className="h-5 w-5" /> {listening ? (language === "ru" ? "Слушаем..." : "Tinglanmoqda...") : (language === "ru" ? "Повторить голосом" : "Ovoz bilan takrorlash")}</AppButton>
          </div>

          <label className="mt-6 block text-sm font-black text-stone-600">
            {language === "ru" ? "Повторите" : "Takrorlang"}
            <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={4} className="warm-focus mt-3 w-full resize-none rounded-[1.5rem] border border-orange-soft bg-white p-4 text-xl font-black text-ink outline-none" placeholder="我学习汉语" />
          </label>

          {checked ? (
            <div className="mt-5 rounded-[1.5rem] bg-orange-soft/65 p-5">
              <p className="text-lg font-black text-ink">{language === "ru" ? "Результат" : "Natija"}: {score}%</p>
              <p className="mt-2 font-semibold leading-7 text-stone-700">
                {missing.length ? `${language === "ru" ? "Пропущенные слова" : "Yetishmagan so‘zlar"}: ${missing.join(" ")}` : (language === "ru" ? "Фраза хорошо совпадает." : "Gap yaxshi mos keldi.")}
              </p>
            </div>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <AppButton onClick={submit} disabled={!answer.trim()}><Send className="h-5 w-5" /> {language === "ru" ? "Проверить" : "Tekshirish"}</AppButton>
            <AppButton onClick={next} variant="secondary"><RotateCcw className="h-5 w-5" /> {language === "ru" ? "Попробовать снова" : "Yana urinib ko‘rish"}</AppButton>
            <AppButton href="/listening" variant="secondary"><Headphones className="h-5 w-5" /> {language === "ru" ? "Аудирование" : "Tinglash"}</AppButton>
          </div>
        </Card>
      </section>
    </ProtectedRoute>
  );
}
