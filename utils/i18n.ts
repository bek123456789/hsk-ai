"use client";

import uz from "@/locales/uz.json";
import ru from "@/locales/ru.json";
import { useLanguageStore } from "@/store/languageStore";
import type { AppLanguage, HSKWord } from "@/types";

const dictionaries = { uz, ru } as const;

export const languageOptions: Array<{ value: AppLanguage; label: string }> = [
  { value: "uz", label: "O‘zbek 🇺🇿" },
  { value: "ru", label: "Русский 🇷🇺" }
];

export function useI18n() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);
  const effectiveLanguage = hasHydrated ? language : "uz";

  function t(key: keyof typeof uz) {
    return dictionaries[effectiveLanguage][key] || dictionaries.uz[key] || key;
  }

  return { language: effectiveLanguage, setLanguage, t };
}

export function getWordTranslation(word: HSKWord, language: AppLanguage) {
  if (language === "ru") return word.translationRu || word.translationUz;
  return word.translationUz;
}

export function getWordExample(word: HSKWord, language: AppLanguage) {
  if (language === "ru") return word.exampleRu || word.exampleUz;
  return word.exampleUz;
}
