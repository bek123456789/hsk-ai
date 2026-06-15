"use client";

import { useEffect, useState } from "react";
import { UsageLimitCard } from "@/components/UsageLimitCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import type { AIUsageType } from "@/utils/usageLimits";
import { getDailyUsageLimit } from "@/utils/usageLimits";
import { getLocalAIUsage } from "@/utils/aiUsageClient";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

type UsageItem = {
  usageType: AIUsageType;
  used: number;
  limit: number;
  remaining: number;
};

export function UsageLimitOverview({ usageType, compact = true }: { usageType: AIUsageType; compact?: boolean }) {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const [item, setItem] = useState<UsageItem | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const localUsed = getLocalAIUsage(usageType);
      const localLimit = getDailyUsageLimit(usageType, isPremiumProfile(user));
      if (active) {
        setItem({ usageType, used: localUsed, limit: localLimit, remaining: Math.max(0, localLimit - localUsed) });
      }
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;
        const response = await fetch("/api/usage", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        if (!response.ok) return;
        const result = (await response.json()) as { usage?: UsageItem[] };
        const match = result.usage?.find((entry) => entry.usageType === usageType);
        if (active && match) setItem(match);
      } catch {
        // Usage information is secondary and must not block the feature.
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [usageType, user]);

  return item ? <UsageLimitCard {...item} language={language} compact={compact} /> : null;
}
