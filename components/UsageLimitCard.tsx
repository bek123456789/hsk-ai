"use client";

import { Bot, Crown, Gauge, Mic2 } from "lucide-react";
import { Card } from "@/components/Card";
import { getUsageTypeLabel, type AIUsageType } from "@/utils/usageLimits";
import type { AppLanguage } from "@/types";

type UsageLimitCardProps = {
  usageType: AIUsageType;
  used: number;
  limit: number;
  language: AppLanguage;
  compact?: boolean;
};

export function UsageLimitCard({ usageType, used, limit, language, compact = false }: UsageLimitCardProps) {
  const safeLimit = Math.max(0, limit);
  const percentage = safeLimit === 0 ? 100 : Math.min(100, Math.round((used / safeLimit) * 100));
  const remaining = Math.max(0, safeLimit - used);
  const Icon = usageType === "pronunciation_check" ? Mic2 : usageType === "ai_tutor_message" ? Bot : Gauge;

  return (
    <Card className={`border-orange-soft/70 bg-white/88 ${compact ? "p-4" : "p-5"} shadow-soft`}>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-ink">{getUsageTypeLabel(usageType, language)}</p>
            <p className="mt-1 text-xs font-bold text-stone-500">
              {language === "ru" ? "Осталось" : "Qoldi"}: {remaining}
            </p>
          </div>
        </div>
        {safeLimit === 0 ? <Crown className="h-5 w-5 shrink-0 text-orange-brand" /> : <span className="shrink-0 text-sm font-black text-orange-deep">{used}/{safeLimit}</span>}
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-orange-soft/70">
        <div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-orange-hot transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </Card>
  );
}
