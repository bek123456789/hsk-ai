import { NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

function createReferralCode(userId: string) {
  return `HSK${userId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function GET(request: Request) {
  const { user, supabase } = await getAuthenticatedServerUser(request);
  if (!user || !supabase) {
    return NextResponse.json({ error: "Sessiya topilmadi" }, { status: 401 });
  }

  const fallbackCode = createReferralCode(user.id);
  const { data, error } = await supabase
    .from("profiles")
    .select("referral_code,referral_bonus_days")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ referralCode: fallbackCode, bonusDays: 0, persisted: false });
  }

  const referralCode = data?.referral_code || fallbackCode;
  if (!data?.referral_code) {
    const update = await supabase
      .from("profiles")
      .update({ referral_code: referralCode, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (update.error) {
      return NextResponse.json({ referralCode, bonusDays: Number(data?.referral_bonus_days ?? 0), persisted: false });
    }
  }

  return NextResponse.json({
    referralCode,
    bonusDays: Number(data?.referral_bonus_days ?? 0),
    persisted: true
  });
}
