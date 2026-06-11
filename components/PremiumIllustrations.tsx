"use client";

import { motion } from "framer-motion";
import { Bot, BookOpen, GraduationCap, Sparkles, Star } from "lucide-react";
import { useI18n } from "@/utils/i18n";

export function FloatingCharacters() {
  const chars = ["你", "好", "学", "汉", "语", "谢"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {chars.map((char, index) => (
        <motion.span
          key={char}
          initial={{ opacity: 0, y: 18, rotate: -8 }}
          animate={{ opacity: [0.18, 0.48, 0.18], y: [-6, -22, -6], rotate: [-8, 8, -8] }}
          transition={{ duration: 5 + index, repeat: Infinity, delay: index * 0.45 }}
          className="absolute rounded-3xl bg-white/55 px-3 py-2 text-2xl font-black text-orange-deep shadow-soft backdrop-blur dark:bg-white/10 dark:text-orange-200"
          style={{ left: `${12 + index * 14}%`, top: `${12 + (index % 3) * 23}%` }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

export function MascotIllustration({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative mx-auto ${compact ? "h-44 w-44" : "h-72 w-72 sm:h-80 sm:w-80"}`}
    >
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-8 rounded-[2.5rem] bg-gradient-to-br from-orange-brand via-orange-hot to-amber-300 shadow-glow"
      />
      <div className="absolute inset-12 rounded-[2rem] border border-white/60 bg-white/88 shadow-premium backdrop-blur dark:border-white/10 dark:bg-white/12">
        <div className="absolute left-1/2 top-8 h-20 w-32 -translate-x-1/2 rounded-[2rem] bg-ink dark:bg-cream" />
        <div className="absolute left-[34%] top-14 h-5 w-5 rounded-full bg-mint" />
        <div className="absolute right-[34%] top-14 h-5 w-5 rounded-full bg-mint" />
        <div className="absolute left-1/2 top-[5.8rem] h-4 w-16 -translate-x-1/2 rounded-full bg-orange-brand" />
        <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-black text-ink shadow-soft dark:bg-obsidian dark:text-cream">
          <Bot className="h-4 w-4 text-orange-brand" />
          HSK AI
        </div>
      </div>
      <motion.div
        animate={{ rotate: [6, -8, 6], y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-1 top-14 rounded-3xl bg-mint p-4 shadow-soft"
      >
        <BookOpen className="h-8 w-8 text-emerald-700" />
      </motion.div>
      <motion.div
        animate={{ rotate: [-8, 7, -8], y: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-3 bottom-16 rounded-3xl bg-lavender p-4 shadow-soft"
      >
        <GraduationCap className="h-8 w-8 text-violet-700" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.14, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute right-8 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-brand shadow-card dark:bg-white/15"
      >
        <Sparkles className="h-6 w-6" />
      </motion.div>
    </motion.div>
  );
}

export function StudyScene() {
  const { t } = useI18n();
  return (
    <div className="relative min-h-[250px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-orange-soft to-skysoft p-6 shadow-premium dark:from-white/12 dark:via-orange-brand/18 dark:to-sky-500/14">
      <FloatingCharacters />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-orange-deep shadow-soft dark:bg-white/10 dark:text-orange-200">
            {t("illustration.studyStudio")}
          </span>
          <Star className="h-6 w-6 fill-orange-brand text-orange-brand" />
        </div>
        <MascotIllustration compact />
        <div className="grid grid-cols-3 gap-3">
          {[t("common.flashcards"), t("common.quiz"), t("illustration.tutor")].map((item) => (
            <div key={item} className="rounded-3xl bg-white/75 p-3 text-center text-xs font-black text-ink shadow-soft backdrop-blur dark:bg-white/10 dark:text-cream">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
