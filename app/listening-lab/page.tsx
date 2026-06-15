"use client";

import { Eye, Headphones, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getListeningByLevel } from "@/data/hsk/contentIndex";
import { useProgressStore } from "@/store/progressStore";
import { useAuthStore } from "@/store/authStore";
import type { HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { speakChinese } from "@/utils/speechSynthesis";
import { isPremiumProfile } from "@/utils/premium";

export default function ListeningLabPage() {
  const { language } = useI18n();
  const save = useProgressStore((state) => state.saveLearningActivity);
  const user = useAuthStore((state) => state.user);
  const premium = isPremiumProfile(user);
  const [level, setLevel] = useState<HSKLevel>(1);
  const [index, setIndex] = useState(0);
  const [replays, setReplays] = useState(0);
  const [strict, setStrict] = useState(false);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const prompts = getListeningByLevel(level);
  const prompt = prompts[index % Math.max(1, prompts.length)];
  const question = prompt?.questions[0];
  const options = useMemo(() => question?.options ?? [], [question]);
  const canReplay = !strict || replays < 2;

  function listen() {
    if (!prompt || !canReplay) return;
    speakChinese(prompt.audioTextZh);
    setReplays((value) => value + 1);
  }
  function check() {
    if (!prompt || !question || !selected) return;
    setChecked(true);
    save({ id: `listen-${Date.now()}`, type: "listening-lab", hskLevel: level, score: selected === question.correctOptionId ? 1 : 0, total: 1, completedAt: new Date().toISOString() });
  }
  function next() { setIndex((value) => (value + 1) % Math.max(1, prompts.length)); setSelected(""); setChecked(false); setReplays(0); }

  return (
    <ProtectedRoute>
      <PageShell className="max-w-5xl">
        <PageHeader eyebrow="HSK 1–6" title={language === "ru" ? "Лаборатория аудирования" : "Tinglash laboratoriyasi"} description={language === "ru" ? "Прослушайте предложение и выберите правильное значение." : "Gapni tinglang va to‘g‘ri ma’noni tanlang."} icon={Headphones} />
        <div className="rounded-[2rem] bg-white/88 p-6 shadow-premium sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">{([1,2,3,4,5,6] as HSKLevel[]).map((item) => <button key={item} disabled={item > 1 && !premium} onClick={() => { setLevel(item); setIndex(0); setSelected(""); setChecked(false); }} className={`rounded-full px-4 py-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-45 ${level === item ? "bg-orange-brand text-white" : "bg-cream text-stone-600"}`}>HSK {item}{item > 1 && !premium ? " · Premium" : ""}</button>)}</div>
            <label className="flex items-center gap-2 text-sm font-black text-stone-600"><input type="checkbox" checked={strict} onChange={(event) => setStrict(event.target.checked)} className="h-4 w-4 accent-orange-500" /> {language === "ru" ? "Строгий режим" : "Qat’iy rejim"}</label>
          </div>
          <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-cream to-orange-soft/55 p-8 text-center">
            <button onClick={listen} disabled={!canReplay} className="warm-focus mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow disabled:opacity-40"><Headphones className="h-11 w-11" /></button>
            <p className="mt-4 font-black text-stone-600">{language === "ru" ? "Прослушайте и ответьте" : "Eshitib javob bering"} · {replays}{strict ? "/2" : ""}</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{options.map((option) => <button key={option.id} onClick={() => !checked && setSelected(option.id)} className={`rounded-3xl p-4 text-left font-black shadow-soft ${selected === option.id ? "bg-orange-soft text-orange-deep" : "bg-cream text-ink"} ${checked && option.id === question?.correctOptionId ? "ring-2 ring-emerald-500" : ""}`}>{language === "ru" ? option.textRu : option.textUz}</button>)}</div>
          {checked && prompt ? <div className="mt-5 rounded-3xl bg-white p-5 shadow-soft"><p className="flex items-center gap-2 text-sm font-black text-orange-deep"><Eye className="h-4 w-4" /> {language === "ru" ? "Текст" : "Matn"}</p><p className="mt-2 text-3xl font-black text-ink">{prompt.audioTextZh}</p><p className="mt-2 font-black text-orange-brand">{prompt.audioTextPinyin}</p><p className="mt-2 font-semibold text-stone-600">{language === "ru" ? prompt.transcriptRu : prompt.transcriptUz}</p></div> : null}
          <div className="mt-6 flex flex-wrap gap-3">{!checked ? <AppButton onClick={check} disabled={!selected}>{language === "ru" ? "Проверить ответ" : "Javobni tekshirish"}</AppButton> : <AppButton onClick={next}><RefreshCcw className="h-4 w-4" /> {language === "ru" ? "Следующее" : "Keyingi"}</AppButton>}</div>
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
