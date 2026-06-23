import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthenticatedServerUser, getSupabaseAdminClient } from "@/lib/supabase/server";
import { getPlanFromPrice, getStripeServerClient, unixToIso } from "@/lib/stripe";
import { getIsPremium } from "@/utils/premium";
import type { AppLanguage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function localized(language: AppLanguage, key: "ok" | "activated" | "missing" | "failed") {
  const messages = {
    uz: {
      ok: "Premium holati tekshirildi",
      activated: "Premium faollashtirildi",
      missing: "Sessiya topilmadi",
      failed: "Premiumni tekshirib bo‘lmadi"
    },
    ru: {
      ok: "Статус Premium проверен",
      activated: "Premium активирован",
      missing: "Сессия не найдена",
      failed: "Не удалось проверить Premium"
    },
    en: {
      ok: "Premium status checked",
      activated: "Premium activated",
      missing: "Session was not found",
      failed: "Could not verify Premium"
    }
  };
  return messages[language][key];
}

function getCustomerId(value: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function getPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price.id ?? null;
}

function getPeriodEnd(subscription: Stripe.Subscription) {
  const periodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  return unixToIso(periodEnd ?? null);
}

async function parseRequest(request: Request) {
  const url = new URL(request.url);
  let sessionId = url.searchParams.get("session_id");
  let language: AppLanguage = url.searchParams.get("language") === "ru" ? "ru" : url.searchParams.get("language") === "en" ? "en" : "uz";

  if (request.method === "POST") {
    const body = (await request.json().catch(() => ({}))) as { session_id?: unknown; language?: unknown };
    if (typeof body.session_id === "string") sessionId = body.session_id;
    language = body.language === "ru" ? "ru" : language;
  }

  return { sessionId, language };
}

async function handleVerify(request: Request) {
  const { sessionId, language } = await parseRequest(request);
  if (!sessionId) {
    return NextResponse.json({ error: localized(language, "missing") }, { status: 400 });
  }

  const { user, supabase } = await getAuthenticatedServerUser(request);
  if (!user || !supabase) {
    return NextResponse.json({ error: language === "ru" ? "Сначала войдите в аккаунт" : "Avval tizimga kiring" }, { status: 401 });
  }

  try {
    const stripe = getStripeServerClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    const customerId = getCustomerId(session.customer);
    if (!subscriptionId || !customerId) {
      return NextResponse.json({ error: localized(language, "missing") }, { status: 404 });
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();
    const ownsSession = session.metadata?.user_id === user.id || currentProfile?.stripe_customer_id === customerId;
    if (!ownsSession) {
      return NextResponse.json({ error: localized(language, "failed") }, { status: 403 });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = getPriceId(subscription);
    const periodEnd = getPeriodEnd(subscription);
    const plan = session.metadata?.plan ?? subscription.metadata.plan ?? getPlanFromPrice(priceId);
    const update = {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      subscription_plan: plan,
      stripe_price_id: priceId,
      current_period_end: periodEnd,
      premium_until: periodEnd,
      updated_at: new Date().toISOString()
    };

    const admin = getSupabaseAdminClient();
    const { data: updatedProfile, error } = await admin
      .from("profiles")
      .update(update)
      .eq("id", user.id)
      .select("subscription_status,subscription_plan,stripe_customer_id,stripe_subscription_id,stripe_price_id,current_period_end,premium_until,premium")
      .single();
    if (error) throw error;

    const isPremium = getIsPremium(updatedProfile);
    return NextResponse.json({
      message: isPremium ? localized(language, "activated") : localized(language, "ok"),
      isPremium,
      subscription_status: updatedProfile.subscription_status,
      subscription_plan: updatedProfile.subscription_plan,
      stripeCustomerExists: Boolean(updatedProfile.stripe_customer_id),
      stripeSubscriptionExists: Boolean(updatedProfile.stripe_subscription_id),
      stripe_price_id: updatedProfile.stripe_price_id,
      current_period_end: updatedProfile.current_period_end,
      premium_until: updatedProfile.premium_until
    });
  } catch {
    return NextResponse.json({ error: localized(language, "failed") }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handleVerify(request);
}

export async function POST(request: Request) {
  return handleVerify(request);
}
