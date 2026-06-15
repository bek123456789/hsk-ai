import { NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/lib/supabase/server";
import { getAIUsageSummary } from "@/utils/aiUsage";
import { hasPremiumUsageLimits } from "@/utils/usageLimits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { user, supabase } = await getAuthenticatedServerUser(request);
  if (!user || !supabase) {
    return NextResponse.json({ error: "Sessiya topilmadi" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("premium,subscription_status,premium_until")
    .eq("id", user.id)
    .maybeSingle();
  const premium = hasPremiumUsageLimits(profile?.subscription_status, profile?.premium, profile?.premium_until);
  const usage = await getAIUsageSummary(user.id, premium);

  return NextResponse.json({ usage, premium });
}
