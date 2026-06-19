import { hskLessonCurriculum } from "../data/hsk/lessonCurriculum";
import type { ExamAttempt } from "../types";
import { getSafeNextPath } from "../utils/authRedirect";
import { generateDailyStudyPlan } from "../utils/studyPlan";
import { getLevelCompletionStatus, isLessonUnlocked } from "../utils/lessonUnlock";

const storage = new Map<string, string>();
Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear()
    }
  }
});

const hsk1 = hskLessonCurriculum.filter((lesson) => lesson.level === 1).sort((a, b) => a.order - b.order);
const hsk2 = hskLessonCurriculum.filter((lesson) => lesson.level === 2).sort((a, b) => a.order - b.order);
const [lesson1, lesson2, lesson3] = hsk1;
const hsk2Lesson1 = hsk2[0];

if (!lesson1 || !lesson2 || !lesson3 || !hsk2Lesson1) {
  throw new Error("Unlock flow test uchun kerakli darslar topilmadi.");
}

if (!isLessonUnlocked(1, lesson1.id, { knownWordIds: [], lessonProgress: {} }, [])) {
  throw new Error("Yangi user uchun HSK 1 lesson 1 ochiq emas.");
}

if (isLessonUnlocked(1, lesson2.id, { knownWordIds: [], lessonProgress: {} }, [])) {
  throw new Error("Yangi user uchun HSK 1 lesson 2 ochilib ketgan.");
}

const lessonProgress = {
  [lesson1.id]: {
    lessonId: lesson1.id,
    level: 1,
    completedSections: ["vocabulary", "grammar", "reading", "listening", "speaking", "miniTest"],
    sections: { vocabulary: true, grammar: true, reading: true, listening: true, speaking: true, miniTest: true },
    quizScore: 19,
    quizTotal: 20,
    progress: 100,
    markedDone: true,
    done: true,
    completedAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString()
  }
};

if (!isLessonUnlocked(1, lesson2.id, { knownWordIds: [], lessonProgress }, [])) {
  throw new Error("Lesson 1 done=true bo‘lgandan keyin lesson 2 ochilmadi.");
}

if (isLessonUnlocked(1, lesson3.id, { knownWordIds: [], lessonProgress }, [])) {
  throw new Error("Lesson 2 tugamagan bo‘lsa lesson 3 ochilmasligi kerak.");
}

if (isLessonUnlocked(2, hsk2Lesson1.id, { knownWordIds: [], lessonProgress }, [])) {
  throw new Error("HSK 2 lesson 1 HSK 1 exam pass bo‘lmasdan ochildi.");
}

const passedHsk1: ExamAttempt = {
  id: "test-hsk1-pass",
  hskLevel: 1,
  score: 8,
  total: 10,
  accuracy: 80,
  overallScore: 80,
  passingScore: 80,
  passed: true,
  correctAnswers: 8,
  wrongAnswers: 2,
  timeSpentSeconds: 600,
  completedAt: new Date(0).toISOString(),
  answers: []
};

if (!isLessonUnlocked(2, hsk2Lesson1.id, { knownWordIds: [], lessonProgress }, [passedHsk1])) {
  throw new Error("HSK 1 exam 80% bo‘lsa HSK 2 lesson 1 ochilmadi.");
}

const status = getLevelCompletionStatus(1, { knownWordIds: [], lessonProgress });
if (status.completed !== 1 || status.currentLesson?.id !== lesson2.id) {
  throw new Error("Current available lesson lesson 2 bo‘lishi kerak.");
}

const plan = generateDailyStudyPlan({ knownWordIds: [], currentLevel: 2 }, [], [], []);
const lessonTask = plan.tasks.find((task) => task.id === "lesson");
if (!lessonTask || lessonTask.href.includes("/lesson/2/")) {
  throw new Error("Daily plan locked HSK 2 darsini tavsiya qildi.");
}

if (getSafeNextPath("/ai-tutor") !== "/ai-tutor") {
  throw new Error("Auth redirect: ichki next path saqlanmadi.");
}
if (getSafeNextPath("https://example.com/ai-tutor") !== "/dashboard") {
  throw new Error("Auth redirect: tashqi URL bloklanmadi.");
}
if (getSafeNextPath("//example.com") !== "/dashboard") {
  throw new Error("Auth redirect: protocol-relative URL bloklanmadi.");
}

console.log("Unlock flow: sequential lesson, exam gate, safe redirect va daily plan locked content testi o‘tdi.");
