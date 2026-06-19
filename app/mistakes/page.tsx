"use client";

import { AlertTriangle, BookOpenCheck, Filter, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel, MistakeRecord, MistakeSource } from "@/types";
import { useI18n } from "@/utils/i18n";

const sourceFilters: Array<"all" | MistakeSource> = ["all", "quiz", "exam", "reading", "listening", "speaking", "writing", "dictation", "sentence-builder", "tone-trainer", "shadowing", "roleplay", "ai"];

function sourceLabel(source: "all" | MistakeSource, language: "uz" | "ru") {
  const uz: Record<string, string> = {
    all: "Barchasi",
    quiz: "Test",
    exam: "Imtihon",
    reading: "O‘qish",
    listening: "Tinglash",
    speaking: "Gapirish",
    writing: "Yozish",
    dictation: "Diktant",
    "sentence-builder": "Gap tuzish",
    "tone-trainer": "Ton mashqi",
    shadowing: "Takrorlash",
    roleplay: "Real vaziyat",
    ai: "AI"
  };
  const ru: Record<string, string> = {
    all: "Все",
    quiz: "Тест",
    exam: "Экзамен",
    reading: "Чтение",
    listening: "Аудирование",
    speaking: "Говорение",
    writing: "Письмо",
    dictation: "Диктант",
    "sentence-builder": "Предложения",
    "tone-trainer": "Тоны",
    shadowing: "Повтор",
    roleplay: "Ситуации",
    ai: "AI"
  };
  return language === "ru" ? ru[source] ?? source : uz[source] ?? source;
}

function practiceHref(mistake: MistakeRecord) {
  if (mistake.source === "quiz") return `/quiz/${mistake.hskLevel}`;
  if (mistake.source === "exam") return `/exam/${mistake.hskLevel}`;
  if (mistake.source === "reading") return `/reading/${mistake.hskLevel}`;
  if (mistake.source === "listening") return `/listening/${mistake.hskLevel}`;
  if (mistake.source === "speaking") return `/speaking/${mistake.hskLevel}`;
  if (mistake.source === "dictation") return "/dictation";
  if (mistake.source === "sentence-builder") return "/sentence-builder";
  if (mistake.source === "tone-trainer") return "/tone-trainer";
  if (mistake.source === "shadowing") return "/shadowing";
  if (mistake.source === "roleplay") return "/roleplay";
  return "/review";
}

export default function MistakesPage() {
  const mistakes = useProgressStore((state) => state.mistakes);
  const markMistakeLearned = useProgressStore((state) => state.markMistakeLearned);
  const markWeak = useProgressStore((state) => state.markWeak);
  const { language, t } = useI18n();
  const [source, setSource] = useState("all");
  const [level, setLevel] = useState(0);
  const activeMistakes = mistakes.filter((mistake) => !mistake.learned && (source === "all" || mistake.source === source) && (!level || mistake.hskLevel === level));
  const repeatedMistakes = useMemo(() => {
    const grouped = new Map<string, { mistake: MistakeRecord; count: number }>();
    mistakes
      .filter((mistake) => !mistake.learned)
      .forEach((mistake) => {
        const key = mistake.wordId ?? `${mistake.hskLevel}:${mistake.chinese}:${mistake.correctAnswer}`;
        const current = grouped.get(key);
        grouped.set(key, { mistake, count: (current?.count ?? 0) + 1 });
      });
    return Array.from(grouped.values())
      .filter((item) => item.count > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [mistakes]);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{t("nav.mistakes")}</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{t("mistakes.title")}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">{t("mistakes.subtitle")}</p>
        </div>
        {repeatedMistakes.length ? (
          <div className="mb-6 rounded-[2rem] border border-orange-soft/70 bg-white/88 p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">{language === "ru" ? "Частые ошибки" : "Ko‘p takrorlangan xatolar"}</p>
                <h2 className="text-xl font-black text-ink">{language === "ru" ? "Сначала исправьте повторяющиеся ошибки" : "Avval takrorlanayotgan xatolarni tuzating"}</h2>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {repeatedMistakes.map(({ mistake, count }) => (
                <div key={`${mistake.id}-${count}`} className="rounded-3xl bg-cream/80 p-4">
                  <p className="text-2xl font-black text-ink">{mistake.chinese}</p>
                  <p className="mt-1 text-sm font-bold text-orange-deep">{count}× · HSK {mistake.hskLevel}</p>
                  <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-stone-600">{mistake.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-6 flex flex-wrap gap-2 rounded-[2rem] bg-white/88 p-4 shadow-soft">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-xs font-black text-orange-deep">
            <Filter className="h-4 w-4" /> {language === "ru" ? "Фильтр" : "Filtr"}
          </span>
          {sourceFilters.map((item) => (
            <button key={item} onClick={() => setSource(item)} className={`rounded-full px-4 py-2 text-xs font-black ${source === item ? "bg-orange-brand text-white" : "bg-cream text-stone-600"}`}>
              {sourceLabel(item, language)}
            </button>
          ))}
          <select value={level} onChange={(event) => setLevel(Number(event.target.value))} className="rounded-full border border-orange-soft bg-cream px-4 py-2 text-xs font-black text-stone-600">
            <option value={0}>HSK 1–6</option>
            {([1,2,3,4,5,6] as HSKLevel[]).map((item) => <option key={item} value={item}>HSK {item}</option>)}
          </select>
        </div>
        {activeMistakes.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {activeMistakes.map((mistake) => (
              <div key={mistake.id} className="rounded-[2rem] border border-white/70 bg-white/84 p-6 shadow-premium backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-4xl font-black text-ink">{mistake.chinese}</p>
                    {mistake.pinyin ? <p className="mt-1 text-lg font-black text-orange-brand">{mistake.pinyin}</p> : null}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-orange-soft px-3 py-1 text-xs font-black text-orange-deep">HSK {mistake.hskLevel}</span>
                    <span className="rounded-full bg-cream px-3 py-1 text-xs font-black text-stone-500">{sourceLabel(mistake.source, language)}</span>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 text-sm font-bold text-stone-600">
                  <p className="rounded-2xl bg-cream p-3"><span className="font-black text-stone-500">{language === "ru" ? "Ваш ответ" : "Javobingiz"}: </span>{mistake.wrongAnswer}</p>
                  <p className="rounded-2xl bg-orange-soft p-3 text-orange-deep"><span className="font-black">{language === "ru" ? "Правильный ответ" : "To‘g‘ri javob"}: </span>{mistake.correctAnswer}</p>
                  <p className="leading-7">{mistake.explanation}</p>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <AppButton href={practiceHref(mistake)} variant="secondary"><RotateCcw className="h-5 w-5" /> {language === "ru" ? "Исправить сейчас" : "Hozir tuzatish"}</AppButton>
                  <button
                    disabled={!mistake.wordId}
                    onClick={() => mistake.wordId ? markWeak(mistake.wordId) : undefined}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-soft bg-white px-5 py-3 text-sm font-black text-orange-deep shadow-soft disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-5 w-5" /> {language === "ru" ? "Добавить в повторение" : "Takrorlashga qo‘shish"}
                  </button>
                  <button onClick={() => markMistakeLearned(mistake.id)} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-5 py-3 text-sm font-black text-white shadow-card">
                    <BookOpenCheck className="h-5 w-5" /> {t("mistakes.markLearned")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] bg-white/84 p-10 text-center shadow-premium">
            <BookOpenCheck className="mx-auto mb-4 h-12 w-12 text-orange-brand" />
            <h2 className="text-4xl font-black text-ink">{t("mistakes.empty")}</h2>
            <div className="mt-6"><AppButton href="/quiz/1">{t("common.quiz")}</AppButton></div>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
