import { getLearningProgress, saveLearningProgress } from "../utils/learningProgress";
import { hskLessonCurriculum } from "../data/hsk/lessonCurriculum";
import { calculateLessonProgress, completeLessonIfReady, getAllLessonProgressRecords, getLessonCompletionState, getLessonProgressRecord, saveLessonQuiz, saveLessonSection } from "../utils/lessonPlanner";
import { isLessonUnlocked } from "../utils/lessonUnlock";
import { getSpeakingTaskProgress, saveSpeakingTaskProgress } from "../utils/speakingProgress";

const storage = new Map<string, string>();
const localStorage = {
  getItem(key: string) {
    return storage.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    storage.set(key, value);
  },
  removeItem(key: string) {
    storage.delete(key);
  },
  clear() {
    storage.clear();
  },
  key(index: number) {
    return [...storage.keys()][index] ?? null;
  },
  get length() {
    return storage.size;
  }
};

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: { localStorage }
});

saveLearningProgress({
  kind: "reading",
  contentId: "qa-reading-1",
  level: 1,
  score: 4,
  total: 4,
  done: true,
  mistakes: []
});

saveLearningProgress({
  kind: "listening",
  contentId: "qa-listening-1",
  level: 1,
  score: 3,
  total: 4,
  done: false,
  mistakes: ["qa-listening-question"]
});

saveSpeakingTaskProgress({
  taskId: "qa-speaking-1",
  level: 1,
  score: 82,
  userAnswerZh: "我今天学习汉语。",
  correctedAnswerZh: "我今天学习汉语。",
  done: true,
  feedback: {
    ok: true,
    done: true,
    score: 82,
    meaningScore: 85,
    grammarScore: 80,
    vocabularyScore: 82,
    fluencyScore: 80,
    feedbackUz: "Mazmun to‘g‘ri.",
    feedbackRu: "Смысл передан верно.",
    correctedAnswerZh: "我今天学习汉语。",
    correctedAnswerPinyin: "wǒ jīntiān xuéxí hànyǔ",
    explanationUz: "Javob mazmunga mos.",
    explanationRu: "Ответ соответствует смыслу.",
    missingPointsUz: [],
    missingPointsRu: [],
    goodPointsUz: ["Asosiy fikr aytildi."],
    goodPointsRu: ["Основная мысль передана."],
    nextTipUz: "Yana bir tafsilot qo‘shing.",
    nextTipRu: "Добавьте ещё одну деталь."
  }
});

const reading = getLearningProgress("reading");
const listening = getLearningProgress("listening");
const speaking = getSpeakingTaskProgress();

if (!reading.some((item) => item.contentId === "qa-reading-1" && item.done)) {
  throw new Error("Reading LocalStorage fallback saqlanmadi.");
}
if (!listening.some((item) => item.contentId === "qa-listening-1" && item.mistakes.length === 1)) {
  throw new Error("Listening LocalStorage fallback saqlanmadi.");
}
if (!speaking.some((item) => item.taskId === "qa-speaking-1" && item.done && item.score === 82)) {
  throw new Error("Speaking LocalStorage fallback saqlanmadi.");
}

const hsk1Lessons = hskLessonCurriculum.filter((lesson) => lesson.level === 1).sort((first, second) => first.order - second.order);
const firstLesson = hsk1Lessons[0];
const secondLesson = hsk1Lessons[1];

if (!firstLesson || !secondLesson) {
  throw new Error("Learning progress test uchun HSK 1 birinchi va ikkinchi dars topilmadi.");
}

saveLessonSection(firstLesson.id, "vocabulary", firstLesson.level);
saveLessonSection(firstLesson.id, "grammar", firstLesson.level);
saveLessonSection(firstLesson.id, "reading", firstLesson.level);
saveLessonSection(firstLesson.id, "listening", firstLesson.level);
saveLessonSection(firstLesson.id, "speaking", firstLesson.level);
saveLessonQuiz(firstLesson.id, 19, 20, firstLesson.level);

const completion = getLessonCompletionState(firstLesson, []);
if (!completion.ready || !completion.miniTestDone) {
  throw new Error("Mini test 95% bo‘lganda lesson completion tayyor bo‘lmadi.");
}

completeLessonIfReady(firstLesson, []);
const completedRecord = getLessonProgressRecord(firstLesson.id);
const lessonProgress = calculateLessonProgress(firstLesson, []);
const quizPercent = completedRecord.quizTotal > 0 ? Math.round((completedRecord.quizScore / completedRecord.quizTotal) * 100) : 0;

if (lessonProgress !== 100 || !completedRecord.markedDone || completedRecord.done !== true || completedRecord.progress !== 100) {
  throw new Error("Dars yakunlanganda umumiy progress 100 va done=true saqlanmadi.");
}

if (quizPercent !== 95) {
  throw new Error("Mini test foizi alohida 95% sifatida saqlanmadi.");
}

if (!isLessonUnlocked(1, secondLesson.id, { knownWordIds: [], lessonProgress: getAllLessonProgressRecords() }, [])) {
  throw new Error("Birinchi dars done=true bo‘lgandan keyin ikkinchi dars ochilmadi.");
}

console.log("Learning progress fallback: reading, listening, speaking, lesson done=100 va next lesson unlock saqlandi.");
