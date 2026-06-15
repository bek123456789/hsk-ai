"use client";

import { CheckCircle2, Clock3, MessageCircle, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { PremiumLock } from "@/components/PremiumLock";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getCourseLessonsByLevel } from "@/data/hskLessons";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

export default function MiniLessonLevelPage() {
  const params = useParams<{ level: string }>();
  const level = Math.min(6, Math.max(1, Number(params.level) || 1)) as HSKLevel;
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const save = useProgressStore((state) => state.saveLearningActivity);
  const lessons = getCourseLessonsByLevel(level);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [finished, setFinished] = useState(false);
  const lesson = lessons[lessonIndex] ?? lessons[0];
  const words = lesson?.vocabulary.slice(0, 5) ?? [];
  const grammar = lesson?.grammarPoints[0];
  const quizWord = words[0];
  const options = useMemo(() => words.slice(0, 4), [lesson?.lessonId]); // eslint-disable-line react-hooks/exhaustive-deps
  const correct = selected === quizWord?.id;

  if (level > 1 && !isPremiumProfile(user)) {
    return <ProtectedRoute><PageShell><PremiumLock featureKey="hskFull" title={language === "ru" ? "Мини-уроки HSK 2–6 доступны в Premium" : "HSK 2–6 mini darslari Premium uchun"} /></PageShell></ProtectedRoute>;
  }

  function complete() {
    if (!quizWord || !selected) return;
    save({ id: `mini-${Date.now()}`, type: "mini-lesson", hskLevel: level, score: correct ? 1 : 0, total: 1, completedAt: new Date().toISOString() });
    setFinished(true);
  }

  return (
    <ProtectedRoute>
      <PageShell className="max-w-5xl">
        <PageHeader eyebrow={`HSK ${level} · ${lessonIndex + 1}/${Math.max(1, lessons.length)}`} title={language === "ru" ? "Урок на 3 минуты" : "3 daqiqalik dars"} description={lesson ? (language === "ru" ? lesson.shortDescriptionRu : lesson.shortDescriptionUz) : ""} icon={Clock3} />
        {finished ? (
          <div className="rounded-[2rem] bg-white/88 p-10 text-center shadow-premium">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
            <h2 className="mt-4 text-4xl font-black text-ink">{correct ? (language === "ru" ? "Отлично!" : "Ajoyib!") : (language === "ru" ? "Повторите слова ещё раз" : "So‘zlarni yana takrorlang")}</h2>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><AppButton href="/mini-lessons" variant="secondary">{language === "ru" ? "Все уроки" : "Barcha darslar"}</AppButton><AppButton onClick={() => { setLessonIndex((value) => (value + 1) % Math.max(1, lessons.length)); setSelected(""); setFinished(false); }}>{language === "ru" ? "Следующий урок" : "Keyingi dars"}</AppButton></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{words.map((word) => <div key={word.id} className="rounded-3xl bg-white/88 p-5 text-center shadow-soft"><p className="text-4xl font-black text-ink">{word.chinese}</p><p className="mt-2 font-black text-orange-brand">{word.pinyin}</p><p className="mt-2 text-sm font-bold text-stone-600">{language === "ru" ? word.translationRu : word.translationUz}</p></div>)}</div>
            {grammar ? <div className="rounded-[2rem] border border-orange-soft/70 bg-orange-soft/45 p-6 shadow-soft"><p className="text-sm font-black text-orange-deep">{language === "ru" ? "Краткое объяснение" : "Qisqa tushuntirish"}</p><h2 className="mt-2 text-3xl font-black text-ink">{grammar.structure}</h2><p className="mt-3 font-semibold leading-7 text-stone-600">{language === "ru" ? grammar.explanationRu : grammar.explanationUz}</p></div> : null}
            {words.length > 1 ? <div className="rounded-[2rem] bg-white/88 p-6 shadow-premium"><div className="flex items-center gap-3"><MessageCircle className="h-6 w-6 text-orange-brand" /><h2 className="text-2xl font-black text-ink">{language === "ru" ? "Пример диалога" : "Dialog namunasi"}</h2></div><p className="mt-4 text-xl font-black text-ink">A: {words[0].exampleChinese}</p><p className="mt-2 text-xl font-black text-ink">B: {words[1].exampleChinese}</p></div> : null}
            {quizWord ? <div className="rounded-[2rem] bg-white/88 p-6 shadow-premium"><p className="text-sm font-black text-orange-deep">{language === "ru" ? "Быстрый тест" : "Tezkor test"}</p><h2 className="mt-2 text-3xl font-black text-ink">{quizWord.chinese}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{options.map((word) => <button key={word.id} onClick={() => setSelected(word.id)} className={`rounded-3xl p-4 text-left font-black shadow-soft ${selected === word.id ? "bg-orange-soft text-orange-deep" : "bg-cream text-ink"}`}>{language === "ru" ? word.translationRu : word.translationUz}</button>)}</div><AppButton onClick={complete} disabled={!selected} className="mt-5"><Sparkles className="h-5 w-5" /> {language === "ru" ? "Проверить" : "Tekshirish"}</AppButton></div> : null}
          </div>
        )}
      </PageShell>
    </ProtectedRoute>
  );
}
