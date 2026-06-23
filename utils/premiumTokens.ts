import type { AppLanguage } from "@/types";

export type TokenRewardSource = "streak" | "referral" | "reward_chest";

export function getBonusTokenAmount(source: TokenRewardSource) {
  if (source === "referral") return 10;
  if (source === "reward_chest") return 5;
  return 3;
}

export function getBonusTokenLabel(source: TokenRewardSource, language: AppLanguage) {
  const labels = {
    uz: {
      streak: "Seriya bonusi",
      referral: "Do‘st taklifi bonusi",
      reward_chest: "Kunlik mukofot bonusi"
    },
    ru: {
      streak: "Бонус серии",
      referral: "Бонус приглашения",
      reward_chest: "Бонус ежедневной награды"
    },
    en: {
      streak: "Streak bonus",
      referral: "Referral bonus",
      reward_chest: "Daily reward bonus"
    }
  };
  return labels[language][source];
}

export function readLocalBonusTokens() {
  if (typeof window === "undefined") return 0;
  return Math.max(0, Number(localStorage.getItem("hsk-ai-bonus-tokens") ?? 0));
}

export function addLocalBonusTokens(amount: number) {
  if (typeof window === "undefined") return 0;
  const next = readLocalBonusTokens() + Math.max(0, amount);
  localStorage.setItem("hsk-ai-bonus-tokens", String(next));
  return next;
}

export function useLocalBonusToken() {
  if (typeof window === "undefined") return false;
  const current = readLocalBonusTokens();
  if (current <= 0) return false;
  localStorage.setItem("hsk-ai-bonus-tokens", String(current - 1));
  return true;
}
