const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

const routes = [
  "/",
  "/login",
  "/register",
  "/premium",
  "/premium/success",
  "/dashboard",
  "/lesson",
  "/lesson/1",
  "/lesson/2",
  "/lesson/1/hsk1-lesson-01",
  "/lessons",
  "/lessons/1",
  "/lessons/1/hsk1-lesson-01",
  "/daily-plan",
  "/learning-path",
  "/progress-map",
  "/share/streak",
  "/mini-lessons",
  "/mini-lessons/1",
  "/grammar-bank",
  "/grammar-bank/1",
  "/listening-lab",
  "/sentence-builder",
  "/dictation",
  "/mistake-notebook",
  "/study-calendar",
  "/achievements",
  "/ai-explainer",
  "/placement-test",
  "/review",
  "/dictionary",
  "/hanzi-builder",
  "/tone-trainer",
  "/shadowing",
  "/mistakes/loop",
  "/sprint",
  "/study-plan",
  "/flashcard/1",
  "/reading/1",
  "/listening/1",
  "/speaking/1",
  "/quiz/1",
  "/ai-tutor",
  "/practice",
  "/speaking",
  "/exam",
  "/exam/1",
  "/exam/2",
  "/exam-simulator",
  "/exam-simulator/1",
  "/homework",
  "/reports",
  "/reports/parent",
  "/reports/teacher",
  "/rewards",
  "/challenges",
  "/challenges/vocabulary",
  "/challenges/listening",
  "/challenges/speaking",
  "/challenges/speed",
  "/roleplay",
  "/roleplay/restaurant",
  "/usage",
  "/profile",
  "/settings",
  "/mobile-app"
];

const allowedEnglish = [
  "HSK",
  "AI",
  "Premium",
  "Stripe",
  "Supabase",
  "OpenAI",
  "XP",
  "PWA",
  "PDF",
  "URL",
  "API"
];

const englishUiWords = /\b(dashboard|settings|profile|lesson|lessons|practice|review|progress|start|continue|next|back|cancel|success|failed|checkout|subscription|payment|locked|unlocked|result|results|challenge|roadmap|usage|limit)\b/i;

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripAllowed(text: string) {
  return allowedEnglish.reduce((current, word) => current.replace(new RegExp(`\\b${word}\\b`, "gi"), ""), text);
}

async function main() {
  const failures: string[] = [];

  for (const route of routes) {
    const response = await fetch(`${appUrl}${route}`, { redirect: "manual" }).catch((error: unknown) => {
      failures.push(`${route}: so‘rov bajarilmadi (${error instanceof Error ? error.message : "noma’lum xatolik"})`);
      return null;
    });

    if (!response) continue;
    const statusAllowed = response.status >= 200 && response.status < 400;
    if (!statusAllowed) {
      failures.push(`${route}: HTTP ${response.status}`);
      continue;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) continue;

    const html = await response.text();
    const visibleText = stripAllowed(stripHtml(html));
    if (/Application error|Unhandled Runtime Error|Hydration failed/i.test(visibleText)) {
      failures.push(`${route}: runtime/hydration xato matni topildi`);
    }
    if (englishUiWords.test(visibleText)) {
      failures.push(`${route}: inglizcha UI so‘z ehtimoli bor`);
    }
  }

  if (failures.length) {
    console.error(`UI smoke check xato: ${failures.length}`);
    for (const failure of failures.slice(0, 80)) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("UI smoke check muvaffaqiyatli o‘tdi.");
}

main().catch((error) => {
  console.error(`UI smoke check bajarilmadi: ${error instanceof Error ? error.message : "noma’lum xatolik"}`);
  process.exit(1);
});

export {};
