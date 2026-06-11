export type HSKLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HSKWord = {
  id: string;
  hskLevel: HSKLevel;
  lessonId: string;
  chinese: string;
  pinyin: string;
  translationUz: string;
  translationRu?: string;
  translationZh?: string;
  exampleChinese: string;
  exampleUz: string;
  exampleRu?: string;
  exampleZh?: string;
};

export type HSKLesson = {
  id: string;
  hskLevel: HSKLevel;
  title: string;
  description: string;
  wordIds: string[];
  locked: boolean;
};

export type LevelMeta = {
  level: HSKLevel;
  wordCount: number;
  locked: boolean;
  accent: "orange" | "green" | "blue" | "purple";
};

export type QuizQuestion = {
  word: HSKWord;
  options: string[];
  correctAnswer: string;
};

export type QuizResult = {
  level: HSKLevel;
  score: number;
  total: number;
  completedAt: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  currentHSKLevel: HSKLevel;
  createdAt: string;
  premium: boolean;
};

export type AppLanguage = "uz" | "ru";

export type ExamQuestionType = "vocabulary" | "pinyin" | "character" | "sentence" | "listening" | "grammar";

export type ExamQuestion = {
  id: string;
  hskLevel: HSKLevel;
  type: ExamQuestionType;
  promptChinese: string;
  promptPinyin: string;
  questionUz: string;
  questionRu: string;
  optionsUz: string[];
  optionsRu: string[];
  correctAnswerUz: string;
  correctAnswerRu: string;
  explanationUz: string;
  explanationRu: string;
};

export type WordReviewState = {
  wordId: string;
  status: "new" | "learning" | "review" | "mastered";
  correctCount: number;
  wrongCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  easeLevel: number;
};

export type MistakeSource = "quiz" | "flashcard" | "exam" | "listening";

export type MistakeRecord = {
  id: string;
  source: MistakeSource;
  hskLevel: HSKLevel;
  chinese: string;
  pinyin?: string;
  wrongAnswer: string;
  correctAnswer: string;
  explanation: string;
  createdAt: string;
  learned: boolean;
  wordId?: string;
};

export type ExamAttempt = {
  id: string;
  hskLevel: HSKLevel;
  score: number;
  total: number;
  accuracy: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: Array<{
    questionId: string;
    selectedAnswer: string;
    correctAnswer: string;
    correct: boolean;
  }>;
};

export type CertificateRecord = {
  id: string;
  hskLevel: HSKLevel;
  score: number;
  date: string;
};
