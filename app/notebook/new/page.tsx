"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { appendLocalItem } from "@/utils/localLearning";
import { useI18n } from "@/utils/i18n";

type Note = { id: string; title: string; chinese: string; pinyin: string; meaningUz: string; meaningRu: string; note: string; hskLevel: number; tags: string; createdAt: string; updatedAt: string };

export default function NewNotebookNotePage() {
  const router = useRouter();
  const { language } = useI18n();
  const [note, setNote] = useState<Omit<Note, "id" | "createdAt" | "updatedAt">>({ title: "", chinese: "", pinyin: "", meaningUz: "", meaningRu: "", note: "", hskLevel: 1, tags: "" });

  function save() {
    const id = `note-${Date.now()}`;
    appendLocalItem<Note>("hsk-ai-notes", { ...note, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    router.push(`/notebook/${id}`);
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="rounded-[2.5rem] bg-white/88 p-7 shadow-premium sm:p-10">
          <h1 className="text-5xl font-black text-ink">{language === "ru" ? "Новая заметка" : "Yangi eslatma"}</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["title", language === "ru" ? "Заголовок" : "Sarlavha"],
              ["chinese", language === "ru" ? "Китайский текст" : "Xitoycha matn"],
              ["pinyin", "Pinyin"],
              ["meaningUz", "O‘zbekcha ma’nosi"],
              ["meaningRu", "Русское значение"],
              ["tags", language === "ru" ? "Теги" : "Teglar"]
            ].map(([key, label]) => (
              <label key={key} className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600">
                {label}
                <input value={String(note[key as keyof typeof note])} onChange={(event) => setNote({ ...note, [key]: event.target.value })} className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-ink outline-none" />
              </label>
            ))}
            <label className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600">
              HSK
              <select value={note.hskLevel} onChange={(event) => setNote({ ...note, hskLevel: Number(event.target.value) })} className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-ink outline-none">
                {[1, 2, 3, 4, 5, 6].map((level) => <option key={level} value={level}>HSK {level}</option>)}
              </select>
            </label>
            <label className="rounded-3xl bg-cream p-4 text-sm font-black text-stone-600 sm:col-span-2">
              {language === "ru" ? "Моя заметка" : "Mening eslatmam"}
              <textarea value={note.note} onChange={(event) => setNote({ ...note, note: event.target.value })} className="mt-2 min-h-32 w-full resize-none rounded-2xl bg-white px-4 py-3 text-ink outline-none" />
            </label>
          </div>
          <div className="mt-7 flex gap-3">
            <AppButton onClick={save}><Save className="h-5 w-5" /> {language === "ru" ? "Сохранить" : "Saqlash"}</AppButton>
            <AppButton href="/notebook" variant="secondary">{language === "ru" ? "Назад" : "Orqaga"}</AppButton>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
