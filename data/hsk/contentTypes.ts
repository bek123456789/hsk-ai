import type { HSKLevel } from "@/types";

export type HSKContentOption = {
  id: "a" | "b" | "c" | "d";
  textZh?: string;
  textPinyin?: string;
  textUz?: string;
  textRu?: string;
};

export type HSKVocabularyEntry = {
  id: string;
  level: HSKLevel;
  hanzi: string;
  pinyin: string;
  uz: string;
  ru: string;
  pos: string;
  category: string;
  exampleZh: string;
  examplePinyin: string;
  exampleUz: string;
  exampleRu: string;
  tags: string[];
};

export type HSKReadingPassage = {
  id: string;
  level: HSKLevel;
  titleUz: string;
  titleRu: string;
  titleZh: string;
  passageZh: string;
  passagePinyin: string;
  passageUz: string;
  passageRu: string;
  vocabularyIds: string[];
  questions: Array<{
    id: string;
    questionUz: string;
    questionRu: string;
    questionZh?: string;
    options: HSKContentOption[];
    correctOptionId: "a" | "b" | "c" | "d";
    explanationUz: string;
    explanationRu: string;
  }>;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  tags: string[];
};

export type HSKListeningPrompt = {
  id: string;
  level: HSKLevel;
  titleUz: string;
  titleRu: string;
  audioTextZh: string;
  audioTextPinyin: string;
  transcriptUz: string;
  transcriptRu: string;
  speakerHintUz: string;
  speakerHintRu: string;
  vocabularyIds: string[];
  questions: HSKReadingPassage["questions"];
  replayLimit?: number;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  tags: string[];
};

export type HSKSpeakingTask = {
  id: string;
  level: HSKLevel;
  type: "retell" | "dialogue_summary" | "picture_like_prompt" | "opinion" | "daily_situation";
  titleUz: string;
  titleRu: string;
  instructionUz: string;
  instructionRu: string;
  textZh: string;
  textPinyin: string;
  textUz: string;
  textRu: string;
  expectedMeaningUz: string;
  expectedMeaningRu: string;
  sampleAnswerZh: string;
  sampleAnswerPinyin: string;
  sampleAnswerUz: string;
  sampleAnswerRu: string;
  keywordsZh: string[];
  allowedAnswerHintsZh: string[];
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  tags: string[];
};

export type HSKSkillQuestion = {
  id: string;
  level: HSKLevel;
  type: "vocabulary" | "pinyin" | "grammar" | "reading" | "listening" | "writing" | "speaking";
  questionUz: string;
  questionRu: string;
  promptZh?: string;
  promptPinyin?: string;
  options?: HSKContentOption[];
  correctOptionId?: "a" | "b" | "c" | "d";
  correctAnswerZh?: string;
  explanationUz: string;
  explanationRu: string;
  skill: "reading" | "listening" | "writing" | "speaking" | "grammar" | "vocabulary";
  difficulty: "easy" | "medium" | "hard";
};

export type HSKSentenceBuilderItem = {
  id: string;
  level: HSKLevel;
  sentenceZh: string;
  sentencePinyin: string;
  sentenceUz: string;
  sentenceRu: string;
  chunks: string[];
  explanationUz: string;
  explanationRu: string;
};

export type HSKDictationItem = {
  id: string;
  level: HSKLevel;
  audioTextZh: string;
  audioTextPinyin: string;
  answerZh: string;
  answerPinyin: string;
  meaningUz: string;
  meaningRu: string;
  difficulty: "easy" | "medium" | "hard";
};

export type HSKRoleplayScenario = {
  id: string;
  level: HSKLevel;
  titleUz: string;
  titleRu: string;
  situationUz: string;
  situationRu: string;
  openingZh: string;
  openingPinyin: string;
  suggestedRepliesZh: string[];
  usefulWords: string[];
};

export type HSKMiniLesson = {
  id: string;
  level: HSKLevel;
  titleUz: string;
  titleRu: string;
  minutes: number;
  grammarPattern: string;
  explanationUz: string;
  explanationRu: string;
  vocabularyIds: string[];
  dialogueZh: string;
  dialoguePinyin: string;
  dialogueUz: string;
  dialogueRu: string;
  quiz: HSKSkillQuestion[];
};
