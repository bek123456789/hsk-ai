import uz from "../locales/uz.json";

type Dictionary = Record<string, string>;

const values = uz as Dictionary;
const errors: string[] = [];
const forbiddenPlaceholders = /\b(TODO|lorem|undefined|\[object Object\]|placeholder)\b/i;

for (const [key, value] of Object.entries(values)) {
  if (typeof value !== "string") {
    errors.push(`${key}: qiymat string emas`);
    continue;
  }

  if (!value.trim() && key !== "hero.titleEnd") {
    errors.push(`${key}: tarjima bo‘sh`);
    continue;
  }

  if (forbiddenPlaceholders.test(value)) {
    errors.push(`${key}: placeholder/test matn topildi -> ${value}`);
  }

  if (/[а-яё]/i.test(value)) {
    errors.push(`${key}: Uzbek UI ichida kirill matni bor -> ${value}`);
  }
}

if (errors.length) {
  console.error(`Uzbek tarjima validatsiyasi xato: ${errors.length}`);
  for (const error of errors.slice(0, 120)) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Uzbek tarjima validatsiyasi muvaffaqiyatli o‘tdi.");
