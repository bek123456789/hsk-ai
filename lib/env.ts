import type { AppLanguage } from "@/types";

export type StripeEnvStatus = {
  stripeSecretConfigured: boolean;
  publishableKeyConfigured: boolean;
  monthlyPriceConfigured: boolean;
  yearlyPriceConfigured: boolean;
  webhookSecretConfigured: boolean;
  appUrlConfigured: boolean;
  serviceRoleConfigured: boolean;
};

export function getStripeEnvStatus(): StripeEnvStatus {
  return {
    stripeSecretConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    publishableKeyConfigured: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    monthlyPriceConfigured: Boolean(process.env.STRIPE_PRICE_PREMIUM_MONTHLY),
    yearlyPriceConfigured: Boolean(process.env.STRIPE_PRICE_PREMIUM_YEARLY),
    webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    appUrlConfigured: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  };
}

export function getWebhookSecretMissingMessage(language: AppLanguage) {
  return language === "ru" ? "Webhook secret не настроен" : "Webhook secret sozlanmagan";
}

export function getStripeCheckoutReady(status = getStripeEnvStatus()) {
  return (
    status.stripeSecretConfigured &&
    status.monthlyPriceConfigured &&
    status.yearlyPriceConfigured &&
    status.appUrlConfigured
  );
}

export function getStripeDeploymentReady(status = getStripeEnvStatus()) {
  return getStripeCheckoutReady(status) && status.webhookSecretConfigured && status.serviceRoleConfigured;
}

export type AIEnvStatus = {
  openAiKeyConfigured: boolean;
  aiTutorReady: boolean;
  usageLimitReady: boolean;
  supabaseReady: boolean;
  modelConfigured: boolean;
  ok: boolean;
};

export function getAIEnvStatus(): AIEnvStatus {
  const openAiKeyConfigured = Boolean(process.env.OPENAI_API_KEY);
  const supabaseReady = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const usageLimitReady = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const modelConfigured = Boolean(process.env.OPENAI_MODEL ?? "gpt-4o-mini");
  const aiTutorReady = openAiKeyConfigured && supabaseReady && modelConfigured;

  return {
    openAiKeyConfigured,
    aiTutorReady,
    usageLimitReady,
    supabaseReady,
    modelConfigured,
    ok: aiTutorReady
  };
}

export function getAIHealthMessage(language: AppLanguage, status = getAIEnvStatus()) {
  if (!status.openAiKeyConfigured) {
    return language === "ru" ? "OPENAI_API_KEY не настроен" : "OPENAI_API_KEY sozlanmagan";
  }
  if (status.ok) {
    return language === "ru" ? "AI-помощник готов" : "AI yordamchi tayyor";
  }
  return language === "ru" ? "Нужно проверить настройки AI" : "AI sozlamalarini tekshirish kerak";
}
