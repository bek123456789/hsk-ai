"use client";

import { Award, BookOpenCheck, Flame, Headphones, MessageCircle, Mic, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { achievements } from "@/data/achievements";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";
import { getSpeakingTaskProgress } from "@/utils/speakingProgress";

const icons = [BookOpenCheck, Flame, Flame, Trophy, Trophy, Trophy, Award, Award, MessageCircle, Mic, Headphones, RotateCcw, Sparkles];

export default function AchievementsPage() {
  const { language } = useI18n();
  const state = useProgressStore();
  const user = useAuthStore((value) => value.user);

  const progressFor = (id: string) => {
    const listeningCount = state.learningActivityResults.filter((item) => item.type === "listening-lab").length;
    const reviewCount = Object.values(state.wordReviews ?? {}).filter((review) => review.lastReviewedAt).length;
    const speakingCount = Math.max(state.speakingResults.length, typeof window === "undefined" ? 0 : getSpeakingTaskProgress().length);
    const firstAi = typeof window === "undefined" ? 0 : Number(window.localStorage.getItem("hanziflow-first-ai-session") === "true");
    const valueMap: Record<string, number> = {
      "first-lesson": state.knownWordIds.length > 0 ? 1 : 0,
      "streak-7": state.streak,
      "streak-30": state.streak,
      "exam-pass": state.passedLevels.length,
      "hsk1-passed": state.bestScoreByLevel?.[1] ?? 0,
      "hsk2-passed": state.bestScoreByLevel?.[2] ?? 0,
      "words-100": state.knownWordIds.length,
      "words-500": state.knownWordIds.length,
      "first-ai": firstAi,
      "first-speaking": speakingCount,
      "listening-master": listeningCount,
      "review-champion": reviewCount,
      "premium-learner": isPremiumProfile(user) ? 1 : 0
    };
    const target = achievements.find((item) => item.id === id)?.target ?? 1;
    const current = Math.min(target, valueMap[id] ?? 0);
    return { current, target, percent: Math.min(100, Math.round((current / Math.max(1, target)) * 100)) };
  };

  const unlocked = (id: string) => progressFor(id).percent >= 100;
  const unlockedCount = achievements.filter((item) => unlocked(item.id)).length;

  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader eyebrow={`${unlockedCount}/${achievements.length}`} title={language === "ru" ? "Достижения" : "Yutuqlar"} description={language === "ru" ? "Значки открываются только по реальным урокам, серии дней, словам и экзаменам." : "Nishonlar faqat real dars, seriya, so‘z va imtihon natijalari asosida ochiladi."} icon={Award} />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {achievements.map((item, index) => {
            const Icon = icons[index % icons.length];
            const progress = progressFor(item.id);
            const open = progress.percent >= 100;
            return (
              <article key={item.id} className={`rounded-[2rem] border p-6 shadow-premium ${open ? "border-orange-soft bg-gradient-to-br from-white to-orange-soft/50" : "border-stone-200 bg-white/65"}`}>
                <div className={`flex h-16 w-16 items-center justify-center rounded-3xl ${open ? "bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow" : "bg-stone-100 text-stone-400"}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <p className="mt-5 text-xs font-black uppercase text-orange-deep">
                  {open ? (language === "ru" ? "Открыто" : "Ochilgan") : progress.percent >= 70 ? (language === "ru" ? "Почти готово" : "Yaqin qoldingiz") : (language === "ru" ? "Закрыто" : "Qulflangan")}
                </p>
                <h2 className="mt-2 text-2xl font-black text-ink">{language === "ru" ? item.titleRu : item.titleUz}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{language === "ru" ? item.detailRu : item.detailUz}</p>
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-black text-stone-500">
                    <span>{progress.current}/{progress.target}</span>
                    <span>{progress.percent}%</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream">
                    <div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${progress.percent}%` }} />
                  </div>
                </div>
                {open ? (
                  <button type="button" className="mt-5 rounded-full bg-orange-soft px-4 py-2 text-xs font-black text-orange-deep shadow-soft">
                    {language === "ru" ? "Поделиться" : "Ulashing"}
                  </button>
                ) : null}
              </article>
            );
          })}
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
