import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  buildTutorMessages,
  getRelevantHSKContent,
  getUserLearningContext,
  type ClientLearningContext,
  type UserLearningContext
} from "@/lib/ai/contextBuilder";
import { getAIEnvStatus } from "@/lib/env";
import type { AppLanguage, HSKLevel } from "@/types";
import { checkAIUsageLimit, consumeAIUsage } from "@/utils/aiUsage";
import { getUsageLimitMessage, hasPremiumUsageLimits, type AIUsageType } from "@/utils/usageLimits";

export const runtime = "nodejs";

type TutorRequestBody = {
  message?: unknown;
  language?: unknown;
  hskLevel?: unknown;
  clientContext?: ClientLearningContext;
  usageType?: unknown;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type AIDebugCode =
  | "missing_openai_key"
  | "invalid_request"
  | "unauthenticated"
  | "rate_limited"
  | "usage_limit_exceeded"
  | "usage_check_failed"
  | "context_builder_failed"
  | "openai_auth_failed"
  | "openai_quota_failed"
  | "openai_rate_limited"
  | "openai_model_failed"
  | "openai_timeout"
  | "openai_request_failed"
  | "unknown_ai_error"
  | "supabase_not_configured";

const rateLimits = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;

function toLanguage(value: unknown): AppLanguage {
  return value === "ru" ? "ru" : "uz";
}

function toLevel(value: unknown): HSKLevel {
  const numberValue = Number(value);
  return numberValue >= 1 && numberValue <= 6 ? (numberValue as HSKLevel) : 1;
}

function inferLevelFromMessage(message: string, fallback: HSKLevel) {
  const match = message.match(/hsk\s*([1-6])/i);
  if (!match) return fallback;
  return toLevel(match[1]);
}

function toUsageType(value: unknown): AIUsageType {
  const allowed = new Set<AIUsageType>(["ai_tutor_message", "ai_mistake_analysis", "ai_exam_coach", "ai_roleplay", "ai_voice_conversation", "ai_lesson_explainer"]);
  return typeof value === "string" && allowed.has(value as AIUsageType) ? (value as AIUsageType) : "ai_tutor_message";
}

type LocalizedErrorType =
  | "auth"
  | "rate"
  | "config"
  | "api"
  | "message"
  | "usage"
  | "openaiAuth"
  | "openaiQuota"
  | "openaiRate"
  | "openaiModel"
  | "openaiTimeout";

function localizedError(language: AppLanguage, type: LocalizedErrorType) {
  const uz = {
    auth: "Sessiya topilmadi. Iltimos, qayta kiring.",
    rate: "Juda ko‘p so‘rov yuborildi. Bir daqiqadan keyin qayta urinib ko‘ring.",
    config: "AI hozircha mavjud emas. Serverda OPENAI_API_KEY sozlanmagan.",
    api: "AI hozir javob bera olmadi. Iltimos, birozdan keyin qayta urinib ko‘ring.",
    message: "Savol matnini kiriting.",
    usage: "Bugungi AI limitingiz tugadi. Premium bilan ko‘proq AI savollar ishlatishingiz mumkin.",
    openaiAuth: "AI kaliti noto‘g‘ri yoki ishlamayapti. Server sozlamalarini tekshiring.",
    openaiQuota: "AI xizmati limiti yoki to‘lov sozlamalarida muammo bor. OpenAI hisobingizni tekshiring.",
    openaiRate: "AI so‘rovlar soni vaqtincha cheklangan. Birozdan keyin urinib ko‘ring.",
    openaiModel: "AI modeli javob bermadi. Model sozlamalarini tekshiring.",
    openaiTimeout: "AI javobi juda sekin keldi. Birozdan keyin qayta urinib ko‘ring."
  };
  const ru = {
    auth: "Сессия не найдена. Пожалуйста, войдите снова.",
    rate: "Слишком много запросов. Попробуйте снова через минуту.",
    config: "AI пока недоступен. На сервере не настроен OPENAI_API_KEY.",
    api: "AI сейчас не смог ответить. Попробуйте ещё раз чуть позже.",
    message: "Введите текст вопроса.",
    usage: "Ваш дневной лимит AI закончился. С Premium доступно больше AI-запросов.",
    openaiAuth: "AI-ключ неверный или не работает. Проверьте настройки сервера.",
    openaiQuota: "Есть проблема с лимитом или оплатой AI-сервиса. Проверьте аккаунт OpenAI.",
    openaiRate: "Количество AI-запросов временно ограничено. Попробуйте чуть позже.",
    openaiModel: "AI-модель не ответила. Проверьте настройки модели.",
    openaiTimeout: "AI отвечает слишком долго. Попробуйте ещё раз чуть позже."
  };

  return language === "ru" ? ru[type] : uz[type];
}

function debugPayload(code: AIDebugCode, extra: Record<string, boolean | string | number | null | undefined> = {}) {
  if (process.env.NODE_ENV === "production") return {};
  return {
    code,
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    ...extra
  };
}

function jsonError(language: AppLanguage, type: LocalizedErrorType, code: AIDebugCode, status: number, extra: Record<string, boolean | string | number | null | undefined> = {}) {
  return NextResponse.json({ error: localizedError(language, type), ...debugPayload(code, extra) }, { status });
}

function checkRateLimit(userId: string) {
  const now = Date.now();
  const current = rateLimits.get(userId);

  if (!current || current.resetAt <= now) {
    rateLimits.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) return false;
  current.count += 1;
  return true;
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function getRouteSupabase(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}

function getModelName() {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}

function fallbackUserContext(userId: string, language: AppLanguage, hskLevel: HSKLevel, clientContext?: ClientLearningContext): UserLearningContext {
  return {
    userId,
    language,
    profile: {
      name: "HanziFlow AI",
      currentHskLevel: hskLevel,
      premium: false
    },
    learnedWordIds: clientContext?.knownWordIds ?? [],
    weakWordIds: clientContext?.weakWordIds ?? [],
    weakWords: [],
    mistakes: (clientContext?.mistakes ?? []).slice(0, 8).map((mistake) => ({
      hskLevel: mistake.hskLevel,
      chinese: mistake.chinese,
      pinyin: mistake.pinyin,
      wrongAnswer: mistake.wrongAnswer,
      correctAnswer: mistake.correctAnswer,
      explanation: mistake.explanation
    })),
    quizResults: (clientContext?.quizResults ?? []).slice(0, 4).map((result) => ({
      hskLevel: result.level,
      score: result.score,
      totalQuestions: result.total,
      accuracy: result.total ? Math.round((result.score / result.total) * 100) : 0,
      createdAt: result.completedAt
    })),
    examResults: (clientContext?.examAttempts ?? []).slice(0, 4).map((attempt) => ({
      hskLevel: attempt.hskLevel,
      score: attempt.score,
      totalQuestions: attempt.total,
      accuracy: attempt.accuracy,
      passed: (attempt.overallScore ?? attempt.accuracy) >= 80,
      createdAt: attempt.completedAt
    })),
    unlockedLevels: [1]
  };
}

function getErrorStatus(error: unknown) {
  const maybe = error as { status?: unknown; code?: unknown; type?: unknown; name?: unknown; message?: unknown; request_id?: unknown; requestID?: unknown };
  return {
    status: typeof maybe.status === "number" ? maybe.status : undefined,
    code: typeof maybe.code === "string" ? maybe.code : undefined,
    type: typeof maybe.type === "string" ? maybe.type : undefined,
    name: typeof maybe.name === "string" ? maybe.name : undefined,
    message: typeof maybe.message === "string" ? maybe.message : "",
    requestId: typeof maybe.request_id === "string" ? maybe.request_id : typeof maybe.requestID === "string" ? maybe.requestID : undefined
  };
}

function classifyOpenAIError(error: unknown): { code: AIDebugCode; type: LocalizedErrorType; status: number; openAiStatus?: number; requestId?: string } {
  const details = getErrorStatus(error);
  const message = details.message.toLowerCase();

  if (details.name === "AbortError" || message.includes("timeout") || message.includes("timed out")) {
    return { code: "openai_timeout", type: "openaiTimeout", status: 504, openAiStatus: details.status, requestId: details.requestId };
  }
  if (details.status === 401 || details.status === 403 || message.includes("api key")) {
    return { code: "openai_auth_failed", type: "openaiAuth", status: 502, openAiStatus: details.status, requestId: details.requestId };
  }
  if (details.code === "insufficient_quota" || details.type === "insufficient_quota" || message.includes("quota") || message.includes("billing")) {
    return { code: "openai_quota_failed", type: "openaiQuota", status: 402, openAiStatus: details.status, requestId: details.requestId };
  }
  if (details.status === 429) {
    return { code: "openai_rate_limited", type: "openaiRate", status: 429, openAiStatus: details.status, requestId: details.requestId };
  }
  if (details.status === 404 || message.includes("model") || message.includes("does not exist")) {
    return { code: "openai_model_failed", type: "openaiModel", status: 502, openAiStatus: details.status, requestId: details.requestId };
  }
  return { code: "openai_request_failed", type: "api", status: 502, openAiStatus: details.status, requestId: details.requestId };
}

async function callOpenAI(messages: ReturnType<typeof buildTutorMessages>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const openai = new OpenAI({ apiKey, timeout: 30_000 });
  const response = await openai.chat.completions.create({
    model: getModelName(),
    messages,
    temperature: 0.25,
    max_tokens: 900
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}

export async function POST(request: Request) {
  let language: AppLanguage = "uz";

  try {
    const body = (await request.json().catch(() => null)) as TutorRequestBody | null;
    if (!body || typeof body !== "object") {
      return jsonError(language, "message", "invalid_request", 400, { userAuthenticated: false, usageAllowed: false });
    }
    language = toLanguage(body.language);
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 1200) : "";

    if (!message) {
      return jsonError(language, "message", "invalid_request", 400, { userAuthenticated: false, usageAllowed: false });
    }

    const token = getBearerToken(request);
    if (!token) {
      return jsonError(language, "auth", "unauthenticated", 401, { userAuthenticated: false, usageAllowed: false });
    }

    const supabase = getRouteSupabase(token);
    if (!supabase) {
      return jsonError(language, "api", "supabase_not_configured", 500, { userAuthenticated: false, usageAllowed: false });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return jsonError(language, "auth", "unauthenticated", 401, { userAuthenticated: false, usageAllowed: false });
    }

    if (!checkRateLimit(data.user.id)) {
      return jsonError(language, "rate", "rate_limited", 429, { userAuthenticated: true, usageAllowed: false });
    }

    const aiEnv = getAIEnvStatus();
    if (!aiEnv.openAiKeyConfigured) {
      return jsonError(language, "config", "missing_openai_key", 503, { userAuthenticated: true, usageAllowed: false });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("premium,subscription_status,premium_until")
      .eq("id", data.user.id)
      .maybeSingle();
    const premium = hasPremiumUsageLimits(profile?.subscription_status, profile?.premium, profile?.premium_until);
    let dailyUsage;
    try {
      dailyUsage = await checkAIUsageLimit(data.user.id, toUsageType(body.usageType), premium);
    } catch (usageError) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[AI Tutor] Usage tekshiruvida xatolik", usageError instanceof Error ? usageError.message : "unknown");
      }
      return jsonError(language, "api", "usage_check_failed", 500, { userAuthenticated: true, usageAllowed: false });
    }
    if (!dailyUsage.allowed) {
      return NextResponse.json(
        {
          error: localizedError(language, "usage"),
          detail: getUsageLimitMessage(language).detail,
          ...debugPayload("usage_limit_exceeded", { userAuthenticated: true, usageAllowed: false }),
          usage: dailyUsage
        },
        { status: 429 }
      );
    }

    const requestedLevel = inferLevelFromMessage(message, toLevel(body.hskLevel));
    let userContext;
    let contextBuilt = true;
    try {
      userContext = await getUserLearningContext(data.user.id, {
        accessToken: token,
        language,
        clientContext: body.clientContext
      });
    } catch (contextError) {
      contextBuilt = false;
      if (process.env.NODE_ENV !== "production") {
        console.warn("[AI Tutor] Kontekst tuzishda xatolik", contextError instanceof Error ? contextError.message : "unknown");
      }
      userContext = fallbackUserContext(data.user.id, language, requestedLevel, body.clientContext);
    }
    userContext.language = language;

    const relevantContent = getRelevantHSKContent(message, requestedLevel, language);
    const messages = buildTutorMessages(message, userContext, relevantContent);
    let reply = "";
    try {
      reply = (await callOpenAI(messages)) ?? "";
    } catch (openAIError) {
      const classified = classifyOpenAIError(openAIError);
      if (process.env.NODE_ENV !== "production") {
        console.warn("[AI Tutor] OpenAI so‘rovida xatolik", {
          code: classified.code,
          openAiStatus: classified.openAiStatus ?? null,
          modelName: getModelName(),
          requestId: classified.requestId ?? null
        });
      }
      return jsonError(language, classified.type, classified.code, classified.status, {
        userAuthenticated: true,
        usageAllowed: true,
        contextBuilt,
        openAiStatus: classified.openAiStatus ?? null,
        modelName: getModelName(),
        requestId: classified.requestId ?? null
      });
    }

    if (!reply) {
      return jsonError(language, "api", "openai_request_failed", 502, { userAuthenticated: true, usageAllowed: true, contextBuilt, modelName: getModelName() });
    }

    const consumedUsage = await consumeAIUsage(data.user.id, toUsageType(body.usageType), premium, dailyUsage);
    return NextResponse.json({
      reply,
      hskLevel: userContext.profile.currentHskLevel,
      enoughContent: relevantContent.enoughContent,
      usage: consumedUsage
    });
  } catch {
    return jsonError(language, "api", "invalid_request", 500, { userAuthenticated: false, usageAllowed: false });
  }
}
