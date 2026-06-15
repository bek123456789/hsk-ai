"use client";

import { BookOpenCheck, CheckCircle2, Clock3, FileText } from "lucide-react";
import { useState } from "react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function HomeworkPage() {
  const { language } = useI18n();
  const [done, setDone] = useState<string[]>(() => (typeof window === "undefined" ? [] : JSON.parse(localStorage.getItem("hsk-ai-homework-done") ?? "[]") as string[]));
  const currentLevel = useProgressStore((state) => state.currentLevel);
  const tasks = [
    { id: "words", icon: BookOpenCheck, uz: "10 ta yangi so‘z", ru: "10 новых слов", href: `/lesson/${currentLevel}` },
    { id: "review", icon: Clock3, uz: "5 ta takrorlash", ru: "5 повторений", href: "/review" },
    { id: "quiz", icon: FileText, uz: "1 ta mini test", ru: "1 мини-тест", href: `/quiz/${currentLevel}` },
    { id: "listen", icon: CheckCircle2, uz: "Tinglab mashq qilish", ru: "Практика аудирования", href: `/listening/${currentLevel}` }
  ];

  function toggle(id: string) {
    const next = done.includes(id) ? done.filter((item) => item !== id) : [...done, id];
    setDone(next);
    localStorage.setItem("hsk-ai-homework-done", JSON.stringify(next));
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Домашние задания" : "Uy vazifalari"}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Короткий дневной набор заданий для стабильного прогресса." : "Barqaror o‘sish uchun qisqa kunlik vazifalar to‘plami."}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {tasks.map((task) => (
            <Card key={task.id} className="p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep">
                    <task.icon className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-black text-ink">{language === "ru" ? task.ru : task.uz}</h2>
                    <p className="mt-1 text-sm font-bold text-stone-500">HSK {currentLevel}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(task.id)}
                  className={`h-12 w-12 rounded-full border text-sm font-black shadow-soft ${done.includes(task.id) ? "border-orange-brand bg-orange-brand text-white" : "border-orange-soft bg-cream text-orange-deep"}`}
                >
                  ✓
                </button>
              </div>
              <AppButton href={task.href} variant="secondary" className="w-full">{language === "ru" ? "Открыть" : "Ochish"}</AppButton>
            </Card>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}
