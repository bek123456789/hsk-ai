"use client";

import uz from "@/locales/uz.json";
import ru from "@/locales/ru.json";
import en from "@/locales/en.json";
import { useLanguageStore } from "@/store/languageStore";
import type { AppLanguage, HSKWord } from "@/types";

const dictionaries = { uz, ru, en } as const;

export const languageOptions: Array<{ value: AppLanguage; label: string }> = [
  { value: "uz", label: "O‘zbek 🇺🇿" },
  { value: "ru", label: "Русский 🇷🇺" },
  { value: "en", label: "English 🇬🇧" }
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
  if (language === "en") return word.translationUz || word.translationRu || word.chinese;
  return word.translationUz;
}

export function getWordExample(word: HSKWord, language: AppLanguage) {
  if (language === "ru") return word.exampleRu || word.exampleUz;
  if (language === "en") return word.exampleUz || word.exampleRu || word.exampleChinese;
  return word.exampleUz;
}
