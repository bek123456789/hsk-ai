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
      className={`rounded-[2rem] border border-white/85 bg-white/88 shadow-premium backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
