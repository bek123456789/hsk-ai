import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeServerClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Stripe sozlamalari topilmadi.");

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getStripePriceForPlan(plan: unknown) {
  if (plan === "monthly") return process.env.STRIPE_PRICE_PREMIUM_MONTHLY;
  if (plan === "yearly") return process.env.STRIPE_PRICE_PREMIUM_YEARLY;
  return null;
}

export function getPlanFromPrice(priceId?: string | null) {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_PREMIUM_MONTHLY) return "monthly";
  if (priceId === process.env.STRIPE_PRICE_PREMIUM_YEARLY) return "yearly";
  return null;
}

export function unixToIso(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}
