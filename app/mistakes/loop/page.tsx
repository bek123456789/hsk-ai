"use client";

import { CheckCircle2, RotateCcw, Target, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import { normalizeHanzi } from "@/utils/hanziTools";
import { useI18n } from "@/utils/i18n";
import { readLocalObject, writeLocalObject } from "@/utils/localLearning";

const loopKey = "hanziflow_mistake_loop_progress";

export default function MistakeLoopPage() {
  const { language } = useI18n();
  const mistakes = useProgressStore((state) => state.mistakes);
  const markMistakeLearned = useProgressStore((state) => state.markMistakeLearned);
  const markWeak = useProgressStore((state) => state.markWeak);
  const activeMistakes = useMemo(() => mistakes.filter((mistake) => !mistake.learned).slice(0, 20), [mistakes]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const mistake = activeMistakes[index % Math.max(1, activeMistakes.length)];
  const currentCount = mistake ? progress[mistake.id] ?? 0 : 0;

  useEffect(() => {
    setProgress(readLocalObject<Record<string, number>>(loopKey, {}));
  }, []);

  function persist(nextProgress: Record<string, number>) {
    setProgress(nextProgress);
    writeLocalObject(loopKey, nextProgress);
  }

  function submit() {
    if (!mistake) return;
    const expected = normalizeHanzi(mistake.correctAnswer || mistake.chinese);
    const user = normalizeHanzi(answer);
    const isCorrect = Boolean(user && (user === expected || expected.includes(user) || user.includes(expected)));
    setChecked(isCorrect);
    if (isCorrect) {
      const nextCount = Math.min(2, currentCount + 1);
      const nextProgress = { ...progress, [mistake.id]: nextCount };
      persist(nextProgress);
      if (mistake.wordId) markWeak(mistake.wordId);
      if (nextCount >= 2) markMistakeLearned(mistake.id);
    }
  }

  function next() {
    setAnswer("");
    setChecked(null);
    setIndex((value) => (value + 1) % Math.max(1, activeMistakes.length));
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Исправление ошибок" : "Xatolarni tuzatish"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Повторяйте ошибку, пока не ответите правильно 2 раза." : "Xatoni 2 marta to‘g‘ri javob berguncha mashq qiling."}
          </p>
        </div>

        {mistake ? (
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="rounded-full bg-orange-soft px-3 py-1 text-xs font-black text-orange-deep">HSK {mistake.hskLevel}</span>
                <h2 className="mt-4 text-5xl font-black text-ink">{mistake.chinese}</h2>
                {mistake.pinyin ? <p className="mt-2 text-xl font-black text-orange-brand">{mistake.pinyin}</p> : null}
              </div>
              <div className="rounded-[1.5rem] bg-cream p-4 text-center">
                <Target className="mx-auto h-6 w-6 text-orange-brand" />
                <p className="mt-2 text-2xl font-black text-ink">{currentCount}/2</p>
                <p className="text-xs font-black text-stone-500">{language === "ru" ? "правильно" : "to‘g‘ri"}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-cream p-5 text-sm font-semibold leading-7 text-stone-700">
              <p><b>{language === "ru" ? "Ваш ответ" : "Javobingiz"}:</b> {mistake.wrongAnswer}</p>
              <p className="mt-2"><b>{language === "ru" ? "Причина ошибки" : "Xato sababi"}:</b> {mistake.explanation}</p>
            </div>

            <label className="mt-6 block text-sm font-black text-stone-600">
              {language === "ru" ? "Напишите правильный ответ" : "To‘g‘ri javobni yozing"}
              <input value={answer} onChange={(event) => setAnswer(event.target.value)} className="warm-focus mt-3 w-full rounded-[1.5rem] border border-orange-soft bg-white px-5 py-4 text-xl font-black text-ink outline-none" />
            </label>

            {checked !== null ? (
              <div className={`mt-5 rounded-[1.5rem] p-5 ${checked ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                <p className="flex items-center gap-2 font-black">
                  {checked ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  {checked ? (language === "ru" ? "Ошибка исправлена" : "Xato tuzatildi") : (language === "ru" ? "Повторите эту ошибку" : "Bu xatoni yana mashq qiling")}
                </p>
                {!checked ? <p className="mt-2 font-semibold">{language === "ru" ? "Правильный ответ" : "To‘g‘ri javob"}: {mistake.correctAnswer}</p> : null}
              </div>
            ) : null}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AppButton onClick={submit} disabled={!answer.trim()}>{language === "ru" ? "Проверить" : "Tekshirish"}</AppButton>
              <AppButton onClick={next} variant="secondary"><RotateCcw className="h-5 w-5" /> {language === "ru" ? "Следующая ошибка" : "Keyingi xato"}</AppButton>
            </div>
          </Card>
        ) : (
          <Card className="p-10 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-orange-brand" />
            <h2 className="mt-4 text-4xl font-black text-ink">{language === "ru" ? "Пока нет ошибок" : "Hozircha xato yo‘q"}</h2>
            <p className="mx-auto mt-3 max-w-xl font-semibold leading-7 text-stone-600">{language === "ru" ? "Ошибки появятся здесь после тестов, speaking, writing или экзамена." : "Test, speaking, writing yoki imtihondan keyin xatolar shu yerda ko‘rinadi."}</p>
            <AppButton href="/practice" className="mt-6">{language === "ru" ? "Начать практику" : "Mashqni boshlash"}</AppButton>
          </Card>
        )}
      </section>
    </ProtectedRoute>
  );
}
