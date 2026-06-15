"use client";

import { Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { readLocalList } from "@/utils/localLearning";
import { useI18n } from "@/utils/i18n";

type Note = { id: string; title: string; chinese: string; pinyin: string; meaningUz: string; meaningRu: string; note: string; hskLevel: number; tags: string; createdAt: string; updatedAt: string };

export default function NotebookNotePage() {
  const router = useRouter();
  const params = useParams();
  const { language } = useI18n();
  const noteId = Array.isArray(params.noteId) ? params.noteId[0] : params.noteId;
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    setNote(readLocalList<Note>("hsk-ai-notes").find((item) => item.id === noteId) ?? null);
  }, [noteId]);

  function remove() {
    const next = readLocalList<Note>("hsk-ai-notes").filter((item) => item.id !== noteId);
    window.localStorage.setItem("hsk-ai-notes", JSON.stringify(next));
    router.push("/notebook");
  }

  if (!note) {
    return (
      <ProtectedRoute>
        <section className="mx-auto max-w-4xl px-5 py-12 text-center"><AppButton href="/notebook">{language === "ru" ? "Личный блокнот" : "Shaxsiy daftar"}</AppButton></section>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="rounded-[2.5rem] bg-white/88 p-7 shadow-premium sm:p-10">
          <p className="text-sm font-black text-orange-deep">HSK {note.hskLevel}</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{note.title}</h1>
          <p className="mt-5 text-5xl font-black text-orange-brand">{note.chinese}</p>
          <p className="mt-2 text-xl font-black text-stone-600">{note.pinyin}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-cream p-5 shadow-soft"><p className="font-black text-ink">{note.meaningUz}</p></div>
            <div className="rounded-3xl bg-cream p-5 shadow-soft"><p className="font-black text-ink">{note.meaningRu}</p></div>
          </div>
          <p className="mt-6 rounded-[2rem] bg-cream p-6 text-base font-semibold leading-8 text-stone-700 shadow-soft">{note.note}</p>
          <div className="mt-7 flex gap-3">
            <AppButton href="/notebook" variant="secondary">{language === "ru" ? "Назад" : "Orqaga"}</AppButton>
            <button onClick={remove} className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-5 py-3 text-sm font-black text-rose-700 shadow-soft"><Trash2 className="h-5 w-5" /> {language === "ru" ? "Удалить" : "O‘chirish"}</button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
