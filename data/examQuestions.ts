import type { ExamQuestion, HSKExamQuestion, HSKLevel } from "@/types";
import { hskExamQuestions } from "@/data/hskExamQuestions";

function seededShuffle(items: string[], seed: string) {
  return [...items].sort((left, right) => {
    const leftScore = `${seed}-${left}`.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % 97;
    const rightScore = `${seed}-${right}`.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % 97;
    return leftScore - rightScore;
  });
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function targetCorrectIndex(seed: string) {
  const match = seed.match(/hsk(\d+)-[a-z]+-(\d+)-(uz|ru)$/);
  if (match) {
    const level = Number(match[1]);
    const number = Number(match[2]);
    const languageOffset = match[3] === "ru" ? 1 : 0;
    return (level + number + languageOffset) % 4;
  }
  return stableHash(seed) % 4;
}

function balancedOptions(options: string[], correct: string, seed: string) {
  if (options.length < 4) return options;
  const distractors = seededShuffle(
    options.filter((option, index, array) => option !== correct && array.indexOf(option) === index),
    `${seed}-distractors`
  ).slice(0, 3);
  const target = targetCorrectIndex(seed);
  const result = [...distractors];
  result.splice(target, 0, correct);
  return result.slice(0, 4);
}

function adaptQuestion(question: HSKExamQuestion): ExamQuestion {
  const correctUz = question.optionsUz[0] ?? question.correctAnswer;
  const correctRu = question.optionsRu[0] ?? question.correctAnswer;
  const optionsUz = question.optionsUz.length ? balancedOptions(question.optionsUz, correctUz, `${question.id}-uz`) : [question.sampleAnswer ?? question.correctAnswer];
  const optionsRu = question.optionsRu.length ? balancedOptions(question.optionsRu, correctRu, `${question.id}-ru`) : [question.sampleAnswer ?? question.correctAnswer];

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
