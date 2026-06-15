import type { AppLanguage, ExamAttempt, HSKLevel, MistakeRecord, QuizResult } from "@/types";

type WeaknessInput = {
  weakWordCount: number;
  mistakes: MistakeRecord[];
  quizResults: QuizResult[];
  examAttempts: ExamAttempt[];
  currentLevel: HSKLevel;
  language: AppLanguage;
};

export type WeaknessInsight = {
  title: string;
  detail: string;
  actionLabel: string;
  href: string;
  score: number;
};

export function buildWeaknessInsights(input: WeaknessInput): WeaknessInsight[] {
  const recentQuiz = input.quizResults.at(-1);
  const recentExam = input.examAttempts.at(-1);
  const accuracy = recentQuiz ? Math.round((recentQuiz.score / Math.max(1, recentQuiz.total)) * 100) : 0;
  const wrongExam = recentExam?.wrongAnswers ?? 0;

  const uz = input.language === "uz";

  return [
    {
      title: uz ? "Zaif so‘zlar" : "Слабые слова",
      detail: uz
        ? `${input.weakWordCount} ta so‘z bugun ko‘proq takrorlashga muhtoj.`
        : `${input.weakWordCount} слов требуют повторения сегодня.`,
      actionLabel: uz ? "Takrorlash" : "Повторить",
      href: "/review",
      score: Math.min(100, input.weakWordCount * 12)
    },
    {
      title: uz ? "Test aniqligi" : "Точность теста",
      detail: uz
        ? accuracy > 0
          ? `So‘nggi test aniqligi ${accuracy}%. Xatolar daftarini ko‘rib chiqing.`
          : "Test topshiring va AI sizga keyingi qadamni aytadi."
        : accuracy > 0
          ? `Точность последнего теста ${accuracy}%. Посмотрите тетрадь ошибок.`
          : "Пройдите тест, и AI предложит следующий шаг.",
      actionLabel: uz ? "Test qilish" : "Пройти тест",
      href: `/quiz/${input.currentLevel}`,
      score: accuracy
    },
    {
      title: uz ? "Imtihon tayyorgarligi" : "Подготовка к экзамену",
      detail: uz
        ? wrongExam > 0
          ? `${wrongExam} ta imtihon xatosi bor. Simulyator bilan mashq qiling.`
          : "HSK-style simulyator orqali vaqt bilan mashq qiling."
        : wrongExam > 0
          ? `${wrongExam} ошибок в экзамене. Практикуйтесь в симуляторе.`
          : "Тренируйтесь по времени в HSK-style симуляторе.",
      actionLabel: uz ? "Simulyator" : "Симулятор",
      href: "/exam-simulator",
      score: wrongExam ? Math.min(100, wrongExam * 10) : 45
    }
  ];
}
