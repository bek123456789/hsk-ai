import { hskExamQuestions } from "@/data/hskExamQuestions";

export const hskWritingTasks = hskExamQuestions
  .filter((question) => question.section === "writing")
  .map((question) => ({
    id: `${question.id}-writing`,
    hskLevel: question.hskLevel,
    promptChinese: question.questionChinese,
    promptPinyin: question.questionPinyin,
    questionUz: question.questionUz,
    questionRu: question.questionRu,
    sampleAnswer: question.sampleAnswer ?? question.correctAnswer,
    questionId: question.id
  }));
