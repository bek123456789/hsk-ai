"use client";

import { ArrowRight, BookOpen, Clock3, Headphones, Lock, MessageCircle, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProgressRing } from "@/components/ProgressRing";
import { getCurriculumLessonsByLevel, type LessonSkillFocus } from "@/data/hsk/lessonCurriculum";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { calculateLessonProgress } from "@/utils/lessonPlanner";
import { isPremiumProfile } from "@/utils/premium";
import { getLevelLockReason, isLevelUnlocked } from "@/utils/hskUnlock";

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
                const progressionLocked = !isLevelUnlocked(group.level, { knownWordIds }, examAttempts);
                const premiumLocked = lesson.isPremium && !premium;
                const locked = progressionLocked || premiumLocked;
                const progress = mounted ? calculateLessonProgress(lesson, knownWordIds) : 0;
                return (
                  <article key={lesson.id} className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-premium transition hover:-translate-y-1">
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] bg-orange-soft/70" />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep shadow-soft">
                          {locked ? <Lock className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                        </div>
                        <ProgressRing value={progress} size={78} />
                      </div>
                      <p className="mt-5 text-xs font-black uppercase tracking-normal text-orange-deep">HSK {lesson.level} · {lesson.order}</p>
                      <h3 className="mt-2 text-2xl font-black leading-tight text-ink">{language === "ru" ? lesson.titleRu : lesson.titleUz}</h3>
                      <p className="mt-3 min-h-16 text-sm font-semibold leading-6 text-stone-600">{language === "ru" ? lesson.descriptionRu : lesson.descriptionUz}</p>
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
                      <AppButton href={progressionLocked ? `/exam/${Math.max(1, lesson.level - 1)}` : premiumLocked ? "/premium" : `/lesson/${lesson.level}/${lesson.id}`} className="mt-5 w-full" variant={locked ? "secondary" : "primary"}>
                        {progressionLocked
                          ? (language === "ru" ? "Сначала предыдущий экзамен" : "Avval oldingi imtihon")
                          : premiumLocked
                            ? (language === "ru" ? "Нужен Premium" : "Premium kerak")
                            : progress > 0 ? (language === "ru" ? "Продолжить" : "Davom etish") : (language === "ru" ? "Начать урок" : "Darsni boshlash")}
                        {locked ? <Sparkles className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                      </AppButton>
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
