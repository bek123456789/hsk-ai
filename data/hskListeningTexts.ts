import { hskExamQuestions } from "@/data/hskExamQuestions";

export const hskListeningTexts = hskExamQuestions
  .filter((question) => question.section === "listening")
  .map((question) => ({
    id: `${question.id}-audio`,
    hskLevel: question.hskLevel,
    audioTextChinese: question.audioTextChinese ?? question.questionChinese,
    questionId: question.id,
    playLimit: 2
  }));
