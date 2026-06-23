import { NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/lib/supabase/server";
import { createTrialPeriod } from "@/utils/trial";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_ENABLE_TRIAL !== "true") {
    return NextResponse.json(
      { error: "Sinov muddati hozir o‘chirilgan" },
      { status: 404 }
    );
  }

  const { user, supabase } = await getAuthenticatedServerUser(request);
  if (!user || !supabase) {
    return NextResponse.json(
      { error: "Avval tizimga kiring" },
      { status: 401 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("trial_used,trial_ends_at")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) {
    return NextResponse.json(
      { error: "Avval ma’lumotlar bazasi yangilanishini qo‘llang" },
      { status: 503 }
    );
  }

  if (profile?.trial_used) {
    return NextResponse.json(
      { error: "Sinov muddati tugagan" },
      { status: 409 }
    );
  }

  const trial = createTrialPeriod();
  const { error } = await supabase
    .from("profiles")
    .update({
      trial_started_at: trial.startsAt,
      trial_ends_at: trial.endsAt,
      trial_used: true,
      subscription_status: "trialing",
      premium_until: trial.endsAt,
      updated_at: trial.startsAt
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Sinov muddatini boshlab bo‘lmadi" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, trialEndsAt: trial.endsAt });
}
