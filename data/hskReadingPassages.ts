import { hskExamQuestions } from "@/data/hskExamQuestions";

export const hskReadingPassages = hskExamQuestions
  .filter((question) => question.section === "reading" && question.passageChinese)
  .map((question) => ({
    id: `${question.id}-passage`,
    hskLevel: question.hskLevel,
    passageChinese: question.passageChinese ?? question.questionChinese,
    passagePinyin: question.passagePinyin ?? question.questionPinyin,
    questionId: question.id
  }));
