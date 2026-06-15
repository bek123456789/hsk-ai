"use client";

import { motion } from "framer-motion";
import { BookOpenCheck, CheckCircle2, Clock3, Headphones, Lock, Mic, PenLine, RotateCcw, Trophy } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { hskExamTemplates } from "@/data/hsk/examTemplates";
import { getCurriculumLessonsByLevel } from "@/data/hsk/lessonCurriculum";
import { useProgressStore } from "@/store/progressStore";
import { getBestExamScore, getCompletedLessonCount, getExamLockReason, isExamUnlocked, isLevelUnlocked } from "@/utils/hskUnlock";
import { useI18n } from "@/utils/i18n";

export default function ExamCenterPage() {
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const { language } = useI18n();
  const progress = { knownWordIds };

  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-7xl px-4 pb-36 pt-8 sm:px-8 md:pb-10 lg:py-12">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase text-orange-deep">{language === "ru" ? "Экзамены для подготовки к HSK" : "HSK tayyorgarlik imtihonlari"}</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Экзаменационный центр" : "Imtihon markazi"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru"
              ? "Завершайте уроки, сдавайте экзамен на 80% или выше и открывайте следующий уровень по порядку."
              : "Darslarni yakunlang, imtihondan 80% yoki yuqori ball oling va keyingi darajani ketma-ket oching."}
          </p>
          <p className="mt-4 rounded-3xl border border-orange-soft bg-orange-50 px-5 py-3 text-sm font-black leading-6 text-orange-deep">
            {language === "ru" ? "Это оригинальные тренировочные экзамены в стиле HSK, а не официальные экзамены." : "Bular rasmiy imtihonlar emas, original HSK uslubidagi tayyorgarlik imtihonlaridir."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hskExamTemplates.map((template, index) => {
            const level = template.level;
            const levelOpen = isLevelUnlocked(level, progress, examAttempts);
            const examOpen = isExamUnlocked(level, progress, examAttempts);
            const bestScore = getBestExamScore(level, examAttempts);
            const passed = bestScore >= template.passingScore;
            const lessons = getCurriculumLessonsByLevel(level);
            const completedLessons = getCompletedLessonCount(level, progress);
            const lockReason = getExamLockReason(level, progress, examAttempts, language);
            const status = passed
              ? language === "ru" ? "Пройдено" : "O‘tildi"
              : examOpen
                ? language === "ru" ? "Открыто" : "Ochiq"
                : language === "ru" ? "Закрыто" : "Yopiq";

            return (
              <motion.div key={template.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <Card className={`relative h-full overflow-hidden p-6 ${examOpen || passed ? "" : "bg-stone-50/90"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-orange-deep">{language === "ru" ? template.titleRu : template.titleUz}</p>
                      <h2 className="mt-2 text-4xl font-black text-ink">HSK {level}</h2>
                    </div>
                    <span className={`flex h-14 w-14 items-center justify-center rounded-3xl ${passed ? "bg-emerald-50 text-emerald-700" : examOpen ? "bg-orange-soft text-orange-deep" : "bg-stone-100 text-stone-400"}`}>
                      {passed ? <CheckCircle2 className="h-7 w-7" /> : examOpen ? <Trophy className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-black shadow-soft">
                    <span className={passed ? "text-emerald-700" : examOpen ? "text-orange-deep" : "text-stone-500"}>{status}</span>
                    <span className="text-stone-500">{bestScore}%</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-black text-stone-600">
                    <span className="rounded-2xl bg-cream p-3"><Clock3 className="mb-2 h-4 w-4 text-orange-brand" />{template.estimatedMinutes} {language === "ru" ? "минут" : "daqiqa"}</span>
                    <span className="rounded-2xl bg-cream p-3"><BookOpenCheck className="mb-2 h-4 w-4 text-orange-brand" />{completedLessons}/{lessons.length} {language === "ru" ? "уроков" : "dars"}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {[
                      [Headphones, language === "ru" ? "Ауд." : "Ting."],
                      [BookOpenCheck, language === "ru" ? "Чтен." : "O‘qish"],
                      [Mic, language === "ru" ? "Говор." : "Gap."],
                      [PenLine, language === "ru" ? "Письм." : "Yoz."]
                    ].map(([Icon, label]) => {
                      const SkillIcon = Icon as typeof Headphones;
                      return <span key={String(label)} className="flex flex-col items-center rounded-2xl bg-white px-1 py-3 text-[10px] font-black text-stone-500 shadow-soft"><SkillIcon className="mb-1 h-4 w-4 text-orange-brand" />{String(label)}</span>;
                    })}
                  </div>

                  {!examOpen && !passed ? (
                    <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 text-sm font-bold leading-6 text-stone-600">
                      {lockReason}
                    </div>
                  ) : null}

                  <div className="mt-6">
                    {examOpen || passed ? (
                      <AppButton href={`/exam/${level}`} className="w-full">
                        {passed ? <RotateCcw className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
                        {passed
                          ? language === "ru" ? "Пересдать" : "Qayta topshirish"
                          : language === "ru" ? "Начать экзамен" : "Imtihonni boshlash"}
                      </AppButton>
                    ) : (
                      <AppButton href={levelOpen ? `/lessons/${level}` : level === 1 ? "/lessons/1" : `/exam/${level - 1}`} variant="secondary" className="w-full">
                        {levelOpen
                          ? language === "ru" ? "Завершить уроки" : "Darslarni yakunlash"
                          : language === "ru" ? "Предыдущий уровень" : "Avvalgi daraja"}
                      </AppButton>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </ProtectedRoute>
  );
}
