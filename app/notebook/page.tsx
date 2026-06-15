"use client";

import { NotebookTabs, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { readLocalList } from "@/utils/localLearning";
import { useI18n } from "@/utils/i18n";

type Note = { id: string; title: string; chinese: string; pinyin: string; meaningUz: string; meaningRu: string; note: string; hskLevel: number; tags: string; createdAt: string; updatedAt: string };

export default function NotebookPage() {
  const { language } = useI18n();
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => setNotes(readLocalList<Note>("hsk-ai-notes")), []);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return notes.filter((note) => !normalized || [note.title, note.chinese, note.pinyin, note.meaningUz, note.meaningRu, note.tags].join(" ").toLowerCase().includes(normalized));
  }, [notes, query]);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-6xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black text-orange-deep">HanziFlow AI</p>
            <h1 className="mt-2 text-5xl font-black text-ink">{language === "ru" ? "Личный блокнот" : "Shaxsiy daftar"}</h1>
          </div>
          <AppButton href="/notebook/new">{language === "ru" ? "Новая заметка" : "Yangi eslatma"}</AppButton>
        </div>
        <label className="mb-6 flex items-center gap-3 rounded-full bg-white/88 px-5 py-3 shadow-premium">
          <Search className="h-5 w-5 text-orange-brand" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "ru" ? "Поиск заметок" : "Eslatma qidirish"} className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none" />
        </label>
        {filtered.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((note) => (
              <Link key={note.id} href={`/notebook/${note.id}`} className="rounded-[2rem] bg-white/88 p-6 shadow-premium transition hover:-translate-y-1">
                <p className="text-sm font-black text-orange-deep">HSK {note.hskLevel}</p>
                <h2 className="mt-2 text-3xl font-black text-ink">{note.title}</h2>
                <p className="mt-3 text-2xl font-black text-orange-brand">{note.chinese}</p>
                <p className="mt-2 text-sm font-semibold text-stone-500">{note.note}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] bg-white/88 p-10 text-center shadow-premium">
            <NotebookTabs className="mx-auto mb-4 h-12 w-12 text-orange-brand" />
            <h2 className="text-3xl font-black text-ink">{language === "ru" ? "Пока нет заметок" : "Hali eslatma yo‘q"}</h2>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}
