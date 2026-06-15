import { hskListeningContent } from "@/data/hsk/listening";
import { hskQuizQuestions } from "@/data/hsk/quizQuestions";
import { hskReadingContent } from "@/data/hsk/reading";
import type { HSKLevel } from "@/types";

export const hskCentralExamQuestions = [
  ...hskQuizQuestions.map((question) => ({ ...question, id: question.id.replace("quiz-", "exam-") })),
  ...hskReadingContent.flatMap((passage) =>
    passage.questions.map((question) => ({
      id: question.id.replace("reading-", "exam-reading-"),
      level: passage.level,
      type: "reading" as const,
      questionUz: question.questionUz,
      questionRu: question.questionRu,
      promptZh: passage.passageZh,
      promptPinyin: passage.passagePinyin,
      options: question.options,
      correctOptionId: question.correctOptionId,
      explanationUz: question.explanationUz,
      explanationRu: question.explanationRu,
      skill: "reading" as const,
      difficulty: passage.difficulty
    }))
  ),
  ...hskListeningContent.flatMap((prompt) =>
    prompt.questions.map((question) => ({
      id: question.id.replace("listening-", "exam-listening-"),
      level: prompt.level,
      type: "listening" as const,
      questionUz: question.questionUz,
      questionRu: question.questionRu,
      promptZh: prompt.audioTextZh,
      promptPinyin: prompt.audioTextPinyin,
      options: question.options,
      correctOptionId: question.correctOptionId,
      explanationUz: question.explanationUz,
      explanationRu: question.explanationRu,
      skill: "listening" as const,
      difficulty: prompt.difficulty
    }))
  )
];

export function getCentralExamQuestionsByLevel(level: HSKLevel) {
  return hskCentralExamQuestions.filter((question) => question.level === level);
}
