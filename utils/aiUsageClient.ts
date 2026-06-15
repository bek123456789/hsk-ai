"use client";

import type { AIUsageType } from "@/utils/usageLimits";

type LocalUsage = Partial<Record<AIUsageType, number>> & { date?: string };

const storageKey = "hsk-ai-usage-fallback";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function readState(): LocalUsage {
  if (typeof window === "undefined") return { date: today() };
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as LocalUsage;
    return stored.date === today() ? stored : { date: today() };
  } catch {
    return { date: today() };
  }
}

export function getLocalAIUsage(usageType: AIUsageType) {
  return Math.max(0, Number(readState()[usageType] ?? 0));
}

export function recordLocalAIUsage(usageType: AIUsageType) {
  if (typeof window === "undefined") return;
  const state = readState();
  state[usageType] = getLocalAIUsage(usageType) + 1;
  localStorage.setItem(storageKey, JSON.stringify(state));
}
