import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isPremiumProfile } from "@/utils/premium";
import type { AppLanguage, AuthUser, HSKLevel, SubscriptionStatus } from "@/types";

type ProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  current_hsk_level: number | null;
  preferred_language: string | null;
  premium: boolean | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  subscription_status?: SubscriptionStatus | null;
  subscription_plan?: "monthly" | "yearly" | null;
  stripe_price_id?: string | null;
  current_period_end?: string | null;
  premium_until?: string | null;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  trial_used?: boolean | null;
  onboarding_completed?: boolean | null;
  learning_goal?: string | null;
  daily_goal_minutes?: number | null;
  referral_code?: string | null;
  referred_by?: string | null;
  referral_bonus_days?: number | null;
  created_at: string | null;
};

function supabaseErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const status = (error as { status?: unknown }).status;
    if (status === 429) return "too many requests";
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "Auth xatosi";
}

function toAuthUser(profile: ProfileRow, fallbackEmail: string): AuthUser {
  const rawStatus = profile.subscription_status ?? (profile.premium ? "beta_premium" : "free");
  const timedStatusExpired =
    (rawStatus === "trialing" || rawStatus === "beta_premium") &&
    Boolean(profile.premium_until) &&
    new Date(profile.premium_until as string).getTime() <= Date.now();
  const subscriptionStatus = timedStatusExpired ? "free" : rawStatus;

  return {
    id: profile.id,
    email: profile.email ?? fallbackEmail,
    name: profile.name ?? fallbackEmail.split("@")[0] ?? "HanziFlow AI",
    currentHSKLevel: ((profile.current_hsk_level ?? 1) as HSKLevel),
    createdAt: profile.created_at ?? new Date().toISOString(),
    premium: isPremiumProfile(profile),
    stripeCustomerId: profile.stripe_customer_id ?? null,
    stripeSubscriptionId: profile.stripe_subscription_id ?? null,
    subscriptionStatus,
    subscriptionPlan: profile.subscription_plan ?? null,
    stripePriceId: profile.stripe_price_id ?? null,
    currentPeriodEnd: profile.current_period_end ?? null,
    premiumUntil: profile.premium_until ?? null,
    trialStartedAt: profile.trial_started_at ?? null,
    trialEndsAt: profile.trial_ends_at ?? null,
    trialUsed: profile.trial_used ?? false,
    onboardingCompleted: profile.onboarding_completed ?? undefined,
    learningGoal: profile.learning_goal ?? null,
    dailyGoalMinutes: profile.daily_goal_minutes ?? null,
    referralCode: profile.referral_code ?? null,
    referredBy: profile.referred_by ?? null,
    referralBonusDays: profile.referral_bonus_days ?? 0
  };
}

export async function upsertProfile(input: { id: string; email: string; name: string; preferredLanguage?: AppLanguage }) {
  const supabase = getSupabaseBrowserClient();
  const row = {
    id: input.id,
    email: input.email,
    name: input.name,
    current_hsk_level: 1,
    preferred_language: input.preferredLanguage ?? "uz",
    premium: false,
    subscription_status: "free",
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from("profiles").upsert(row, { onConflict: "id" }).select("*").single();
  if (error) throw new Error(supabaseErrorMessage(error));

  return toAuthUser(data as ProfileRow, input.email);
}

export async function getCurrentUserProfile() {
  const supabase = getSupabaseBrowserClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(supabaseErrorMessage(sessionError));

  const user = sessionData.session?.user;
  if (!user?.email) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) throw new Error(supabaseErrorMessage(error));

  if (!data) {
    return upsertProfile({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name ?? user.email.split("@")[0] ?? "HanziFlow AI"
    });
  }

  return toAuthUser(data as ProfileRow, user.email);
}

export async function updateCurrentUserProfile(input: {
  id: string;
  email: string;
  name: string;
  currentHSKLevel: HSKLevel;
  dailyGoalMinutes: number;
  preferredLanguage: AppLanguage;
}) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: input.name,
      current_hsk_level: input.currentHSKLevel,
      daily_goal_minutes: input.dailyGoalMinutes,
      preferred_language: input.preferredLanguage,
      updated_at: new Date().toISOString()
    })
    .eq("id", input.id)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(supabaseErrorMessage(error));
  if (!data) throw new Error("Profil ma’lumotlari yangilanmadi.");
  return toAuthUser(data as ProfileRow, input.email);
}

export async function registerWithSupabase(input: { name: string; email: string; password: string; preferredLanguage?: AppLanguage }) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name
      }
    }
  });

  if (error) throw new Error(supabaseErrorMessage(error));
  if (!data.user?.id || !data.user.email) throw new Error("Foydalanuvchi yaratilmadi.");

  if (!data.session) {
    throw new Error("Hisob yaratildi. Iltimos, elektron pochtangizni tasdiqlab keyin kiring.");
  }

  return upsertProfile({
    id: data.user.id,
    email: data.user.email,
    name: input.name,
    preferredLanguage: input.preferredLanguage
  });
}

export async function loginWithSupabase(input: { email: string; password: string }) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password
  });

  if (error) throw new Error(supabaseErrorMessage(error));
  const profile = await getCurrentUserProfile();
  if (!profile) throw new Error("Sessiya topilmadi.");

  return profile;
}

export async function logoutFromSupabase() {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(supabaseErrorMessage(error));
}

export async function sendPasswordReset(email: string) {
  const supabase = getSupabaseBrowserClient();
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(supabaseErrorMessage(error));
}
