import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-[1.75rem] border border-orange-soft/60 bg-white/88 p-5 shadow-soft">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-black text-stone-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-ink">{value}</p>
      {detail ? <p className="mt-1 text-xs font-bold text-stone-500">{detail}</p> : null}
    </div>
  );
}
