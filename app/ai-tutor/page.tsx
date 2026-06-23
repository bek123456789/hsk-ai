"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, BookOpen, Crown, Loader2, MessageCircle, RefreshCcw, Send, Sparkles, Target, Volume2, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { hskWords } from "@/data/hskWords";
import { UsageLimitOverview } from "@/components/UsageLimitOverview";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { AppLanguage, HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { recordLocalAIUsage } from "@/utils/aiUsageClient";
import { logAppError } from "@/utils/appLogger";
import { getUnlockedHskLevels } from "@/utils/hskUnlock";
import { getAllLessonProgressRecords } from "@/utils/lessonPlanner";
import { getCurrentAvailableLesson, getLevelCompletionStatus } from "@/utils/lessonUnlock";
import { isPremiumProfile } from "@/utils/premium";
import { getReviewQueue } from "@/utils/spacedReview";
import { speakChinese } from "@/utils/speechSynthesis";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type TutorResponse = {
  reply?: string;
  error?: string;
  detail?: string;
  code?: string;
  usage?: { fallback?: boolean };
};

function getDailyGoalMinutes() {
  if (typeof window === "undefined") return 10;
  try {
    const parsed = JSON.parse(window.localStorage.getItem("hsk-ai-onboarding") ?? "{}") as { dailyMinutes?: number };
    return typeof parsed.dailyMinutes === "number" && parsed.dailyMinutes > 0 ? parsed.dailyMinutes : 10;
  } catch {
    return 10;
  }
}

export default function AITutorPage() {
  const user = useAuthStore((state) => state.user);
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const quizResults = useProgressStore((state) => state.quizResults);
  const examAttempts = useProgressStore((state) => state.examAttempts);
  const mistakes = useProgressStore((state) => state.mistakes);
  const bestScoreByLevel = useProgressStore((state) => state.bestScoreByLevel);
  const wordReviews = useProgressStore((state) => state.wordReviews);
  const currentProgressLevel = useProgressStore((state) => state.currentLevel);
  const { language, t } = useI18n();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const prompts = useMemo(
    () =>
      language === "ru"
        ? ["Что мне учить сегодня?", "Объясни мои слабые места", "Готов ли я к экзамену?", "Составь план на 20 минут", "Объясни следующий урок", "Проанализируй мои ошибки"]
        : ["Bugun nima o‘rganay?", "Zaif joylarimni tushuntir", "Imtihonga tayyormanmi?", "Menga 20 daqiqalik reja tuz", "Keyingi darsni tushuntir", "Xatolarimni tahlil qil"],
    [language]
  );
  const lessonProgress = typeof window !== "undefined" ? getAllLessonProgressRecords() : {};
  const unlockedLevels = getUnlockedHskLevels({ knownWordIds }, examAttempts);
  const requestedLevel = (user?.currentHSKLevel ?? currentProgressLevel ?? 1) as HSKLevel;
  const activeLevel = unlockedLevels.includes(requestedLevel) ? requestedLevel : unlockedLevels.at(-1) ?? 1;
  const currentAvailableLesson = getCurrentAvailableLesson(activeLevel, { knownWordIds, lessonProgress });
  const activeLevelStatus = getLevelCompletionStatus(activeLevel, { knownWordIds, lessonProgress });
  const reviewDueCount = getReviewQueue({ words: hskWords, knownWordIds, weakWordIds, wordReviews, mistakes, limit: 24 }).length;
  const dailyGoalMinutes = getDailyGoalMinutes();
  const premium = isPremiumProfile(user);
  const visibleMessages = messages.length ? messages : [{ role: "assistant" as const, content: t("ai.pageWelcome") }];
  const assistantLabel = language === "ru" ? "AI-помощник" : "AI yordamchi";

  async function sendMessage(value?: string) {
    const text = (value ?? input).trim();
    if (loading) return;
    if (!text) {
      setError(language === "ru" ? "Сообщение не может быть пустым." : "Xabar bo‘sh bo‘lishi mumkin emas.");
      return;
    }

    setInput("");
    setError(null);
    setLastPrompt(text);
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: text }]);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        setError(t("ai.sessionInvalid"));
        return;
      }

      const response = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          language,
          hskLevel: activeLevel,
          clientContext: {
            knownWordIds: knownWordIds.slice(0, 240),
            weakWordIds: weakWordIds.slice(0, 80),
            quizResults: quizResults.slice(0, 8),
            examAttempts: examAttempts.slice(0, 8),
            mistakes: mistakes.slice(0, 20),
            bestScoreByLevel,
            currentAvailableLesson: currentAvailableLesson ? {
              id: currentAvailableLesson.id,
              level: currentAvailableLesson.level,
              order: currentAvailableLesson.order,
              titleUz: currentAvailableLesson.titleUz,
              titleRu: currentAvailableLesson.titleRu
            } : null,
            completedLessonsInLevel: activeLevelStatus.completed,
            totalLessonsInLevel: activeLevelStatus.total,
            reviewDueCount,
            dailyGoalMinutes,
            premium
          }
        })
      });

      const result = await readTutorResponse(response);

      if (response.status === 401) {
        setError(t("ai.sessionInvalid"));
        return;
      }

      if (response.status === 429 && (result.code === "daily_ai_limit_reached" || result.code === "usage_limit_exceeded")) {
        const limitError = [result.error, result.detail].filter(Boolean).join(". ");
        setError(limitError || t("ai.error"));
        await logAppError({ eventType: "ai_usage_limit_reached", message: limitError || "AI limit", accessToken: token });
        return;
      }

      if (!response.ok || !result.reply) {
        throw new Error(getCleanAIError(result.error, result.code, language, response.status));
      }

      if (result.usage?.fallback) recordLocalAIUsage("ai_tutor_message");
      if (typeof window !== "undefined") window.localStorage.setItem("hanziflow-first-ai-session", "true");
      setMessages((current) => [...current, { role: "assistant", content: result.reply ?? "" }]);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : getCleanAIError(null, undefined, language);
      setError(message);
      void logAppError({ eventType: "ai_request_error", message });
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  async function playAssistantReply(content: string) {
    setVoiceError(null);
    const result = speakChinese(content);
    if (!result.ok) {
      setVoiceError(language === "ru" ? "Аудио недоступно" : "Ovoz mavjud emas");
    }
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto min-h-[calc(100vh-5rem)] max-w-[1220px] px-4 pb-[calc(10.5rem+env(safe-area-inset-bottom))] pt-5 text-ink sm:px-6 md:pb-14 lg:px-8 lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-5 overflow-hidden rounded-[2rem] border border-orange-soft/70 bg-gradient-to-br from-white/95 via-cream to-orange-soft/45 p-4 shadow-premium sm:p-6 lg:p-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-orange-soft bg-white/80 px-3 py-2 text-xs font-black text-orange-deep shadow-soft sm:px-4">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="truncate">{t("ai.badge")}</span>
              </div>
              <h1 className="text-balance text-3xl font-black leading-tight text-ink sm:text-5xl">{t("ai.pageTitle")}</h1>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-stone-600 sm:text-base sm:leading-7">{t("ai.pageSubtitle")}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
              <MetricTile icon={<Target className="h-5 w-5" />} label={t("ai.contextLevel")} value={`HSK ${user?.currentHSKLevel ?? 1}`} />
              <MetricTile icon={<BookOpen className="h-5 w-5" />} label={t("common.learnedWords")} value={String(knownWordIds.length)} />
              <MetricTile icon={<Sparkles className="h-5 w-5" />} label={t("review.weak")} value={String(weakWordIds.length)} />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden border-orange-soft/70 bg-white/90 p-5 shadow-premium">
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow">
                  <Bot className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-normal text-orange-deep">{t("ai.pageEyebrow")}</p>
                  <h2 className="mt-1 text-xl font-black text-ink">{assistantLabel}</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{t("ai.chatSubtitle")}</p>
                </div>
              </div>
              <div className="mt-5">
                <UsageLimitOverview usageType="ai_tutor_message" />
                <p className="mt-3 flex items-center gap-2 rounded-2xl bg-orange-soft/55 px-3 py-2 text-xs font-black text-orange-deep">
                  <Crown className="h-4 w-4" />
                  {language === "ru" ? "С Premium доступно больше вопросов" : "Premium bilan ko‘proq savol bering"}
                </p>
              </div>
            </Card>

            <Card className="border-orange-soft/70 bg-white/88 p-5 shadow-soft">
              <div className="mb-4 flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-orange-brand" />
                <h3 className="text-base font-black text-ink">{language === "ru" ? "Быстрые подсказки" : "Tezkor savollar"}</h3>
              </div>
              <div className="flex flex-col gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => void sendMessage(prompt)}
                    disabled={loading}
                    className="w-full rounded-2xl border border-orange-soft/80 bg-cream px-4 py-3 text-left text-sm font-black leading-5 text-stone-700 shadow-soft transition hover:-translate-y-0.5 hover:bg-orange-soft disabled:opacity-60"
                  >
                    <Sparkles className="mr-2 inline h-4 w-4 text-orange-brand" />
                    {prompt}
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          <Card className="flex min-h-[620px] flex-col overflow-hidden border-orange-soft/70 bg-white/92 p-0 shadow-premium">
            <div className="border-b border-orange-soft/70 bg-gradient-to-r from-white via-cream to-orange-soft/35 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep shadow-soft">
                    <MessageCircle className="h-6 w-6" />
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-orange-brand shadow-card" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black text-ink sm:text-xl">{t("ai.chatTitle")}</h2>
                    <p className="line-clamp-2 text-xs font-bold leading-5 text-stone-500">{t("ai.chatSubtitle")}</p>
                  </div>
                </div>
                <AppButton href="/lesson" variant="ghost" className="hidden shrink-0 px-4 sm:inline-flex">
                  {t("nav.learn")} <ArrowRight className="h-4 w-4" />
                </AppButton>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-cream/80 p-4 sm:p-6">
              {visibleMessages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[92%] whitespace-pre-wrap break-words rounded-[1.5rem] px-4 py-3 text-sm font-bold leading-7 shadow-soft [overflow-wrap:anywhere] sm:max-w-[82%] sm:px-5 sm:py-4 ${
                      message.role === "user"
                        ? "rounded-br-md bg-gradient-to-r from-orange-brand to-orange-hot text-white shadow-card"
                        : "rounded-tl-md border border-orange-soft/70 bg-white/95 text-ink"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="mb-3 flex items-center gap-2 border-b border-orange-soft/60 pb-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
                          <Bot className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-black uppercase tracking-normal text-orange-deep">{assistantLabel}</span>
                      </div>
                    ) : null}
                    <MessageContent content={message.content} role={message.role} />
                    {message.role === "assistant" ? (
                      <button
                        type="button"
                        onClick={() => void playAssistantReply(message.content)}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-soft px-3 py-1.5 text-xs font-black text-orange-deep transition hover:bg-orange-brand hover:text-white"
                        aria-label={language === "ru" ? "Прослушать ответ" : "Ovoz bilan eshitish"}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        {language === "ru" ? "Прослушать ответ" : "Ovoz bilan eshitish"}
                      </button>
                    ) : null}
                  </div>
                </motion.div>
              ))}
              {loading ? (
                <div className="inline-flex items-center gap-3 rounded-3xl border border-orange-soft/70 bg-cream px-4 py-3 text-xs font-black text-stone-500 shadow-soft">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white text-orange-deep shadow-soft">
                    <Bot className="h-4 w-4" />
                  </span>
                  <span className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-orange-brand" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-orange-brand [animation-delay:120ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-orange-brand [animation-delay:240ms]" />
                  </span>
                  {t("ai.typing")}
                </div>
              ) : null}
              {error ? (
                <div className="rounded-3xl border border-rose-100 bg-rose-50 px-4 py-4 text-sm font-black text-rose-700 shadow-soft">
                  <p>{language === "ru" ? "AI не смог ответить" : "AI javob bera olmadi"}</p>
                  <p className="mt-1 text-xs leading-5 text-rose-600">{error}</p>
                  <button
                    type="button"
                    onClick={() => void sendMessage(lastPrompt ?? input)}
                    disabled={loading || !(lastPrompt ?? input).trim()}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-rose-700 shadow-soft disabled:opacity-60"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    {language === "ru" ? "Попробовать снова" : "Qayta urinib ko‘rish"}
                  </button>
                </div>
              ) : null}
              {voiceError ? (
                <div className="rounded-3xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700">
                  {voiceError}
                </div>
              ) : null}
            </div>

            <div className="sticky bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-20 border-t border-orange-soft/70 bg-white/95 p-3 shadow-[0_-18px_45px_rgba(255,122,26,0.12)] backdrop-blur-xl sm:p-4 md:static md:p-6 md:shadow-none">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => void sendMessage(prompt)}
                    disabled={loading}
                    className="max-w-[260px] shrink-0 rounded-full border border-orange-soft/80 bg-cream px-4 py-2 text-left text-xs font-black text-stone-700 shadow-soft transition hover:-translate-y-0.5 hover:bg-orange-soft disabled:opacity-60"
                  >
                    <Sparkles className="mr-1 inline h-3.5 w-3.5 text-orange-brand" />
                    {prompt}
                  </button>
                ))}
              </div>
              <form onSubmit={submit} className="flex items-end gap-2 rounded-[1.75rem] border border-orange-soft/70 bg-cream p-2 pl-4 shadow-inner sm:gap-3 sm:rounded-[2rem] sm:pl-5">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={language === "ru" ? "Напишите сообщение..." : "Xabar yozing..."}
                  rows={1}
                  className="max-h-36 min-h-12 min-w-0 flex-1 resize-none bg-transparent py-3 text-sm font-bold text-ink outline-none placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label={t("ai.send")}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-brand to-orange-hot text-white shadow-card transition hover:scale-105 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </form>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[t("ai.featureVocabulary"), t("ai.featureGrammar"), t("ai.featureMistakes")].map((item) => (
            <Card key={item} className="border-orange-soft/70 bg-white/88 p-5 shadow-soft">
              <Wand2 className="mb-4 h-7 w-7 text-orange-brand" />
              <p className="text-lg font-black text-ink">{item}</p>
            </Card>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}

function MetricTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-3xl border border-orange-soft/70 bg-white/85 p-3 shadow-soft">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">{icon}</div>
      <p className="truncate text-[0.68rem] font-black uppercase tracking-normal text-stone-500">{label}</p>
      <p className="mt-1 truncate text-lg font-black text-ink">{value}</p>
    </div>
  );
}

function MessageContent({ content, role }: { content: string; role: ChatMessage["role"] }) {
  const lines = content.split("\n");

  return (
    <div className={role === "assistant" ? "space-y-2" : ""}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={`${index}-blank`} className="h-2" />;
        const hasChinese = /[\u3400-\u9fff]/.test(trimmed);
        const hasPinyin = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]|pinyin|pīnyīn/i.test(trimmed);

        if (role === "assistant" && hasChinese) {
          return (
            <p key={`${index}-${trimmed}`} className="rounded-2xl bg-orange-soft/55 px-3 py-2 text-base font-black leading-7 text-ink">
              {trimmed}
            </p>
          );
        }

        if (role === "assistant" && hasPinyin) {
          return (
            <p key={`${index}-${trimmed}`} className="text-xs font-black leading-6 text-stone-500">
              {trimmed}
            </p>
          );
        }

        return (
          <p key={`${index}-${trimmed}`} className="leading-7">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

async function readTutorResponse(response: Response): Promise<TutorResponse> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {};
  }

  try {
    return (await response.json()) as TutorResponse;
  } catch {
    return {};
  }
}

function getCleanAIError(error: string | undefined | null, code: string | undefined, language: AppLanguage, status?: number) {
  const copy = (uz: string, ru: string, en: string) => language === "ru" ? ru : language === "en" ? en : uz;
  if (code === "missing_openai_key") {
    return copy("Server sozlamalarini tekshiring.", "Проверьте настройки сервера.", "Check the server settings.");
  }
  if (code === "openai_auth_failed") {
    return error || copy("Server sozlamalarini tekshiring.", "Проверьте настройки сервера.", "Check the server settings.");
  }
  if (code === "openai_quota_failed") {
    return error || copy("OpenAI hisobingizni tekshiring.", "Проверьте аккаунт OpenAI.", "Check the OpenAI account.");
  }
  if (code === "openai_rate_limited") {
    return error || copy("AI so‘rovlar soni vaqtincha cheklangan. Birozdan keyin urinib ko‘ring.", "Количество AI-запросов временно ограничено. Попробуйте чуть позже.", "AI requests are temporarily limited. Try again shortly.");
  }
  if (code === "openai_model_failed") {
    return error || copy("Model sozlamalarini tekshiring.", "Проверьте настройки модели.", "Check the model settings.");
  }
  if (code === "openai_timeout") {
    return error || copy("AI javobi juda sekin keldi. Birozdan keyin qayta urinib ko‘ring.", "AI отвечает слишком долго. Попробуйте ещё раз чуть позже.", "AI is taking too long to respond. Try again shortly.");
  }
  if (code === "usage_limit_exceeded" || code === "daily_ai_limit_reached") {
    return error || copy("Bugungi AI limitingiz tugadi. Premium bilan ko‘proq AI savollar ishlatishingiz mumkin.", "Ваш дневной лимит AI закончился. С Premium доступно больше AI-запросов.", "Your daily AI limit is used. Premium includes more AI requests.");
  }
  if (status === 401 || code === "unauthenticated") {
    return language === "ru" ? "Сессия не найдена или не подтверждена. Пожалуйста, подтвердите email или войдите заново." : "Sessiya topilmadi yoki tasdiqlanmagan. Iltimos, emailingizni tasdiqlang yoki qayta kiring.";
  }
  return error || (language === "ru" ? "AI сейчас не смог ответить. Попробуйте ещё раз чуть позже." : "AI hozir javob bera olmadi. Iltimos, birozdan keyin qayta urinib ko‘ring.");
}
