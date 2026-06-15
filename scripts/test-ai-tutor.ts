const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
const token = process.env.TEST_SUPABASE_ACCESS_TOKEN ?? process.env.SUPABASE_ACCESS_TOKEN;

type AIHealthResponse = {
  openAiKeyConfigured?: boolean;
  aiTutorReady?: boolean;
  ok?: boolean;
};

type AITutorResponse = {
  reply?: string;
  error?: string;
  code?: string;
};

function hasChinese(text: string) {
  return /[\u3400-\u9fff]/.test(text);
}

function hasPinyinLikeText(text: string) {
  return /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]|nǐ|hǎo|xiè|xué|hàn|yǔ/i.test(text);
}

async function main() {
  const healthResponse = await fetch(`${appUrl}/api/ai/health?language=uz`);
  if (!healthResponse.ok) {
    console.error(`AI Tutor test: health endpoint xato, HTTP ${healthResponse.status}`);
    process.exit(1);
  }

  const health = (await healthResponse.json()) as AIHealthResponse;
  if (!health.openAiKeyConfigured) {
    console.error("AI Tutor test: OPENAI_API_KEY sozlanmagan. Server-only env qiymatini qo‘shing.");
    process.exit(1);
  }

  if (!token) {
    const unauthenticatedResponse = await fetch(`${appUrl}/api/ai-tutor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "HSK 1 uchun 3 ta so‘z ber", language: "uz", hskLevel: 1 })
    });
    if (unauthenticatedResponse.status !== 401) {
      console.error(`AI Tutor test: authsiz so‘rov 401 qaytarmadi, HTTP ${unauthenticatedResponse.status}`);
      process.exit(1);
    }
    console.log("AI Tutor test: health tayyor, /api/ai-tutor auth himoyasi ishlayapti. Real javob uchun brauzerda login bilan manual test kerak.");
    return;
  }

  const response = await fetch(`${appUrl}/api/ai-tutor`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "HSK 1 uchun 3 ta so‘z ber",
      language: "uz",
      hskLevel: 1
    })
  });

  const result = (await response.json().catch(() => ({}))) as AITutorResponse;
  if (!response.ok || !result.reply) {
    console.error(`AI Tutor test: javob xato, HTTP ${response.status}, code=${result.code ?? "unknown"}`);
    process.exit(1);
  }

  if (!hasChinese(result.reply)) {
    console.error("AI Tutor test: javobda xitoycha so‘z yoki gap topilmadi.");
    process.exit(1);
  }
  if (!hasPinyinLikeText(result.reply)) {
    console.error("AI Tutor test: javobda pinyin ko‘rinmadi.");
    process.exit(1);
  }

  console.log("AI Tutor test: real API javobi tekshirildi.");
}

main().catch((error) => {
  console.error(`AI Tutor test bajarilmadi: ${error instanceof Error ? error.message : "noma’lum xatolik"}`);
  process.exit(1);
});

export {};
