import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getAllUsageLimits, getDailyUsageLimit, type AIUsageType } from "@/utils/usageLimits";

type UsageEntry = {
  count?: number | null;
};

export type UsageResult = {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  fallback: boolean;
};

export type UsageSummaryItem = {
  usageType: AIUsageType;
  used: number;
  limit: number;
  remaining: number;
};

const memoryUsage = new Map<string, number>();

function todayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function memoryKey(userId: string, usageType: AIUsageType, date: string) {
  return `${userId}:${usageType}:${date}`;
}

function sumUsage(rows: UsageEntry[] | null) {
  return (rows ?? []).reduce((total, row) => total + Math.max(0, Number(row.count ?? 1)), 0);
}

function memoryResult(userId: string, usageType: AIUsageType, premium: boolean, consume: boolean): UsageResult {
  const date = todayKey();
  const key = memoryKey(userId, usageType, date);
  const limit = getDailyUsageLimit(usageType, premium);
  const current = memoryUsage.get(key) ?? 0;
  const allowed = limit > 0 && current < limit;
  const used = allowed && consume ? current + 1 : current;

  if (allowed && consume) memoryUsage.set(key, used);

  return {
    allowed,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    fallback: true
  };
}

async function readUsage(userId: string, usageType: AIUsageType, premium: boolean) {
  const limit = getDailyUsageLimit(usageType, premium);
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("ai_usage_logs")
      .select("count")
      .eq("user_id", userId)
      .eq("usage_type", usageType)
      .eq("date", todayKey());

    if (error) throw error;
    const used = sumUsage(data as UsageEntry[] | null);
    return {
      allowed: limit > 0 && used < limit,
      used,
      limit,
      remaining: Math.max(0, limit - used),
      fallback: false
    } satisfies UsageResult;
  } catch {
    return memoryResult(userId, usageType, premium, false);
  }
}

export async function checkAIUsageLimit(userId: string, usageType: AIUsageType, premium: boolean) {
  return readUsage(userId, usageType, premium);
}

export async function consumeAIUsage(userId: string, usageType: AIUsageType, premium: boolean, current?: UsageResult) {
  const base = current ?? (await readUsage(userId, usageType, premium));
  if (!base.allowed) return base;
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("ai_usage_logs").insert({
      user_id: userId,
      usage_type: usageType,
      count: 1,
      date: todayKey()
    });
    if (error) throw error;

    const used = base.used + 1;
    return {
      allowed: true,
      used,
      limit: base.limit,
      remaining: Math.max(0, base.limit - used),
      fallback: false
    } satisfies UsageResult;
  } catch {
    return memoryResult(userId, usageType, premium, true);
  }
}

export async function checkAndConsumeAIUsage(userId: string, usageType: AIUsageType, premium: boolean) {
  const current = await checkAIUsageLimit(userId, usageType, premium);
  return consumeAIUsage(userId, usageType, premium, current);
}

export async function getAIUsageSummary(userId: string, premium: boolean) {
  const usageTypes = Object.keys(getAllUsageLimits(premium)) as AIUsageType[];
  const results = await Promise.all(
    usageTypes.map(async (usageType) => {
      const result = await readUsage(userId, usageType, premium);
      return {
        usageType,
        used: result.used,
        limit: result.limit,
        remaining: result.remaining
      } satisfies UsageSummaryItem;
    })
  );

  return results;
}
