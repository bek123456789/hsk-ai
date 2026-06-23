import { NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/lib/supabase/server";
import { getStripePriceForPlan, getStripeServerClient } from "@/lib/stripe";
import type { AppLanguage } from "@/types";
import { getStripeRedirectUrls } from "@/utils/getBaseUrl";

export const runtime = "nodejs";

type Plan = "monthly" | "yearly";

type CheckoutBody = {
  plan?: unknown;
  language?: unknown;
};

type CheckoutErrorCode =
  | "missing_stripe_secret_key"
  | "missing_price_id"
  | "no_session"
  | "profile_fetch_failed"
  | "customer_create_failed"
  | "profile_update_failed"
  | "checkout_create_failed";

type ErrorKey = "auth" | "plan" | "config" | "profile" | "session";

function errorMessage(key: ErrorKey, language: AppLanguage) {
  const messages = {
    uz: {
      auth: "Avval tizimga kiring",
      plan: "Premium rejasi topilmadi",
      config: "Stripe sozlamalari to‘liq emas",
      profile: "Profil ma’lumotlarini olishda xatolik",
      session: "To‘lov sessiyasini yaratib bo‘lmadi. Qayta urinib ko‘ring"
    },
    ru: {
      auth: "Сначала войдите в аккаунт",
      plan: "Премиум-план не найден",
      config: "Настройки Stripe заполнены не полностью",
      profile: "Ошибка получения профиля",
      session: "Не удалось создать платёжную сессию. Попробуйте ещё раз"
    },
    en: {
      auth: "Sign in first",
      plan: "Premium plan was not found",
      config: "Stripe settings are incomplete",
      profile: "Could not load profile data",
      session: "Could not create a checkout session. Try again"
    }
  };

  return messages[language][key];
}

function errorResponse(error: string, code: CheckoutErrorCode, status: number) {
  return NextResponse.json(
    {
      error,
      ...(process.env.NODE_ENV !== "production" ? { code } : {})
    },
    { status }
  );
}

function isPlan(value: unknown): value is Plan {
  return value === "monthly" || value === "yearly";
}

export async function POST(request: Request) {
  let body: CheckoutBody = {};
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    body = {};
  }

  const language: AppLanguage = body.language === "ru" || body.language === "en" ? body.language : "uz";

  if (!isPlan(body.plan)) {
    return errorResponse(errorMessage("plan", language), "missing_price_id", 400);
  }

  const { user, supabase } = await getAuthenticatedServerUser(request);
  if (!user || !supabase) {
    return errorResponse(errorMessage("auth", language), "no_session", 401);
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return errorResponse(errorMessage("config", language), "missing_stripe_secret_key", 500);
  }

  const priceId = getStripePriceForPlan(body.plan);
  if (!priceId) {
    return errorResponse(errorMessage("config", language), "missing_price_id", 500);
  }

  const profileSelect = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (profileSelect.error) {
    return errorResponse(errorMessage("profile", language), "profile_fetch_failed", 500);
  }

  let profile = profileSelect.data;
  if (!profile) {
    const now = new Date().toISOString();
    const profileCreate = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email ?? null,
          name: typeof user.user_metadata?.name === "string" ? user.user_metadata.name : user.email?.split("@")[0] ?? "HanziFlow AI",
          current_hsk_level: 1,
          preferred_language: language,
          premium: false,
          subscription_status: "free",
          updated_at: now
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();

    if (profileCreate.error || !profileCreate.data) {
      return errorResponse(errorMessage("profile", language), "profile_fetch_failed", 500);
    }
    profile = profileCreate.data;
  }

  const stripe = getStripeServerClient();
  let customerId = typeof profile.stripe_customer_id === "string" ? profile.stripe_customer_id : null;

  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: typeof profile.name === "string" ? profile.name : undefined,
        metadata: {
          user_id: user.id
        }
      });
      customerId = customer.id;
    } catch {
      return errorResponse(errorMessage("session", language), "customer_create_failed", 500);
    }

    const profileUpdate = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (profileUpdate.error) {
      return errorResponse(errorMessage("profile", language), "profile_update_failed", 500);
    }
  }

  try {
    const { successUrl, cancelUrl } = getStripeRedirectUrls(request);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        plan: body.plan
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan: body.plan
        }
      }
    });

    if (!session.url) {
      return errorResponse(errorMessage("session", language), "checkout_create_failed", 500);
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return errorResponse(errorMessage("session", language), "checkout_create_failed", 500);
  }
}
