import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getSpeakingTaskById } from "@/data/hsk/contentIndex";
import { getAuthenticatedServerUser } from "@/lib/supabase/server";
import type { AppLanguage, HSKLevel } from "@/types";
import { checkAIUsageLimit, consumeAIUsage } from "@/utils/aiUsage";
import { hasPremiumUsageLimits } from "@/utils/usageLimits";

export const runtime = "nodejs";

type RequestBody = {
  taskId?: unknown;
  level?: unknown;
  userAnswerZh?: unknown;
  locale?: unknown;
};

function localeOf(value: unknown): AppLanguage {
  return value === "ru" ? "ru" : "uz";
}

function levelOf(value: unknown): HSKLevel {
  const parsed = Number(value);
  return parsed >= 1 && parsed <= 6 ? (parsed as HSKLevel) : 1;
}

function localized(locale: AppLanguage, uz: string, ru: string) {
  return locale === "ru" ? ru : uz;
}

function error(locale: AppLanguage, status: number, messageUz: string, messageRu: string, code: string) {
  return NextResponse.json({ ok: false, error: localized(locale, messageUz, messageRu), code: process.env.NODE_ENV === "production" ? undefined : code }, { status });
}

function fallbackResult(locale: AppLanguage, score: number, userAnswerZh: string) {
  return {
    ok: true,
    done: score >= 75,
    score,
    meaningScore: score,
    grammarScore: Math.max(0, score - 10),
    vocabularyScore: Math.max(0, score - 5),
    fluencyScore: Math.max(0, score - 10),
    feedbackUz: score >= 75 ? "Mazmun to‘g‘ri tushunilgan." : "Mazmun hali to‘liq emas. Kalit so‘zlarni qayta ishlating.",
    feedbackRu: score >= 75 ? "Смысл понят правильно." : "Смысл пока раскрыт не полностью. Используйте ключевые слова ещё раз.",
    correctedAnswerZh: userAnswerZh,
    correctedAnswerPinyin: "",
    explanationUz: "AI javobi tuzilmaviy baholash asosida qaytarildi.",
    explanationRu: "Ответ AI возвращён на основе структурной оценки.",
    missingPointsUz: score >= 75 ? [] : ["Asosiy harakat yoki joy aniq aytilmagan."],
    missingPointsRu: score >= 75 ? [] : ["Главное действие или место не указано ясно."],
    goodPointsUz: userAnswerZh.trim() ? ["Xitoycha javob yozildi."] : [],
    goodPointsRu: userAnswerZh.trim() ? ["Ответ написан по-китайски."] : [],
    nextTipUz: "Namuna javobdagi kalit so‘zlardan foydalanib, qisqaroq gap tuzing.",
    nextTipRu: "Используйте ключевые слова из примера и составьте более короткое предложение.",
    locale
  };
}

function parseJSON(text: string, locale: AppLanguage, userAnswerZh: string) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return fallbackResult(locale, 60, userAnswerZh);
    const parsed = JSON.parse(match[0]) as Partial<ReturnType<typeof fallbackResult>>;
    const score = Math.max(0, Math.min(100, Number(parsed.score ?? 0)));
    return {
      ...fallbackResult(locale, score, userAnswerZh),
      ...parsed,
      ok: true,
      score,
      done: score >= 75
    };
  } catch {
    return fallbackResult(locale, 60, userAnswerZh);
  }
}

export async function POST(request: Request) {
  let locale: AppLanguage = "uz";
  try {
    const body = (await request.json().catch(() => null)) as RequestBody | null;
    locale = localeOf(body?.locale);
    const taskId = typeof body?.taskId === "string" ? body.taskId : "";
    const level = levelOf(body?.level);
    const userAnswerZh = typeof body?.userAnswerZh === "string" ? body.userAnswerZh.trim().slice(0, 800) : "";
    const task = getSpeakingTaskById(taskId);

    if (!task || task.level !== level) {
      return error(locale, 400, "Gapirish vazifasi topilmadi.", "Задание говорения не найдено.", "task_not_found");
    }
    if (!userAnswerZh) {
      return error(locale, 400, "Javob bo‘sh bo‘lishi mumkin emas.", "Ответ не может быть пустым.", "empty_answer");
    }

    const { user, supabase } = await getAuthenticatedServerUser(request);
    if (!user || !supabase) {
      return error(locale, 401, "Avval tizimga kiring.", "Сначала войдите в аккаунт.", "unauthenticated");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("premium, subscription_status, premium_until")
      .eq("id", user.id)
      .maybeSingle();
    const premium = hasPremiumUsageLimits(
      (profile as { subscription_status?: string | null } | null)?.subscription_status,
      (profile as { premium?: boolean | null } | null)?.premium,
      (profile as { premium_until?: string | null } | null)?.premium_until
    );
    const usage = await checkAIUsageLimit(user.id, "speaking_meaning_check", premium);
    if (!usage.allowed) {
      return error(locale, 429, "Bugungi gapirishni AI bilan tekshirish limitingiz tugadi.", "Ваш дневной лимит AI-проверок говорения закончился.", "usage_limit_exceeded");
    }

    if (!process.env.OPENAI_API_KEY) {
      return error(locale, 500, "AI hozircha mavjud emas. Server sozlamalarini tekshiring.", "AI пока недоступен. Проверьте настройки сервера.", "missing_openai_key");
    }

    const normalizedAnswer = userAnswerZh.replace(/\s+/g, "");
    const copiedReference =
      normalizedAnswer === task.textZh.replace(/\s+/g, "") ||
      normalizedAnswer === task.sampleAnswerZh.replace(/\s+/g, "");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30_000 });
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.15,
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are HanziFlow AI speaking evaluator for Uzbek and Russian speakers. Return only valid JSON with the required fields. Evaluate whether the Chinese answer captures the meaning, not perfect native fluency. Do not claim official HSK status."
        },
        {
          role: "user",
          content: JSON.stringify({
            locale,
            level,
            taskTextZh: task.textZh,
            taskTextPinyin: task.textPinyin,
            expectedMeaningUz: task.expectedMeaningUz,
            expectedMeaningRu: task.expectedMeaningRu,
            sampleAnswerZh: task.sampleAnswerZh,
            keywordsZh: task.keywordsZh,
            userAnswerZh,
            copiedReference,
            scoringRules: "score>=75 done true; copied source or sample answer max 65; unrelated 0-30; empty 0"
          })
        }
      ]
    });

    const content = response.choices[0]?.message?.content ?? "";
    const result = parseJSON(content, locale, userAnswerZh);
    const cappedResult = copiedReference && result.score > 65 ? { ...result, score: 65, done: false } : result;
    await consumeAIUsage(user.id, "speaking_meaning_check", premium, usage);
    return NextResponse.json(cappedResult);
  } catch {
    return error(locale, 502, "AI tekshiruv hozir ishlamadi. Iltimos, birozdan keyin qayta urinib ko‘ring.", "AI-проверка сейчас не сработала. Попробуйте ещё раз чуть позже.", "ai_request_failed");
  }
}
