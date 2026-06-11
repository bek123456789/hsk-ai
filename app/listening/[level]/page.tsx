"use client";

import { Check, Volume2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getWordsByLevel, hskWords } from "@/data/hskWords";
import { saveMistake as saveRemoteMistake, saveWeakWord, saveWordProgress } from "@/lib/progressService";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel, HSKWord } from "@/types";
import { getWordTranslation, useI18n } from "@/utils/i18n";

function parseLevel(value: string | string[] | undefined): HSKLevel {
  const raw = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(raw);
  return numberValue >= 1 && numberValue <= 6 ? (numberValue as HSKLevel) : 1;
}

function makeOptions(word: HSKWord, language: "uz" | "ru") {
  return Array.from(new Set([getWordTranslation(word, language), ...hskWords.filter((item) => item.id !== word.id).slice(0, 8).map((item) => getWordTranslation(item, language))])).slice(0, 4);
}

export default function ListeningPage() {
  const params = useParams();
  const level = parseLevel(params.level);
  const { language, t } = useI18n();
  const words = useMemo(() => getWordsByLevel(level), [level]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const markKnown = useProgressStore((state) => state.markKnown);
  const markWeak = useProgressStore((state) => state.markWeak);
  const addMistake = useProgressStore((state) => state.addMistake);
  const user = useAuthStore((state) => state.user);
  const word = words[index] ?? words[0];
  const options = word ? makeOptions(word, language) : [];
  const correct = word ? getWordTranslation(word, language) : "";

  function speak() {
    if (!word || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(word.chinese);
    utterance.lang = "zh-CN";
    window.speechSynthesis.speak(utterance);
  }

  function choose(option: string) {
    if (!word || selected) return;
    setSelected(option);
    if (option === correct) {
      markKnown(word.id);
      saveWordProgress({ userId: user?.id, wordId: word.id, hskLevel: level, lessonId: word.lessonId, status: "review", correctCount: 1, lastReviewedAt: new Date().toISOString() }).catch(() => undefined);
    }
    else {
      markWeak(word.id);
      saveWeakWord({ userId: user?.id, wordId: word.id, hskLevel: level, lessonId: word.lessonId, reason: "listening" }).catch(() => undefined);
      addMistake({ source: "listening", hskLevel: level, chinese: word.chinese, pinyin: word.pinyin, wrongAnswer: option, correctAnswer: correct, explanation: `${word.chinese} — ${correct}.`, wordId: word.id });
      saveRemoteMistake({
        userId: user?.id,
        mistake: {
          id: `listening-${word.id}-${Date.now()}`,
          source: "listening",
          hskLevel: level,
          chinese: word.chinese,
          pinyin: word.pinyin,
          wrongAnswer: option,
          correctAnswer: correct,
          explanation: `${word.chinese} — ${correct}.`,
          createdAt: new Date().toISOString(),
          learned: false,
          wordId: word.id
        }
      }).catch(() => undefined);
    }
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 text-center">
          <p className="text-sm font-black text-orange-deep dark:text-orange-200">HSK {level}</p>
          <h1 className="mt-2 text-5xl font-black text-ink dark:text-cream">{t("listening.title")}</h1>
          <p className="mt-4 text-lg font-semibold text-stone-600 dark:text-stone-300">{t("listening.subtitle")}</p>
        </div>
        {word ? (
          <div className="rounded-[2.5rem] bg-white/84 p-7 text-center shadow-premium dark:bg-white/10 sm:p-10">
            <button onClick={speak} className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow transition hover:scale-105">
              <Volume2 className="h-12 w-12" />
            </button>
            <p className="mt-5 text-sm font-black text-stone-500 dark:text-stone-300">{t("listening.play")}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {options.map((option) => {
                const isSelected = selected === option;
                const isCorrect = selected && option === correct;
                return (
                  <button key={option} onClick={() => choose(option)} className={`flex items-center justify-between rounded-4xl p-4 text-left text-sm font-black shadow-soft ${
                    isCorrect ? "bg-mint text-emerald-800" : isSelected ? "bg-red-100 text-red-700" : "bg-cream text-ink dark:bg-white/8 dark:text-cream"
                  }`}>
                    {option}
                    {isCorrect ? <Check className="h-5 w-5" /> : isSelected ? <X className="h-5 w-5" /> : null}
                  </button>
                );
              })}
            </div>
            {selected ? (
              <div className="mt-7 flex justify-center">
                <button onClick={() => { setSelected(null); setIndex((value) => (value + 1) % words.length); }} className="rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-card">{t("common.next")}</button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-[2.5rem] bg-white/84 p-10 text-center shadow-premium dark:bg-white/10">
            <h2 className="text-3xl font-black text-ink dark:text-cream">{t("review.empty")}</h2>
            <div className="mt-6"><AppButton href="/lesson/1">{t("lessons.title")}</AppButton></div>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
