"use client";

import { ArrowRight, BadgeCheck, Bot, Brain, Crown, Lightbulb, LockKeyhole, Map, RefreshCcw, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { getAllLessonProgressRecords, type LessonProgressRecord } from "@/utils/lessonPlanner";
import { buildMasteryDiagnosis, saveMasteryDiagnosisCache, syncMasteryDiagnosisBestEffort } from "@/utils/masterySystem";
import { isPremiumProfile } from "@/utils/premium";

const drillTypeLabels = {
  meaning: "Ma’no",
  sentence: "Gap",
  listening: "Listening"
};

function Ring({ value }: { value: number }) {
  return (
    <div className="relative h-32 w-32 shrink-0">
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(#FF6B1A ${value * 3.6}deg, #FCE8D8 0deg)` }}
      />
      <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white shadow-soft">
        <span className="text-3xl font-black text-ink">{value}%</span>
      </div>
    </div>
  );
}

export default function MasteryPage() {
  const user = useAuthStore((state) => state.user);
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const wordReviews = useProgressStore((state) => state.wordReviews);
  const quizResults = useProgressStore((state) => state.quizResults);
  const mistakes = useProgressStore((state) => state.mistakes);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const practiceResults = useProgressStore((state) => state.practiceResults);
  const speakingResults = useProgressStore((state) => state.speakingResults);
  const currentLevel = useProgressStore((state) => state.currentLevel);
  const streak = useProgressStore((state) => state.streak);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgressRecord>>({});
  const premium = isPremiumProfile(user);

  useEffect(() => {
    setLessonProgress(getAllLessonProgressRecords());
  }, []);

  const diagnosis = useMemo(
    () => buildMasteryDiagnosis({
      currentLevel,
      knownWordIds,
      weakWordIds,
      wordReviews,
      quizResults,
      mistakes,
      examAttempts,
      practiceResults,
      speakingResults,
      lessonProgress,
      streak,
      premium
    }),
    [currentLevel, examAttempts, knownWordIds, lessonProgress, mistakes, practiceResults, premium, quizResults, speakingResults, streak, weakWordIds, wordReviews]
  );

  useEffect(() => {
    saveMasteryDiagnosisCache(diagnosis);
    void syncMasteryDiagnosisBestEffort(diagnosis, user?.id);
  }, [diagnosis, user?.id]);

  const topRecommendation = diagnosis.recommendations[0];
  const pass = diagnosis.passPrediction;

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-orange-soft px-4 py-2 text-xs font-black uppercase tracking-normal text-orange-deep">
              <Bot className="h-4 w-4" /> AI HSK Mastery System
            </p>
            <h1 className="mt-4 text-5xl font-black leading-tight text-ink sm:text-7xl">AI HSK Ustoz</h1>
            <p className="mt-4 max-w-3xl text-lg font-semibold leading-8 text-stone-600">
              Xatolaringiz sababini tushuntiradi, shaxsiy drill yaratadi va HSKdan o‘tish uchun keyingi eng foydali qadamni ko‘rsatadi.
            </p>
          </div>
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-5">
              <Ring value={pass.readiness} />
              <div className="min-w-0">
                <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HSKga tayyorlik</p>
                <h2 className="mt-1 break-words text-2xl font-black text-ink">HSK {pass.level} pass ehtimoli: {pass.probabilityUz}</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-stone-600">{pass.messageUz}</p>
              </div>
            </div>
          </Card>
        </div>

        {!diagnosis.hasEnoughData ? (
          <Card className="mb-8 p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-14 w-14 text-orange-brand" />
            <h2 className="mt-4 text-3xl font-black text-ink">Hali diagnoz uchun ma’lumot kam</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-stone-600">
              Hali tahlil qilish uchun ma’lumot yetarli emas. Avval 1 ta dars va 1 ta mini test bajaring.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <AppButton href="/lessons/1">1-darsni boshlash <ArrowRight className="h-4 w-4" /></AppButton>
              <AppButton href="/quiz/1" variant="secondary">Mini test</AppButton>
            </div>
          </Card>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="p-6 lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
                <Brain className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">Bugungi diagnoz</p>
                <h2 className="text-2xl font-black text-ink">Nimani bilasiz va nimani mustahkamlash kerak?</h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {diagnosis.diagnosisUz.map((item) => (
                <div key={item} className="rounded-[1.4rem] bg-cream/80 p-4 text-sm font-bold leading-7 text-stone-700">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Target className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">Eng katta xato sababi</p>
                <h2 className="text-2xl font-black text-ink">{diagnosis.biggestMistakeReason?.titleUz ?? "Hozircha aniq xato sababi yo‘q"}</h2>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold leading-7 text-stone-600">
              {diagnosis.biggestMistakeReason?.detailUz ?? "Bir nechta quiz, listening yoki speaking mashq bajarganingizdan keyin bu yerda xatolar sababi ko‘rinadi."}
            </p>
            {diagnosis.biggestMistakeReason ? (
              <div className="mt-5">
                <AppButton href="/mistakes" variant="secondary">Xatolar daftarini ko‘rish</AppButton>
              </div>
            ) : null}
          </Card>

          <Card className="p-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
                <Trophy className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">HSK pass ehtimoli</p>
                <h2 className="text-2xl font-black text-ink">{pass.readiness}% tayyorlik</h2>
              </div>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-orange-soft">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-orange-hot" style={{ width: `${pass.readiness}%` }} />
            </div>
            <div className="mt-5 space-y-2">
              {(pass.neededUz.length ? pass.neededUz : ["Bugun 1 ta dars va 1 ta review mashqini bajaring."]).map((item) => (
                <p key={item} className="rounded-2xl bg-cream/80 px-4 py-3 text-sm font-bold text-stone-700">{item}</p>
              ))}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
                <Map className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">Bugungi 15 daqiqalik reja</p>
                <h2 className="text-2xl font-black text-ink">Shaxsiy HSK Yo‘l</h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {diagnosis.recommendations.slice(0, 4).map((item, index) => (
                <div key={item.id} className="rounded-[1.5rem] border border-orange-soft/70 bg-white/80 p-4 shadow-soft">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-orange-deep">{index + 1}-qadam</p>
                      <h3 className="mt-1 break-words text-lg font-black text-ink">{item.titleUz}</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-stone-600">{item.detailUz}</p>
                    </div>
                    <AppButton href={item.href} variant={index === 0 ? "primary" : "secondary"} className="shrink-0">
                      Ochish <ArrowRight className="h-4 w-4" />
                    </AppButton>
                  </div>
                  <p className="mt-3 rounded-2xl bg-cream px-4 py-3 text-xs font-bold leading-5 text-stone-600">
                    Nega bu keyingi qadam? {item.whyUz}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
                <Zap className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">Xatoni tuzatish drilllari</p>
                <h2 className="text-2xl font-black text-ink">3 ta mini mashq</h2>
              </div>
            </div>
            {diagnosis.drills.length ? (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {diagnosis.drills.map((drill) => (
                  <div key={drill.id} className="rounded-[1.5rem] bg-cream/85 p-4">
                    <p className="text-xs font-black uppercase tracking-normal text-orange-deep">{drillTypeLabels[drill.type]}</p>
                    <h3 className="mt-2 text-base font-black leading-6 text-ink">{drill.questionUz}</h3>
                    {drill.promptZh ? <p className="mt-3 text-3xl font-black text-ink">{drill.promptZh}</p> : null}
                    {drill.promptPinyin ? <p className="mt-1 text-sm font-black text-orange-brand">{drill.promptPinyin}</p> : null}
                    <p className="mt-3 text-sm font-bold leading-6 text-stone-600">{drill.explanationUz}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-[1.5rem] bg-cream/85 p-5 text-sm font-bold leading-7 text-stone-600">
                Hali drill yaratish uchun xato topilmadi. Quiz yoki listening mashq bajarsangiz, AI HSK Ustoz shu xatodan mini mashqlar beradi.
              </p>
            )}
          </Card>

          <Card className="p-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
                <Lightbulb className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">Keyingi eng foydali qadam</p>
                <h2 className="text-2xl font-black text-ink">{topRecommendation?.titleUz ?? "Darsni boshlang"}</h2>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold leading-7 text-stone-600">
              {topRecommendation?.whyUz ?? "Boshlang‘ich progress paydo bo‘lishi uchun birinchi dars va mini test eng foydali qadam."}
            </p>
            <div className="mt-5">
              <AppButton href={topRecommendation?.href ?? "/lessons/1"} className="w-full">Boshlash <ArrowRight className="h-4 w-4" /></AppButton>
            </div>
            <div className="mt-5 rounded-[1.5rem] bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-amber-800">
                {premium ? <Crown className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
                {premium ? "Premium tahlil faol" : "Bepul tahlil"}
              </div>
              <p className="mt-2 text-xs font-bold leading-5 text-stone-600">{diagnosis.premiumSummaryUz}</p>
              {!premium ? <AppButton href="/premium" variant="secondary" className="mt-4 w-full"><Crown className="h-4 w-4" /> Premiumni ko‘rish</AppButton> : null}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">HSK Tayyorlik xaritasi</p>
                <h2 className="mt-1 text-2xl font-black text-ink">Zaif joylar</h2>
              </div>
              <AppButton href="/learning-path" variant="secondary">
                O‘quv yo‘lini ko‘rish <ArrowRight className="h-4 w-4" />
              </AppButton>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {(diagnosis.weakPointsUz.length ? diagnosis.weakPointsUz : ["Hozircha aniq zaif joy yo‘q"]).map((item) => (
                <span key={item} className="rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {diagnosis.knownHighlightsUz.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                  <BadgeCheck className="h-4 w-4" /> {item}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </ProtectedRoute>
  );
}
