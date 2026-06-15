"use client";

import { Search, Volume2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { hskWords } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { getWordStatus } from "@/utils/wordMastery";
import { getWordTranslation, useI18n } from "@/utils/i18n";
import { speakChinese } from "@/utils/speechSynthesis";

const statuses = ["all", "new", "learning", "weak", "review", "mastered"] as const;

export default function DictionaryPage() {
  const { language } = useI18n();
  const wordReviews = useProgressStore((state) => state.wordReviews);
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const markWeak = useProgressStore((state) => state.markWeak);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"all" | HSKLevel>("all");
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return hskWords
      .filter((word) => level === "all" || word.hskLevel === level)
      .filter((word) => {
        const currentStatus = weakWordIds.includes(word.id) ? "weak" : getWordStatus(word.id, wordReviews);
        return status === "all" || currentStatus === status;
      })
      .filter((word) => {
        if (!normalized) return true;
        return [word.chinese, word.pinyin, word.translationUz, word.translationRu ?? ""].join(" ").toLowerCase().includes(normalized);
      })
      .slice(0, 120);
  }, [level, query, status, weakWordIds, wordReviews]);

  const labels = {
    title: language === "ru" ? "Словарь" : "Lug‘at",
    search: language === "ru" ? "Поиск слова" : "So‘z qidirish",
    level: language === "ru" ? "Уровень HSK" : "HSK daraja",
    status: language === "ru" ? "Статус" : "Holat",
    practice: language === "ru" ? "Практиковать" : "Mashq qilish",
    listen: language === "ru" ? "Прослушать" : "Eshitish",
    weak: language === "ru" ? "Слабые слова" : "Zaif so‘zlar"
  };
  const statusLabels: Record<(typeof statuses)[number], string> = {
    all: labels.status,
    new: language === "ru" ? "Новое" : "Yangi",
    learning: language === "ru" ? "Изучается" : "O‘rganilmoqda",
    weak: language === "ru" ? "Слабое" : "Zaif",
    review: language === "ru" ? "Повторение" : "Takrorlash",
    mastered: language === "ru" ? "Освоено" : "O‘zlashtirilgan"
  };

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{labels.title}</h1>
        </div>
        <div className="mb-6 grid gap-3 rounded-[2rem] bg-white/86 p-4 shadow-premium md:grid-cols-[1fr_180px_180px]">
          <label className="flex items-center gap-3 rounded-full bg-cream px-4 py-3 shadow-inner">
            <Search className="h-5 w-5 text-orange-brand" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.search} className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none" />
          </label>
          <select value={level} onChange={(event) => setLevel(event.target.value === "all" ? "all" : (Number(event.target.value) as HSKLevel))} className="rounded-full bg-cream px-4 py-3 text-sm font-black text-ink outline-none">
            <option value="all">{labels.level}</option>
            {[1, 2, 3, 4, 5, 6].map((item) => <option key={item} value={item}>HSK {item}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value as (typeof statuses)[number])} className="rounded-full bg-cream px-4 py-3 text-sm font-black text-ink outline-none">
            <option value="all">{labels.status}</option>
            <option value="new">{statusLabels.new}</option>
            <option value="learning">{statusLabels.learning}</option>
            <option value="weak">{statusLabels.weak}</option>
            <option value="review">{statusLabels.review}</option>
            <option value="mastered">{statusLabels.mastered}</option>
          </select>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((word) => {
            const currentStatus = weakWordIds.includes(word.id) ? "weak" : getWordStatus(word.id, wordReviews);
            return (
              <article key={word.id} className="rounded-[2rem] border border-white/70 bg-white/84 p-6 shadow-premium backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/dictionary/${word.id}`} className="min-w-0">
                    <h2 className="text-5xl font-black text-ink">{word.chinese}</h2>
                    <p className="mt-2 text-lg font-black text-orange-brand">{word.pinyin}</p>
                  </Link>
                  <span className="rounded-full bg-orange-soft px-3 py-1 text-xs font-black text-orange-deep">HSK {word.hskLevel}</span>
                </div>
                <p className="mt-4 rounded-3xl bg-cream px-4 py-3 text-lg font-black text-ink">{getWordTranslation(word, language)}</p>
                <p className="mt-3 text-xs font-black text-stone-500">{statusLabels[currentStatus]}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => speakChinese(word.chinese)} className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-black text-stone-600 shadow-soft"><Volume2 className="h-4 w-4 text-orange-brand" /> {labels.listen}</button>
                  <button onClick={() => markWeak(word.id)} className="rounded-full bg-cream px-4 py-2 text-xs font-black text-stone-600 shadow-soft">{labels.weak}</button>
                  <AppButton href={`/speaking/${word.hskLevel}?word=${word.id}`} variant="secondary" className="px-4 py-2 text-xs">{labels.practice}</AppButton>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </ProtectedRoute>
  );
}
