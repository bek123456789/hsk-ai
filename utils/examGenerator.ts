import type { ExamQuestionType, HSKExamQuestion, HSKLevel, RichHSKVocabularyItem } from "@/types";
import { createQuestion } from "@/utils/questionGenerator";

export const examStructure: Record<HSKLevel, { total: number; minutes: number; listening: number; reading: number; writing: number }> = {
  1: { total: 40, minutes: 40, listening: 20, reading: 20, writing: 0 },
  2: { total: 60, minutes: 55, listening: 35, reading: 25, writing: 0 },
  3: { total: 80, minutes: 90, listening: 40, reading: 30, writing: 10 },
  4: { total: 100, minutes: 105, listening: 45, reading: 40, writing: 15 },
  5: { total: 100, minutes: 125, listening: 45, reading: 45, writing: 10 },
  6: { total: 101, minutes: 140, listening: 50, reading: 50, writing: 1 }
};

const listeningTypes: ExamQuestionType[] = ["listen_choose_answer", "listen_true_false", "listen_dialogue_question", "listening"];
const readingTypes: ExamQuestionType[] = ["choose_meaning", "fill_blank", "true_false", "sentence_order", "reading_comprehension", "pinyin", "character"];
const writingTypes: ExamQuestionType[] = ["write_sentence_from_words", "write_character_or_word", "short_answer", "essay_placeholder"];

export function createExamQuestions(level: HSKLevel, vocabulary: RichHSKVocabularyItem[]): HSKExamQuestion[] {
  const config = examStructure[level];
  const levelWords = vocabulary.filter((word) => word.hskLevel === level);
  const questions: HSKExamQuestion[] = [];

  function pushSection(count: number, types: ExamQuestionType[]) {
    for (let offset = 0; offset < count; offset += 1) {
      const globalIndex = questions.length;
      const word = levelWords[globalIndex % levelWords.length];
      const type = level === 6 && globalIndex === config.total - 1 ? "essay_placeholder" : types[offset % types.length];
      questions.push(createQuestion({ level, index: globalIndex, word, levelWords, type }));
    }
  }

  pushSection(config.listening, listeningTypes);
  pushSection(config.reading, readingTypes);
  pushSection(config.writing, writingTypes);

  return questions.slice(0, config.total);
}
