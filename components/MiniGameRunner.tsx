"use client";

import { Gamepad2, RotateCcw, Timer, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { hskWords } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import { getWordTranslation, useI18n } from "@/utils/i18n";
import { speakChinese } from "@/utils/speechSynthesis";

type GameType = "matching" | "speed-quiz" | "memory" | "audio-match";

export function MiniGameRunner({ gameType }: { gameType: GameType }) {
  const { language } = useI18n();
  const saveGameResult = useProgressStore((state) => state.saveGameResult);
  const markKnown = useProgressStore((state) => state.markKnown);
  const markWeak = useProgressStore((state) => state.markWeak);
  const words = useMemo(() => hskWords.filter((word) => word.hskLevel <= 3).slice(0, 20), []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const word = words[index];
  const title = {
    matching: language === "ru" ? "Сопоставление слов" : "So‘zlarni moslashtirish",
    "speed-quiz": language === "ru" ? "Быстрый тест" : "Tezkor test",
    memory: language === "ru" ? "Карты памяти" : "Xotira kartalari",
    "audio-match": language === "ru" ? "Аудио-сопоставление" : "Audio moslashtirish"
  }[gameType];
  const options = word ? [getWordTranslation(word, language), ...hskWords.filter((item) => item.id !== word.id).slice(index, index + 6).map((item) => getWordTranslation(item, language))].filter((value, optionIndex, array) => array.indexOf(value) === optionIndex).slice(0, 4) : [];
  const correct = word ? getWordTranslation(word, language) : "";

  function choose(option: string) {
    if (!word || selected) return;
    setSelected(option);
    if (option === correct) {
      setScore((value) => value + 1);
      markKnown(word.id);
    } else {
      markWeak(word.id);
    }
  }

  function next() {
    if (index + 1 >= 10) {
      const xp = score * 20;
      saveGameResult({ id: `${gameType}-${Date.now()}`, gameType, hskLevel: 1, score, xp, completedAt: new Date().toISOString() });
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  return (
    <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Игры" : "O‘yinlar"}</p>
        <h1 className="mt-2 text-5xl font-black text-ink">{title}</h1>
      </div>
      {finished ? (
        <div className="rounded-[2.5rem] bg-white/88 p-10 text-center shadow-premium">
          <Trophy className="mx-auto mb-5 h-16 w-16 text-orange-brand" />
          <h2 className="text-5xl font-black text-ink">{language === "ru" ? "Счёт" : "Hisob"}: {score}/10</h2>
          <p className="mt-3 text-xl font-black text-orange-deep">{language === "ru" ? "XP получен" : "XP olindi"}: {score * 20}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => { setIndex(0); setScore(0); setFinished(false); setSelected(null); }} className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-black text-ink shadow-soft">
              <RotateCcw className="h-5 w-5" /> {language === "ru" ? "Играть снова" : "Yana o‘ynash"}
            </button>
            <AppButton href="/games" variant="primary">{language === "ru" ? "Игры" : "O‘yinlar"}</AppButton>
          </div>
        </div>
      ) : word ? (
        <div className="rounded-[2.5rem] bg-white/88 p-7 shadow-premium sm:p-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep"><Gamepad2 className="h-4 w-4" /> {index + 1}/10</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-black text-stone-600 shadow-soft"><Timer className="h-4 w-4 text-orange-brand" /> {language === "ru" ? "Время" : "Vaqt"}</span>
          </div>
          <button onClick={() => gameType === "audio-match" && speakChinese(word.chinese)} className="block w-full rounded-[2rem] bg-gradient-to-br from-cream to-orange-soft p-8 text-center shadow-soft">
            <p className="text-7xl font-black text-ink">{gameType === "audio-match" ? "听" : word.chinese}</p>
            <p className="mt-3 text-xl font-black text-orange-brand">{gameType === "matching" ? word.pinyin : language === "ru" ? "Выберите ответ" : "Javobni tanlang"}</p>
          </button>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {options.map((option) => {
              const isCorrect = selected && option === correct;
              const isWrong = selected === option && option !== correct;
              return (
                <button key={option} onClick={() => choose(option)} className={`rounded-4xl p-4 text-left text-sm font-black shadow-soft ${
                  isCorrect ? "bg-orange-soft text-orange-deep" : isWrong ? "bg-rose-50 text-rose-700" : "bg-cream text-ink"
                }`}>
                  {option}
                </button>
              );
            })}
          </div>
          {selected ? <button onClick={next} className="mt-6 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-card">{language === "ru" ? "Далее" : "Keyingi"}</button> : null}
        </div>
      ) : null}
    </section>
  );
}
