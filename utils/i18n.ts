"use client";

import uz from "@/locales/uz.json";
import type { AppLanguage, HSKWord } from "@/types";

export function useI18n(): {
  language: AppLanguage;
  t: (key: keyof typeof uz) => string;
} {
  const language: AppLanguage = "uz";

  function t(key: keyof typeof uz) {
    return uz[key] || key;
  }

  return { language, t };
}

export function getWordTranslation(word: HSKWord, _language: AppLanguage = "uz") {
  return word.translationUz;
}

export function getWordExample(word: HSKWord, _language: AppLanguage = "uz") {
  return word.exampleUz;
}
