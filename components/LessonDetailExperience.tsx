"use client";

import { ArrowRight, BookOpen, Check, CheckCircle2, Clock3, Headphones, Lock, MessageCircle, Play, RotateCcw, Sparkles, Trophy, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { PremiumLock } from "@/components/PremiumLock";
import { SpeakingRetellTask } from "@/components/SpeakingRetellTask";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { hskCentralGrammar } from "@/data/hsk/grammar";
import { type HSKLessonCurriculum } from "@/data/hsk/lessonCurriculum";
import { hskListeningContent } from "@/data/hsk/listening";
import { hskQuizQuestions } from "@/data/hsk/quizQuestions";
import { hskReadingContent } from "@/data/hsk/reading";
import { hskSpeakingTasks } from "@/data/hsk/speakingTasks";
import { vocabularyEntries } from "@/data/hsk/vocabulary";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { calculateLessonProgress, getLessonCompletionState, getLessonProgressRecord, markLessonDone, saveLessonQuiz, saveLessonSection } from "@/utils/lessonPlanner";
import { getLessonLockReason, getNextLesson as getSequentialNextLesson, getPreviousLesson, isLessonUnlocked } from "@/utils/lessonUnlock";
import { saveLearningProgress } from "@/utils/learningProgress";
import { isPremiumProfile } from "@/utils/premium";
import { speakChinese } from "@/utils/speechSynthesis";

function optionText(option: { textUz?: string; textRu?: string; textZh?: string; textPinyin?: string }, language: "uz" | "ru") {
  return language === "ru"
    ? option.textRu ?? option.textZh ?? option.textPinyin ?? ""
    : option.textUz ?? option.textZh ?? option.textPinyin ?? "";
}

export function LessonDetailExperience({ lesson }: { lesson: HSKLessonCurriculum }) {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const markKnown = useProgressStore((state) => state.markKnown);
  const markWeak = useProgressStore((state) => state.markWeak);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const [version, setVersion] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showReadingPinyin, setShowReadingPinyin] = useState(false);
  const [showReadingTranslation, setShowReadingTranslation] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [readingAnswer, setReadingAnswer] = useState("");
  const [listeningAnswer, setListeningAnswer] = useState("");
  const [readingChecked, setReadingChecked] = useState(false);
  const [listeningChecked, setListeningChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => setMounted(true), []);

  const words = useMemo(() => vocabularyEntries.filter((item) => lesson.vocabularyIds.includes(item.id)), [lesson.vocabularyIds]);
  const grammar = useMemo(() => hskCentralGrammar.filter((item) => lesson.grammarIds.includes(item.id)), [lesson.grammarIds]);
  const reading = hskReadingContent.find((item) => lesson.readingIds.includes(item.id));
  const listening = hskListeningContent.find((item) => lesson.listeningIds.includes(item.id));
  const speaking = hskSpeakingTasks.find((item) => lesson.speakingTaskIds.includes(item.id));
  const quiz = hskQuizQuestions.filter((item) => lesson.quizQuestionIds.includes(item.id));
  const readingQuestion = reading?.questions[0];
  const listeningQuestion = listening?.questions[0];
  const progress = mounted ? calculateLessonProgress(lesson, knownWordIds) : 0;
  const record = mounted ? getLessonProgressRecord(lesson.id) : null;
  const completion = mounted ? getLessonCompletionState(lesson, knownWordIds) : null;
  const lessonUnlocked = mounted ? isLessonUnlocked(lesson.level, lesson.id, { knownWordIds }, examAttempts) : true;
  const lockReason = mounted ? getLessonLockReason(lesson.level, lesson.id, { knownWordIds }, examAttempts, language) : "";
  const requiredPreviousLesson = getPreviousLesson(lesson.level, lesson.id);
  const nextLesson = getSequentialNextLesson(lesson.level, lesson.id);
  const nextLessonUnlocked = mounted && nextLesson ? isLessonUnlocked(lesson.level, nextLesson.id, { knownWordIds }, examAttempts) : false;

  function refresh() {
    setVersion((value) => value + 1);
  }

  function completeWords() {
    words.forEach((word) => markKnown(word.id));
    saveLessonSection(lesson.id, "vocabulary");
    refresh();
  }

  function submitReading() {
    if (!reading || !readingQuestion || !readingAnswer) return;
    const correct = readingAnswer === readingQuestion.correctOptionId;
    saveLearningProgress({ kind: "reading", contentId: reading.id, level: lesson.level, score: correct ? 1 : 0, total: 1, done: correct, mistakes: correct ? [] : [readingQuestion.id] });
    if (correct) saveLessonSection(lesson.id, "reading");
    setReadingChecked(true);
    refresh();
  }

  function submitListening() {
    if (!listening || !listeningQuestion || !listeningAnswer) return;
    const correct = listeningAnswer === listeningQuestion.correctOptionId;
    saveLearningProgress({ kind: "listening", contentId: listening.id, level: lesson.level, score: correct ? 1 : 0, total: 1, done: correct, mistakes: correct ? [] : [listeningQuestion.id] });
    if (correct) saveLessonSection(lesson.id, "listening");
    setListeningChecked(true);
    setShowTranscript(true);
    refresh();
  }

  function submitQuiz() {
    const score = quiz.filter((question) => quizAnswers[question.id] === question.correctOptionId).length;
    saveLessonQuiz(lesson.id, score, quiz.length);
    setQuizSubmitted(true);
    refresh();
  }

  if (mounted && !lessonUnlocked) {
    return (
      <PageShell className="max-w-3xl">
        <div className="rounded-[2.2rem] border border-orange-soft/70 bg-white/92 p-7 text-center shadow-premium sm:p-10">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-orange-soft text-orange-deep">
            <Lock className="h-9 w-9" />
          </span>
          <p className="mt-5 text-sm font-black text-orange-deep">HSK {lesson.level} · {lesson.order}</p>
          <h1 className="mt-2 text-4xl font-black text-ink">{language === "ru" ? "Этот урок пока закрыт" : "Bu dars hali yopiq"}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-stone-600">
            {lockReason || (language === "ru" ? "Уроки открываются по порядку." : "Darslar ketma-ket ochiladi.")}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {requiredPreviousLesson ? (
              <AppButton href={`/lesson/${lesson.level}/${requiredPreviousLesson.id}`} variant="primary">
                <ArrowRight className="h-4 w-4" /> {language === "ru" ? "Предыдущий урок" : "Oldingi dars"}
              </AppButton>
            ) : (
              <AppButton href={`/exam/${Math.max(1, lesson.level - 1)}`} variant="primary">
                <Trophy className="h-4 w-4" /> {language === "ru" ? "Посмотреть экзамен" : "Imtihonni ko‘rish"}
              </AppButton>
            )}
            <AppButton href={`/lessons/${lesson.level}`} variant="secondary">
              {language === "ru" ? "К списку уроков" : "Darslar ro‘yxati"}
            </AppButton>
          </div>
        </div>
      </PageShell>
    );
  }

  if (lesson.isPremium && !isPremiumProfile(user)) {
    return <PageShell><PremiumLock featureKey="hskFull" /></PageShell>;
  }

  return (
    <PageShell className="max-w-6xl">
      <PageHeader
        eyebrow={`HSK ${lesson.level} · ${lesson.order}`}
        title={language === "ru" ? lesson.titleRu : lesson.titleUz}
        description={language === "ru" ? lesson.descriptionRu : lesson.descriptionUz}
        icon={BookOpen}
      />

      <div className="mb-7 rounded-[2rem] border border-orange-soft/70 bg-white/90 p-5 shadow-premium">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 text-sm font-black text-stone-600">
            <span className="rounded-full bg-cream px-4 py-2">{words.length} {language === "ru" ? "слов" : "so‘z"}</span>
            <span className="rounded-full bg-cream px-4 py-2">{grammar.length} {language === "ru" ? "грамматических тем" : "grammatika mavzusi"}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2"><Clock3 className="h-4 w-4 text-orange-brand" /> {lesson.estimatedMinutes} {language === "ru" ? "минут" : "daqiqa"}</span>
          </div>
          <span className="rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep">{progress}%</span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream"><div className="h-full rounded-full bg-gradient-to-r from-orange-brand to-amber-300 transition-all" style={{ width: `${progress}%` }} /></div>
      </div>

      <section className="mb-7 rounded-[2.2rem] border border-orange-soft/60 bg-white/90 p-5 shadow-premium sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-sm font-black text-orange-deep">01</p><h2 className="text-3xl font-black text-ink">{language === "ru" ? "Слова" : "So‘zlar"}</h2></div>
          <AppButton onClick={completeWords}><Check className="h-4 w-4" /> {language === "ru" ? "Слова изучены" : "So‘zlar o‘rganildi"}</AppButton>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {words.map((word) => (
            <article key={word.id} className="rounded-[1.7rem] border border-orange-soft/50 bg-cream/70 p-5">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-4xl font-black text-ink">{word.hanzi}</p><p className="mt-1 font-black text-orange-brand">{word.pinyin}</p></div>
                <button onClick={() => speakChinese(word.hanzi)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-orange-deep shadow-soft" aria-label={language === "ru" ? "Прослушать слово" : "So‘zni eshitish"}><Volume2 className="h-5 w-5" /></button>
              </div>
              <p className="mt-3 font-black text-stone-700">{language === "ru" ? word.ru : word.uz}</p>
              <p className="mt-4 text-lg font-black text-ink">{word.exampleZh}</p>
              <p className="mt-1 text-sm font-bold text-orange-deep">{word.examplePinyin}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{language === "ru" ? word.exampleRu : word.exampleUz}</p>
              <button onClick={() => markWeak(word.id)} className="mt-4 text-xs font-black text-orange-deep underline decoration-orange-soft underline-offset-4">{language === "ru" ? "Добавить в повторение" : "Takrorlashga saqlash"}</button>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-7 rounded-[2.2rem] border border-orange-soft/60 bg-white/90 p-5 shadow-premium sm:p-7">
        <p className="text-sm font-black text-orange-deep">02</p>
        <h2 className="text-3xl font-black text-ink">{language === "ru" ? "Грамматика" : "Grammatika"}</h2>
        <div className="mt-5 space-y-4">
          {grammar.map((item) => (
            <article key={item.id} className="rounded-[1.7rem] bg-cream p-5">
              <p className="text-2xl font-black text-orange-deep">{item.pattern}</p>
              <p className="mt-3 font-semibold leading-7 text-stone-700">{language === "ru" ? item.explanationRu : item.explanationUz}</p>
              <div className="mt-4 space-y-3">{item.examples.slice(0, 2).map((example, index) => <div key={`${item.id}-${index}`} className="rounded-2xl bg-white p-4 shadow-soft"><p className="font-black text-ink">{example.chinese}</p><p className="text-sm font-bold text-orange-brand">{example.pinyin}</p><p className="mt-1 text-sm font-semibold text-stone-600">{language === "ru" ? example.ru : example.uz}</p></div>)}</div>
              {item.commonMistakes[0] ? <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800"><span className="font-black">{language === "ru" ? "Частая ошибка:" : "Ko‘p uchraydigan xato:"}</span> {language === "ru" ? item.commonMistakes[0].ru : item.commonMistakes[0].uz}</p> : null}
            </article>
          ))}
        </div>
        <AppButton className="mt-5" onClick={() => { saveLessonSection(lesson.id, "grammar"); refresh(); }}><Check className="h-4 w-4" /> {language === "ru" ? "Грамматика изучена" : "Grammatika o‘rganildi"}</AppButton>
      </section>

      {reading && readingQuestion ? (
        <section className="mb-7 rounded-[2.2rem] border border-orange-soft/60 bg-white/90 p-5 shadow-premium sm:p-7">
          <p className="text-sm font-black text-orange-deep">03</p><h2 className="text-3xl font-black text-ink">{language === "ru" ? "Чтение" : "O‘qish"}</h2>
          <div className="mt-5 rounded-[1.7rem] bg-cream p-5"><p className="text-xl font-black leading-9 text-ink">{reading.passageZh}</p>{showReadingPinyin ? <p className="mt-3 font-bold leading-7 text-orange-brand">{reading.passagePinyin}</p> : null}{showReadingTranslation ? <p className="mt-3 font-semibold leading-7 text-stone-600">{language === "ru" ? reading.passageRu : reading.passageUz}</p> : null}</div>
          <div className="mt-4 flex flex-wrap gap-2"><AppButton variant="secondary" onClick={() => setShowReadingPinyin((value) => !value)}>{language === "ru" ? "Показать pinyin" : "Pinyinni ko‘rsatish"}</AppButton><AppButton variant="secondary" onClick={() => setShowReadingTranslation((value) => !value)}>{language === "ru" ? "Показать перевод" : "Tarjimani ko‘rsatish"}</AppButton></div>
          <p className="mt-5 font-black text-ink">{language === "ru" ? readingQuestion.questionRu : readingQuestion.questionUz}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">{readingQuestion.options.map((option) => <button key={option.id} onClick={() => !readingChecked && setReadingAnswer(option.id)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${readingChecked && option.id === readingQuestion.correctOptionId ? "border-emerald-300 bg-emerald-50 text-emerald-700" : readingChecked && readingAnswer === option.id ? "border-rose-300 bg-rose-50 text-rose-700" : readingAnswer === option.id ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-orange-soft/50 bg-white text-stone-700"}`}>{optionText(option, language)}</button>)}</div>
          <AppButton className="mt-4" onClick={submitReading} disabled={!readingAnswer || readingChecked}>{language === "ru" ? "Проверить ответ" : "Javobni tekshirish"}</AppButton>
          {readingChecked ? <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-semibold leading-6 text-stone-600"><b>{language === "ru" ? "Объяснение" : "Tushuntirish"}:</b> {language === "ru" ? readingQuestion.explanationRu : readingQuestion.explanationUz}</p> : null}
        </section>
      ) : null}

      {listening && listeningQuestion ? (
        <section className="mb-7 rounded-[2.2rem] border border-orange-soft/60 bg-white/90 p-5 shadow-premium sm:p-7">
          <p className="text-sm font-black text-orange-deep">04</p><h2 className="text-3xl font-black text-ink">{language === "ru" ? "Аудирование" : "Tinglash"}</h2>
          <button onClick={() => speakChinese(listening.audioTextZh)} className="mt-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow"><Play className="h-8 w-8 fill-current" /></button>
          <p className="mt-4 font-black text-ink">{language === "ru" ? listeningQuestion.questionRu : listeningQuestion.questionUz}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">{listeningQuestion.options.map((option) => <button key={option.id} onClick={() => !listeningChecked && setListeningAnswer(option.id)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${listeningChecked && option.id === listeningQuestion.correctOptionId ? "border-emerald-300 bg-emerald-50 text-emerald-700" : listeningChecked && listeningAnswer === option.id ? "border-rose-300 bg-rose-50 text-rose-700" : listeningAnswer === option.id ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-orange-soft/50 bg-white text-stone-700"}`}>{optionText(option, language)}</button>)}</div>
          <div className="mt-4 flex flex-wrap gap-2"><AppButton onClick={submitListening} disabled={!listeningAnswer || listeningChecked}>{language === "ru" ? "Проверить ответ" : "Javobni tekshirish"}</AppButton><AppButton variant="secondary" disabled={!listeningChecked} onClick={() => setShowTranscript((value) => !value)}>{language === "ru" ? "Показать текст" : "Matnni ko‘rsatish"}</AppButton></div>
          {listeningChecked ? <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-semibold leading-6 text-stone-600"><b>{language === "ru" ? "Объяснение" : "Tushuntirish"}:</b> {language === "ru" ? listeningQuestion.explanationRu : listeningQuestion.explanationUz}</p> : null}
          {showTranscript ? <div className="mt-4 rounded-2xl bg-cream p-4"><p className="font-black text-ink">{listening.audioTextZh}</p><p className="mt-1 font-bold text-orange-brand">{listening.audioTextPinyin}</p><p className="mt-2 text-sm font-semibold text-stone-600">{language === "ru" ? listening.transcriptRu : listening.transcriptUz}</p></div> : null}
        </section>
      ) : null}

      {speaking ? (
        <section className="mb-7">
          <div className="mb-4"><p className="text-sm font-black text-orange-deep">05</p><h2 className="text-3xl font-black text-ink">{language === "ru" ? "Говорение" : "Gapirish"}</h2></div>
          <SpeakingRetellTask task={speaking} language={language} onNext={() => undefined} onEvaluated={(done) => { if (done) saveLessonSection(lesson.id, "speaking"); refresh(); }} />
        </section>
      ) : null}

      <section className="mb-7 rounded-[2.2rem] border border-orange-soft/60 bg-white/90 p-5 shadow-premium sm:p-7">
        <p className="text-sm font-black text-orange-deep">06</p><h2 className="text-3xl font-black text-ink">{language === "ru" ? "Мини-тест" : "Mini test"}</h2>
        <div className="mt-5 space-y-5">
          {quiz.map((question, index) => (
            <article key={question.id} className="rounded-[1.7rem] bg-cream p-5">
              <p className="font-black text-ink">{index + 1}. {language === "ru" ? question.questionRu : question.questionUz}</p>
              {question.promptZh ? <p className="mt-3 text-3xl font-black text-orange-deep">{question.promptZh}</p> : null}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">{question.options?.map((option) => {
                const selected = quizAnswers[question.id] === option.id;
                const correct = quizSubmitted && option.id === question.correctOptionId;
                const wrong = quizSubmitted && selected && !correct;
                return <button key={option.id} onClick={() => !quizSubmitted && setQuizAnswers((current) => ({ ...current, [question.id]: option.id }))} className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${correct ? "border-emerald-300 bg-emerald-50 text-emerald-700" : wrong ? "border-rose-300 bg-rose-50 text-rose-700" : selected ? "border-orange-brand bg-orange-soft text-orange-deep" : "border-orange-soft/50 bg-white text-stone-700"}`}>{optionText(option, language)}</button>;
              })}</div>
              {quizSubmitted ? <p className="mt-3 text-sm font-semibold text-stone-600">{language === "ru" ? question.explanationRu : question.explanationUz}</p> : null}
            </article>
          ))}
        </div>
        <AppButton className="mt-5" onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < quiz.length || quizSubmitted}><Sparkles className="h-4 w-4" /> {language === "ru" ? "Завершить мини-тест" : "Mini testni yakunlash"}</AppButton>
      </section>

      <section className="rounded-[2.2rem] bg-gradient-to-br from-orange-brand to-orange-hot p-6 text-white shadow-glow sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-sm font-black text-white/80">{progress}%</p><h2 className="mt-1 text-3xl font-black">{record?.markedDone ? (language === "ru" ? "Урок завершён" : "Dars yakunlandi") : (language === "ru" ? "Завершить урок" : "Darsni yakunlash")}</h2><p className="mt-2 max-w-2xl font-semibold text-white/85">{language === "ru" ? "Завершите основные разделы и отметьте урок выполненным." : "Asosiy bo‘limlarni tugatib, darsni yakunlangan deb belgilang."}</p></div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { markLessonDone(lesson.id); refresh(); }} disabled={!completion?.ready || record?.markedDone} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-orange-deep disabled:opacity-50"><CheckCircle2 className="h-5 w-5" /> {language === "ru" ? "Урок завершён" : "Dars yakunlandi"}</button>
            {nextLesson && nextLessonUnlocked ? (
              <AppButton href={`/lesson/${lesson.level}/${nextLesson.id}`} variant="secondary">{language === "ru" ? "Следующий урок открыт" : "Keyingi dars ochildi"} <ArrowRight className="h-4 w-4" /></AppButton>
            ) : nextLesson ? (
              <AppButton disabled variant="secondary"><Lock className="h-4 w-4" /> {language === "ru" ? "Следующий урок закрыт" : "Keyingi dars yopiq"}</AppButton>
            ) : <AppButton href={`/lesson/${lesson.level}`} variant="secondary"><RotateCcw className="h-4 w-4" /> {language === "ru" ? "К списку уроков" : "Darslar ro‘yxati"}</AppButton>}
          </div>
        </div>
      </section>
      <span className="sr-only">{version}</span>
    </PageShell>
  );
}
