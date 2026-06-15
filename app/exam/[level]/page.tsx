"use client";

import { ArrowLeft, ArrowRight, BookOpen, Clock3, Headphones, Lock, Mic, Send, Volume2, PenLine } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { PremiumLock } from "@/components/PremiumLock";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getExamTemplate } from "@/data/hsk/examTemplates";
import type { HSKContentOption, HSKListeningPrompt, HSKReadingPassage } from "@/data/hsk/contentTypes";
import type { ExamSpeakingPrompt } from "@/data/hsk/examSpeakingPrompts";
import type { ExamWritingPrompt } from "@/data/hsk/examWritingPrompts";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { AppLanguage, ExamAttempt, ExamSectionResult, ExamSkill, HSKLevel } from "@/types";
import { syncExamResult } from "@/utils/examProgress";
import {
  calculateOverallExamScore,
  EXAM_PASSING_SCORE,
  getRecommendedExamLessons,
  getWeakExamSkills,
  scoreChoiceSection,
  scoreOpenSection,
  scoreSpeakingAnswer,
  scoreWritingAnswer
} from "@/utils/examScoring";
import { formatSeconds } from "@/utils/exam";
import { getExamLockReason, isExamUnlocked } from "@/utils/hskUnlock";
import { useI18n } from "@/utils/i18n";
import { parseHskLevel } from "@/utils/level";
import { isPremiumProfile } from "@/utils/premium";

type ChoiceItem =
  | { kind: "listening"; skill: "listening"; id: string; source: HSKListeningPrompt; question: HSKListeningPrompt["questions"][number] }
  | { kind: "reading"; skill: "reading"; id: string; source: HSKReadingPassage; question: HSKReadingPassage["questions"][number] };
type OpenItem =
  | { kind: "speaking"; skill: "speaking"; id: string; source: ExamSpeakingPrompt }
  | { kind: "writing"; skill: "writing"; id: string; source: ExamWritingPrompt };
type ExamItem = ChoiceItem | OpenItem;

const skillIcons = { listening: Headphones, reading: BookOpen, speaking: Mic, writing: PenLine };

function optionText(option: HSKContentOption, language: AppLanguage) {
  return language === "ru"
    ? option.textRu ?? option.textZh ?? option.textPinyin ?? ""
    : option.textUz ?? option.textZh ?? option.textPinyin ?? "";
}

function buildItems(level: HSKLevel): ExamItem[] {
  const template = getExamTemplate(level);
  const items: ExamItem[] = [];
  for (const section of template.sections) {
    if (section.id === "listening") {
      for (const source of section.questions) {
        for (const question of source.questions) {
          items.push({ kind: "listening", skill: "listening", id: question.id, source, question });
        }
      }
      continue;
    }
    if (section.id === "reading") {
      for (const source of section.questions) {
        for (const question of source.questions) {
          items.push({ kind: "reading", skill: "reading", id: question.id, source, question });
        }
      }
      continue;
    }
    if (section.id === "speaking") {
      for (const source of section.prompts) {
        items.push({ kind: "speaking", skill: "speaking", id: source.examId, source });
      }
      continue;
    }
    for (const source of section.prompts) {
      items.push({ kind: "writing", skill: "writing", id: source.id, source });
    }
  }
  return items;
}

function sectionTitle(skill: ExamSkill, language: AppLanguage) {
  const labels = {
    uz: { listening: "Listening bo‘limi", reading: "O‘qish bo‘limi", speaking: "Speaking bo‘limi", writing: "Writing bo‘limi" },
    ru: { listening: "Раздел аудирования", reading: "Раздел чтения", speaking: "Раздел говорения", writing: "Раздел письма" }
  };
  return labels[language][skill];
}

export default function ExamLevelPage() {
  const params = useParams();
  const router = useRouter();
  const level = parseHskLevel(params.level);
  const { language } = useI18n();
  const template = useMemo(() => getExamTemplate(level), [level]);
  const items = useMemo(() => buildItems(level), [level]);
  const user = useAuthStore((state) => state.user);
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const saveExamAttempt = useProgressStore((state) => state.saveExamAttempt);
  const addMistake = useProgressStore((state) => state.addMistake);
  const premium = isPremiumProfile(user);
  const examOpen = isExamUnlocked(level, { knownWordIds }, examAttempts);
  const lockReason = getExamLockReason(level, { knownWordIds }, examAttempts, language);
  const [index, setIndex] = useState(0);
  const [choiceAnswers, setChoiceAnswers] = useState<Record<string, string>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<string, string>>({});
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const item = items[index];

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [startedAt]);

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    window.speechSynthesis.speak(utterance);
  }

  async function submitExam() {
    if (!examOpen || submitting) return;
    setSubmitting(true);
    const listeningSection = template.sections.find((section) => section.id === "listening");
    const readingSection = template.sections.find((section) => section.id === "reading");
    const speakingItems = items.filter((entry): entry is Extract<ExamItem, { kind: "speaking" }> => entry.kind === "speaking");
    const writingItems = items.filter((entry): entry is Extract<ExamItem, { kind: "writing" }> => entry.kind === "writing");
    const listening = listeningSection?.id === "listening" ? scoreChoiceSection(choiceAnswers, listeningSection.questions) : { score: 0, correct: 0, total: 0 };
    const reading = readingSection?.id === "reading" ? scoreChoiceSection(choiceAnswers, readingSection.questions) : { score: 0, correct: 0, total: 0 };
    const speakingScores = speakingItems.map((entry) => scoreSpeakingAnswer(entry.source, openAnswers[entry.id] ?? ""));
    const writingScores = writingItems.map((entry) => scoreWritingAnswer(entry.source, openAnswers[entry.id] ?? ""));
    const sections: Record<ExamSkill, ExamSectionResult> = {
      listening,
      reading,
      speaking: scoreOpenSection(speakingScores, language, "speaking"),
      writing: scoreOpenSection(writingScores, language, "writing")
    };
    const overallScore = calculateOverallExamScore(sections);
    const passed = overallScore >= EXAM_PASSING_SCORE;
    const weakSkills = getWeakExamSkills(sections);
    const recommendedLessonIds = getRecommendedExamLessons(level, weakSkills);
    const answerRows = items.map((entry) => {
      if (entry.kind === "listening" || entry.kind === "reading") {
        const selectedId = choiceAnswers[entry.id] ?? "";
        const selectedOption = entry.question.options.find((option) => option.id === selectedId);
        const correctOption = entry.question.options.find((option) => option.id === entry.question.correctOptionId);
        return {
          questionId: entry.id,
          selectedAnswer: selectedOption ? optionText(selectedOption, language) : language === "ru" ? "Нет ответа" : "Javob berilmagan",
          correctAnswer: correctOption ? optionText(correctOption, language) : entry.question.correctOptionId,
          correct: selectedId === entry.question.correctOptionId
        };
      }
      const selectedAnswer = openAnswers[entry.id] ?? "";
      const score = entry.kind === "speaking" ? scoreSpeakingAnswer(entry.source, selectedAnswer) : scoreWritingAnswer(entry.source, selectedAnswer);
      return {
        questionId: entry.id,
        selectedAnswer,
        correctAnswer: entry.source.sampleAnswerZh,
        correct: score >= 60
      };
    });
    answerRows.forEach((answer, answerIndex) => {
      if (answer.correct) return;
      const sourceItem = items[answerIndex];
      const chinese = sourceItem.kind === "listening"
        ? sourceItem.source.audioTextZh
        : sourceItem.kind === "reading"
          ? sourceItem.source.passageZh
          : sourceItem.kind === "speaking"
            ? sourceItem.source.textZh
            : sourceItem.source.instructionZh ?? sourceItem.source.sampleAnswerZh;
      const explanation = sourceItem.kind === "listening" || sourceItem.kind === "reading"
        ? language === "ru" ? sourceItem.question.explanationRu : sourceItem.question.explanationUz
        : language === "ru"
          ? `Сравните ответ с образцом: ${sourceItem.source.sampleAnswerRu}`
          : `Javobni namuna bilan solishtiring: ${sourceItem.source.sampleAnswerUz}`;
      addMistake({
        source: "exam",
        hskLevel: level,
        chinese,
        pinyin: sourceItem.kind === "listening"
          ? sourceItem.source.audioTextPinyin
          : sourceItem.kind === "reading"
            ? sourceItem.source.passagePinyin
            : sourceItem.source.sampleAnswerPinyin,
        wrongAnswer: answer.selectedAnswer,
        correctAnswer: answer.correctAnswer,
        explanation
      });
    });
    const correctAnswers = answerRows.filter((answer) => answer.correct).length;
    const attempt: ExamAttempt = {
      id: `exam-${level}-${Date.now()}`,
      hskLevel: level,
      score: correctAnswers,
      total: answerRows.length,
      accuracy: overallScore,
      overallScore,
      passingScore: EXAM_PASSING_SCORE,
      passed,
      correctAnswers,
      wrongAnswers: answerRows.length - correctAnswers,
      timeSpentSeconds: Math.floor((Date.now() - startedAt) / 1000),
      completedAt: new Date().toISOString(),
      sections,
      weakSkills,
      recommendedLessonIds,
      answers: answerRows
    };
    saveExamAttempt(attempt);
    await syncExamResult(attempt, user?.id);
    router.push(`/exam/${level}/result?attempt=${attempt.id}`);
  }

  if (!examOpen) {
    return (
      <ProtectedRoute>
        <section className="mx-auto max-w-3xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
          <Card className="p-7 text-center sm:p-10">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-orange-soft text-orange-deep"><Lock className="h-9 w-9" /></span>
            <p className="mt-5 text-sm font-black text-orange-deep">HSK {level}</p>
            <h1 className="mt-2 text-4xl font-black text-ink">{language === "ru" ? "Экзамен пока закрыт" : "Imtihon hali yopiq"}</h1>
            <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-stone-600">{lockReason}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <AppButton href={`/lessons/${level}`}>{language === "ru" ? "Завершить уроки" : "Darslarni yakunlash"}</AppButton>
              <AppButton href="/exam" variant="secondary">{language === "ru" ? "Вернуться в центр" : "Markazga qaytish"}</AppButton>
            </div>
          </Card>
        </section>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-5xl px-4 pb-36 pt-6 sm:px-8 md:pb-10 lg:py-10">
        {level > 1 && !premium ? <PremiumLock featureKey="exams" /> : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <AppButton href="/exam" variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> {language === "ru" ? "Экзаменационный центр" : "Imtihon markazi"}</AppButton>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink shadow-soft"><Clock3 className="mr-2 inline h-4 w-4 text-orange-brand" />{formatSeconds(elapsed)}</span>
            </div>

            <Card className="p-5 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black text-orange-deep">HSK {level} · {sectionTitle(item.skill, language)}</p>
                  <h1 className="mt-2 text-3xl font-black text-ink">{language === "ru" ? template.titleRu : template.titleUz}</h1>
                  <p className="mt-2 text-sm font-semibold text-stone-500">{index + 1}/{items.length} · {language === "ru" ? "Проходной балл 80%" : "O‘tish bali 80%"}</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {template.sections.map((section) => {
                    const Icon = skillIcons[section.skill];
                    const active = item.skill === section.skill;
                    return <span key={section.id} title={language === "ru" ? section.titleRu : section.titleUz} className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active ? "bg-orange-brand text-white" : "bg-cream text-stone-400"}`}><Icon className="h-4 w-4" /></span>;
                  })}
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-cream">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-amber-300" style={{ width: `${Math.round(((index + 1) / items.length) * 100)}%` }} />
              </div>

              <div className="mt-7">
                {item.kind === "listening" ? (
                  <ChoiceQuestion
                    item={item}
                    language={language}
                    selected={choiceAnswers[item.id]}
                    onSelect={(value) => setChoiceAnswers((current) => ({ ...current, [item.id]: value }))}
                    onPlay={() => speak(item.source.audioTextZh)}
                  />
                ) : item.kind === "reading" ? (
                  <ChoiceQuestion
                    item={item}
                    language={language}
                    selected={choiceAnswers[item.id]}
                    onSelect={(value) => setChoiceAnswers((current) => ({ ...current, [item.id]: value }))}
                  />
                ) : item.kind === "speaking" ? (
                  <OpenQuestion item={item} language={language} value={openAnswers[item.id] ?? ""} onChange={(value) => setOpenAnswers((current) => ({ ...current, [item.id]: value }))} />
                ) : (
                  <OpenQuestion item={item} language={language} value={openAnswers[item.id] ?? ""} onChange={(value) => setOpenAnswers((current) => ({ ...current, [item.id]: value }))} />
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))} className="min-h-12 rounded-full border border-orange-soft bg-white px-6 py-3 text-sm font-black text-ink disabled:opacity-40">
                  {language === "ru" ? "Назад" : "Orqaga"}
                </button>
                {index === items.length - 1 ? (
                  <button disabled={submitting} onClick={() => void submitExam()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-brand px-7 py-3 text-sm font-black text-white shadow-card disabled:opacity-50">
                    <Send className="h-4 w-4" /> {submitting ? (language === "ru" ? "Сохраняется..." : "Saqlanmoqda...") : (language === "ru" ? "Завершить экзамен" : "Imtihonni yakunlash")}
                  </button>
                ) : (
                  <button onClick={() => setIndex((value) => Math.min(items.length - 1, value + 1))} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-brand px-7 py-3 text-sm font-black text-white shadow-card">
                    {language === "ru" ? "Далее" : "Keyingi"} <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Card>
          </>
        )}
      </section>
    </ProtectedRoute>
  );
}

function ChoiceQuestion({
  item,
  language,
  selected,
  onSelect,
  onPlay
}: {
  item: ChoiceItem;
  language: AppLanguage;
  selected?: string;
  onSelect: (value: string) => void;
  onPlay?: () => void;
}) {
  const question = item.question;
  return (
    <>
      {item.kind === "listening" ? (
        <div className="rounded-[1.8rem] bg-orange-50 p-6 text-center">
          <button onClick={onPlay} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-brand text-white shadow-glow"><Volume2 className="h-7 w-7" /></button>
          <p className="mt-4 text-sm font-bold text-stone-600">{language === "ru" ? item.source.speakerHintRu : item.source.speakerHintUz}</p>
          <p className="mt-2 text-xs font-black text-orange-deep">{language === "ru" ? "Текст откроется после завершения экзамена." : "Matn imtihon tugagandan keyin ko‘rsatiladi."}</p>
        </div>
      ) : (
        <div className="rounded-[1.8rem] bg-cream p-5 sm:p-7">
          <p className="text-2xl font-black leading-10 text-ink sm:text-3xl">{item.source.passageZh}</p>
        </div>
      )}
      <h2 className="mt-6 text-2xl font-black text-ink">{language === "ru" ? question.questionRu : question.questionUz}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button key={option.id} onClick={() => onSelect(option.id)} className={`min-h-14 rounded-3xl border px-5 py-4 text-left text-sm font-black transition ${selected === option.id ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-stone-200 bg-white text-ink hover:border-orange-soft"}`}>
            {optionText(option, language)}
          </button>
        ))}
      </div>
    </>
  );
}

function OpenQuestion({ item, language, value, onChange }: { item: OpenItem; language: AppLanguage; value: string; onChange: (value: string) => void }) {
  const speaking = item.kind === "speaking";
  const title = speaking
    ? language === "ru" ? item.source.titleRu : item.source.titleUz
    : language === "ru" ? item.source.titleRu : item.source.titleUz;
  const instruction = speaking
    ? language === "ru" ? item.source.instructionRu : item.source.instructionUz
    : language === "ru" ? item.source.promptRu : item.source.promptUz;
  return (
    <>
      <div className="rounded-[1.8rem] bg-cream p-5 sm:p-7">
        <p className="text-xs font-black uppercase text-orange-deep">{title}</p>
        <h2 className="mt-2 text-2xl font-black leading-9 text-ink">{instruction}</h2>
        {speaking ? (
          <div className="mt-5 rounded-3xl bg-white p-5">
            <p className="text-xl font-black leading-9 text-ink">{item.source.textZh}</p>
          </div>
        ) : item.source.instructionZh ? <p className="mt-4 text-xl font-black text-ink">{item.source.instructionZh}</p> : null}
      </div>
      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-black text-ink">{language === "ru" ? "Ответ на китайском" : "Xitoycha javob"}</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={speaking ? 5 : 7}
          placeholder={language === "ru" ? "Введите ответ китайскими иероглифами..." : "Javobni xitoy ierogliflarida yozing..."}
          className="min-h-36 w-full resize-y rounded-[1.6rem] border border-orange-soft bg-white px-5 py-4 text-lg font-bold leading-8 text-ink outline-none focus:border-orange-brand"
        />
      </label>
      <p className="mt-2 text-xs font-bold text-stone-500">
        {language === "ru" ? "Пустой ответ получает 0 баллов. Скопированный исходный текст не получает полный балл." : "Bo‘sh javob 0 ball oladi. Asl matnni ko‘chirib yozish to‘liq ball bermaydi."}
      </p>
    </>
  );
}
