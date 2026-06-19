"use client";

import { BookOpen, Brain, Search, Sparkles, Volume2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getCurriculumLessonsByLevel } from "@/data/hsk/lessonCurriculum";
import { vocabularyEntries } from "@/data/hsk/vocabulary";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { getHanziAnalysis } from "@/utils/hanziTools";
import { useI18n } from "@/utils/i18n";
import { speakChinese } from "@/utils/speechSynthesis";

function lessonForWord(wordId: string, level: HSKLevel) {
  return getCurriculumLessonsByLevel(level).find((lesson) => lesson.vocabularyIds.includes(wordId));
}

export default function HanziBuilderPage() {
  const { language } = useI18n();
  const markWeak = useProgressStore((state) => state.markWeak);
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const [query, setQuery] = useState("你");
  const results = useMemo(() => {
    const clean = query.trim().toLowerCase();
    const list = clean
      ? vocabularyEntries.filter((word) =>
          word.hanzi.includes(query.trim()) ||
          word.pinyin.toLowerCase().includes(clean) ||
          word.uz.toLowerCase().includes(clean) ||
          word.ru.toLowerCase().includes(clean)
        )
      : vocabularyEntries.slice(0, 24);
    return list.slice(0, 18);
  }, [query]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = vocabularyEntries.find((word) => word.id === selectedId) ?? results[0] ?? vocabularyEntries[0];
  const analysis = selected ? getHanziAnalysis(selected) : [];
  const lesson = selected ? lessonForWord(selected.id, selected.level) : null;
  const learned = selected ? knownWordIds.includes(selected.id) : false;

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Разбор иероглифа" : "Ieroglif tahlili"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Разбирайте ханьцзы, pinyin, значение, пример и способ запоминания." : "Hanzi, pinyin, ma’no, misol va eslab qolish usulini bir joyda ko‘ring."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Card className="p-5">
            <label className="text-sm font-black text-stone-600">
              {language === "ru" ? "Поиск слова" : "So‘z qidirish"}
              <span className="mt-3 flex items-center gap-2 rounded-full border border-orange-soft bg-cream px-4 py-3">
                <Search className="h-5 w-5 text-orange-brand" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-black text-ink outline-none"
                  placeholder={language === "ru" ? "你, nǐ, ты..." : "你, nǐ, sen..."}
                />
              </span>
            </label>
            <div className="mt-5 max-h-[560px] space-y-2 overflow-auto pr-1">
              {results.map((word) => (
                <button
                  key={word.id}
                  onClick={() => setSelectedId(word.id)}
                  className={`w-full rounded-3xl border px-4 py-3 text-left transition ${selected?.id === word.id ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-stone-200 bg-white text-ink hover:border-orange-soft"}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-black">{word.hanzi}</span>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black">HSK {word.level}</span>
                  </span>
                  <span className="mt-1 block text-sm font-black text-orange-brand">{word.pinyin}</span>
                  <span className="mt-1 block text-xs font-bold text-stone-600">{language === "ru" ? word.ru : word.uz}</span>
                </button>
              ))}
            </div>
          </Card>

          {selected ? (
            <div className="space-y-6">
              <Card className="overflow-hidden p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-orange-brand px-3 py-1 text-xs font-black text-white">HSK {selected.level}</span>
                      <span className="rounded-full bg-cream px-3 py-1 text-xs font-black text-stone-600">{selected.category}</span>
                      {learned ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{language === "ru" ? "Изучено" : "O‘rganilgan"}</span> : null}
                    </div>
                    <h2 className="mt-4 text-7xl font-black text-ink sm:text-8xl">{selected.hanzi}</h2>
                    <p className="mt-3 text-2xl font-black text-orange-brand">{selected.pinyin}</p>
                    <p className="mt-2 text-xl font-black text-stone-700">{language === "ru" ? selected.ru : selected.uz}</p>
                  </div>
                  <button onClick={() => speakChinese(selected.hanzi)} className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft">
                    <Volume2 className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-6 rounded-[1.5rem] bg-cream p-5">
                  <p className="text-xs font-black uppercase text-orange-deep">{language === "ru" ? "Пример" : "Misol gap"}</p>
                  <p className="mt-2 text-2xl font-black text-ink">{selected.exampleZh}</p>
                  <p className="mt-1 font-black text-orange-brand">{selected.examplePinyin}</p>
                  <p className="mt-2 font-semibold leading-7 text-stone-700">{language === "ru" ? selected.exampleRu : selected.exampleUz}</p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => markWeak(selected.id)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-glow">
                    <Brain className="h-5 w-5" /> {language === "ru" ? "Добавить в повторение" : "Takrorlashga qo‘shish"}
                  </button>
                  <AppButton href={lesson ? `/lesson/${selected.level}/${lesson.id}` : `/dictionary/${selected.id}`} variant="secondary">
                    <BookOpen className="h-5 w-5" /> {lesson ? (language === "ru" ? "Посмотреть в уроке" : "Darsda ko‘rish") : (language === "ru" ? "Открыть словарь" : "Lug‘atda ochish")}
                  </AppButton>
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                {analysis.map(({ character, hint }) => (
                  <Card key={character} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-5xl font-black text-ink">{character}</p>
                        <p className="mt-2 text-sm font-black text-orange-deep">{language === "ru" ? "Радикал" : "Radikal"}: {hint.radical}</p>
                      </div>
                      <Sparkles className="h-6 w-6 text-orange-brand" />
                    </div>
                    <p className="mt-4 text-sm font-black text-stone-700">{language === "ru" ? hint.componentRu : hint.componentUz}</p>
                    <p className="mt-3 rounded-2xl bg-orange-soft/70 p-4 text-sm font-semibold leading-6 text-orange-deep">
                      {language === "ru" ? hint.memoryRu : hint.memoryUz}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
                      {language === "ru" ? hint.strokeRu : hint.strokeUz}
                    </p>
                  </Card>
                ))}
              </div>
              <Link href="/stroke-order" className="warm-focus inline-flex text-sm font-black text-orange-deep hover:text-orange-brand">
                {language === "ru" ? "Полная практика письма иероглифов" : "To‘liq iyeroglif yozish mashqi"}
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </ProtectedRoute>
  );
}
