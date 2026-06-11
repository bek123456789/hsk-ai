export function ProgressRing({ value, label, size = 116 }: { value: number; label?: string; size?: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="10" fill="none" className="text-white/55 dark:text-white/10" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-orange-brand drop-shadow"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-black text-ink dark:text-cream">{value}%</p>
        {label ? <p className="text-[10px] font-black uppercase text-stone-500 dark:text-stone-300">{label}</p> : null}
      </div>
    </div>
  );
}
