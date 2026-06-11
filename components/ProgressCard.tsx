import type { LucideIcon } from "lucide-react";

export function ProgressCard({ title, value, detail, icon: Icon, tone = "orange" }: { title: string; value: string; detail: string; icon: LucideIcon; tone?: "orange" | "green" | "blue" | "purple" }) {
  const tones = {
    orange: "bg-orange-soft text-orange-deep",
    green: "bg-mint text-emerald-700",
    blue: "bg-skysoft text-sky-700",
    purple: "bg-lavender text-violet-700"
  };

  return (
    <div className="group relative overflow-hidden rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-brand/10 blur-2xl transition group-hover:bg-orange-brand/20" />
      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-3xl ${tones[tone]}`}>
        <Icon className="h-7 w-7" />
      </div>
      <p className="relative text-sm font-black uppercase tracking-normal text-stone-400 dark:text-stone-300">{title}</p>
      <p className="relative mt-2 text-4xl font-black text-ink dark:text-cream">{value}</p>
      <p className="relative mt-2 text-sm font-semibold text-stone-500 dark:text-stone-300">{detail}</p>
    </div>
  );
}
