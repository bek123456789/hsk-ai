const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function main() {
  const response = await fetch(`${appUrl.replace(/\/$/, "")}/api/ai/health?language=uz`);
  if (!response.ok) {
    console.error(`AI health tekshiruvi xato: HTTP ${response.status}`);
    process.exit(1);
  }

  const body = (await response.json()) as {
    openAiKeyConfigured?: boolean;
    aiTutorReady?: boolean;
    usageLimitReady?: boolean;
    supabaseReady?: boolean;
    modelConfigured?: boolean;
    ok?: boolean;
    message?: string;
  };

  const requiredKeys = ["openAiKeyConfigured", "aiTutorReady", "usageLimitReady", "supabaseReady", "modelConfigured", "ok"];
  const missing = requiredKeys.filter((key) => typeof body[key as keyof typeof body] !== "boolean");
  if (missing.length) {
    console.error(`AI health javobida maydon yetishmaydi: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (!body.openAiKeyConfigured) {
    console.log("AI health: OPENAI_API_KEY sozlanmagan. Lokal .env.local ichida server-only kalit qo‘shing.");
    return;
  }

  console.log(body.ok ? "AI health: AI yordamchi tayyor." : `AI health: ${body.message ?? "sozlamalarni tekshirish kerak"}`);
}

main().catch((error) => {
  console.error(`AI health tekshiruvini bajarib bo‘lmadi: ${error instanceof Error ? error.message : "noma’lum xatolik"}`);
  process.exit(1);
});

export {};
