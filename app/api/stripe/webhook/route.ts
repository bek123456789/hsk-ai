import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getPlanFromPrice, getStripeServerClient, unixToIso } from "@/lib/stripe";

type ProfileUpdate = {
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
  subscription_plan?: string | null;
  stripe_price_id?: string | null;
  current_period_end?: string | null;
  premium_until?: string | null;
  updated_at: string;
};

function devLog(message: string, details?: Record<string, string | boolean | null>) {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[Stripe webhook] ${message}`, details ?? {});
  }
}

function getPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price.id ?? null;
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription) {
  const periodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  return unixToIso(periodEnd ?? null);
}

function getCustomerId(value: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function updateProfileByUserId(userId: string, update: ProfileUpdate) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("profiles").update(update).eq("id", userId).select("id").maybeSingle();
  if (error) throw error;
  if (data?.id) {
    devLog("Profil user_id orqali yangilandi", { userFound: true });
    return true;
  }

  const { data: upserted, error: upsertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        current_hsk_level: 1,
        preferred_language: "uz",
        premium: false,
        ...update
      },
      { onConflict: "id" }
    )
    .select("id")
    .maybeSingle();
  if (upsertError) throw upsertError;
  devLog("Profil user_id orqali yaratildi", { userFound: Boolean(upserted?.id) });
  return Boolean(upserted?.id);
}

async function updateProfileByCustomer(customerId: string, update: ProfileUpdate) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("profiles").update(update).eq("stripe_customer_id", customerId).select("id").maybeSingle();
  if (error) throw error;
  devLog("Profil customer orqali yangilandi", { userFound: Boolean(data?.id) });
  return Boolean(data?.id);
}

async function updateSubscriptionProfile(subscription: Stripe.Subscription, statusOverride?: string) {
  const customerId = getCustomerId(subscription.customer);
  const userId = subscription.metadata.user_id;
  const priceId = getPriceId(subscription);
  const plan = subscription.metadata.plan || getPlanFromPrice(priceId);
  const currentPeriodEnd = getCurrentPeriodEnd(subscription);
  const update: ProfileUpdate = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: statusOverride ?? subscription.status,
    subscription_plan: plan,
    stripe_price_id: priceId,
    current_period_end: currentPeriodEnd,
    premium_until: currentPeriodEnd,
    updated_at: new Date().toISOString()
  };

  if (userId) {
    const mappedByUser = await updateProfileByUserId(userId, update);
    if (mappedByUser) return true;
  }

  if (customerId) {
    return updateProfileByCustomer(customerId, update);
  }

  return false;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const stripe = getStripeServerClient();
  const plan = session.metadata?.plan ?? null;
  const customerId = getCustomerId(session.customer);
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

  if (!subscriptionId) return false;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = session.metadata?.user_id ?? subscription.metadata.user_id;
  const priceId = getPriceId(subscription);
  const currentPeriodEnd = getCurrentPeriodEnd(subscription);
  const update: ProfileUpdate = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    subscription_plan: plan || subscription.metadata.plan || getPlanFromPrice(priceId),
    stripe_price_id: priceId,
    current_period_end: currentPeriodEnd,
    premium_until: currentPeriodEnd,
    updated_at: new Date().toISOString()
  };

  if (userId) {
    const mappedByUser = await updateProfileByUserId(userId, update);
    if (mappedByUser) return true;
  }

  if (customerId) {
    return updateProfileByCustomer(customerId, update);
  }

  return false;
}

async function handleInvoice(event: Stripe.Invoice, failed: boolean) {
  const stripe = getStripeServerClient();
  const invoice = event as Stripe.Invoice & { subscription?: string | { id?: string } | null };
  const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
  if (!subscriptionId) return false;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const failedStatus = subscription.status === "unpaid" ? "unpaid" : "past_due";
  return updateSubscriptionProfile(subscription, failed ? failedStatus : subscription.status);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook sozlamalari topilmadi" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Imzo topilmadi" }, { status: 400 });
  }

  const stripe = getStripeServerClient();
  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Webhook imzosi noto‘g‘ri" }, { status: 400 });
  }

  try {
    let mapped = true;
    devLog("Hodisa qabul qilindi", { eventType: event.type });

    switch (event.type) {
      case "checkout.session.completed":
        mapped = await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        mapped = await updateSubscriptionProfile(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        mapped = await updateSubscriptionProfile(event.data.object as Stripe.Subscription, "canceled");
        break;
      case "invoice.payment_succeeded":
        mapped = await handleInvoice(event.data.object as Stripe.Invoice, false);
        break;
      case "invoice.payment_failed":
        mapped = await handleInvoice(event.data.object as Stripe.Invoice, true);
        break;
      default:
        mapped = true;
    }

    if (!mapped && process.env.NODE_ENV !== "production") {
      console.warn(`[Stripe webhook] Foydalanuvchi topilmadi (${event.type})`);
    }

    devLog("Hodisa muvaffaqiyatli yakunlandi", { eventType: event.type, userFound: mapped });
    return NextResponse.json({ received: true });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Stripe webhook] Profilni yangilashda xatolik", {
        eventType: event.type,
        message: error instanceof Error ? error.message : "Noma’lum xatolik"
      });
    }
    return NextResponse.json({ error: "Webhook ishlovida xatolik" }, { status: 500 });
  }
}
