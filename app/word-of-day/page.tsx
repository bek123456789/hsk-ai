"use client";

import { CalendarDays, Volume2 } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getVocabularyEntriesByLevel } from "@/data/hsk/contentIndex";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { speakChinese } from "@/utils/speechSynthesis";

function dayNumber() {
  const date = new Date();
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export default function WordOfDayPage() {
  const { language } = useI18n();
  const level = useProgressStore((state) => state.currentLevel);
  const words = getVocabularyEntriesByLevel(level);
  const word = words[dayNumber() % Math.max(words.length, 1)];

  return (
    <ProtectedRoute>
      <PageShell>
        <PageHeader
          eyebrow={language === "ru" ? "Ежедневная практика" : "Kunlik mashq"}
          title={language === "ru" ? "Слово дня" : "Kun so‘zi"}
          description={language === "ru" ? "Каждый день новое слово вашего уровня HSK." : "Har kuni HSK darajangizga mos yangi so‘z."}
          icon={CalendarDays}
        />
        {word ? (
          <article className="mx-auto max-w-3xl rounded-[2.5rem] border border-orange-soft/70 bg-white/90 p-6 text-center shadow-premium sm:p-10">
            <span className="rounded-full bg-orange-soft px-4 py-2 text-sm font-black text-orange-deep">HSK {level}</span>
            <h2 className="mt-7 text-7xl font-black text-ink sm:text-8xl">{word.hanzi}</h2>
            <p className="mt-4 text-2xl font-black text-orange-brand">{word.pinyin}</p>
            <p className="mx-auto mt-5 max-w-xl rounded-3xl bg-cream px-5 py-4 text-xl font-black text-ink">
              {language === "ru" ? word.ru : word.uz}
            </p>
            <div className="mt-6 rounded-[2rem] bg-orange-soft/55 p-5 text-left">
              <p className="text-2xl font-black text-ink">{word.exampleZh}</p>
              <p className="mt-2 font-bold text-orange-deep">{word.examplePinyin}</p>
              <p className="mt-3 font-semibold leading-7 text-stone-700">{language === "ru" ? word.exampleRu : word.exampleUz}</p>
            </div>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <AppButton onClick={() => speakChinese(word.exampleZh)}>
                <Volume2 className="h-5 w-5" /> {language === "ru" ? "Прослушать" : "Eshitish"}
              </AppButton>
              <AppButton href={`/flashcard/${level}`} variant="secondary">
                {language === "ru" ? "Открыть карточки" : "Kartalarni ochish"}
              </AppButton>
            </div>
          </article>
        ) : null}
      </PageShell>
    </ProtectedRoute>
  );
}
