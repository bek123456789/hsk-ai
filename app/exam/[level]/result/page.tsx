"use client";

import { ArrowRight, BadgeCheck, BookOpen, Clock3, Headphones, Mic, PenLine, RotateCcw, Target, Trophy } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getCurriculumLesson } from "@/data/hsk/lessonCurriculum";
import { useProgressStore } from "@/store/progressStore";
import type { ExamSkill, HSKLevel } from "@/types";
import { formatSeconds } from "@/utils/exam";
import { EXAM_PASSING_SCORE } from "@/utils/examScoring";
import { useI18n } from "@/utils/i18n";
import { parseHskLevel } from "@/utils/level";

const icons = { listening: Headphones, reading: BookOpen, speaking: Mic, writing: PenLine };

function skillLabel(skill: ExamSkill, language: "uz" | "ru") {
  const labels = {
    uz: { listening: "Listening bo‘limi", reading: "O‘qish bo‘limi", speaking: "Speaking bo‘limi", writing: "Writing bo‘limi" },
    ru: { listening: "Раздел аудирования", reading: "Раздел чтения", speaking: "Раздел говорения", writing: "Раздел письма" }
  };
  return labels[language][skill];
}

export default function ExamResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const level = parseHskLevel(params.level);
  const attemptId = searchParams.get("attempt");
  const attempts = useProgressStore((state) => state.examAttempts);
  const { language } = useI18n();
  const attempt = attempts.find((item) => item.id === attemptId) ?? attempts.find((item) => item.hskLevel === level);

  if (!attempt) {
    return (
      <ProtectedRoute>
        <section className="mx-auto max-w-3xl px-5 py-14">
          <Card className="p-10 text-center">
            <h1 className="text-4xl font-black text-ink">{language === "ru" ? "Результат не найден" : "Natija topilmadi"}</h1>
            <AppButton href={`/exam/${level}`} className="mt-6">{language === "ru" ? "Начать экзамен" : "Imtihonni boshlash"}</AppButton>
          </Card>
        </section>
      </ProtectedRoute>
    );
  }

  const overallScore = attempt.overallScore ?? attempt.accuracy;
  const passed = attempt.passed ?? overallScore >= EXAM_PASSING_SCORE;
  const sectionEntries = attempt.sections ? Object.entries(attempt.sections) as Array<[ExamSkill, NonNullable<typeof attempt.sections>[ExamSkill]]> : [];
  const recommended = (attempt.recommendedLessonIds ?? [])
    .map((lessonId) => getCurriculumLesson(level, lessonId))
    .filter(Boolean);
  const wrongAnswers = attempt.answers.filter((answer) => !answer.correct);

  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-6xl px-4 pb-36 pt-8 sm:px-8 md:pb-10 lg:py-12">
        <Card className="overflow-hidden p-6 sm:p-10">
          <div className="text-center">
            <span className={`mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] text-white shadow-glow ${passed ? "bg-gradient-to-br from-emerald-500 to-emerald-300" : "bg-gradient-to-br from-orange-brand to-amber-300"}`}>
              {passed ? <BadgeCheck className="h-12 w-12" /> : <Target className="h-12 w-12" />}
            </span>
            <p className="mt-5 text-sm font-black uppercase text-orange-deep">HSK {level} · {language === "ru" ? "Результат" : "Natija"}</p>
            <h1 className="mt-2 text-5xl font-black text-ink">{overallScore}%</h1>
            <p className={`mt-3 text-xl font-black ${passed ? "text-emerald-700" : "text-orange-deep"}`}>
              {passed
                ? language === "ru" ? "Вы прошли" : "O‘tdingiz"
                : language === "ru" ? "Попробуйте снова" : "Qayta urinib ko‘ring"}
            </p>
            <p className="mt-2 text-sm font-bold text-stone-500">{language === "ru" ? "Проходной балл" : "O‘tish bali"}: {attempt.passingScore ?? EXAM_PASSING_SCORE}%</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sectionEntries.length ? sectionEntries.map(([skill, result]) => {
              const Icon = icons[skill];
              return (
                <div key={skill} className="rounded-[1.6rem] border border-orange-soft/70 bg-cream p-5">
                  <Icon className="h-6 w-6 text-orange-brand" />
                  <p className="mt-3 text-sm font-black text-stone-500">{skillLabel(skill, language)}</p>
                  <p className="mt-1 text-3xl font-black text-ink">{result.score}%</p>
                  <p className="mt-2 text-xs font-bold text-stone-500">{result.correct}/{result.total}</p>
                </div>
              );
            }) : (
              <div className="col-span-full rounded-3xl bg-cream p-5 text-center font-bold text-stone-600">
                {language === "ru" ? "Старый результат не содержит баллы по разделам." : "Eski natijada bo‘limlar kesimidagi ballar mavjud emas."}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 shadow-soft"><Trophy className="h-5 w-5 text-orange-brand" /><p className="mt-2 text-sm font-bold text-stone-500">{language === "ru" ? "Правильные ответы" : "To‘g‘ri javoblar"}</p><p className="mt-1 text-2xl font-black text-ink">{attempt.correctAnswers}</p></div>
            <div className="rounded-3xl bg-white p-5 shadow-soft"><Target className="h-5 w-5 text-orange-brand" /><p className="mt-2 text-sm font-bold text-stone-500">{language === "ru" ? "Неверные ответы" : "Noto‘g‘ri javoblar"}</p><p className="mt-1 text-2xl font-black text-ink">{attempt.wrongAnswers}</p></div>
            <div className="rounded-3xl bg-white p-5 shadow-soft"><Clock3 className="h-5 w-5 text-orange-brand" /><p className="mt-2 text-sm font-bold text-stone-500">{language === "ru" ? "Затраченное время" : "Sarflangan vaqt"}</p><p className="mt-1 text-2xl font-black text-ink">{formatSeconds(attempt.timeSpentSeconds)}</p></div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[1.8rem] bg-orange-50 p-6">
              <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Слабые разделы" : "Zaif bo‘limlar"}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(attempt.weakSkills ?? []).length
                  ? attempt.weakSkills?.map((skill) => <span key={skill} className="rounded-full bg-white px-4 py-2 text-sm font-black text-orange-deep shadow-soft">{skillLabel(skill, language)}</span>)
                  : <p className="font-semibold text-stone-600">{language === "ru" ? "Все разделы показали устойчивый результат." : "Barcha bo‘limlarda barqaror natija ko‘rsatildi."}</p>}
              </div>
            </div>
            <div className="rounded-[1.8rem] bg-cream p-6">
              <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Рекомендуемые уроки" : "Tavsiya qilingan darslar"}</h2>
              <div className="mt-4 space-y-2">
                {recommended.length ? recommended.map((lesson) => lesson ? (
                  <AppButton key={lesson.id} href={`/lesson/${level}/${lesson.id}`} variant="secondary" className="w-full justify-between">
                    <span className="truncate">{language === "ru" ? lesson.titleRu : lesson.titleUz}</span><ArrowRight className="h-4 w-4 shrink-0" />
                  </AppButton>
                ) : null) : <p className="font-semibold text-stone-600">{language === "ru" ? "Продолжайте повторение текущего уровня." : "Joriy darajani takrorlashda davom eting."}</p>}
              </div>
            </div>
          </div>

          {wrongAnswers.length ? (
            <div className="mt-7 rounded-[1.8rem] border border-orange-soft bg-white p-6">
              <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Разбор ответов" : "Javoblar tahlili"}</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {wrongAnswers.map((answer, index) => (
                  <div key={`${answer.questionId}-${index}`} className="min-w-0 rounded-3xl bg-cream p-5">
                    <p className="text-xs font-black text-orange-deep">{language === "ru" ? `Задание ${index + 1}` : `${index + 1}-topshiriq`}</p>
                    <p className="mt-3 break-words text-sm font-bold text-stone-500">{language === "ru" ? "Ваш ответ" : "Sizning javobingiz"}</p>
                    <p className="mt-1 break-words text-base font-black text-rose-700">{answer.selectedAnswer || (language === "ru" ? "Нет ответа" : "Javob berilmagan")}</p>
                    <p className="mt-3 break-words text-sm font-bold text-stone-500">{language === "ru" ? "Правильный ответ или образец" : "To‘g‘ri javob yoki namuna"}</p>
                    <p className="mt-1 break-words text-base font-black text-emerald-700">{answer.correctAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className={`mt-7 rounded-[1.8rem] p-6 ${passed ? "bg-emerald-50" : "bg-amber-50"}`}>
            <h2 className={`text-2xl font-black ${passed ? "text-emerald-800" : "text-amber-800"}`}>
              {passed
                ? level < 6
                  ? language === "ru" ? "Следующий уровень открыт" : "Keyingi daraja ochildi"
                  : language === "ru" ? "Уровень HSK 6 готов" : "HSK 6 tayyor"
                : language === "ru" ? "Следующий уровень остаётся закрытым" : "Keyingi daraja yopiq qoladi"}
            </h2>
            <p className="mt-2 font-semibold leading-7 text-stone-600">
              {passed
                ? level < 6
                  ? language === "ru" ? `Теперь доступны уроки HSK ${level + 1}.` : `Endi HSK ${level + 1} darslari ochildi.`
                  : language === "ru" ? "Вы успешно завершили всю учебную траекторию." : "Siz barcha o‘quv bosqichlarini muvaffaqiyatli yakunladingiz."
                : language === "ru" ? "Повторите слабые разделы и пересдайте экзамен. Требуется 80% или выше." : "Zaif bo‘limlarni takrorlab, imtihonni qayta topshiring. 80% yoki yuqori ball talab qilinadi."}
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <AppButton href={`/exam/${level}`} variant="secondary"><RotateCcw className="h-5 w-5" /> {language === "ru" ? "Пересдать" : "Qayta topshirish"}</AppButton>
            <AppButton href="/review" variant="secondary">{language === "ru" ? "Повторить практику" : "Qayta mashq qilish"}</AppButton>
            {passed ? (
              level < 6
                ? <AppButton href={`/lessons/${(level + 1) as HSKLevel}`}>{language === "ru" ? `Уроки HSK ${level + 1}` : `HSK ${level + 1} darslari`} <ArrowRight className="h-4 w-4" /></AppButton>
                : <AppButton href={`/certificate/${level}`}>{language === "ru" ? "Посмотреть сертификат" : "Sertifikatni ko‘rish"}</AppButton>
            ) : null}
          </div>
        </Card>
      </section>
    </ProtectedRoute>
  );
}
