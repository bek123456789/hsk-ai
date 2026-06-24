"use client";

import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Brain,
  Download,
  Headphones,
  Map,
  Mic,
  NotebookTabs,
  PenTool,
  RefreshCcw,
  ShieldCheck,
  Target,
  Trophy,
  Volume2
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getListeningByLevel, getReadingByLevel, getVocabularyEntriesByLevel } from "@/data/hsk/contentIndex";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel, LearningActivityType } from "@/types";
import {
  buildBossBattleResult,
  buildHomeworkTasks,
  buildMentorReport,
  buildWeaknessHeatmap,
  createOfflinePracticePack,
  evaluateDictationAnswer,
  getAdvancedFeatureConfig,
  getWordFamilies,
  type AdvancedFeatureKey
} from "@/utils/advancedLearning";
import { saveFeatureResult, safeLocalSet } from "@/utils/featureStorage";
import { speakChinese } from "@/utils/speechSynthesis";

const iconMap = {
  "pronunciation-coach": Mic,
  "tone-battle": Volume2,
  "word-family": NotebookTabs,
  topics: Map,
  stories: BookOpenCheck,
  "grammar-playground": Brain,
  "reading-trainer": PenTool,
  "weakness-map": Target,
  "boss-battle": Trophy,
  "error-replay": RefreshCcw,
  "offline-pack": Download,
  "mentor-report": ShieldCheck
} satisfies Record<AdvancedFeatureKey, typeof Mic>;

type Props = { featureKey: AdvancedFeatureKey };

function scoreTone(score: number) {
  if (score >= 80) return "bg-emerald-50 text-emerald-700";
  if (score >= 60) return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
}

function activityTypeFor(featureKey: AdvancedFeatureKey): LearningActivityType {
  if (featureKey === "tone-battle") return "tone-trainer";
  if (featureKey === "pronunciation-coach") return "shadowing";
  if (featureKey === "grammar-playground") return "sentence-builder";
  if (featureKey === "stories" || featureKey === "reading-trainer") return "review";
  if (featureKey === "offline-pack") return "study-plan";
  if (featureKey === "boss-battle") return "sprint";
  if (featureKey === "error-replay") return "review";
  return "review";
}

export function AdvancedFeaturePage({ featureKey }: Props) {
  const config = getAdvancedFeatureConfig(featureKey);
  const Icon = iconMap[featureKey];
  const currentLevel = useProgressStore((state) => state.currentLevel);
  const knownWordIds = useProgressStore((state) => state.knownWordIds);
  const weakWordIds = useProgressStore((state) => state.weakWordIds);
  const mistakes = useProgressStore((state) => state.mistakes);
  const practiceResults = useProgressStore((state) => state.practiceResults);
  const addMistake = useProgressStore((state) => state.addMistake);
  const saveLearningActivity = useProgressStore((state) => state.saveLearningActivity);
  const [level, setLevel] = useState<HSKLevel>(currentLevel);
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const [showPinyin, setShowPinyin] = useState(false);
  const [bossHp, setBossHp] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [packSaved, setPackSaved] = useState(false);
  const snapshot = useMemo(() => ({ currentLevel: level, knownWordIds, weakWordIds, mistakes, practiceResults }), [knownWordIds, level, mistakes, practiceResults, weakWordIds]);
  const words = getVocabularyEntriesByLevel(level);
  const firstWord = words[0];
  const listening = getListeningByLevel(level)[0];
  const reading = getReadingByLevel(level)[0];
  const heatmap = buildWeaknessHeatmap(snapshot);
  const homework = buildHomeworkTasks(snapshot);
  const mentor = buildMentorReport(snapshot);
  const boss = buildBossBattleResult(7, 10);
  const pronunciationCheck = evaluateDictationAnswer(listening?.audioTextZh ?? firstWord?.exampleZh ?? "你好", answer);
  const families = getWordFamilies(level);
  const topicWords = words.slice(0, 8);
  const toneOptions = ["1-ton", "2-ton", "3-ton", "4-ton"];
  const correctTone = "3-ton";
  const grammarAnswer = firstWord ? `我学习${firstWord.hanzi}` : "我学习汉语";
  const readingClue = reading?.questions[0]?.questionUz ?? "Matndagi asosiy kalit so‘zni toping.";

  function saveResult() {
    const item = {
      id: `${featureKey}-${Date.now()}`,
      level,
      createdAt: new Date().toISOString(),
      score: featureKey === "boss-battle" ? (boss.won ? 100 : 70) : featureKey === "pronunciation-coach" ? pronunciationCheck.score : 1
    };
    if (featureKey === "pronunciation-coach" && !pronunciationCheck.completed) return;
    saveLearningActivity({ id: item.id, type: activityTypeFor(featureKey), hskLevel: level, score: typeof item.score === "number" ? item.score : 1, total: featureKey === "pronunciation-coach" ? 100 : 1, completedAt: item.createdAt });
    void saveFeatureResult({ localKey: config.localStorageKey, table: config.table, item }).then(setSaved);
  }

  function saveDictation() {
    if (!pronunciationCheck.completed) return;
    if (pronunciationCheck.score < 80) {
      addMistake({
        source: "speaking",
        hskLevel: level,
        chinese: listening?.audioTextZh ?? firstWord?.exampleZh ?? "你好",
        pinyin: listening?.audioTextPinyin ?? firstWord?.examplePinyin,
        wrongAnswer: answer,
        correctAnswer: listening?.audioTextZh ?? firstWord?.exampleZh ?? "你好",
        explanation: pronunciationCheck.feedbackUz
      });
    }
    saveResult();
  }

  function answerTone(option: string) {
    setSelected(option);
    const ok = option === correctTone;
    setResult(ok ? "To‘g‘ri! 3-ton pastga tushib, keyin ko‘tariladi." : "Xato ton. 3-tonni yana eshiting va egri talaffuzga e’tibor bering.");
    void saveFeatureResult({
      localKey: "tone_battle_results",
      table: "tone_battle_results",
      item: { id: `tone-battle-${Date.now()}`, level, option, correct: ok, createdAt: new Date().toISOString() }
    });
  }

  function checkSimpleAnswer(expected: string, success: string, fail: string) {
    const ok = answer.trim().replace(/[。？！\s]/g, "") === expected.replace(/[。？！\s]/g, "");
    setResult(ok ? success : fail);
    void saveFeatureResult({
      localKey: config.localStorageKey,
      table: config.table,
      item: { id: `${featureKey}-${Date.now()}`, level, answer, correct: ok, createdAt: new Date().toISOString() }
    });
  }

  function playBoss(correct: boolean) {
    const nextHp = Math.max(0, bossHp - (correct ? 25 : 0));
    const nextEnergy = Math.max(0, energy - (correct ? 0 : 20));
    setBossHp(nextHp);
    setEnergy(nextEnergy);
    setResult(correct ? "Zarba! To‘g‘ri javob boss kuchini kamaytirdi." : "Xato javob energiyangizni kamaytirdi.");
    if (nextHp === 0 || nextEnergy === 0) {
      void saveFeatureResult({
        localKey: "boss_battle_results",
        table: "boss_battle_results",
        item: { id: `boss-${Date.now()}`, level, bossHp: nextHp, energy: nextEnergy, officialUnlock: false, createdAt: new Date().toISOString() }
      });
    }
  }

  function saveOfflinePack() {
    const pack = createOfflinePracticePack(level);
    safeLocalSet("offline_practice_pack", pack);
    void saveFeatureResult({ localKey: "offline_pack_results", table: "offline_pack_results", item: { id: pack.id, level, createdAt: new Date().toISOString() } });
    setPackSaved(true);
  }

  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader eyebrow={config.eyebrowUz} title={config.titleUz} description={config.descriptionUz} icon={Icon} />
        <div className="mb-6 flex flex-wrap gap-2">
          {([1, 2, 3, 4, 5, 6] as HSKLevel[]).map((item) => (
            <button key={item} onClick={() => setLevel(item)} className={`rounded-full px-4 py-2 text-sm font-black ${level === item ? "bg-orange-brand text-white" : "bg-white text-stone-600 shadow-soft"}`}>
              HSK {item}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="p-6 lg:col-span-7">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep">
                <Icon className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <h2 className="text-3xl font-black text-ink">{config.primaryActionUz}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-stone-600">{config.descriptionUz}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {config.bulletsUz.map((item) => (
                <div key={item} className="rounded-[1.4rem] bg-cream/80 p-4 text-sm font-black text-stone-700">
                  <BadgeCheck className="mb-2 h-5 w-5 text-orange-brand" /> {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-5">
            <h2 className="text-2xl font-black text-ink">Bugungi namuna</h2>
            <div className="mt-4 rounded-[1.5rem] bg-cream/85 p-5">
              <p className="text-4xl font-black text-ink">{firstWord?.hanzi ?? "你好"}</p>
              <p className="mt-2 text-lg font-black text-orange-brand">{firstWord?.pinyin ?? "nǐ hǎo"}</p>
              <p className="mt-2 text-sm font-bold text-stone-600">{firstWord?.uz ?? "salom"}</p>
              <p className="mt-4 text-xl font-black text-ink">{firstWord?.exampleZh ?? "你好，我是学生。"}</p>
              <p className="mt-1 text-sm font-bold text-stone-500">{firstWord?.examplePinyin ?? "nǐ hǎo, wǒ shì xué sheng."}</p>
              <p className="mt-1 text-sm font-semibold text-stone-600">{firstWord?.exampleUz ?? "Salom, men o‘quvchiman."}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <AppButton onClick={() => speakChinese(firstWord?.exampleZh ?? "你好")}>
                <Headphones className="h-4 w-4" /> Eshitish
              </AppButton>
              <AppButton onClick={saveResult} variant="secondary">Progress saqlash</AppButton>
            </div>
            {saved ? <p className="mt-3 text-sm font-black text-orange-deep">LocalStoragega saqlandi. Supabase bo‘lsa best-effort sync qilinadi.</p> : null}
          </Card>

          {featureKey === "pronunciation-coach" ? (
            <Card className="p-6 lg:col-span-12">
              <h2 className="text-2xl font-black text-ink">Eshiting va takrorlang</h2>
              <p className="mt-2 text-sm font-semibold text-stone-600">Bo‘sh javob progress sifatida saqlanmaydi.</p>
              <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} className="warm-focus mt-4 min-h-32 w-full rounded-[1.5rem] border border-orange-soft bg-cream px-5 py-4 text-lg font-bold text-ink outline-none" placeholder="Hanzi yoki pinyin yozing" />
              {answer.trim() ? (
                <div className={`mt-4 rounded-[1.5rem] p-4 text-sm font-bold ${pronunciationCheck.score >= 80 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  Ball: {pronunciationCheck.score}% · {pronunciationCheck.feedbackUz}
                  {pronunciationCheck.missingWords.length ? <p className="mt-2">Yetishmagan so‘zlar: {pronunciationCheck.missingWords.join(" ")}</p> : null}
                </div>
              ) : null}
              <AppButton onClick={saveDictation} disabled={!answer.trim()} className="mt-5">Natijani saqlash</AppButton>
            </Card>
          ) : null}

          {featureKey === "weakness-map" ? (
            <Card className="p-6 lg:col-span-12">
              <h2 className="text-2xl font-black text-ink">Zaif joylar heatmap</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {heatmap.map((item) => (
                  <div key={item.skillUz} className={`rounded-[1.4rem] p-4 ${scoreTone(item.score)}`}>
                    <p className="text-sm font-black">{item.skillUz}</p>
                    <p className="mt-2 text-3xl font-black">{item.score}%</p>
                    <p className="mt-1 text-xs font-black">{item.statusUz}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {featureKey === "offline-pack" ? (
            <Card className="p-6 lg:col-span-12">
              <h2 className="text-2xl font-black text-ink">Offline paket</h2>
              <p className="mt-2 text-sm font-semibold text-stone-600">Internet bo‘lmasa ham mashq qilish uchun bugungi paket LocalStoragega saqlanadi.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-5">
                {Object.entries(createOfflinePracticePack(level)).filter(([key]) => ["vocabulary", "grammarTasks", "listeningTexts", "readingTasks", "quizQuestions"].includes(key)).map(([key, value]) => (
                  <div key={key} className="rounded-[1.4rem] bg-cream p-4">
                    <p className="text-xs font-black text-orange-deep">{key}</p>
                    <p className="mt-2 text-3xl font-black text-ink">{Array.isArray(value) ? value.length : 0}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {featureKey === "word-family" ? (
            <Card className="p-6 lg:col-span-12">
              <h2 className="text-2xl font-black text-ink">Bir ieroglifdan kelgan so‘zlar</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {families.map((family) => (
                  <div key={family.char} className="rounded-[1.5rem] bg-cream p-4">
                    <p className="text-4xl font-black text-ink">{family.char}</p>
                    <div className="mt-3 space-y-2">
                      {family.family.map((word) => <p key={word.id} className="text-sm font-bold text-stone-600">{word.hanzi} · {word.pinyin} · {word.uz}</p>)}
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <AppButton href={`/hanzi-builder?word=${family.family[0]?.id}`} variant="secondary" className="w-full">Hanzi Builderda ochish</AppButton>
                      <button onClick={() => { safeLocalSet(`word-family-${family.char}`, family); setResult(`${family.char} oilasi takrorlashga qo‘shildi.`); }} className="rounded-full bg-orange-brand px-4 py-3 text-sm font-black text-white">Oilani reviewga qo‘shish</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {(featureKey === "error-replay" || featureKey === "mentor-report" || featureKey === "boss-battle") ? (
            <Card className="p-6 lg:col-span-12">
              <h2 className="text-2xl font-black text-ink">{featureKey === "mentor-report" ? mentor.titleUz : featureKey === "boss-battle" ? "Boss natijasi" : "Xatolar sababiga ko‘ra replay"}</h2>
              {featureKey === "boss-battle" ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] bg-rose-50 p-4 text-rose-700"><p className="font-black">Boss kuchi</p><p className="mt-2 text-3xl font-black">{bossHp}%</p></div>
                  <div className="rounded-[1.4rem] bg-orange-soft p-4 text-orange-deep"><p className="font-black">Sizning energiyangiz</p><p className="mt-2 text-3xl font-black">{energy}%</p></div>
                  <div className="rounded-[1.4rem] bg-cream p-4 text-stone-700"><p className="font-black">Rasmiy unlock</p><p className="mt-2 text-3xl font-black">{boss.unlocksOfficialHsk ? "Ha" : "Yo‘q"}</p></div>
                  <div className="sm:col-span-3 rounded-[1.4rem] bg-white p-4">
                    <p className="font-black text-ink">{firstWord?.hanzi} nimani anglatadi?</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => playBoss(true)} className="rounded-full bg-orange-brand px-4 py-2 text-sm font-black text-white">{firstWord?.uz}</button>
                      <button onClick={() => playBoss(false)} className="rounded-full bg-cream px-4 py-2 text-sm font-black text-stone-600">boshqa ma’no</button>
                    </div>
                  </div>
                </div>
              ) : featureKey === "mentor-report" ? (
                <div className="mt-5 rounded-[1.5rem] bg-cream p-5">
                  <p className="font-bold text-stone-700">O‘zlashtirilgan so‘zlar: {mentor.completedWords}</p>
                  <p className="mt-2 font-bold text-stone-700">Yordam kerak bo‘lgan joylar: {mentor.weakAreas.join(", ") || "hozircha aniq emas"}</p>
                  <p className="mt-2 font-bold text-stone-700">{mentor.recommendationUz}</p>
                  <p className="mt-3 text-xs font-black text-orange-deep">{mentor.officialClaimUz}</p>
                  <AppButton onClick={() => window.print()} variant="secondary" className="mt-5">Chop etish</AppButton>
                </div>
              ) : (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {(mistakes.length ? mistakes.slice(0, 6) : [{ id: "empty", chinese: "Hali xato yo‘q", explanation: "Quiz yoki listening mashq bajarganingizdan keyin replay dars paydo bo‘ladi." }]).map((mistake) => (
                    <div key={mistake.id} className="rounded-[1.4rem] bg-cream p-4">
                      <p className="text-2xl font-black text-ink">{mistake.chinese}</p>
                      <p className="mt-1 text-sm font-bold text-stone-600">Nega xato bo‘ldi? {mistake.explanation}</p>
                      <p className="mt-3 text-sm font-black text-orange-deep">Shunga o‘xshash mashq: {firstWord?.hanzi} ma’nosini tanlang.</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ) : null}

          {featureKey === "topics" || featureKey === "stories" || featureKey === "grammar-playground" || featureKey === "reading-trainer" || featureKey === "tone-battle" ? (
            <Card className="p-6 lg:col-span-12">
              <h2 className="text-2xl font-black text-ink">Amaliy mashq</h2>
              {featureKey === "tone-battle" ? (
                <div className="mt-5 rounded-[1.5rem] bg-cream p-5">
                  <p className="text-lg font-black text-ink">Qaysi tonni eshitdingiz?</p>
                  <p className="mt-2 text-4xl font-black text-orange-deep">mǎ</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {toneOptions.map((option) => <button key={option} onClick={() => answerTone(option)} className={`rounded-full px-4 py-2 text-sm font-black ${selected === option ? "bg-orange-brand text-white" : "bg-white text-stone-600"}`}>{option}</button>)}
                  </div>
                </div>
              ) : null}
              {featureKey === "stories" ? (
                <div className="mt-5 rounded-[1.5rem] bg-cream p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-ink">Kichik hikoya</h3>
                    <button onClick={() => setShowPinyin((value) => !value)} className="rounded-full bg-white px-4 py-2 text-sm font-black text-orange-deep">Pinyin</button>
                  </div>
                  <p className="mt-4 text-2xl font-black leading-relaxed text-ink">{reading?.passageZh ?? firstWord?.exampleZh}</p>
                  {showPinyin ? <p className="mt-2 text-sm font-black text-orange-brand">{reading?.passagePinyin ?? firstWord?.examplePinyin}</p> : null}
                  <p className="mt-2 text-sm font-semibold text-stone-600">{reading?.passageUz ?? firstWord?.exampleUz}</p>
                  <AppButton onClick={() => speakChinese(reading?.passageZh ?? firstWord?.exampleZh ?? "你好")} variant="secondary" className="mt-4">Hikoyani eshitish</AppButton>
                </div>
              ) : null}
              {featureKey === "grammar-playground" ? (
                <div className="mt-5 rounded-[1.5rem] bg-cream p-5">
                  <p className="font-black text-ink">Gapni tuzing: Men {firstWord?.uz ?? "xitoy tili"} o‘rganaman.</p>
                  <input value={answer} onChange={(event) => setAnswer(event.target.value)} className="warm-focus mt-3 w-full rounded-2xl bg-white px-4 py-3 font-black text-ink outline-none" placeholder={grammarAnswer} />
                  <AppButton onClick={() => checkSimpleAnswer(grammarAnswer, "To‘g‘ri tartib: ega + fe’l + to‘ldiruvchi.", "Yana urinib ko‘ring. Oddiy tartib: 我 + 学习 + so‘z.")} className="mt-4">Tekshirish</AppButton>
                </div>
              ) : null}
              {featureKey === "reading-trainer" ? (
                <div className="mt-5 rounded-[1.5rem] bg-cream p-5">
                  <p className="text-xl font-black leading-relaxed text-ink">{reading?.passageZh}</p>
                  <p className="mt-3 text-sm font-bold text-stone-600">{readingClue}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topicWords.slice(0, 4).map((word, index) => <button key={word.id} onClick={() => { setResult(index === 0 ? "To‘g‘ri clue topildi." : "Bu so‘z foydali, lekin asosiy javob clue emas."); safeLocalSet("reading_trainer_last", { word: word.hanzi, level }); }} className="rounded-full bg-white px-4 py-2 text-sm font-black text-stone-700">{word.hanzi}</button>)}
                  </div>
                </div>
              ) : null}
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {homework.slice(0, 3).map((task) => (
                  <div key={task.id} className="rounded-[1.5rem] bg-cream p-5">
                    <p className="text-lg font-black text-ink">{task.titleUz}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{task.whyUz}</p>
                    <AppButton href={task.href} variant="secondary" className="mt-4 w-full">Ochish <ArrowRight className="h-4 w-4" /></AppButton>
                  </div>
                ))}
              </div>
              {reading ? <p className="mt-5 rounded-[1.4rem] bg-white p-4 text-sm font-bold text-stone-600">O‘qish namunasi: {reading.passageZh}</p> : null}
            </Card>
          ) : null}

          {featureKey === "topics" ? (
            <Card className="p-6 lg:col-span-12">
              <h2 className="text-2xl font-black text-ink">Do‘kon mavzusi</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {topicWords.map((word) => <div key={word.id} className="rounded-[1.3rem] bg-cream p-4"><p className="text-2xl font-black text-ink">{word.hanzi}</p><p className="text-sm font-bold text-orange-deep">{word.pinyin}</p><p className="text-sm font-semibold text-stone-600">{word.uz}</p></div>)}
              </div>
              <AppButton onClick={() => { safeLocalSet("topic_progress", { topic: "Do‘kon", level, doneAt: new Date().toISOString() }); setResult("Mavzu progressi saqlandi."); }} className="mt-5">Mavzuni tugatish</AppButton>
            </Card>
          ) : null}

          {featureKey === "offline-pack" ? (
            <div className="lg:col-span-12">
              <AppButton onClick={saveOfflinePack}>{packSaved ? "Paket saqlandi" : "Bugungi paketni saqlash"}</AppButton>
            </div>
          ) : null}

          {result ? (
            <div className="lg:col-span-12 rounded-[1.5rem] bg-orange-soft p-5 text-sm font-black text-orange-deep">
              {result}
            </div>
          ) : null}
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
