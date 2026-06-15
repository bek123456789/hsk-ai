"use client";

import { Award, BookOpenCheck, Flame, Mic, Sparkles, Target, Trophy } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { achievements } from "@/data/achievements";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

const icons = [BookOpenCheck, Target, Award, Trophy, Mic, Flame, Trophy, Sparkles];

export default function AchievementsPage() {
  const { language } = useI18n();
  const state = useProgressStore();
  const user = useAuthStore((value) => value.user);
  const unlocked = (id: string) => {
    if (id === "first-lesson") return state.knownWordIds.length > 0;
    if (id === "first-10") return state.knownWordIds.length >= 10;
    if (id === "words-50") return state.knownWordIds.length >= 50;
    if (id === "words-100") return state.knownWordIds.length >= 100;
    if (id === "first-quiz") return state.quizResults.length > 0;
    if (id === "first-speaking") return state.speakingResults.length > 0;
    if (id === "streak-7") return state.streak >= 7;
    if (id === "exam-pass") return state.passedLevels.length > 0;
    if (id === "certificate") return state.certificates.length > 0;
    if (id === "hsk1-ready") return (state.bestScoreByLevel?.[1] ?? 0) >= 80;
    if (id === "premium-learner") return isPremiumProfile(user);
    return isPremiumProfile(user);
  };
  const unlockedCount = achievements.filter((item) => unlocked(item.id)).length;

  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader eyebrow={`${unlockedCount}/${achievements.length}`} title={language === "ru" ? "Достижения" : "Yutuqlar"} description={language === "ru" ? "Открывайте значки за уроки, серию дней, слова и экзамены." : "Darslar, kunlik seriya, so‘zlar va imtihonlar uchun nishonlarni oching."} icon={Award} />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {achievements.map((item, index) => {
            const Icon = icons[index % icons.length];
            const open = unlocked(item.id);
            return <article key={item.id} className={`rounded-[2rem] border p-6 shadow-premium ${open ? "border-orange-soft bg-gradient-to-br from-white to-orange-soft/50" : "border-stone-200 bg-white/65 opacity-70"}`}><div className={`flex h-16 w-16 items-center justify-center rounded-3xl ${open ? "bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow" : "bg-stone-100 text-stone-400"}`}><Icon className="h-8 w-8" /></div><p className="mt-5 text-xs font-black uppercase text-orange-deep">{open ? (language === "ru" ? "Значок открыт" : "Nishon ochildi") : (language === "ru" ? "Следующее достижение" : "Keyingi yutuq")}</p><h2 className="mt-2 text-2xl font-black text-ink">{language === "ru" ? item.titleRu : item.titleUz}</h2><p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{language === "ru" ? item.detailRu : item.detailUz}</p></article>;
          })}
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
