import type { LucideIcon } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 rounded-[2rem] border border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/35 p-6 shadow-premium sm:p-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase text-orange-deep">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink sm:text-6xl">{title}</h1>
        <p className="mt-4 text-base font-semibold leading-7 text-stone-600 sm:text-lg">{description}</p>
      </div>
      {Icon ? (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow">
          <Icon className="h-10 w-10" />
        </div>
      ) : null}
    </header>
  );
}
