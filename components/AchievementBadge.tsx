import type { LucideIcon } from "lucide-react";

export function AchievementBadge({ icon: Icon, title, detail, unlocked = true }: { icon: LucideIcon; title: string; detail: string; unlocked?: boolean }) {
  return (
    <div className={`rounded-[1.75rem] border p-4 shadow-soft transition hover:-translate-y-1 ${
      unlocked
        ? "border-white/70 bg-white/82"
        : "border-white/60 bg-white/45 opacity-60"
    }`}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-card">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-black text-ink">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-stone-500">{detail}</p>
    </div>
  );
}
