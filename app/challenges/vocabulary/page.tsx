"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { hskWords } from "@/data/hskWords";
import { useI18n, getWordTranslation } from "@/utils/i18n";

export default function VocabularyChallengePage() {
  const { language } = useI18n();
  const words = useMemo(() => hskWords.slice(0, 10), []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const word = words[index];
  const done = index >= words.length;
  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-3xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <Card className="p-7 text-center">
          <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Словарный челлендж" : "Lug‘at sinovi"}</p>
          {done ? (
            <>
              <h1 className="mt-3 text-6xl font-black text-ink">{score}/10</h1>
              <p className="mt-3 font-bold text-stone-500">{language === "ru" ? "Результат сохранён локально." : "Natija lokal saqlandi."}</p>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-7xl font-black text-ink">{word.chinese}</h1>
              <p className="mt-2 text-xl font-black text-orange-brand">{word.pinyin}</p>
              <div className="mt-7 grid gap-3">
                {[getWordTranslation(word, language), ...hskWords.slice(10, 13).map((item) => getWordTranslation(item, language))].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      if (option === getWordTranslation(word, language)) setScore((value) => value + 1);
                      setIndex((value) => value + 1);
                    }}
                    className="rounded-3xl bg-cream px-5 py-4 text-sm font-black text-ink shadow-soft hover:bg-orange-soft"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </Card>
      </section>
    </ProtectedRoute>
  );
}
