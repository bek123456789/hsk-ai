import { hskSpeakingTasks } from "../data/hsk/speakingTasks";
import { hskExamSpeakingPrompts } from "../data/hsk/examSpeakingPrompts";
import { hskExamWritingPrompts } from "../data/hsk/examWritingPrompts";
import { deterministicOpenAnswerScore, localizedMissingKeywordFeedback, precheckChineseAnswer } from "../utils/answerEvaluation";
import { scoreSpeakingAnswer, scoreWritingAnswer } from "../utils/examScoring";

const storeTask = hskSpeakingTasks.find((item) =>
  item.level === 1 &&
  item.textZh.includes("你在商店买东西") &&
  item.textZh.includes("茶") &&
  item.textZh.includes("米饭")
);
const examTask = hskExamSpeakingPrompts.find((item) => item.level === 1);
const writing = hskExamWritingPrompts.find((item) => item.level === 1);

if (!storeTask || !examTask || !writing) {
  throw new Error("Speaking/writing test uchun HSK 1 kontenti topilmadi.");
}

const copiedPrompt = deterministicOpenAnswerScore({
  answer: storeTask.textZh,
  keywordsZh: storeTask.keywordsZh,
  minCharacters: 8,
  promptZh: storeTask.textZh,
  promptPinyin: storeTask.textPinyin,
  sampleAnswerZh: storeTask.sampleAnswerZh,
  sampleAnswerPinyin: storeTask.sampleAnswerPinyin,
  allowBeginnerPinyin: true
});

if (copiedPrompt.score !== 0 || copiedPrompt.precheck.code !== "copied_prompt") {
  throw new Error("Copied speaking prompt 0 ball olmadi.");
}

const copiedPinyin = precheckChineseAnswer({
  answer: storeTask.textPinyin,
  promptZh: storeTask.textZh,
  promptPinyin: storeTask.textPinyin,
  sampleAnswerZh: storeTask.sampleAnswerZh,
  sampleAnswerPinyin: storeTask.sampleAnswerPinyin,
  allowBeginnerPinyin: true
});

if (copiedPinyin.scoreOverride !== 0 || copiedPinyin.code !== "copied_pinyin") {
  throw new Error("Copied pinyin prompt 0 ball olmadi.");
}

const pinyinOnly = deterministicOpenAnswerScore({
  answer: "wo yao mai cha",
  keywordsZh: storeTask.keywordsZh,
  minCharacters: 8,
  promptZh: storeTask.textZh,
  promptPinyin: storeTask.textPinyin,
  sampleAnswerZh: storeTask.sampleAnswerZh,
  sampleAnswerPinyin: storeTask.sampleAnswerPinyin,
  allowBeginnerPinyin: true
});

if (pinyinOnly.score > 35 || pinyinOnly.precheck.code !== "pinyin_only") {
  throw new Error("Pinyin-only beginner javobi cap qilinmadi.");
}

const partialStoreAnswer = deterministicOpenAnswerScore({
  answer: "这个多少钱？我要买这个，",
  keywordsZh: storeTask.keywordsZh,
  minCharacters: 8,
  promptZh: storeTask.textZh,
  promptPinyin: storeTask.textPinyin,
  sampleAnswerZh: storeTask.sampleAnswerZh,
  sampleAnswerPinyin: storeTask.sampleAnswerPinyin,
  allowBeginnerPinyin: true,
  mode: "practice"
});

if (partialStoreAnswer.precheck.code === "copied_sample" || partialStoreAnswer.precheck.code === "copied_prompt") {
  throw new Error("Qisman store javobi copy deb noto‘g‘ri belgilandi.");
}
if (partialStoreAnswer.score <= 40 || partialStoreAnswer.score >= 85) {
  throw new Error(`Qisman store javobi adolatli partial score olmadi: ${partialStoreAnswer.score}`);
}
if (!localizedMissingKeywordFeedback(partialStoreAnswer.missingKeywords, "uz").includes("不要米饭")) {
  throw new Error("Qisman store javobi feedbackida 不要米饭 yetishmasligi ko‘rsatilmagan.");
}

const correctStoreAnswer = deterministicOpenAnswerScore({
  answer: "这个多少钱？我要买茶，不要米饭。",
  keywordsZh: storeTask.keywordsZh,
  minCharacters: 8,
  promptZh: storeTask.textZh,
  promptPinyin: storeTask.textPinyin,
  sampleAnswerZh: storeTask.sampleAnswerZh,
  sampleAnswerPinyin: storeTask.sampleAnswerPinyin,
  allowBeginnerPinyin: true,
  mode: "practice"
});

if (correctStoreAnswer.score < 85) {
  throw new Error(`Task-specific to‘g‘ri store javobi past baholandi: ${correctStoreAnswer.score}`);
}

const genericStoreAnswer = deterministicOpenAnswerScore({
  answer: "这个多少钱？我要这个，不要那个。",
  keywordsZh: storeTask.keywordsZh,
  minCharacters: 8,
  promptZh: storeTask.textZh,
  promptPinyin: storeTask.textPinyin,
  sampleAnswerZh: storeTask.sampleAnswerZh,
  sampleAnswerPinyin: storeTask.sampleAnswerPinyin,
  allowBeginnerPinyin: true,
  mode: "practice"
});

if (genericStoreAnswer.score < 70) {
  throw new Error(`Generic, lekin valid store javobi juda past baholandi: ${genericStoreAnswer.score}`);
}

const unrelatedScore = deterministicOpenAnswerScore({
  answer: "我学习汉语。",
  keywordsZh: storeTask.keywordsZh,
  minCharacters: 8,
  promptZh: storeTask.textZh,
  promptPinyin: storeTask.textPinyin,
  sampleAnswerZh: storeTask.sampleAnswerZh,
  sampleAnswerPinyin: storeTask.sampleAnswerPinyin,
  allowBeginnerPinyin: true
}).score;

if (unrelatedScore > 25) {
  throw new Error(`Aloqasiz xitoycha javob juda yuqori baholandi: ${unrelatedScore}`);
}

if (scoreSpeakingAnswer(examTask, "") !== 0 || scoreWritingAnswer(writing, "") !== 0) {
  throw new Error("Empty speaking/writing 0 ball olmadi.");
}

const examFirstScore = scoreSpeakingAnswer(examTask, examTask.sampleAnswerZh);
const examSecondScore = scoreSpeakingAnswer(examTask, examTask.sampleAnswerZh);
if (examFirstScore !== examSecondScore) {
  throw new Error("Bir xil exam speaking javob ikki marta turli score berdi.");
}

if (scoreWritingAnswer(writing, writing.sampleAnswerZh) !== 0) {
  throw new Error("Copied writing sample answer 0 ball olmadi.");
}

console.log("Speaking/writing evaluation: partial scoring, copy, pinyin, empty va deterministic testlar o‘tdi.");
