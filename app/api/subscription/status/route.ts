import { NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/lib/supabase/server";
import { getIsPremium } from "@/utils/premium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { user, supabase } = await getAuthenticatedServerUser(request);
  if (!user || !supabase) {
    return NextResponse.json({ error: "Sessiya topilmadi" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("subscription_status,subscription_plan,stripe_customer_id,stripe_subscription_id,stripe_price_id,current_period_end,premium_until,premium")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Obuna holatini olib bo‘lmadi" }, { status: 500 });
  }

  return NextResponse.json({
    subscription_status: profile?.subscription_status ?? "free",
    subscription_plan: profile?.subscription_plan ?? null,
    stripe_price_id: profile?.stripe_price_id ?? null,
    current_period_end: profile?.current_period_end ?? null,
    premium_until: profile?.premium_until ?? null,
    stripeCustomerExists: Boolean(profile?.stripe_customer_id),
    stripeSubscriptionExists: Boolean(profile?.stripe_subscription_id),
    isPremium: getIsPremium(profile)
  });
}
