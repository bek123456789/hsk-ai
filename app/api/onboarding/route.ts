import { NextResponse } from "next/server";
import { getAuthenticatedServerUser, getSupabaseAdminClient } from "@/lib/supabase/server";
import type { AppLanguage, HSKLevel } from "@/types";

export const runtime = "nodejs";

const goals = new Set(["exam", "travel", "conversation", "work"]);
const dailyMinutes = new Set([5, 10, 20, 30]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    language?: unknown;
    goal?: unknown;
    level?: unknown;
    dailyMinutes?: unknown;
    referredBy?: unknown;
    skip?: unknown;
  };
  const language: AppLanguage = body.language === "ru" ? "ru" : "uz";
  const { user, supabase } = await getAuthenticatedServerUser(request);
  if (!user || !supabase) {
    return NextResponse.json({ error: language === "ru" ? "Сессия не найдена" : "Sessiya topilmadi" }, { status: 401 });
  }

  const levelNumber = Number(body.level);
  const level = Math.min(6, Math.max(1, Number.isFinite(levelNumber) ? levelNumber : 1)) as HSKLevel;
  const minutes = Number(body.dailyMinutes);
  const update = {
    preferred_language: language,
    learning_goal: typeof body.goal === "string" && goals.has(body.goal) ? body.goal : null,
    current_hsk_level: level,
    daily_goal_minutes: dailyMinutes.has(minutes) ? minutes : 10,
    onboarding_completed: true,
    referred_by: typeof body.referredBy === "string" ? body.referredBy.slice(0, 32) : null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
  if (error) {
    return NextResponse.json(
      {
        error: language === "ru" ? "Настройки сохранены только на этом устройстве" : "Sozlamalar faqat shu qurilmada saqlandi",
        code: "profile_columns_missing"
      },
      { status: 503 }
    );
  }

  await supabase
    .from("profiles")
    .update({
      target_hsk_level: level,
      ui_language: language,
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (update.referred_by && body.skip !== true) {
    try {
      const admin = getSupabaseAdminClient();
      const { data: referrer } = await admin
        .from("profiles")
        .select("id,referral_bonus_days,premium_until")
        .eq("referral_code", update.referred_by)
        .neq("id", user.id)
        .maybeSingle();

      if (referrer?.id) {
        const currentEnd = referrer.premium_until ? new Date(referrer.premium_until).getTime() : Date.now();
        const bonusBase = Math.max(Date.now(), currentEnd);
        const premiumUntil = new Date(bonusBase + 24 * 60 * 60 * 1000).toISOString();
        await admin
          .from("profiles")
          .update({
            referral_bonus_days: Number(referrer.referral_bonus_days ?? 0) + 1,
            subscription_status: "beta_premium",
            premium_until: premiumUntil,
            updated_at: new Date().toISOString()
          })
          .eq("id", referrer.id);
      }
    } catch {
      // Referral bonus is retriable after the profile migration and must not block onboarding.
    }
  }

  return NextResponse.json({ ok: true });
}
