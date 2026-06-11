"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`rounded-5xl border border-white/75 bg-white/82 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10 ${className}`}
    >
      {children}
    </motion.div>
  );
}
