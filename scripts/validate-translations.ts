import uz from "../locales/uz.json";
import ru from "../locales/ru.json";
import en from "../locales/en.json";

type Dictionary = Record<string, string>;
type Locale = "uz" | "ru" | "en";

const dictionaries: Array<{ locale: Locale; values: Dictionary }> = [
  { locale: "uz", values: uz as Dictionary },
  { locale: "ru", values: ru as Dictionary },
  { locale: "en", values: en as Dictionary }
];

const allowedLatinWords = new Set([
  "AI",
  "HSK",
  "Premium",
  "XP",
  "Stripe",
  "Supabase",
  "OpenAI",
  "PWA",
  "PDF",
  "Vercel",
  "Webhook",
  "URL",
  "API",
  "email",
  "pinyin",
  "hanzi"
]);

const englishUiWords = /\b(home|dashboard|settings|profile|lesson|lessons|quiz|flashcard|practice|review|progress|start|continue|next|back|cancel|success|failed|error|checkout|subscription|subscribe|payment|premium plan|locked|unlocked|result|results|help|challenge|roadmap|exam center|usage|limit|used|left)\b/i;
const errors: string[] = [];

function stripAllowedWords(value: string) {
  return [...allowedLatinWords].reduce((text, word) => text.replace(new RegExp(`\\b${word}\\b`, "gi"), ""), value);
}

for (const { locale, values } of dictionaries) {
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "string") {
      errors.push(`${locale}.${key}: qiymat string emas`);
      continue;
    }
    if (!value.trim() && key !== "hero.titleEnd") {
      errors.push(`${locale}.${key}: tarjima bo‘sh`);
      continue;
    }
    const normalized = stripAllowedWords(value);
    if (locale !== "en" && englishUiWords.test(normalized)) {
      errors.push(`${locale}.${key}: inglizcha UI so‘z topildi -> ${value}`);
    }
    if (locale === "uz" && /[а-яё]/i.test(value)) {
      errors.push(`${locale}.${key}: Uzbek UI ichida kirill matni bor -> ${value}`);
    }
  }
}

const uzKeys = new Set(Object.keys(uz));
for (const { locale, values } of dictionaries) {
  const keys = new Set(Object.keys(values));
  for (const key of uzKeys) {
    if (!keys.has(key)) errors.push(`${locale}.${key}: kalit yetishmaydi`);
  }
  for (const key of keys) {
    if (!uzKeys.has(key)) errors.push(`uz.${key}: kalit yetishmaydi`);
  }
}

if (errors.length) {
  console.error(`Tarjima validatsiyasi xato: ${errors.length}`);
  for (const error of errors.slice(0, 120)) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Tarjima validatsiyasi muvaffaqiyatli o‘tdi.");
