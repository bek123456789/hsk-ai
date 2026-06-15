import type { HSKExamQuestion, HSKLevel, RichHSKVocabularyItem, SkillType } from "@/types";
import { createQuestion } from "@/utils/questionGenerator";

const skillTypes: Record<SkillType, Array<HSKExamQuestion["type"]>> = {
  reading: ["reading_comprehension", "fill_blank", "true_false", "choose_meaning"],
  listening: ["listen_choose_answer", "listen_true_false", "listen_dialogue_question", "listening"],
  writing: ["write_sentence_from_words", "write_character_or_word", "short_answer", "essay_placeholder"],
  speaking: ["vocabulary", "sentence", "pinyin", "choose_meaning"]
};

export function createSkillPractice(level: HSKLevel, vocabulary: RichHSKVocabularyItem[], skill: SkillType, count = 12) {
  const levelWords = vocabulary.filter((word) => word.hskLevel === level);
  const types = skillTypes[skill];
  return Array.from({ length: count }, (_, index) =>
    createQuestion({
      level,
      index,
      word: levelWords[index % levelWords.length],
      levelWords,
      type: types[index % types.length]
    })
  );
}

export function createSpeakingPrompts(level: HSKLevel, vocabulary: RichHSKVocabularyItem[], count = 16) {
  return vocabulary
    .filter((word) => word.hskLevel === level)
    .slice(0, count)
    .map((word, index) => ({
      id: `speaking-${word.id}`,
      hskLevel: level,
      wordId: word.id,
      lessonId: word.lessonId,
      chinese: index % 2 === 0 ? word.chinese : word.exampleChinese,
      pinyin: index % 2 === 0 ? word.pinyin : word.examplePinyin,
      translationUz: index % 2 === 0 ? word.translationUz : word.exampleUz,
      translationRu: index % 2 === 0 ? word.translationRu : word.exampleRu
    }));
}
