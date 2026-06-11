"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppLanguage } from "@/types";

type LanguageState = {
  language: AppLanguage;
  hasHydrated: boolean;
  setLanguage: (language: AppLanguage) => void;
  setHydrated: (value: boolean) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "uz",
      hasHydrated: false,
      setLanguage: (language) => set({ language }),
      setHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: "hsk-ai-language",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
