import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { advancedFeatureConfigs, buildBossBattleResult, buildHomeworkTasks, evaluateDictationAnswer } from "@/utils/advancedLearning";
import { buildMasteryDiagnosis } from "@/utils/masterySystem";
import { safeLocalGet, safeLocalSet, safeLocalAppend, loadFeatureResults } from "@/utils/featureStorage";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();
const routes = [
  "mastery",
  "pronunciation-coach",
  "tone-battle",
  "word-family",
  "topics",
  "stories",
  "grammar-playground",
  "dictation",
  "reading-trainer",
  "weakness-map",
  "boss-battle",
  "error-replay",
  "homework",
  "offline-pack",
  "mentor-report",
  "goals"
];

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function routeFile(route: string) {
  return join(root, "app", route, "page.tsx");
}

async function main() {
  for (const route of routes) {
    assert(existsSync(routeFile(route)), `/${route} route exists`);
  }

  const advancedPage = read("components/AdvancedFeaturePage.tsx");
  const practicePage = read("app/practice/page.tsx");
  const dashboardPage = read("app/dashboard/page.tsx");

  for (const action of ["onClick", "saveFeatureResult", "safeLocalSet", "Natijani saqlash", "Progress saqlash"]) {
    assert(advancedPage.includes(action), `Advanced feature page must include action/state: ${action}`);
  }

  assert(advancedPage.includes("Bo‘sh javob progress sifatida saqlanmaydi"), "Advanced pages must include useful empty validation.");
  assert(advancedPage.includes("Boss kuchi") && advancedPage.includes("Sizning energiyangiz"), "Boss battle must expose HP/energy logic.");
  assert(advancedPage.includes("window.print()"), "Mentor report print button must call window.print.");

  for (const config of Object.values(advancedFeatureConfigs)) {
    assert(practicePage.includes(`href: "${config.href}"`) || config.href === "/pronunciation-coach", `Practice should link to ${config.href}`);
  }
  for (const href of ["/mastery", "/homework", "/review", "/exam", "/learning-path", "/practice"]) {
    assert(dashboardPage.includes(`href: "${href}"`), `Dashboard should link to ${href}`);
  }
  assert(!dashboardPage.includes('href: "/boss-battle"') && !dashboardPage.includes('href: "/dictation"'), "Dashboard should not be overcrowded with deep tools.");

  const boss = buildBossBattleResult(10, 10);
  assert(!boss.unlocksOfficialHsk, "Boss Battle does not unlock official HSK.");
  const emptyDictation = evaluateDictationAnswer("我喝茶", "");
  assert(!emptyDictation.completed && emptyDictation.score === 0, "Dictation empty answer does not complete.");

  const homework = buildHomeworkTasks({ currentLevel: 1, knownWordIds: [], weakWordIds: ["hsk1-001"], mistakes: [], practiceResults: [] });
  assert(homework.every((task) => !task.href.startsWith("/lesson/2")), "Homework must not recommend locked HSK 2 for empty HSK 1 user.");
  const mentor = (await import("@/utils/advancedLearning")).buildMentorReport({ currentLevel: 1, knownWordIds: [], weakWordIds: [], mistakes: [], practiceResults: [] });
  assert(mentor.officialClaimUz.includes("rasmiy HSK sertifikati emas"), "Mentor report must include non-official disclaimer.");

  const emptyMastery = buildMasteryDiagnosis({ currentLevel: 1, knownWordIds: [], weakWordIds: [], quizResults: [], mistakes: [], examAttempts: [], practiceResults: [], speakingResults: [], lessonProgress: {}, streak: 0, premium: false });
  assert(!emptyMastery.hasEnoughData && emptyMastery.passPrediction.readiness === 0, "Mastery must not fake readiness with no data.");

  assert(safeLocalGet("feature-depth-missing", { ok: true }).ok, "safeLocalGet fallback works in Node.");
  assert(typeof safeLocalSet("feature-depth", { ok: true }) === "boolean", "safeLocalSet does not crash in Node.");
  assert(typeof safeLocalAppend("feature-depth", { id: "1" }) === "boolean", "safeLocalAppend does not crash in Node.");
  assert(loadFeatureResults("feature-depth").length === 0, "loadFeatureResults returns empty fallback in Node.");

  const scanned = [advancedPage, practicePage, read("utils/advancedLearning.ts")].join("\n");
  assert(!/Coming soon|Placeholder|Lorem|TODO/.test(scanned), "New feature UI must not contain placeholder labels.");
  assert(!/Telegram|telegram|TON|Stars|Fragment|KYC|BotFather/.test(scanned), "New feature UI must not contain forbidden platform/payment references.");
  assert(!/HSK AI/.test(scanned), "New feature UI must not contain old HSK AI brand.");

  console.log("Feature depth tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
