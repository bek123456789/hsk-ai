import type { AppLanguage, SubscriptionStatus } from "@/types";

export type AIUsageType =
  | "ai_tutor_message"
  | "ai_mistake_analysis"
  | "pronunciation_check"
  | "ai_exam_coach"
  | "ai_conversation"
  | "ai_roleplay"
  | "ai_lesson_explainer"
  | "speaking_meaning_check"
  | "ai_voice_conversation";

export type AIUsageLimits = Record<AIUsageType, number>;

const freeLimits: AIUsageLimits = {
  ai_tutor_message: 3,
  ai_mistake_analysis: 3,
  pronunciation_check: 5,
  ai_exam_coach: 0,
  ai_conversation: 0,
  ai_roleplay: 0,
  ai_lesson_explainer: 3,
  speaking_meaning_check: 3,
  ai_voice_conversation: 0
};

const premiumLimits: AIUsageLimits = {
  ai_tutor_message: 50,
  ai_mistake_analysis: 50,
  pronunciation_check: 100,
  ai_exam_coach: 20,
  ai_conversation: 50,
  ai_roleplay: 50,
  ai_lesson_explainer: 50,
  speaking_meaning_check: 50,
  ai_voice_conversation: 50
};

const premiumStatuses = new Set<SubscriptionStatus>(["active", "trialing", "beta_premium"]);

export function hasPremiumUsageLimits(status?: string | null, premium?: boolean | null, premiumUntil?: string | null) {
  const normalizedStatus = (status ?? "free") as SubscriptionStatus;
  const hasFuturePremiumUntil = premiumUntil ? new Date(premiumUntil).getTime() > Date.now() : false;
  if ((normalizedStatus === "trialing" || normalizedStatus === "beta_premium") && premiumUntil) {
    return hasFuturePremiumUntil;
  }
  return premium === true || premiumStatuses.has(normalizedStatus) || hasFuturePremiumUntil;
}

export function getDailyUsageLimit(usageType: AIUsageType, premium: boolean) {
  return (premium ? premiumLimits : freeLimits)[usageType];
}

export function getAllUsageLimits(premium: boolean) {
  return premium ? premiumLimits : freeLimits;
}

export function getUsageTypeLabel(usageType: AIUsageType, language: AppLanguage) {
  const labels: Record<AppLanguage, Record<AIUsageType, string>> = {
    uz: {
      ai_tutor_message: "AI yordamchi savollari",
      ai_mistake_analysis: "Xatolar tahlili",
      pronunciation_check: "Talaffuz tekshiruvi",
      ai_exam_coach: "Imtihon murabbiyi",
      ai_conversation: "AI suhbat",
      ai_roleplay: "Rol o‘yini",
      ai_lesson_explainer: "Dars izohi",
      speaking_meaning_check: "Gapirishni AI bilan tekshirish",
      ai_voice_conversation: "Ovozli AI suhbat"
    },
    ru: {
      ai_tutor_message: "Вопросы AI-наставнику",
      ai_mistake_analysis: "Анализ ошибок",
      pronunciation_check: "Проверка произношения",
      ai_exam_coach: "Экзаменационный наставник",
      ai_conversation: "Диалог с AI",
      ai_roleplay: "Ролевая практика",
      ai_lesson_explainer: "Объяснение урока",
      speaking_meaning_check: "AI-проверка говорения",
      ai_voice_conversation: "Голосовой диалог с AI"
    },
    en: {
      ai_tutor_message: "AI Coach questions",
      ai_mistake_analysis: "Mistake analysis",
      pronunciation_check: "Pronunciation check",
      ai_exam_coach: "Exam coach",
      ai_conversation: "AI conversation",
      ai_roleplay: "Roleplay",
      ai_lesson_explainer: "Lesson explanation",
      speaking_meaning_check: "AI speaking check",
      ai_voice_conversation: "Voice AI conversation"
    }
  };

  return labels[language][usageType];
}

export function getUsageLimitMessage(language: AppLanguage) {
  if (language === "en") {
    return {
      title: "Your daily AI limit is used",
      detail: "Premium includes more AI requests. Try again tomorrow, or use bonus AI tokens if you have them."
    };
  }
  return language === "ru"
    ? {
        title: "Ваш дневной лимит AI закончился",
        detail: "С Premium доступно больше AI-запросов. Попробуйте снова завтра. У вас есть бонусные AI-токены, если они были начислены."
      }
    : {
        title: "Bugungi AI limitingiz tugadi",
        detail: "Premium bilan ko‘proq AI savollar ishlatishingiz mumkin. Ertaga yana urinib ko‘ring. Sizda bonus AI tokenlar bor bo‘lsa, ular ham ishlatiladi."
      };
}
