"use client";

import { ArrowLeft, Mic, MessageCircle, Volume2 } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { PremiumLock } from "@/components/PremiumLock";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SpeakingPracticeCard } from "@/components/SpeakingPracticeCard";
import { SpeakingRetellTask } from "@/components/SpeakingRetellTask";
import { UsageLimitOverview } from "@/components/UsageLimitOverview";
import { getSpeakingTasksByLevel } from "@/data/hsk/contentIndex";
import { getWordsByLevel } from "@/data/hskWords";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { parseHskLevel } from "@/utils/level";
import { isPremiumProfile } from "@/utils/premium";

type Mode = "pronunciation" | "retell";

export default function SpeakingPracticePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const level = parseHskLevel(params.level);
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const words = useMemo(() => getWordsByLevel(level), [level]);
  const tasks = useMemo(() => getSpeakingTasksByLevel(level), [level]);
  const requestedWordId = searchParams.get("word");
  const startIndex = Math.max(0, words.findIndex((word) => word.id === requestedWordId));
  const [mode, setMode] = useState<Mode>("retell");
  const [index, setIndex] = useState(startIndex);
  const [taskIndex, setTaskIndex] = useState(0);
  const saveSpeakingResult = useProgressStore((state) => state.saveSpeakingResult);
  const word = words[index] ?? words[0];
  const task = tasks[taskIndex] ?? tasks[0];
  const premium = isPremiumProfile(user);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        {!premium ? <PremiumLock featureKey="speaking" /> : (
          <>
            <div className="mb-6 flex items-center justify-between gap-3">
              <AppButton href="/speaking" variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> {language === "ru" ? "Практика говорения" : "Gapirish mashqi"}</AppButton>
              <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-ink shadow-soft">HSK {level}</span>
            </div>
            <div className="mb-6 max-w-3xl">
              <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Произношение, пересказ и ежедневные ситуации" : "Talaffuz, matn mazmuni va kundalik vaziyatlar"}</p>
              <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Практика говорения" : "Gapirish mashqi"}</h1>
              <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
                {language === "ru"
                  ? "В этой практике говорения вы читаете текст и пересказываете смысл на китайском."
                  : "Bu gapirish mashqida matnni o‘qib, mazmunini xitoycha aytib berasiz."}
              </p>
            </div>
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <button onClick={() => setMode("retell")} className={`rounded-[2rem] p-5 text-left shadow-soft ${mode === "retell" ? "bg-orange-soft text-orange-deep" : "bg-white/88 text-ink"}`}>
                <MessageCircle className="mb-3 h-7 w-7" />
                <h2 className="text-2xl font-black">{language === "ru" ? "Пересказ текста" : "Matn mazmunini aytish"}</h2>
                <p className="mt-2 text-sm font-semibold">{language === "ru" ? "Диалог, ежедневная ситуация и экзаменационное говорение." : "Dialog, kundalik vaziyat va imtihon uchun gapirish."}</p>
              </button>
              <button onClick={() => setMode("pronunciation")} className={`rounded-[2rem] p-5 text-left shadow-soft ${mode === "pronunciation" ? "bg-orange-soft text-orange-deep" : "bg-white/88 text-ink"}`}>
                <Volume2 className="mb-3 h-7 w-7" />
                <h2 className="text-2xl font-black">{language === "ru" ? "Произношение слов" : "So‘z talaffuzi"}</h2>
                <p className="mt-2 text-sm font-semibold">{language === "ru" ? "Слушайте слово и повторяйте произношение." : "So‘zni eshiting va talaffuzni takrorlang."}</p>
              </button>
            </div>
            {mode === "retell" ? (
              <>
                <div className="mb-5">
                  <UsageLimitOverview usageType="speaking_meaning_check" />
                </div>
                {task ? <SpeakingRetellTask task={task} language={language} onNext={() => setTaskIndex((value) => (value + 1) % tasks.length)} /> : null}
              </>
            ) : word ? (
              <>
                <SpeakingPracticeCard
                  wordId={word.id}
                  hanzi={word.chinese}
                  pinyin={word.pinyin}
                  translationUz={word.translationUz}
                  translationRu={word.translationRu ?? word.translationUz}
                  hskLevel={level}
                  lessonId={word.lessonId}
                  onCorrect={saveSpeakingResult}
                  onWrong={saveSpeakingResult}
                  onNext={() => setIndex((value) => (value + 1) % words.length)}
                />
                <div className="mt-5 rounded-4xl bg-white/82 p-4 text-sm font-black text-stone-600 shadow-soft">
                  <Mic className="mr-2 inline h-5 w-5 text-orange-brand" />
                  {index + 1}/{words.length}
                </div>
              </>
            ) : null}
          </>
        )}
      </section>
    </ProtectedRoute>
  );
}
