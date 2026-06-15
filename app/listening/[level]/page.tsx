"use client";

import { ArrowLeft, Check, Eye, Headphones, RefreshCcw, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ReportContentButton } from "@/components/ReportContentButton";
import { getListeningByLevel } from "@/data/hsk/contentIndex";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { parseHskLevel } from "@/utils/level";
import { isLearningContentDone, saveLearningProgress } from "@/utils/learningProgress";
import { speakChinese } from "@/utils/speechSynthesis";

export default function ListeningPage() {
  const params = useParams();
  const level = parseHskLevel(params.level);
  const { language } = useI18n();
  const prompts = useMemo(() => getListeningByLevel(level), [level]);
  const addMistake = useProgressStore((state) => state.addMistake);
  const savePracticeResult = useProgressStore((state) => state.savePracticeResult);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [replays, setReplays] = useState(0);
  const [audioError, setAudioError] = useState("");
  const prompt = prompts[index];
  const question = prompt?.questions[0];
  const done = prompt ? isLearningContentDone("listening", prompt.id) : false;
  const canReplay = prompt ? replays < (prompt.replayLimit ?? 3) : false;

  function listen() {
    if (!prompt || !canReplay) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setAudioError(language === "ru" ? "Аудио недоступно" : "Ovoz mavjud emas");
      return;
    }
    setAudioError("");
    speakChinese(prompt.audioTextZh);
    setReplays((value) => value + 1);
  }

  function choose(optionId: string) {
    if (!question || checked) return;
    setSelected(optionId);
    setChecked(true);
    const correct = optionId === question.correctOptionId;
    saveLearningProgress({ kind: "listening", contentId: prompt.id, level, score: correct ? 1 : 0, total: 1, done: correct, mistakes: correct ? [] : [question.id] });
    savePracticeResult({ id: `listening-${level}-${Date.now()}`, skill: "listening", hskLevel: level, score: correct ? 1 : 0, total: 1, completedAt: new Date().toISOString() });
    if (!correct) {
      const selectedOption = question.options.find((option) => option.id === optionId);
      const correctOption = question.options.find((option) => option.id === question.correctOptionId);
      addMistake({
        source: "listening",
        hskLevel: level,
        chinese: prompt.audioTextZh,
        pinyin: prompt.audioTextPinyin,
        wrongAnswer: language === "ru" ? selectedOption?.textRu ?? optionId : selectedOption?.textUz ?? optionId,
        correctAnswer: language === "ru" ? correctOption?.textRu ?? "" : correctOption?.textUz ?? "",
        explanation: language === "ru" ? question.explanationRu : question.explanationUz
      });
    }
  }

  function next() {
    setIndex((value) => (value + 1) % prompts.length);
    setSelected("");
    setChecked(false);
    setShowPinyin(false);
    setShowTranscript(false);
    setReplays(0);
    setAudioError("");
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-6 flex items-center justify-between gap-3">
          <AppButton href="/listening" variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> {language === "ru" ? "Практика аудирования" : "Tinglash mashqi"}</AppButton>
          <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-ink shadow-soft">HSK {level}</span>
        </div>
        {prompt && question ? (
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2.5rem] bg-white/88 p-6 shadow-premium sm:p-8">
              <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Прослушайте и ответьте" : "Eshitib javob bering"}</p>
              <h1 className="mt-2 text-4xl font-black text-ink">{language === "ru" ? prompt.titleRu : prompt.titleUz}</h1>
              <p className="mt-3 text-sm font-bold leading-6 text-stone-600">
                {language === "ru"
                  ? "Эта практика аудирования помогает понимать короткие китайские фразы на слух."
                  : "Bu tinglash mashqi sizga xitoycha qisqa gaplarni eshitib tushunishga yordam beradi."}
              </p>
              <div className="mt-6 rounded-[2rem] bg-gradient-to-br from-cream to-orange-soft/55 p-8 text-center">
                <button onClick={listen} disabled={!canReplay} className="warm-focus mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow disabled:opacity-40">
                  <Headphones className="h-12 w-12" />
                </button>
                <p className="mt-4 text-sm font-black text-stone-600">{language === "ru" ? "Сейчас воспроизводится" : "Hozir eshittirilmoqda"} · {replays}/{prompt.replayLimit ?? 3}</p>
                {audioError ? <p className="mt-3 rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-700">{audioError}</p> : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <AppButton variant="secondary" disabled={!checked} onClick={() => setShowPinyin((value) => !value)}><Eye className="h-4 w-4" /> {language === "ru" ? "Показать pinyin" : "Pinyinni ko‘rish"}</AppButton>
                <AppButton variant="secondary" disabled={!checked} onClick={() => setShowTranscript((value) => !value)}><Eye className="h-4 w-4" /> {language === "ru" ? "Показать текст" : "Matnni ko‘rish"}</AppButton>
              </div>
              {(showPinyin || showTranscript || checked) ? (
                <div className="mt-5 rounded-3xl bg-cream p-5">
                  {showTranscript || checked ? <p className="text-2xl font-black leading-relaxed text-ink">{prompt.audioTextZh}</p> : null}
                  {showPinyin || checked ? <p className="mt-2 font-bold leading-7 text-orange-brand">{prompt.audioTextPinyin}</p> : null}
                  {checked ? <p className="mt-2 font-semibold leading-7 text-stone-700">{language === "ru" ? prompt.transcriptRu : prompt.transcriptUz}</p> : null}
                </div>
              ) : null}
            </div>
            <div className="rounded-[2.5rem] bg-white/88 p-6 shadow-premium sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-ink">{language === "ru" ? question.questionRu : question.questionUz}</h2>
                {done ? <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700">{language === "ru" ? "Выполнено" : "Bajarildi"}</span> : null}
              </div>
              <p className="mt-3 text-sm font-bold text-stone-500">{language === "ru" ? prompt.speakerHintRu : prompt.speakerHintUz}</p>
              <div className="mt-6 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = selected === option.id;
                  const isCorrect = checked && option.id === question.correctOptionId;
                  return (
                    <button key={option.id} onClick={() => choose(option.id)} className={`flex items-center justify-between rounded-3xl p-4 text-left text-sm font-black shadow-soft ${isCorrect ? "bg-orange-soft text-orange-deep" : isSelected ? "bg-red-100 text-red-700" : "bg-cream text-ink"}`}>
                      <span>{language === "ru" ? option.textRu : option.textUz}</span>
                      {isCorrect ? <Check className="h-5 w-5" /> : isSelected ? <X className="h-5 w-5" /> : null}
                    </button>
                  );
                })}
              </div>
              {checked ? <p className="mt-5 rounded-3xl bg-white p-4 text-sm font-semibold leading-6 text-stone-600"><b>{language === "ru" ? "Объяснение" : "Tushuntirish"}:</b> {language === "ru" ? question.explanationRu : question.explanationUz}</p> : null}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <ReportContentButton itemId={prompt.id} itemType="listening" hskLevel={level} />
                {checked ? <AppButton onClick={next}><RefreshCcw className="h-4 w-4" /> {language === "ru" ? "Следующее" : "Keyingi"}</AppButton> : null}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </ProtectedRoute>
  );
}
