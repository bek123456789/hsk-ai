import type { AuthUser } from "@/types";

export const TRIAL_DURATION_DAYS = 3;

export function isTrialEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_TRIAL === "true";
}

export function createTrialPeriod(now = new Date()) {
  const startsAt = now.toISOString();
  const endsAt = new Date(now.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  return { startsAt, endsAt };
}

export function getTrialState(profile?: Pick<AuthUser, "trialUsed" | "trialEndsAt"> | null) {
  if (!profile) return "available" as const;
  if (profile.trialEndsAt && new Date(profile.trialEndsAt).getTime() > Date.now()) return "active" as const;
  if (profile.trialUsed) return "expired" as const;
  return "available" as const;
}
