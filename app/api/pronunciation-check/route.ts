import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { pronunciationFeedback, scorePronunciation } from "@/utils/pronunciationScoring";
import type { AppLanguage } from "@/types";
import { checkAIUsageLimit, consumeAIUsage } from "@/utils/aiUsage";
import { getUsageLimitMessage, hasPremiumUsageLimits } from "@/utils/usageLimits";

export const runtime = "nodejs";

type Body = {
  targetHanzi?: unknown;
  targetPinyin?: unknown;
  recognizedText?: unknown;
  hskLevel?: unknown;
  language?: unknown;
};

function toLanguage(value: unknown): AppLanguage {
  return value === "ru" || value === "en" ? value : "uz";
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function getSupabase(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

export async function POST(request: Request) {
  let language: AppLanguage = "uz";

  try {
    const body = (await request.json()) as Body;
    language = toLanguage(body.language);
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: language === "ru" ? "Сессия не найдена. Пожалуйста, войдите снова." : "Sessiya topilmadi. Iltimos, qayta kiring." }, { status: 401 });
    }

    const supabase = getSupabase(token);
    if (!supabase) {
      return NextResponse.json({ error: language === "ru" ? "Supabase настройки не найдены." : "Supabase sozlamalari topilmadi." }, { status: 500 });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return NextResponse.json({ error: language === "ru" ? "Сессия не найдена. Пожалуйста, войдите снова." : "Sessiya topilmadi. Iltimos, qayta kiring." }, { status: 401 });
    }

    const targetHanzi = typeof body.targetHanzi === "string" ? body.targetHanzi.slice(0, 80) : "";
    const targetPinyin = typeof body.targetPinyin === "string" ? body.targetPinyin.slice(0, 120) : "";
    const recognizedText = typeof body.recognizedText === "string" ? body.recognizedText.slice(0, 160) : "";
    if (!targetHanzi || !targetPinyin || !recognizedText) {
      return NextResponse.json({ error: language === "ru" ? "Данные для проверки неполные." : "Tekshirish uchun ma’lumot yetarli emas." }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("premium,subscription_status,premium_until")
      .eq("id", data.user.id)
      .maybeSingle();
    const premium = hasPremiumUsageLimits(profile?.subscription_status, profile?.premium, profile?.premium_until);
    const dailyUsage = await checkAIUsageLimit(data.user.id, "pronunciation_check", premium);
    if (!dailyUsage.allowed) {
      const limitMessage = getUsageLimitMessage(language);
      return NextResponse.json(
        { error: limitMessage.title, detail: limitMessage.detail, code: "daily_ai_limit_reached", usage: dailyUsage },
        { status: 429 }
      );
    }

    const scored = scorePronunciation({ targetHanzi, targetPinyin, recognizedText });
    const consumedUsage = await consumeAIUsage(data.user.id, "pronunciation_check", premium, dailyUsage);

    return NextResponse.json({
      isCorrect: scored.isCorrect,
      score: scored.score,
      feedbackUz: pronunciationFeedback(scored.score, targetPinyin, "uz"),
      feedbackRu: pronunciationFeedback(scored.score, targetPinyin, "ru"),
      normalizedTarget: scored.normalizedTarget,
      normalizedUserSpeech: scored.normalizedUserSpeech,
      usage: consumedUsage
    });
  } catch {
    return NextResponse.json({ error: language === "ru" ? "Произошла ошибка проверки." : "Tekshirishda xatolik yuz berdi." }, { status: 500 });
  }
}
