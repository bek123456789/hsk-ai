import { motion } from "framer-motion";

export function QuizOption({ option, selected, correct, disabled, onClick }: { option: string; selected: boolean; correct: boolean; disabled: boolean; onClick: () => void }) {
  const stateClass = selected
    ? correct
      ? "border-emerald-400 bg-mint text-emerald-800 shadow-[0_18px_50px_rgba(16,185,129,0.2)]"
      : "border-red-300 bg-red-50 text-red-700 shadow-[0_18px_50px_rgba(239,68,68,0.15)]"
    : disabled && correct
      ? "border-emerald-400 bg-mint text-emerald-800"
      : "border-white/80 bg-white/82 text-ink hover:border-orange-brand hover:bg-orange-soft dark:border-white/10 dark:bg-white/10 dark:text-cream dark:hover:bg-white/15";

  return (
    <motion.button
      whileHover={!disabled ? { y: -4, scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      animate={selected ? { scale: [1, 1.03, 1] } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-[1.7rem] border-2 px-5 py-5 text-left text-base font-black shadow-soft backdrop-blur transition ${stateClass}`}
    >
      {option}
    </motion.button>
  );
}
