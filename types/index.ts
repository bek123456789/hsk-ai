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
  titleRu?: string;
  description: string;
  descriptionRu?: string;
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
  avatarUrl?: string | null;
  currentHSKLevel: HSKLevel;
  createdAt: string;
  premium: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionPlan?: "monthly" | "yearly" | null;
  stripePriceId?: string | null;
  currentPeriodEnd?: string | null;
  premiumUntil?: string | null;
  trialStartedAt?: string | null;
  trialEndsAt?: string | null;
  trialUsed?: boolean;
  onboardingCompleted?: boolean;
  learningGoal?: string | null;
  dailyGoalMinutes?: number | null;
  referralCode?: string | null;
  referredBy?: string | null;
  referralBonusDays?: number;
};

export type AppLanguage = "uz" | "ru";

export type SubscriptionStatus = "free" | "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "beta_premium";

export type ExamQuestionType =
  | "vocabulary"
  | "pinyin"
  | "character"
  | "sentence"
  | "listening"
  | "grammar"
  | "listen_choose_picture"
  | "listen_true_false"
  | "listen_choose_answer"
  | "listen_dialogue_question"
  | "match_sentence_picture"
  | "fill_blank"
  | "true_false"
  | "choose_meaning"
  | "sentence_order"
  | "reading_comprehension"
  | "write_sentence_from_words"
  | "write_character_or_word"
  | "short_answer"
  | "essay_placeholder";

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
  status: "new" | "learning" | "weak" | "review" | "mastered";
  correctCount: number;
  wrongCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  easeLevel: number;
};

export type SkillType = "reading" | "listening" | "writing" | "speaking";

export type MistakeSource = "quiz" | "flashcard" | "exam" | "listening" | "reading" | "writing" | "speaking" | "grammar" | "game" | "dictation" | "sentence-builder" | "ai";

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
  overallScore?: number;
  passingScore?: number;
  passed?: boolean;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpentSeconds: number;
  completedAt: string;
  sections?: Record<ExamSkill, ExamSectionResult>;
  weakSkills?: ExamSkill[];
  recommendedLessonIds?: string[];
  answers: Array<{
    questionId: string;
    selectedAnswer: string;
    correctAnswer: string;
    correct: boolean;
  }>;
};

export type ExamSkill = "listening" | "reading" | "speaking" | "writing";

export type ExamSectionResult = {
  score: number;
  correct: number;
  total: number;
  feedbackUz?: string;
  feedbackRu?: string;
};

export type CertificateRecord = {
  id: string;
  hskLevel: HSKLevel;
  score: number;
  date: string;
};

export type PracticeResult = {
  id: string;
  skill: SkillType;
  hskLevel: HSKLevel;
  score: number;
  total: number;
  completedAt: string;
};

export type SpeakingPracticeResult = {
  id: string;
  userId?: string;
  wordId: string;
  lessonId?: string;
  hskLevel: HSKLevel;
  targetHanzi: string;
  targetPinyin: string;
  recognizedText: string;
  score: number;
  isCorrect: boolean;
  attempts: number;
  createdAt: string;
};

export type GameResult = {
  id: string;
  gameType: "matching" | "speed-quiz" | "memory" | "audio-match";
  hskLevel: HSKLevel;
  score: number;
  xp: number;
  completedAt: string;
};

export type LearningActivityType = "mini-lesson" | "listening-lab" | "dictation" | "sentence-builder" | "review";

export type LearningActivityResult = {
  id: string;
  type: LearningActivityType;
  hskLevel: HSKLevel;
  score: number;
  total: number;
  completedAt: string;
};

export type PlacementResult = {
  id: string;
  score: number;
  total: number;
  recommendedLevel: HSKLevel;
  skillScores: Record<"vocabulary" | "grammar" | "reading", number>;
  completedAt: string;
};

export type HSKContentSection = "listening" | "reading" | "writing";

export type RichHSKVocabularyItem = {
  id: string;
  chinese: string;
  pinyin: string;
  translationUz: string;
  translationRu: string;
  partOfSpeechUz: string;
  partOfSpeechRu: string;
  hskLevel: HSKLevel;
  lessonId: string;
  exampleChinese: string;
  examplePinyin: string;
  exampleUz: string;
  exampleRu: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
};

export type HSKGrammarPoint = {
  grammarId: string;
  hskLevel: HSKLevel;
  titleUz: string;
  titleRu: string;
  explanationUz: string;
  explanationRu: string;
  structure: string;
  chineseExamples: Array<{
    chinese: string;
    pinyin: string;
    uz: string;
    ru: string;
  }>;
  commonMistakes: Array<{
    uz: string;
    ru: string;
  }>;
  practiceQuestions: Array<{
    questionUz: string;
    questionRu: string;
    answer: string;
  }>;
};

export type RichHSKLesson = {
  lessonId: string;
  hskLevel: HSKLevel;
  titleUz: string;
  titleRu: string;
  shortDescriptionUz: string;
  shortDescriptionRu: string;
  vocabulary: RichHSKVocabularyItem[];
  grammarPoints: HSKGrammarPoint[];
  exampleSentences: RichHSKVocabularyItem["exampleChinese"][];
  miniQuiz: HSKExamQuestion[];
  flashcards: RichHSKVocabularyItem[];
  listeningPractice: HSKExamQuestion[];
  writingPractice: HSKExamQuestion[];
  reviewItems: string[];
};

export type HSKExamQuestion = {
  id: string;
  hskLevel: HSKLevel;
  section: HSKContentSection;
  part: number;
  type: ExamQuestionType;
  questionChinese: string;
  questionPinyin: string;
  questionUz: string;
  questionRu: string;
  optionsChinese: string[];
  optionsUz: string[];
  optionsRu: string[];
  correctAnswer: string;
  explanationUz: string;
  explanationRu: string;
  audioTextChinese?: string;
  passageChinese?: string;
  passagePinyin?: string;
  sampleAnswer?: string;
};

export type Profile = {
  id: string;
  email: string;
  name: string;
  currentHskLevel: HSKLevel;
  preferredLanguage: AppLanguage;
  premium: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserProgress = WordReviewState & {
  userId: string;
  hskLevel: HSKLevel;
  lessonId?: string;
};

export type WeakWord = {
  id: string;
  userId: string;
  wordId: string;
  hskLevel: HSKLevel;
  lessonId?: string;
  reason?: string;
  createdAt: string;
};
