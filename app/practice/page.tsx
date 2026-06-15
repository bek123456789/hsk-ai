"use client";

import { BookOpenCheck, Bot, ClipboardList, GraduationCap, Headphones, Keyboard, MessageCircle, Mic, NotebookTabs, RefreshCcw, Sparkles, Timer, Trophy, WholeWord } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useI18n } from "@/utils/i18n";

export default function PracticeHubPage() {
  const { language } = useI18n();
  const sections = [
    {
      titleUz: "So‘zlar",
      titleRu: "Слова",
      cards: [
        { href: "/flashcard/1", icon: WholeWord, titleUz: "So‘z kartalari", titleRu: "Карточки слов", detailUz: "Yangi so‘zlarni hanzi, pinyin va tarjima bilan mustahkamlang.", detailRu: "Закрепляйте слова через ханьцзы, pinyin и перевод." },
        { href: "/quiz/1", icon: Trophy, titleUz: "Lug‘at testi", titleRu: "Тест слов", detailUz: "Ma’no, pinyin va iyeroglifni aralash savollar bilan tekshiring.", detailRu: "Проверяйте значение, pinyin и иероглифы в смешанных вопросах." },
        { href: "/word-of-day", icon: Sparkles, titleUz: "Kun so‘zi", titleRu: "Слово дня", detailUz: "Har kuni bitta foydali so‘z va misol gap o‘rganing.", detailRu: "Каждый день учите полезное слово и пример." }
      ]
    },
    {
      titleUz: "O‘qish",
      titleRu: "Чтение",
      cards: [
        { href: "/lesson", icon: GraduationCap, titleUz: "HSK dars yo‘li", titleRu: "Путь уроков HSK", detailUz: "So‘zlar, grammatika, o‘qish, tinglash, gapirish va mini testni izchil o‘rganing.", detailRu: "Последовательно изучайте слова, грамматику, чтение, аудирование, говорение и мини-тест." },
        { href: "/reading", icon: BookOpenCheck, titleUz: "O‘qish mashqi", titleRu: "Практика чтения", detailUz: "Mualliflik HSK uslubidagi matnlarni o‘qing, savolga javob bering va tushuntirishni ko‘ring.", detailRu: "Читайте авторские тексты в стиле HSK, отвечайте и смотрите объяснение." },
        { href: "/mini-lessons", icon: WholeWord, titleUz: "Mini darslar", titleRu: "Мини-уроки", detailUz: "3–5 daqiqalik lug‘at, dialog va tezkor test.", detailRu: "Слова, диалог и быстрый тест на 3–5 минут." }
      ]
    },
    {
      titleUz: "Tinglab tushunish",
      titleRu: "Аудирование",
      cards: [
        { href: "/listening", icon: Headphones, titleUz: "Tinglash mashqi", titleRu: "Практика аудирования", detailUz: "Dialog, mini hikoya va e’lonlarni tinglab tushuning.", detailRu: "Понимайте диалоги, мини-истории и объявления на слух." },
        { href: "/listening-lab", icon: Headphones, titleUz: "Tinglash laboratoriyasi", titleRu: "Лаборатория аудирования", detailUz: "Qayta eshitish limiti, matn va pinyin bilan chuqurroq mashq qiling.", detailRu: "Тренируйтесь с лимитом повторов, текстом и pinyin." },
        { href: "/dictation", icon: Keyboard, titleUz: "Diktant", titleRu: "Диктант", detailUz: "Eshitgan so‘z yoki gapni hanzi yoki pinyin bilan yozing.", detailRu: "Записывайте услышанное ханьцзы или pinyin." }
      ]
    },
    {
      titleUz: "Grammatika",
      titleRu: "Грамматика",
      cards: [
        { href: "/grammar-bank", icon: BookOpenCheck, titleUz: "Grammatika bazasi", titleRu: "База грамматики", detailUz: "Qoliplar, misollar va ko‘p uchraydigan xatolar.", detailRu: "Модели, примеры и частые ошибки." },
        { href: "/sentence-builder", icon: Sparkles, titleUz: "Gap tuzish", titleRu: "Составление предложений", detailUz: "So‘zlarni to‘g‘ri xitoycha tartibga qo‘ying.", detailRu: "Расставляйте слова в правильном китайском порядке." },
        { href: "/stroke-order", icon: Sparkles, titleUz: "Iyeroglif yozish", titleRu: "Написание иероглифов", detailUz: "Belgilarni yozib, chizish tartibini mashq qiling.", detailRu: "Практикуйте письмо и порядок черт." }
      ]
    },
    {
      titleUz: "Gapirish",
      titleRu: "Говорение",
      cards: [
        { href: "/speaking", icon: Mic, titleUz: "Gapirish mashqi", titleRu: "Практика говорения", detailUz: "So‘z talaffuzi, matn mazmuni, dialog va kundalik vaziyatlarni mashq qiling.", detailRu: "Тренируйте произношение, пересказ, диалог и ежедневные ситуации." },
        { href: "/roleplay", icon: MessageCircle, titleUz: "AI rol o‘yini", titleRu: "AI ролевая практика", detailUz: "Restoran, do‘kon va maktabdagi vaziyatlarni xitoycha mashq qiling.", detailRu: "Практикуйте ресторан, магазин и школу на китайском." },
        { href: "/conversation", icon: MessageCircle, titleUz: "Suhbat mashqi", titleRu: "Практика диалога", detailUz: "HSK darajangizga mos qisqa suhbatlarni davom ettiring.", detailRu: "Продолжайте короткие диалоги по уровню HSK." }
      ]
    },
    {
      titleUz: "Imtihon",
      titleRu: "Экзамен",
      cards: [
        { href: "/exam-simulator", icon: Trophy, titleUz: "Imtihon simulyatori", titleRu: "Симулятор экзамена", detailUz: "Tinglash, o‘qish, lug‘at va grammatika bo‘limlarini vaqt bilan bajaring.", detailRu: "Проходите аудирование, чтение, слова и грамматику с таймером." },
        { href: "/challenges", icon: Timer, titleUz: "Kunlik sinovlar", titleRu: "Челленджи", detailUz: "Tezlik, tinglash va lug‘at bo‘yicha kunlik sinovlar.", detailRu: "Дневные задания на скорость, аудирование и слова." },
        { href: "/mistake-notebook", icon: NotebookTabs, titleUz: "Xatolar daftari", titleRu: "Тетрадь ошибок", detailUz: "Test, imtihon, gapirish va diktant xatolarini qayta mashq qiling.", detailRu: "Повторяйте ошибки из тестов, экзамена, говорения и диктанта." },
        { href: "/daily-plan", icon: ClipboardList, titleUz: "Bugungi reja", titleRu: "План на сегодня", detailUz: "Shaxsiy vazifalarni ketma-ket bajaring.", detailRu: "Выполняйте персональные задания по порядку." },
        { href: "/review", icon: RefreshCcw, titleUz: "Aqlli takrorlash", titleRu: "Умное повторение", detailUz: "Zaif so‘zlar va xatolarni SRS orqali takrorlang.", detailRu: "Повторяйте слабые слова и ошибки по SRS." },
        { href: "/ai-explainer", icon: Bot, titleUz: "AI tushuntiruvchi", titleRu: "AI-объяснение", detailUz: "So‘z, gap yoki grammatikani HSK darajangizga mos tushuntiring.", detailRu: "Разбирайте слова, предложения и грамматику по уровню HSK." }
      ]
    }
  ];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Практика" : "Mashqlar"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Выберите навык и продолжайте обучение HSK 1–6." : "Ko‘nikmani tanlang va HSK 1–6 bo‘yicha o‘qishni davom ettiring."}
          </p>
        </div>
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.titleUz}>
              <h2 className="mb-4 text-3xl font-black text-ink">{language === "ru" ? section.titleRu : section.titleUz}</h2>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {section.cards.map((card) => (
                  <Card key={card.href} className="p-6">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft">
                      <card.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-black text-ink">{language === "ru" ? card.titleRu : card.titleUz}</h3>
                    <p className="mt-3 min-h-20 text-sm font-semibold leading-6 text-stone-500">{language === "ru" ? card.detailRu : card.detailUz}</p>
                    <div className="mt-5">
                      <AppButton href={card.href} variant="secondary" className="w-full">{language === "ru" ? "Начать" : "Boshlash"}</AppButton>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </ProtectedRoute>
  );
}
