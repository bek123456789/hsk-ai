import {
  getCentralExamQuestionsByLevel,
  getDictationByLevel,
  getListeningByLevel,
  getQuizQuestionsByLevel as getCentralQuizQuestionsByLevel,
  getReadingByLevel,
  getRoleplayScenariosByLevel,
  getSentenceBuilderByLevel,
  getSpeakingTasksByLevel,
  getVocabularyEntriesByLevel,
  type HSKSkillQuestion
} from "@/data/hsk/contentIndex";
import type { HSKLevel } from "@/types";
import { pickDiverseQuestions } from "@/utils/contentDiversity";

export type RecentContentType = "vocabulary" | "reading" | "listening" | "speaking" | "quiz" | "exam" | "roleplay";

const recentKeys: Record<RecentContentType, string> = {
  vocabulary: "hsk_recent_vocabulary",
  reading: "hsk_recent_reading",
  listening: "hsk_recent_listening",
  speaking: "hsk_recent_speaking",
  quiz: "hsk_recent_quiz",
  exam: "hsk_recent_exam",
  roleplay: "hsk_recent_roleplay"
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readRecent(type: RecentContentType) {
  if (!isBrowser()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(recentKeys[type]) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function saveRecentlySeenContent(type: RecentContentType, ids: string[]) {
  if (!isBrowser()) return;
  const current = readRecent(type);
  const next = [...ids, ...current.filter((id) => !ids.includes(id))].slice(0, 60);
  window.localStorage.setItem(recentKeys[type], JSON.stringify(next));
}

export function avoidRecentlySeenContent<T extends { id: string }>(type: RecentContentType, items: T[]) {
  const recent = new Set(readRecent(type));
  const fresh = items.filter((item) => !recent.has(item.id));
  return fresh.length ? fresh : items;
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableShuffle<T extends { id: string }>(items: T[], seed = "hsk-ai") {
  return [...items].sort((a, b) => {
    return stableHash(`${seed}:${a.id}`) - stableHash(`${seed}:${b.id}`);
  });
}

export function getVocabularyByLevel(level: HSKLevel) {
  return getVocabularyEntriesByLevel(level);
}

export function getReadingItemsByLevel(level: HSKLevel) {
  return getReadingByLevel(level);
}

export function getListeningItemsByLevel(level: HSKLevel) {
  return getListeningByLevel(level);
}

export function getSpeakingItemsByLevel(level: HSKLevel) {
  return getSpeakingTasksByLevel(level);
}

export function getNewWordsForUser(level: HSKLevel, count: number, excludeIds: string[] = []) {
  const excluded = new Set(excludeIds);
  const fresh = avoidRecentlySeenContent("vocabulary", getVocabularyByLevel(level).filter((word) => !excluded.has(word.id)));
  return stableShuffle(fresh, `new-${level}-${new Date().toISOString().slice(0, 10)}`).slice(0, count);
}

export function getReviewWords(level: HSKLevel, count: number, weakWordIds: string[] = []) {
  const weak = new Set(weakWordIds);
  const words = getVocabularyByLevel(level);
  const weakWords = words.filter((word) => weak.has(word.id));
  return [...weakWords, ...words.filter((word) => !weak.has(word.id))].slice(0, count);
}

export function getRandomWords(level: HSKLevel, count: number, seed?: string) {
  return stableShuffle(getVocabularyByLevel(level), seed).slice(0, count);
}

export function getQuizWords(level: HSKLevel, count: number, mode: "new" | "review" | "mixed" = "mixed") {
  const words = mode === "new" ? getNewWordsForUser(level, count) : getRandomWords(level, count, mode);
  return words.slice(0, count);
}

export function getExamWords(level: HSKLevel, count: number) {
  return getRandomWords(level, count, `exam-${level}`);
}

export function getWordsByCategory(level: HSKLevel, category: string, count: number) {
  return getVocabularyByLevel(level).filter((word) => word.category === category || word.tags.includes(category)).slice(0, count);
}

export function getQuizQuestionsByLevel(level: HSKLevel, skill: HSKSkillQuestion["skill"] | "all" = "all", count = 12) {
  const questions = getCentralQuizQuestionsByLevel(level).filter((question) => skill === "all" || question.skill === skill);
  return pickDiverseQuestions(avoidRecentlySeenContent("quiz", questions), {
    count,
    seed: `quiz-${level}-${skill}-${new Date().toISOString().slice(0, 10)}`
  });
}

export function getExamQuestionsByLevel(level: HSKLevel, count = 40) {
  return pickDiverseQuestions(avoidRecentlySeenContent("exam", getCentralExamQuestionsByLevel(level)), {
    count,
    seed: `exam-${level}`
  });
}

export function getNewContentForUser(type: RecentContentType, level: HSKLevel, count: number) {
  switch (type) {
    case "vocabulary":
      return avoidRecentlySeenContent(type, getVocabularyByLevel(level)).slice(0, count);
    case "reading":
      return avoidRecentlySeenContent(type, getReadingByLevel(level)).slice(0, count);
    case "listening":
      return avoidRecentlySeenContent(type, getListeningByLevel(level)).slice(0, count);
    case "speaking":
      return avoidRecentlySeenContent(type, getSpeakingTasksByLevel(level)).slice(0, count);
    case "quiz":
      return avoidRecentlySeenContent(type, getCentralQuizQuestionsByLevel(level)).slice(0, count);
    case "exam":
      return avoidRecentlySeenContent(type, getCentralExamQuestionsByLevel(level)).slice(0, count);
    case "roleplay":
      return avoidRecentlySeenContent(type, getRoleplayScenariosByLevel(level)).slice(0, count);
  }
}

export function getReviewContentForUser(type: RecentContentType, level: HSKLevel, weakIds: string[] = []) {
  if (type === "vocabulary") return getReviewWords(level, 12, weakIds);
  return getNewContentForUser(type, level, 6);
}

export { getDictationByLevel, getListeningByLevel, getReadingByLevel, getRoleplayScenariosByLevel, getSentenceBuilderByLevel, getSpeakingTasksByLevel };
