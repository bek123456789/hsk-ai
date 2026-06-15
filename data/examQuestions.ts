import type { ExamQuestion, HSKExamQuestion, HSKLevel } from "@/types";
import { hskExamQuestions } from "@/data/hskExamQuestions";

function seededShuffle(items: string[], seed: string) {
  return [...items].sort((left, right) => {
    const leftScore = `${seed}-${left}`.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % 97;
    const rightScore = `${seed}-${right}`.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % 97;
    return leftScore - rightScore;
  });
}

function adaptQuestion(question: HSKExamQuestion): ExamQuestion {
  const correctUz = question.optionsUz[0] ?? question.correctAnswer;
  const correctRu = question.optionsRu[0] ?? question.correctAnswer;
  const optionsUz = question.optionsUz.length ? seededShuffle(question.optionsUz, `${question.id}-uz`) : [question.sampleAnswer ?? question.correctAnswer];
  const optionsRu = question.optionsRu.length ? seededShuffle(question.optionsRu, `${question.id}-ru`) : [question.sampleAnswer ?? question.correctAnswer];

  return {
    id: question.id,
    hskLevel: question.hskLevel,
    type: question.type,
    promptChinese: question.questionChinese,
    promptPinyin: question.questionPinyin,
    questionUz: question.questionUz,
    questionRu: question.questionRu,
    optionsUz,
    optionsRu,
    correctAnswerUz: correctUz,
    correctAnswerRu: correctRu,
    explanationUz: question.explanationUz,
    explanationRu: question.explanationRu
  };
}

export const examQuestions: ExamQuestion[] = hskExamQuestions.map(adaptQuestion);

export function getExamQuestions(level: HSKLevel) {
  return examQuestions.filter((question) => question.hskLevel === level);
}
