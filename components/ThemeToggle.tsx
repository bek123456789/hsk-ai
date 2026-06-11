"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("hsk-ai-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("hsk-ai-theme", next ? "dark" : "light");
  }

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="relative flex h-11 w-20 items-center rounded-full border border-white/60 bg-white/80 p-1 shadow-soft backdrop-blur transition dark:border-white/10 dark:bg-white/10"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-orange-brand text-white shadow-card transition ${
          dark ? "translate-x-9" : "translate-x-0"
        }`}
      >
        {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
    </button>
  );
}
