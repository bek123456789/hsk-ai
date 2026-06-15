"use client";

import { Headphones, Keyboard, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getDictationByLevel } from "@/data/hsk/contentIndex";
import { useProgressStore } from "@/store/progressStore";
import { useAuthStore } from "@/store/authStore";
import type { HSKLevel } from "@/types";
import { useI18n } from "@/utils/i18n";
import { speakChinese } from "@/utils/speechSynthesis";
import { isPremiumProfile } from "@/utils/premium";

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").trim();
}

export default function DictationPage() {
  const { language } = useI18n();
  const save = useProgressStore((state) => state.saveLearningActivity);
  const user = useAuthStore((state) => state.user);
  const premium = isPremiumProfile(user);
  const addMistake = useProgressStore((state) => state.addMistake);
  const [level, setLevel] = useState<HSKLevel>(1);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const items = getDictationByLevel(level);
  const item = items[index % Math.max(1, items.length)];
  const correct = item ? normalize(answer) === normalize(item.answerZh) || normalize(answer) === normalize(item.answerPinyin) : false;

  function check() {
    if (!item || !answer.trim()) return;
    setChecked(true);
    save({ id: `dictation-${Date.now()}`, type: "dictation", hskLevel: level, score: correct ? 1 : 0, total: 1, completedAt: new Date().toISOString() });
    if (!correct) addMistake({ source: "dictation", hskLevel: level, chinese: item.answerZh, pinyin: item.answerPinyin, wrongAnswer: answer, correctAnswer: `${item.answerZh} · ${item.answerPinyin}`, explanation: language === "ru" ? item.meaningRu : item.meaningUz });
  }
  function next() { setIndex((value) => (value + 1) % Math.max(1, items.length)); setAnswer(""); setChecked(false); }

  return (
    <ProtectedRoute>
      <PageShell className="max-w-4xl">
        <PageHeader eyebrow="HSK 1–6" title={language === "ru" ? "Диктант" : "Diktant"} description={language === "ru" ? "Прослушайте китайское слово и напишите ханьцзы или pinyin." : "Xitoycha so‘zni tinglab, hanzi yoki pinyin bilan yozing."} icon={Keyboard} />
        <div className="rounded-[2rem] bg-white/88 p-6 shadow-premium sm:p-9">
          <div className="flex flex-wrap gap-2">{([1,2,3,4,5,6] as HSKLevel[]).map((item) => <button key={item} disabled={item > 1 && !premium} onClick={() => { setLevel(item); setIndex(0); setAnswer(""); setChecked(false); }} className={`rounded-full px-4 py-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-45 ${level === item ? "bg-orange-brand text-white" : "bg-cream text-stone-600"}`}>HSK {item}{item > 1 && !premium ? " · Premium" : ""}</button>)}</div>
          <button onClick={() => item && speakChinese(item.audioTextZh)} className="warm-focus mx-auto mt-9 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow"><Headphones className="h-11 w-11" /></button>
          <label className="mt-7 block text-sm font-black text-stone-600">{language === "ru" ? "Напишите то, что услышали" : "Eshitganingizni yozing"}<input value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(false); }} className="warm-focus mt-3 w-full rounded-3xl border border-orange-soft bg-cream px-5 py-4 text-xl font-black text-ink outline-none" placeholder={language === "ru" ? "Ханьцзы или pinyin" : "Hanzi yoki pinyin"} /></label>
          {checked && item ? <div className={`mt-5 rounded-3xl p-5 ${correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}><p className="font-black">{correct ? (language === "ru" ? "Правильно" : "To‘g‘ri") : (language === "ru" ? "Нужно повторить" : "Yana takrorlash kerak")}</p><p className="mt-2 text-3xl font-black">{item.answerZh}</p><p className="font-black">{item.answerPinyin}</p><p className="mt-1 font-semibold">{language === "ru" ? item.meaningRu : item.meaningUz}</p></div> : null}
          <div className="mt-6 flex flex-wrap gap-3">{!checked ? <AppButton onClick={check} disabled={!answer.trim()}>{language === "ru" ? "Проверить ответ" : "Javobni tekshirish"}</AppButton> : <AppButton onClick={next}><RefreshCcw className="h-4 w-4" /> {language === "ru" ? "Следующее слово" : "Keyingi so‘z"}</AppButton>}</div>
        </div>
      </PageShell>
    </ProtectedRoute>
  );
}
