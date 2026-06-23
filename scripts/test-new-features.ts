import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "components/HanziWritingPad.tsx",
  "app/stroke-order/word/[wordId]/page.tsx",
  "app/writing/[level]/page.tsx",
  "app/writing-practice/page.tsx"
];

const requiredTranslationKeys = [
  "writing.clear",
  "writing.undo",
  "writing.showGuide",
  "writing.hideGuide",
  "writing.tryFirst",
  "writing.saved",
  "writing.wroteWell",
  "writing.needPractice",
  "writing.drawingArea",
  "writing.practice"
];

const failures: string[] = [];

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) failures.push(`${file} topilmadi`);
}

const padSource = readFileSync(path.join(root, "components/HanziWritingPad.tsx"), "utf8");
for (const snippet of ["<canvas", "onPointerDown", "onPointerMove", "onPointerUp", "touch-none", "saveOptionalFeatureResult", "writing_practice_results"]) {
  if (!padSource.includes(snippet)) failures.push(`HanziWritingPad ichida ${snippet} topilmadi`);
}

for (const locale of ["uz"]) {
  const data = JSON.parse(readFileSync(path.join(root, `locales/${locale}.json`), "utf8")) as Record<string, string>;
  for (const key of requiredTranslationKeys) {
    if (!data[key]) failures.push(`${locale}.json: ${key} yo‘q`);
  }
}

if (failures.length) {
  console.error("New feature smoke test xato:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("New feature smoke test muvaffaqiyatli o‘tdi.");
