import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  advancedFeatureConfigs,
  buildBossBattleResult,
  buildHomeworkTasks,
  buildMentorReport,
  buildWeaknessHeatmap,
  createOfflinePracticePack,
  evaluateDictationAnswer,
  getWordFamilies,
  saveAdvancedLocalResult,
  syncAdvancedFeatureBestEffort,
  type AdvancedFeatureKey
} from "@/utils/advancedLearning";
import type { MistakeRecord, PracticeResult } from "@/types";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();
const routes: AdvancedFeatureKey[] = [
  "pronunciation-coach",
  "tone-battle",
  "word-family",
  "topics",
  "stories",
  "grammar-playground",
  "reading-trainer",
  "weakness-map",
  "boss-battle",
  "error-replay",
  "offline-pack",
  "mentor-report"
];

const mistake: MistakeRecord = {
  id: "advanced-mistake-1",
  source: "listening",
  hskLevel: 1,
  chinese: "茶",
  pinyin: "chá",
  wrongAnswer: "水",
  correctAnswer: "茶",
  explanation: "Audio ichida 茶 eshitiladi.",
  createdAt: "2026-06-24T00:00:00.000Z",
  learned: false,
  wordId: "hsk1-032"
};

async function main() {
  for (const route of routes) {
    assert(existsSync(join(root, "app", route, "page.tsx")), `Route /${route} must exist.`);
    const config = advancedFeatureConfigs[route];
    assert(config.href === `/${route}`, `Config href for ${route} must match route.`);
    assert(config.titleUz.length > 2, `${route} must have Uzbek title.`);
    assert(config.bulletsUz.length >= 4, `${route} must have useful Uzbek feature bullets.`);
  }

  const serializedConfigs = JSON.stringify(advancedFeatureConfigs);
  assert(!/[А-Яа-яЁё]/.test(serializedConfigs), "Advanced feature configs must not contain Russian UI.");
  assert(!/Telegram|telegram|TON|Stars|Fragment|KYC|BotFather/.test(serializedConfigs), "Advanced feature configs must not contain Telegram/payment leftovers.");
  assert(!/Official HSK|Rasmiy HSK/.test(serializedConfigs), "Advanced features must not claim official HSK.");

  const emptyDictation = evaluateDictationAnswer("你好", "");
  assert(!emptyDictation.completed && emptyDictation.score === 0, "Dictation must not complete on empty answer.");
  const partialDictation = evaluateDictationAnswer("我喝茶", "我喝");
  assert(partialDictation.completed && partialDictation.score > 0 && partialDictation.missingWords.includes("茶"), "Dictation must detect missing words.");

  const boss = buildBossBattleResult(10, 10);
  assert(boss.won, "Boss battle should be winnable.");
  assert(!boss.unlocksOfficialHsk, "Boss Battle must not unlock official HSK level.");

  const pack = createOfflinePracticePack(1);
  assert(pack.vocabulary.length === 20, "Offline pack must include 20 words.");
  assert(pack.listeningTexts.length > 0 && pack.readingTasks.length > 0, "Offline pack must include listening and reading.");

  const practiceResults: PracticeResult[] = [{ id: "p1", skill: "listening", hskLevel: 1 as const, score: 3, total: 10, completedAt: "2026-06-24T00:00:00.000Z" }];
  const snapshot = {
    currentLevel: 1 as const,
    knownWordIds: ["hsk1-001", "hsk1-002"],
    weakWordIds: ["hsk1-032"],
    mistakes: [mistake],
    practiceResults
  };
  const homework = buildHomeworkTasks(snapshot);
  assert(homework.some((task) => task.titleUz.includes("zaif")), "Homework must use real weak points when available.");
  assert(homework.every((task) => task.href.startsWith("/")), "Homework links must be app routes.");

  const heatmap = buildWeaknessHeatmap(snapshot);
  assert(heatmap.length === 8, "Weakness heatmap must include 8 skill rows.");
  assert(heatmap.some((item) => item.skillUz === "Listening" && item.score < 60), "Weakness map must reflect weak listening score.");

  const mentor = buildMentorReport(snapshot);
  assert(mentor.officialClaimUz.includes("rasmiy HSK sertifikati emas"), "Mentor report must not claim official HSK certificate.");

  const families = getWordFamilies(1);
  assert(families.length > 0, "Word family map must produce related word groups.");

  assert(saveAdvancedLocalResult("advanced-test", { id: "node-test" }) === false, "LocalStorage fallback must not crash in Node.");
  const syncResult = await syncAdvancedFeatureBestEffort("missing_optional_table", { ok: true });
  assert(syncResult === false, "Optional Supabase missing table/helper path must not crash in Node.");

  console.log("Advanced feature tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
