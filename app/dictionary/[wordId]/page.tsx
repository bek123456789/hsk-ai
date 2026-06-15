"use client";

import { ArrowLeft, BookOpen, Mic, Star, Volume2 } from "lucide-react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ReportContentButton } from "@/components/ReportContentButton";
import { hskWords } from "@/data/hskWords";
import { useProgressStore } from "@/store/progressStore";
import { getWordExample, getWordTranslation, useI18n } from "@/utils/i18n";
import { speakChinese } from "@/utils/speechSynthesis";

export default function DictionaryWordPage() {
  const params = useParams();
  const wordId = Array.isArray(params.wordId) ? params.wordId[0] : params.wordId;
  const word = hskWords.find((item) => item.id === wordId) ?? hskWords[0];
  const { language } = useI18n();
  const markWeak = useProgressStore((state) => state.markWeak);
  const markKnown = useProgressStore((state) => state.markKnown);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-6">
          <AppButton href="/dictionary" variant="ghost" className="px-4"><ArrowLeft className="h-5 w-5" /> {language === "ru" ? "Словарь" : "Lug‘at"}</AppButton>
        </div>
        <div className="rounded-[2.5rem] border border-white/70 bg-white/88 p-7 shadow-premium backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-black text-orange-deep">HSK {word.hskLevel}</p>
              <h1 className="mt-2 text-8xl font-black text-ink">{word.chinese}</h1>
              <p className="mt-4 text-3xl font-black text-orange-brand">{word.pinyin}</p>
              <p className="mt-4 text-2xl font-black text-stone-700">{getWordTranslation(word, language)}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-72">
              <button onClick={() => speakChinese(word.chinese)} className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-5 py-3 text-sm font-black text-ink shadow-soft"><Volume2 className="h-5 w-5 text-orange-brand" /> {language === "ru" ? "Прослушать" : "Eshitish"}</button>
              <AppButton href={`/flashcard/${word.hskLevel}`} variant="secondary"><BookOpen className="h-5 w-5" /> {language === "ru" ? "Карточки" : "Kartochka"}</AppButton>
              <AppButton href={`/speaking/${word.hskLevel}?word=${word.id}`} variant="primary"><Mic className="h-5 w-5" /> {language === "ru" ? "Произношение" : "Gapirish"}</AppButton>
              <button onClick={() => markKnown(word.id)} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-soft px-5 py-3 text-sm font-black text-orange-deep shadow-soft"><Star className="h-5 w-5" /> {language === "ru" ? "Освоено" : "O‘zlashtirilgan"}</button>
            </div>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-cream p-6 shadow-soft">
              <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Пример" : "Misol"}</p>
              <p className="mt-3 text-3xl font-black text-ink">{word.exampleChinese}</p>
              <p className="mt-3 text-sm font-bold leading-6 text-stone-600">{getWordExample(word, language)}</p>
            </div>
            <div className="rounded-[2rem] bg-white/80 p-6 shadow-soft">
              <p className="text-sm font-black text-orange-deep">{language === "ru" ? "Связанные действия" : "Bog‘liq mashqlar"}</p>
              <div className="mt-4 flex flex-col gap-3">
                <button onClick={() => markWeak(word.id)} className="rounded-full bg-cream px-5 py-3 text-sm font-black text-stone-700 shadow-soft">{language === "ru" ? "Добавить в повторение" : "Takrorlashga qo‘shish"}</button>
                <ReportContentButton itemId={word.id} itemType="dictionary-word" hskLevel={word.hskLevel} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
