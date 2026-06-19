"use client";

import { ArrowRight, BookOpen, CheckCircle2, Clock3, Headphones, Lock, MessageCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProgressRing } from "@/components/ProgressRing";
import { getCurriculumLessonsByLevel, type LessonSkillFocus } from "@/data/hsk/lessonCurriculum";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { calculateLessonProgress, getAllLessonProgressRecords } from "@/utils/lessonPlanner";
import { isPremiumProfile } from "@/utils/premium";
import { getLevelLockReason, isLevelUnlocked } from "@/utils/hskUnlock";
import { getCurrentAvailableLesson, getLessonLockReason, isLessonCompleted, isLessonUnlocked } from "@/utils/lessonUnlock";

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];

export function LessonCurriculumList({ levelOnly }: { levelOnly?: HSKLevel }) {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("all");
  const premium = isPremiumProfile(user);
  const lessonProgress = mounted ? getAllLessonProgressRecords() : {};

  useEffect(() => setMounted(true), []);

  const groups = useMemo(
    () => {
      const visibleLevels = levelOnly ? [levelOnly] : levels;
      return (
      visibleLevels.map((level) => ({
        level,
        lessons: getCurriculumLessonsByLevel(level).filter((lesson) => {
          const text = `${lesson.titleUz} ${lesson.titleRu} ${lesson.descriptionUz} ${lesson.descriptionRu}`.toLowerCase();
          return (!query.trim() || text.includes(query.toLowerCase().trim())) && (skill === "all" || lesson.skillFocus.includes(skill as LessonSkillFocus));
        })
      }))
      );
    },
    [levelOnly, query, skill]
  );

  return (
    <>
      <div className="mb-8 grid gap-3 rounded-[2rem] border border-orange-soft/70 bg-white/88 p-4 shadow-premium sm:grid-cols-[1fr_220px]">
        <label className="flex min-w-0 items-center gap-3 rounded-full bg-cream px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-orange-brand" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={language === "ru" ? "Поиск урока" : "Dars qidirish"}
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none"
          />
        </label>
        <select value={skill} onChange={(event) => setSkill(event.target.value)} className="rounded-full bg-cream px-4 py-3 text-sm font-black text-ink outline-none">
          <option value="all">{language === "ru" ? "Все навыки" : "Barcha ko‘nikmalar"}</option>
          <option value="vocabulary">{language === "ru" ? "Слова" : "So‘zlar"}</option>
          <option value="grammar">{language === "ru" ? "Грамматика" : "Grammatika"}</option>
          <option value="reading">{language === "ru" ? "Чтение" : "O‘qish"}</option>
          <option value="listening">{language === "ru" ? "Аудирование" : "Tinglash"}</option>
          <option value="speaking">{language === "ru" ? "Говорение" : "Gapirish"}</option>
        </select>
      </div>

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.level}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-brand to-orange-hot text-lg font-black text-white shadow-card">{group.level}</span>
                <div>
                  <h2 className="text-2xl font-black text-ink">HSK {group.level}</h2>
                  <p className="text-sm font-bold text-stone-500">{group.lessons.length} {language === "ru" ? "уроков" : "ta dars"}</p>
                </div>
              </div>
              {!levelOnly ? (
                isLevelUnlocked(group.level, { knownWordIds }, examAttempts)
                  ? <AppButton href={`/lesson/${group.level}`} variant="secondary">{language === "ru" ? "Открыть уровень" : "Darajani ochish"} <ArrowRight className="h-4 w-4" /></AppButton>
                  : <span className="rounded-full bg-stone-100 px-4 py-2 text-xs font-black text-stone-500">{language === "ru" ? "Уровень закрыт" : "Daraja yopiq"}</span>
              ) : null}
            </div>
            {!isLevelUnlocked(group.level, { knownWordIds }, examAttempts) ? (
              <div className="mb-5 rounded-[1.5rem] border border-orange-soft bg-orange-50 p-5 text-sm font-bold leading-6 text-stone-600">
                {getLevelLockReason(group.level, { knownWordIds }, examAttempts, language)}
              </div>
            ) : null}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.lessons.map((lesson) => {
                const levelLocked = !isLevelUnlocked(group.level, { knownWordIds }, examAttempts);
                const sequenceUnlocked = mounted && isLessonUnlocked(group.level, lesson.id, { knownWordIds, lessonProgress }, examAttempts);
                const completed = mounted && isLessonCompleted(group.level, lesson.id, { knownWordIds, lessonProgress });
                const currentLesson = mounted ? getCurrentAvailableLesson(group.level, { knownWordIds, lessonProgress }) : group.lessons[0] ?? null;
                const current = !completed && sequenceUnlocked && currentLesson?.id === lesson.id;
                const progressionLocked = levelLocked || !sequenceUnlocked;
                const premiumLocked = lesson.isPremium && !premium;
                const locked = progressionLocked || premiumLocked;
                const progress = mounted ? calculateLessonProgress(lesson, knownWordIds) : 0;
                const lockReason = progressionLocked
                  ? getLessonLockReason(group.level, lesson.id, { knownWordIds, lessonProgress }, examAttempts, language)
                  : premiumLocked
                    ? (language === "ru" ? "Эта функция доступна в Premium." : "Bu funksiya Premium uchun.")
                    : "";
                return (
                  <article key={lesson.id} className={`relative overflow-hidden rounded-[2rem] border bg-white/90 p-6 shadow-premium transition hover:-translate-y-1 ${current ? "border-orange-brand/45 shadow-glow" : "border-white/80"}`}>
                    <div className={`absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] ${current ? "bg-gradient-to-br from-orange-soft to-amber-100" : "bg-orange-soft/70"}`} />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep shadow-soft">
                          {completed ? <CheckCircle2 className="h-6 w-6" /> : locked ? <Lock className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                        </div>
                        <ProgressRing value={progress} size={78} />
                      </div>
                      <p className="mt-5 text-xs font-black uppercase tracking-normal text-orange-deep">HSK {lesson.level} · {lesson.order}</p>
                      <h3 className="mt-2 text-2xl font-black leading-tight text-ink">{language === "ru" ? lesson.titleRu : lesson.titleUz}</h3>
                      <p className="mt-3 min-h-16 text-sm font-semibold leading-6 text-stone-600">{language === "ru" ? lesson.descriptionRu : lesson.descriptionUz}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className={`rounded-full px-3 py-2 text-xs font-black ${completed ? "bg-amber-50 text-amber-800" : locked ? "bg-stone-100 text-stone-500" : "bg-orange-soft text-orange-deep"}`}>
                          {completed ? (language === "ru" ? "Завершено" : "Yakunlandi") : locked ? (language === "ru" ? "Закрыто" : "Yopiq") : current ? (language === "ru" ? "Текущий урок" : "Joriy dars") : (progress > 0 ? (language === "ru" ? "Продолжить" : "Davom etish") : (language === "ru" ? "Открыто" : "Ochiq"))}
                        </span>
                        {!locked && !completed ? <span className="rounded-full bg-cream px-3 py-2 text-xs font-black text-stone-500">{language === "ru" ? "Уроки открываются по порядку" : "Darslar ketma-ket ochiladi"}</span> : null}
                        {current && progress > 0 ? <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-orange-deep shadow-soft">{language === "ru" ? "Следующий урок открыт" : "Keyingi dars ochildi"}</span> : null}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2 text-xs font-black text-stone-600">
                        <span className="rounded-full bg-cream px-3 py-2">{lesson.vocabularyIds.length} {language === "ru" ? "слов" : "so‘z"}</span>
                        <span className="rounded-full bg-cream px-3 py-2">{lesson.grammarIds.length} {language === "ru" ? "грамматика" : "grammatika"}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-2"><BookOpen className="h-3.5 w-3.5" /> {language === "ru" ? "чтение" : "o‘qish"}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-2"><Headphones className="h-3.5 w-3.5" /> {language === "ru" ? "аудио" : "tinglash"}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-2"><MessageCircle className="h-3.5 w-3.5" /> {language === "ru" ? "речь" : "gapirish"}</span>
                      </div>
                      <div className="mt-5 flex items-center justify-between rounded-3xl bg-orange-soft/55 px-4 py-3 text-sm font-black text-stone-700">
                        <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-orange-brand" /> {lesson.estimatedMinutes} {language === "ru" ? "мин" : "daq"}</span>
                        <span>{progress}%</span>
                      </div>
                      {lockReason ? <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-xs font-bold leading-5 text-stone-600">{lockReason}</p> : null}
                      {locked ? (
                        <AppButton disabled className="mt-5 w-full" variant="secondary">
                          {premiumLocked && !progressionLocked ? (language === "ru" ? "Нужен Premium" : "Premium kerak") : (language === "ru" ? "Закрыто" : "Yopiq")}
                          <Lock className="h-4 w-4" />
                        </AppButton>
                      ) : (
                        <AppButton href={`/lesson/${lesson.level}/${lesson.id}`} className="mt-5 w-full" variant={completed ? "secondary" : "primary"}>
                          {completed ? (language === "ru" ? "Повторить урок" : "Darsni qaytarish") : progress > 0 ? (language === "ru" ? "Продолжить" : "Davom etish") : (language === "ru" ? "Начать урок" : "Darsni boshlash")}
                          <ArrowRight className="h-4 w-4" />
                        </AppButton>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
