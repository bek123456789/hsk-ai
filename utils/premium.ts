import type { AppLanguage, SubscriptionStatus } from "@/types";

type PremiumLikeProfile = {
  premium?: boolean | null;
  subscriptionStatus?: SubscriptionStatus | null;
  subscription_status?: SubscriptionStatus | null;
  premiumUntil?: string | null;
  premium_until?: string | null;
  subscriptionPlan?: "monthly" | "yearly" | null;
  subscription_plan?: "monthly" | "yearly" | null;
  currentPeriodEnd?: string | null;
  current_period_end?: string | null;
};

const activeStatuses = new Set<SubscriptionStatus>(["active", "trialing", "beta_premium"]);

export function isPremiumProfile(profile?: PremiumLikeProfile | null) {
  if (!profile) return false;
  const status = profile.subscriptionStatus ?? profile.subscription_status ?? (profile.premium ? "beta_premium" : "free");
  const premiumUntil = profile.premiumUntil ?? profile.premium_until;
  const hasFuturePremiumUntil = premiumUntil ? new Date(premiumUntil).getTime() > Date.now() : false;
  if ((status === "trialing" || status === "beta_premium") && premiumUntil) return hasFuturePremiumUntil;
  return activeStatuses.has(status) || hasFuturePremiumUntil;
}

export function getIsPremium(profile?: PremiumLikeProfile | null) {
  return isPremiumProfile(profile);
}

export function getPremiumStatus(profile?: PremiumLikeProfile | null) {
  if (!profile) return "free" as SubscriptionStatus;
  return profile.subscriptionStatus ?? profile.subscription_status ?? (profile.premium ? "beta_premium" : "free");
}

export function getPremiumPlan(profile?: PremiumLikeProfile | null) {
  return profile?.subscriptionPlan ?? profile?.subscription_plan ?? null;
}

export function getPremiumUntil(profile?: PremiumLikeProfile | null) {
  return profile?.premiumUntil ?? profile?.premium_until ?? profile?.currentPeriodEnd ?? profile?.current_period_end ?? null;
}

export function getSubscriptionStatusLabel(status: SubscriptionStatus | null | undefined, locale: AppLanguage) {
  const labels: Record<AppLanguage, Record<SubscriptionStatus, string>> = {
    uz: {
      free: "Bepul reja",
      active: "Premium faol",
      trialing: "Sinov Premium faol",
      past_due: "To‘lov kutilmoqda",
      canceled: "Bekor qilingan",
      unpaid: "To‘lanmagan",
      beta_premium: "Sinov Premium"
    },
    ru: {
      free: "Бесплатный план",
      active: "Premium активен",
      trialing: "Пробный Premium активен",
      past_due: "Ожидается платёж",
      canceled: "Отменено",
      unpaid: "Не оплачено",
      beta_premium: "Тестовый Premium"
    },
    en: {
      free: "Free plan",
      active: "Premium active",
      trialing: "Premium trial active",
      past_due: "Payment pending",
      canceled: "Canceled",
      unpaid: "Unpaid",
      beta_premium: "Test Premium"
    }
  };

  return labels[locale][status ?? "free"];
}

export function canAccessPremiumFeature(profile: PremiumLikeProfile | null | undefined, featureKey: string) {
  const freeFeatures = new Set(["hsk1-basic", "basic-vocabulary", "basic-flashcards", "limited-quiz"]);
  if (freeFeatures.has(featureKey)) return true;
  return isPremiumProfile(profile);
}

export function getPremiumLockMessage(featureKey: string, locale: AppLanguage) {
  const featureLabels: Record<AppLanguage, Record<string, string>> = {
    uz: {
      aiTutor: "AI yordamchi",
      speaking: "Aytilishni tekshirish",
      hskFull: "HSK 2–6 to‘liq kirish",
      exams: "To‘liq imtihonlar",
      certificates: "Sertifikatlar",
      analytics: "Kengaytirilgan statistika",
      examCoach: "Imtihon murabbiyi",
      conversation: "AI suhbat",
      voiceConversation: "Ovozli suhbat"
    },
    ru: {
      aiTutor: "ИИ-помощник",
      speaking: "Проверка произношения",
      hskFull: "Полный доступ HSK 2–6",
      exams: "Полные экзамены",
      certificates: "Сертификаты",
      analytics: "Расширенная статистика",
      examCoach: "Экзаменационный наставник",
      conversation: "Диалог с ИИ",
      voiceConversation: "Голосовой диалог"
    },
    en: {
      aiTutor: "AI Coach",
      speaking: "Pronunciation check",
      hskFull: "Full HSK 2–6 access",
      exams: "Full exams",
      certificates: "Certificates",
      analytics: "Advanced analytics",
      examCoach: "Exam coach",
      conversation: "AI conversation",
      voiceConversation: "Voice conversation"
    }
  };

  const feature = featureLabels[locale][featureKey] ?? featureKey;
  if (locale === "ru") return `${feature} доступен в Premium.`;
  if (locale === "en") return `${feature} is available with Premium.`;
  return `${feature} Premium uchun ochiladi.`;
}
