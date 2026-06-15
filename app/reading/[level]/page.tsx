"use client";

import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, Eye, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ReportContentButton } from "@/components/ReportContentButton";
import { getReadingByLevel, getVocabularyEntryById } from "@/data/hsk/contentIndex";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { parseHskLevel } from "@/utils/level";
import { isLearningContentDone, saveLearningProgress } from "@/utils/learningProgress";

export default function ReadingPracticePage() {
  const params = useParams();
  const level = parseHskLevel(params.level);
  const { language } = useI18n();
  const passages = useMemo(() => getReadingByLevel(level), [level]);
  const savePracticeResult = useProgressStore((state) => state.savePracticeResult);
  const addMistake = useProgressStore((state) => state.addMistake);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [finished, setFinished] = useState(false);
  const passage = passages[index];
  const done = passage ? isLearningContentDone("reading", passage.id) : false;

  function choose(questionId: string, optionId: string) {
    if (answers[questionId]) return;
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    const question = passage?.questions.find((item) => item.id === questionId);
    if (passage && question && optionId !== question.correctOptionId) {
      const selected = question.options.find((option) => option.id === optionId);
      const correct = question.options.find((option) => option.id === question.correctOptionId);
      addMistake({
        source: "reading",
        hskLevel: level,
        chinese: passage.passageZh,
        pinyin: passage.passagePinyin,
        wrongAnswer: language === "ru" ? selected?.textRu ?? optionId : selected?.textUz ?? optionId,
        correctAnswer: language === "ru" ? correct?.textRu ?? "" : correct?.textUz ?? "",
        explanation: language === "ru" ? question.explanationRu : question.explanationUz
      });
    }
  }

  function finish() {
    if (!passage) return;
    if (passage.questions.some((question) => !answers[question.id])) return;
    const score = passage.questions.filter((question) => answers[question.id] === question.correctOptionId).length;
    saveLearningProgress({ kind: "reading", contentId: passage.id, level, score, total: passage.questions.length, done: score === passage.questions.length, mistakes: [] });
    savePracticeResult({ id: `reading-${level}-${Date.now()}`, skill: "reading", hskLevel: level, score, total: passage.questions.length, completedAt: new Date().toISOString() });
    setFinished(true);
  }

  function next() {
    setIndex((value) => (value + 1) % passages.length);
    setAnswers({});
    setFinished(false);
    setShowPinyin(false);
    setShowTranslation(false);
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-6 flex items-center justify-between gap-3">
          <AppButton href="/reading" variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> {language === "ru" ? "Практика чтения" : "O‘qish mashqi"}</AppButton>
          <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-ink shadow-soft">HSK {level}</span>
        </div>
        {passage ? (
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2.5rem] border border-white/70 bg-white/88 p-6 shadow-premium backdrop-blur-xl sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Прочитайте текст" : "Matnni o‘qing"}</p>
                  <h1 className="mt-2 text-4xl font-black text-ink">{language === "ru" ? passage.titleRu : passage.titleUz}</h1>
                  <p className="mt-3 text-sm font-bold leading-6 text-stone-600">
                    {language === "ru"
                      ? `В этом упражнении вы учитесь понимать короткие тексты уровня HSK ${level}.`
                      : `Bu mashqda siz HSK ${level} darajasidagi qisqa matnlarni o‘qib tushunishni o‘rganasiz.`}
                  </p>
                </div>
                <span className="rounded-full bg-cream px-4 py-2 text-sm font-black text-stone-600">{index + 1}/{passages.length}</span>
              </div>
              <div className="mt-6 rounded-[2rem] bg-cream p-6 shadow-soft">
                <p className="text-3xl font-black leading-relaxed text-ink sm:text-4xl">{passage.passageZh}</p>
                {showPinyin ? <p className="mt-4 text-sm font-bold leading-7 text-orange-brand">{passage.passagePinyin}</p> : null}
                {showTranslation ? <p className="mt-4 text-sm font-semibold leading-7 text-stone-700">{language === "ru" ? passage.passageRu : passage.passageUz}</p> : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <AppButton variant="secondary" onClick={() => setShowPinyin((value) => !value)}><Eye className="h-4 w-4" /> {language === "ru" ? "Показать pinyin" : "Pinyinni ko‘rsatish"}</AppButton>
                <AppButton variant="secondary" onClick={() => setShowTranslation((value) => !value)}><Eye className="h-4 w-4" /> {language === "ru" ? "Показать перевод" : "Tarjimani ko‘rsatish"}</AppButton>
              </div>
              <div className="mt-5 rounded-3xl bg-white p-4 shadow-soft">
                <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Слова из текста" : "Matndagi so‘zlar"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {passage.vocabularyIds.map((id) => {
                    const word = getVocabularyEntryById(id);
                    return word ? <span key={id} className="rounded-full bg-orange-soft px-3 py-2 text-sm font-black text-orange-deep">{word.hanzi} · {word.pinyin} · {language === "ru" ? word.ru : word.uz}</span> : null;
                  })}
                </div>
              </div>
            </div>
            <div className="rounded-[2.5rem] border border-white/70 bg-white/88 p-6 shadow-premium backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Ответьте на вопросы" : "Savollarga javob bering"}</h2>
                {done || finished ? <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {language === "ru" ? "Выполнено" : "Bajarildi"}</span> : null}
              </div>
              <div className="mt-5 space-y-5">
                {passage.questions.map((question) => {
                  const selected = answers[question.id];
                  return (
                    <div key={question.id} className="rounded-[2rem] bg-cream p-4">
                      <p className="font-black text-ink">{language === "ru" ? question.questionRu : question.questionUz}</p>
                      <div className="mt-4 grid gap-3">
                        {question.options.map((option) => {
                          const isSelected = selected === option.id;
                          const isCorrect = selected && option.id === question.correctOptionId;
                          return (
                            <button key={option.id} onClick={() => choose(question.id, option.id)} className={`flex items-center justify-between rounded-3xl p-4 text-left text-sm font-black shadow-soft ${isCorrect ? "bg-orange-soft text-orange-deep" : isSelected ? "bg-rose-50 text-rose-700" : "bg-white text-ink"}`}>
                              <span>{language === "ru" ? option.textRu : option.textUz}</span>
                              {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : isSelected ? <XCircle className="h-5 w-5" /> : null}
                            </button>
                          );
                        })}
                      </div>
                      {selected ? <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-6 text-stone-600"><b>{language === "ru" ? "Объяснение" : "Tushuntirish"}:</b> {language === "ru" ? question.explanationRu : question.explanationUz}</p> : null}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <ReportContentButton itemId={passage.id} itemType="reading" hskLevel={level} />
                {finished ? (
                  <button onClick={next} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-card">{language === "ru" ? "Следующий текст" : "Keyingi matn"} <ArrowRight className="h-4 w-4" /></button>
                ) : (
                  <button onClick={finish} disabled={passage.questions.some((question) => !answers[question.id])} className="rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-3 text-sm font-black text-white shadow-card disabled:cursor-not-allowed disabled:opacity-50"><BookOpenCheck className="mr-2 inline h-4 w-4" />{language === "ru" ? "Результат" : "Natija"}</button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </ProtectedRoute>
  );
}
