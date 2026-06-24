import type { MasterySnapshot } from "@/utils/masterySystem";
import { buildMasteryDiagnosis, classifyMistakeReason, generateMistakeDrills, saveMasteryDiagnosisCache, syncMasteryDiagnosisBestEffort } from "@/utils/masterySystem";
import type { MistakeRecord } from "@/types";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function baseSnapshot(overrides: Partial<MasterySnapshot> = {}): MasterySnapshot {
  return {
    currentLevel: 1,
    knownWordIds: [],
    weakWordIds: [],
    wordReviews: {},
    quizResults: [],
    mistakes: [],
    examAttempts: [],
    practiceResults: [],
    speakingResults: [],
    lessonProgress: {},
    streak: 0,
    premium: false,
    ...overrides
  };
}

const sampleMistake: MistakeRecord = {
  id: "mistake-tea-1",
  source: "quiz",
  hskLevel: 1,
  chinese: "茶",
  pinyin: "chá",
  wrongAnswer: "suv",
  correctAnswer: "choy",
  explanation: "茶 xitoy tilida choy degani.",
  createdAt: "2026-06-24T00:00:00.000Z",
  learned: false,
  wordId: "hsk1-032"
};

const listeningMistake: MistakeRecord = {
  ...sampleMistake,
  id: "mistake-listening-1",
  source: "listening",
  wrongAnswer: "米饭",
  correctAnswer: "茶",
  explanation: "Audio savolda 茶 eshitiladi."
};

const pinyinMistake: MistakeRecord = {
  ...sampleMistake,
  id: "mistake-pinyin-1",
  wrongAnswer: "cha",
  correctAnswer: "茶",
  explanation: "Hanzi javob kerak."
};

const copiedMistake: MistakeRecord = {
  ...sampleMistake,
  id: "mistake-copy-1",
  source: "speaking",
  wrongAnswer: "你在商店买东西",
  correctAnswer: "这个多少钱？我要买茶，不要米饭。",
  explanation: "Vazifa prompt matni ko‘chirilgan."
};

async function main() {
  const emptyDiagnosis = buildMasteryDiagnosis(baseSnapshot());
  assert(!emptyDiagnosis.hasEnoughData, "Empty account must not pretend to have enough data.");
  assert(emptyDiagnosis.passPrediction.readiness === 0, "Empty account readiness must be 0.");
  assert(emptyDiagnosis.diagnosisUz.join(" ").includes("Hali tahlil qilish uchun ma’lumot yetarli emas"), "Empty diagnosis must show useful Uzbek empty state.");

  const sampleDiagnosis = buildMasteryDiagnosis(baseSnapshot({
    knownWordIds: ["hsk1-001", "hsk1-002", "hsk1-003"],
    weakWordIds: ["hsk1-032", "hsk1-033"],
    quizResults: [{ level: 1, score: 7, total: 10, completedAt: "2026-06-24T00:00:00.000Z" }],
    mistakes: [sampleMistake, listeningMistake],
    practiceResults: [{ id: "listen-1", skill: "listening", hskLevel: 1, score: 4, total: 10, completedAt: "2026-06-24T00:00:00.000Z" }],
    lessonProgress: {
      "hsk1-lesson-01": {
        lessonId: "hsk1-lesson-01",
        level: 1,
        sections: { vocabulary: true, grammar: true, reading: true, listening: true, speaking: true, miniTest: true },
        completedSections: ["vocabulary", "grammar", "reading", "listening", "speaking", "miniTest"],
        progress: 100,
        done: true,
        markedDone: true,
        quizScore: 95,
        quizTotal: 100,
        updatedAt: "2026-06-24T00:00:00.000Z"
      }
    }
  }));
  assert(sampleDiagnosis.hasEnoughData, "Sample progress must produce a diagnosis.");
  assert(sampleDiagnosis.recommendations.length > 0, "Diagnosis must generate recommendations.");
  assert(!sampleDiagnosis.recommendations.some((item) => item.href.startsWith("/lesson/2/")), "Recommendations must not include locked HSK 2 lessons before HSK 1 exam pass.");
  assert(sampleDiagnosis.passPrediction.readiness > 0 && sampleDiagnosis.passPrediction.readiness < 100, "Sample pass prediction must be realistic.");

  assert(classifyMistakeReason(sampleMistake) === "word_meaning", "Word meaning mistake should be classified.");
  assert(classifyMistakeReason(listeningMistake) === "listening_misunderstanding", "Listening mistake should be classified.");
  assert(classifyMistakeReason(pinyinMistake) === "pinyin", "Pinyin mistake should be classified.");
  assert(classifyMistakeReason(copiedMistake) === "copied_prompt", "Copied prompt mistake should be classified.");

  const drills = generateMistakeDrills(sampleMistake);
  assert(drills.length === 3, "Mistake drill generator must return exactly 3 drills.");
  assert(new Set(drills.map((item) => item.questionUz)).size === 3, "Drills must not repeat exact same question.");
  assert(drills.every((item) => item.explanationUz.length > 20), "Each drill must include a useful Uzbek explanation.");

  const serialized = JSON.stringify(sampleDiagnosis);
  assert(!/Telegram|telegram|TON|Stars|Fragment|KYC|BotFather/.test(serialized), "Mastery output must not contain Telegram/payment leftovers.");
  assert(!/[А-Яа-яЁё]/.test(serialized), "Mastery output must not contain Russian UI text.");
  assert(!/Learning Path|Smart Review|Choose language|Select language/.test(serialized), "Mastery output must not contain English UI text.");

  assert(saveMasteryDiagnosisCache(sampleDiagnosis) === false, "LocalStorage fallback helper must not crash in Node.");
  const syncResult = await syncMasteryDiagnosisBestEffort(sampleDiagnosis);
  assert(syncResult === false, "Supabase missing user/table path must not crash.");

  console.log("AI HSK Mastery System tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
