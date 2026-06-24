"use client";

import { BookOpenCheck, Bot, Brain, ClipboardList, Flame, GraduationCap, Headphones, Keyboard, MessageCircle, Mic, NotebookTabs, RefreshCw, RefreshCcw, Sparkles, Timer, Trophy, WholeWord } from "lucide-react";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { AppLanguage } from "@/types";
import { useI18n } from "@/utils/i18n";

type LocalizedCardText = {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  detailUz: string;
  detailRu: string;
  detailEn: string;
};

function localizedTitle(item: { titleUz: string; titleRu: string; titleEn: string }, language: AppLanguage) {
  if (language === "ru") return item.titleRu;
  if (language === "en") return item.titleEn;
  return item.titleUz;
}

function localizedDetail(item: LocalizedCardText, language: AppLanguage) {
  if (language === "ru") return item.detailRu;
  if (language === "en") return item.detailEn;
  return item.detailUz;
}

export default function PracticeHubPage() {
  const { language } = useI18n();
  const sections = [
    {
      titleUz: "AI HSK Ustoz",
      titleRu: "AI HSK Ustoz",
      titleEn: "AI HSK Ustoz",
      cards: [
        { href: "/mastery", icon: Bot, titleUz: "Shaxsiy HSK Yo‘l", titleRu: "Shaxsiy HSK Yo‘l", titleEn: "Shaxsiy HSK Yo‘l", detailUz: "Zaif joylaringizni topib, bugungi eng foydali qadamni ko‘ring.", detailRu: "Zaif joylaringizni topib, bugungi eng foydali qadamni ko‘ring.", detailEn: "Zaif joylaringizni topib, bugungi eng foydali qadamni ko‘ring." },
        { href: "/mastery", icon: RefreshCcw, titleUz: "Xatodan o‘rganish", titleRu: "Xatodan o‘rganish", titleEn: "Xatodan o‘rganish", detailUz: "Xato sababini ko‘ring va shu xatoni tuzatish uchun 3 ta drill oling.", detailRu: "Xato sababini ko‘ring va shu xatoni tuzatish uchun 3 ta drill oling.", detailEn: "Xato sababini ko‘ring va shu xatoni tuzatish uchun 3 ta drill oling." }
      ]
    },
    {
      titleUz: "O‘rganish",
      titleRu: "O‘rganish",
      titleEn: "O‘rganish",
      cards: [
        { href: "/topics", icon: BookOpenCheck, titleUz: "Mavzular", titleRu: "Mavzular", titleEn: "Mavzular", detailUz: "Tanishuv, oila, maktab, ovqat, do‘kon va boshqa HSK mavzularini paket qilib o‘rganing.", detailRu: "Tanishuv, oila, maktab, ovqat, do‘kon va boshqa HSK mavzularini paket qilib o‘rganing.", detailEn: "Tanishuv, oila, maktab, ovqat, do‘kon va boshqa HSK mavzularini paket qilib o‘rganing." },
        { href: "/stories", icon: BookOpenCheck, titleUz: "Hikoyalar", titleRu: "Hikoyalar", titleEn: "Hikoyalar", detailUz: "HSK darajangizga mos qisqa hikoyalarni audio, pinyin va savollar bilan o‘qing.", detailRu: "HSK darajangizga mos qisqa hikoyalarni audio, pinyin va savollar bilan o‘qing.", detailEn: "HSK darajangizga mos qisqa hikoyalarni audio, pinyin va savollar bilan o‘qing." },
        { href: "/word-family", icon: NotebookTabs, titleUz: "So‘z oilasi", titleRu: "So‘z oilasi", titleEn: "So‘z oilasi", detailUz: "Bitta hanzi atrofidagi o‘xshash so‘zlar, misollar va ma’nolarni ko‘ring.", detailRu: "Bitta hanzi atrofidagi o‘xshash so‘zlar, misollar va ma’nolarni ko‘ring.", detailEn: "Bitta hanzi atrofidagi o‘xshash so‘zlar, misollar va ma’nolarni ko‘ring." },
        { href: "/grammar-playground", icon: Brain, titleUz: "Grammatika laboratoriyasi", titleRu: "Grammatika laboratoriyasi", titleEn: "Grammatika laboratoriyasi", detailUz: "Gapni savolga yoki inkor gapga aylantirib, xitoycha struktura bilan ishlang.", detailRu: "Gapni savolga yoki inkor gapga aylantirib, xitoycha struktura bilan ishlang.", detailEn: "Gapni savolga yoki inkor gapga aylantirib, xitoycha struktura bilan ishlang." }
      ]
    },
    {
      titleUz: "Mashq",
      titleRu: "Mashq",
      titleEn: "Mashq",
      cards: [
        { href: "/pronunciation-coach", icon: Mic, titleUz: "Talaffuz murabbiyi", titleRu: "Talaffuz murabbiyi", titleEn: "Talaffuz murabbiyi", detailUz: "Xitoycha gapni eshiting, takrorlang va yetishmagan so‘zlar bo‘yicha feedback oling.", detailRu: "Xitoycha gapni eshiting, takrorlang va yetishmagan so‘zlar bo‘yicha feedback oling.", detailEn: "Xitoycha gapni eshiting, takrorlang va yetishmagan so‘zlar bo‘yicha feedback oling." },
        { href: "/tone-battle", icon: Headphones, titleUz: "Ton jangi", titleRu: "Ton jangi", titleEn: "Ton jangi", detailUz: "O‘xshash pinyin tonlarini tez farqlang va xato tonlarni qayta mashq qiling.", detailRu: "O‘xshash pinyin tonlarini tez farqlang va xato tonlarni qayta mashq qiling.", detailEn: "O‘xshash pinyin tonlarini tez farqlang va xato tonlarni qayta mashq qiling." },
        { href: "/reading-trainer", icon: BookOpenCheck, titleUz: "O‘qish murabbiyi", titleRu: "O‘qish murabbiyi", titleEn: "O‘qish murabbiyi", detailUz: "Matndan kalit so‘z, dalil gap va javob clue sini topishni mashq qiling.", detailRu: "Matndan kalit so‘z, dalil gap va javob clue sini topishni mashq qiling.", detailEn: "Matndan kalit so‘z, dalil gap va javob clue sini topishni mashq qiling." },
        { href: "/offline-pack", icon: ClipboardList, titleUz: "Offline mashq paketi", titleRu: "Offline mashq paketi", titleEn: "Offline mashq paketi", detailUz: "Bugungi so‘z, grammar, listening, reading va quiz paketini saqlang.", detailRu: "Bugungi so‘z, grammar, listening, reading va quiz paketini saqlang.", detailEn: "Bugungi so‘z, grammar, listening, reading va quiz paketini saqlang." }
      ]
    },
    {
      titleUz: "Xatolar",
      titleRu: "Xatolar",
      titleEn: "Xatolar",
      cards: [
        { href: "/weakness-map", icon: Trophy, titleUz: "Zaif joylar xaritasi", titleRu: "Zaif joylar xaritasi", titleEn: "Zaif joylar xaritasi", detailUz: "Vocabulary, pinyin, tones, grammar va ko‘nikmalar bo‘yicha heatmap ko‘ring.", detailRu: "Vocabulary, pinyin, tones, grammar va ko‘nikmalar bo‘yicha heatmap ko‘ring.", detailEn: "Vocabulary, pinyin, tones, grammar va ko‘nikmalar bo‘yicha heatmap ko‘ring." },
        { href: "/error-replay", icon: RefreshCcw, titleUz: "Xatolar replay", titleRu: "Xatolar replay", titleEn: "Xatolar replay", detailUz: "So‘nggi xatolarni sababiga ko‘ra replay darsga aylantiring.", detailRu: "So‘nggi xatolarni sababiga ko‘ra replay darsga aylantiring.", detailEn: "So‘nggi xatolarni sababiga ko‘ra replay darsga aylantiring." }
      ]
    },
    {
      titleUz: "Maqsad va progress",
      titleRu: "Maqsad va progress",
      titleEn: "Maqsad va progress",
      cards: [
        { href: "/goals", icon: Trophy, titleUz: "Maqsadlar", titleRu: "Maqsadlar", titleEn: "Maqsadlar", detailUz: "HSK maqsadi, muddat va bugungi kerakli progressni kuzating.", detailRu: "HSK maqsadi, muddat va bugungi kerakli progressni kuzating.", detailEn: "HSK maqsadi, muddat va bugungi kerakli progressni kuzating." },
        { href: "/homework", icon: ClipboardList, titleUz: "Bugungi uy vazifasi", titleRu: "Bugungi uy vazifasi", titleEn: "Bugungi uy vazifasi", detailUz: "Zaif joylar va HSK darajangizga mos 15 daqiqalik reja.", detailRu: "Zaif joylar va HSK darajangizga mos 15 daqiqalik reja.", detailEn: "Zaif joylar va HSK darajangizga mos 15 daqiqalik reja." },
        { href: "/mentor-report", icon: GraduationCap, titleUz: "Mentor hisoboti", titleRu: "Mentor hisoboti", titleEn: "Mentor hisoboti", detailUz: "Ota-ona yoki ustoz uchun progress va yordam kerak bo‘lgan joylar.", detailRu: "Ota-ona yoki ustoz uchun progress va yordam kerak bo‘lgan joylar.", detailEn: "Ota-ona yoki ustoz uchun progress va yordam kerak bo‘lgan joylar." }
      ]
    },
    {
      titleUz: "Challenge",
      titleRu: "Challenge",
      titleEn: "Challenge",
      cards: [
        { href: "/boss-battle", icon: Flame, titleUz: "HSK Boss Battle", titleRu: "HSK Boss Battle", titleEn: "HSK Boss Battle", detailUz: "Aralash savollar bilan boss HPsini kamaytiring. Badge beradi, exam unlock emas.", detailRu: "Aralash savollar bilan boss HPsini kamaytiring. Badge beradi, exam unlock emas.", detailEn: "Aralash savollar bilan boss HPsini kamaytiring. Badge beradi, exam unlock emas." }
      ]
    },
    {
      titleUz: "So‘zlar",
      titleRu: "Слова",
      titleEn: "Words",
      cards: [
        { href: "/flashcard/1", icon: WholeWord, titleUz: "So‘z kartalari", titleRu: "Карточки слов", titleEn: "Flashcards", detailUz: "Yangi so‘zlarni hanzi, pinyin va tarjima bilan mustahkamlang.", detailRu: "Закрепляйте слова через ханьцзы, pinyin и перевод.", detailEn: "Review new words with hanzi, pinyin, and meaning." },
        { href: "/hanzi-builder", icon: Sparkles, titleUz: "Ieroglif tahlili", titleRu: "Иероглифы", titleEn: "Hanzi Builder", detailUz: "Hanzi, radikal, pinyin, misol va eslab qolish usulini ko‘ring.", detailRu: "Разбирайте ханьцзы, ключ, pinyin, пример и способ запомнить.", detailEn: "Break down hanzi, radicals, pinyin, examples, and memory tips." },
        { href: "/quiz/1", icon: Trophy, titleUz: "Lug‘at testi", titleRu: "Тест слов", titleEn: "Vocabulary Quiz", detailUz: "Ma’no, pinyin va iyeroglifni aralash savollar bilan tekshiring.", detailRu: "Проверяйте значение, pinyin и иероглифы в смешанных вопросах.", detailEn: "Check meanings, pinyin, and characters with mixed questions." },
        { href: "/word-of-day", icon: Sparkles, titleUz: "Kun so‘zi", titleRu: "Слово дня", titleEn: "Word of the Day", detailUz: "Har kuni bitta foydali so‘z va misol gap o‘rganing.", detailRu: "Каждый день учите полезное слово и пример.", detailEn: "Learn one useful word and example sentence each day." }
      ]
    },
    {
      titleUz: "O‘qish",
      titleRu: "Чтение",
      titleEn: "Reading",
      cards: [
        { href: "/lesson", icon: GraduationCap, titleUz: "HSK dars yo‘li", titleRu: "Путь HSK", titleEn: "HSK Lesson Path", detailUz: "So‘zlar, grammatika, o‘qish, tinglash, gapirish va mini testni izchil o‘rganing.", detailRu: "Последовательно изучайте слова, грамматику, чтение, аудирование, говорение и мини-тест.", detailEn: "Study vocabulary, grammar, reading, listening, speaking, and mini-tests step by step." },
        { href: "/reading", icon: BookOpenCheck, titleUz: "O‘qish mashqi", titleRu: "Чтение", titleEn: "Reading Practice", detailUz: "Mualliflik HSK uslubidagi matnlarni o‘qing, savolga javob bering va tushuntirishni ko‘ring.", detailRu: "Читайте авторские тексты в стиле HSK, отвечайте и смотрите объяснение.", detailEn: "Read HSK-style passages, answer questions, and review explanations." },
        { href: "/mini-lessons", icon: WholeWord, titleUz: "Mini darslar", titleRu: "Мини-уроки", titleEn: "Mini Lessons", detailUz: "3–5 daqiqalik lug‘at, dialog va tezkor test.", detailRu: "Слова, диалог и быстрый тест на 3–5 минут.", detailEn: "Short vocabulary, dialogue, and quiz sessions in 3–5 minutes." }
      ]
    },
    {
      titleUz: "Tinglab tushunish",
      titleRu: "Аудирование",
      titleEn: "Listening",
      cards: [
        { href: "/listening", icon: Headphones, titleUz: "Tinglash mashqi", titleRu: "Аудирование", titleEn: "Listening Practice", detailUz: "Dialog, mini hikoya va e’lonlarni tinglab tushuning.", detailRu: "Понимайте диалоги, мини-истории и объявления на слух.", detailEn: "Understand dialogues, short stories, and announcements by ear." },
        { href: "/tone-trainer", icon: Headphones, titleUz: "Ton mashqi", titleRu: "Тоны", titleEn: "Tone Trainer", detailUz: "Eshitib tonni tanlang va pinyin belgilarini mustahkamlang.", detailRu: "Слушайте и выбирайте тон, закрепляя знаки pinyin.", detailEn: "Listen, choose the tone, and strengthen pinyin tone marks." },
        { href: "/listening-lab", icon: Headphones, titleUz: "Tinglash laboratoriyasi", titleRu: "Лаборатория", titleEn: "Listening Lab", detailUz: "Qayta eshitish limiti, matn va pinyin bilan chuqurroq mashq qiling.", detailRu: "Тренируйтесь с лимитом повторов, текстом и pinyin.", detailEn: "Practice deeply with replay limits, transcript, and pinyin." },
        { href: "/dictation", icon: Keyboard, titleUz: "Diktant", titleRu: "Диктант", titleEn: "Dictation", detailUz: "Eshitgan so‘z yoki gapni hanzi yoki pinyin bilan yozing.", detailRu: "Записывайте услышанное ханьцзы или pinyin.", detailEn: "Write the word or sentence you hear in hanzi or pinyin." }
      ]
    },
    {
      titleUz: "Grammatika",
      titleRu: "Грамматика",
      titleEn: "Grammar",
      cards: [
        { href: "/grammar-bank", icon: BookOpenCheck, titleUz: "Grammatika bazasi", titleRu: "Грамматика", titleEn: "Grammar Bank", detailUz: "Qoliplar, misollar va ko‘p uchraydigan xatolar.", detailRu: "Модели, примеры и частые ошибки.", detailEn: "Patterns, examples, and common mistakes." },
        { href: "/sentence-builder", icon: Sparkles, titleUz: "Gap tuzish", titleRu: "Предложения", titleEn: "Sentence Builder", detailUz: "So‘zlarni to‘g‘ri xitoycha tartibga qo‘ying.", detailRu: "Расставляйте слова в правильном китайском порядке.", detailEn: "Arrange words in the correct Chinese order." },
        { href: "/stroke-order", icon: Sparkles, titleUz: "Iyeroglif yozish", titleRu: "Письмо ханьцзы", titleEn: "Hanzi Writing", detailUz: "Belgilarni yozib, chizish tartibini mashq qiling.", detailRu: "Практикуйте письмо и порядок черт.", detailEn: "Practice writing characters and stroke order." }
      ]
    },
    {
      titleUz: "Gapirish",
      titleRu: "Говорение",
      titleEn: "Speaking",
      cards: [
        { href: "/speaking", icon: Mic, titleUz: "Gapirish mashqi", titleRu: "Говорение", titleEn: "Speaking Practice", detailUz: "So‘z talaffuzi, matn mazmuni, dialog va kundalik vaziyatlarni mashq qiling.", detailRu: "Тренируйте произношение, пересказ, диалог и ежедневные ситуации.", detailEn: "Practice pronunciation, retelling, dialogues, and daily situations." },
        { href: "/shadowing", icon: RefreshCw, titleUz: "Ortimizdan takrorlang", titleRu: "Shadowing", titleEn: "Shadowing", detailUz: "Gapni eshiting, takrorlang va yetishmagan so‘zlarni ko‘ring.", detailRu: "Слушайте фразу, повторяйте и смотрите пропущенные слова.", detailEn: "Listen to a sentence, repeat it, and see missing words." },
        { href: "/roleplay", icon: MessageCircle, titleUz: "AI rol o‘yini", titleRu: "Рольплей", titleEn: "Roleplay", detailUz: "Restoran, do‘kon va maktabdagi vaziyatlarni xitoycha mashq qiling.", detailRu: "Практикуйте ресторан, магазин и школу на китайском.", detailEn: "Practice restaurant, shop, and school situations in Chinese." },
        { href: "/conversation", icon: MessageCircle, titleUz: "Suhbat mashqi", titleRu: "Диалоги", titleEn: "Dialogue Practice", detailUz: "HSK darajangizga mos qisqa suhbatlarni davom ettiring.", detailRu: "Продолжайте короткие диалоги по уровню HSK.", detailEn: "Continue short dialogues matched to your HSK level." }
      ]
    },
    {
      titleUz: "Imtihon",
      titleRu: "Экзамен",
      titleEn: "Exam",
      cards: [
        { href: "/exam-simulator", icon: Trophy, titleUz: "Imtihon simulyatori", titleRu: "Симулятор", titleEn: "Exam Simulator", detailUz: "Tinglash, o‘qish, lug‘at va grammatika bo‘limlarini vaqt bilan bajaring.", detailRu: "Проходите аудирование, чтение, слова и грамматику с таймером.", detailEn: "Complete listening, reading, vocabulary, and grammar sections with a timer." },
        { href: "/challenges", icon: Timer, titleUz: "Kunlik sinovlar", titleRu: "Челленджи", titleEn: "Daily Challenges", detailUz: "Tezlik, tinglash va lug‘at bo‘yicha kunlik sinovlar.", detailRu: "Дневные задания на скорость, аудирование и слова.", detailEn: "Daily speed, listening, and vocabulary challenges." },
        { href: "/mistake-notebook", icon: NotebookTabs, titleUz: "Xatolar daftari", titleRu: "Ошибки", titleEn: "Mistake Notebook", detailUz: "Test, imtihon, gapirish va diktant xatolarini qayta mashq qiling.", detailRu: "Повторяйте ошибки из тестов, экзамена, говорения и диктанта.", detailEn: "Review mistakes from tests, exams, speaking, and dictation." },
        { href: "/mistakes/loop", icon: RefreshCcw, titleUz: "Xatolarni tuzatish", titleRu: "Исправление", titleEn: "Mistake Loop", detailUz: "Xatoni 2 marta to‘g‘ri javob berguncha mashq qiling.", detailRu: "Повторяйте ошибку, пока не ответите правильно 2 раза.", detailEn: "Practice a mistake until you answer correctly twice." },
        { href: "/daily-plan", icon: ClipboardList, titleUz: "Bugungi reja", titleRu: "План на сегодня", titleEn: "Daily Plan", detailUz: "Shaxsiy vazifalarni ketma-ket bajaring.", detailRu: "Выполняйте персональные задания по порядку.", detailEn: "Complete your personal tasks step by step." },
        { href: "/sprint", icon: Flame, titleUz: "7 kunlik HSK Sprint", titleRu: "HSK Sprint", titleEn: "HSK Sprint", detailUz: "Qisqa muddatli dars, takrorlash, listening va speaking rejasi.", detailRu: "Короткий план уроков, повторения, аудирования и говорения.", detailEn: "A short plan for lessons, review, listening, and speaking." },
        { href: "/study-plan", icon: ClipboardList, titleUz: "Shaxsiy o‘quv reja", titleRu: "Личный план", titleEn: "Study Plan", detailUz: "Vaqt, daraja va zaif ko‘nikmaga mos haftalik reja yarating.", detailRu: "Создайте недельный план по времени, уровню и слабому навыку.", detailEn: "Create a weekly plan based on time, level, and weak skills." },
        { href: "/review", icon: RefreshCcw, titleUz: "Aqlli takrorlash", titleRu: "Умное повторение", titleEn: "Smart Review", detailUz: "Zaif so‘zlar va xatolarni SRS orqali takrorlang.", detailRu: "Повторяйте слабые слова и ошибки по SRS.", detailEn: "Review weak words and mistakes through spaced repetition." },
        { href: "/ai-explainer", icon: Bot, titleUz: "AI tushuntiruvchi", titleRu: "AI-объяснение", titleEn: "AI Explainer", detailUz: "So‘z, gap yoki grammatikani HSK darajangizga mos tushuntiring.", detailRu: "Разбирайте слова, предложения и грамматику по уровню HSK.", detailEn: "Explain words, sentences, and grammar at your HSK level." }
      ]
    }
  ];

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">HanziFlow AI</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Практика" : language === "en" ? "Practice" : "Mashqlar"}</h1>
          <p className="mt-4 text-lg font-semibold leading-8 text-stone-600">
            {language === "ru" ? "Выберите навык и продолжайте обучение HSK 1–6." : language === "en" ? "Choose a skill and continue learning through HSK 1–6." : "Ko‘nikmani tanlang va HSK 1–6 bo‘yicha o‘qishni davom ettiring."}
          </p>
        </div>
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.titleUz}>
              <h2 className="mb-4 break-words text-2xl font-black leading-tight text-ink sm:text-3xl">{localizedTitle(section, language)}</h2>
              <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {section.cards.map((card) => (
                  <Card key={card.href} className="flex min-h-[17rem] min-w-0 flex-col p-5 sm:p-6">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep shadow-soft">
                      <card.icon className="h-7 w-7" />
                    </div>
                    <h3 className="min-w-0 break-words text-xl font-black leading-tight text-ink sm:text-2xl">{localizedTitle(card, language)}</h3>
                    <p className="mt-3 min-h-20 min-w-0 break-words text-sm font-semibold leading-6 text-stone-500">{localizedDetail(card, language)}</p>
                    <div className="mt-auto pt-5">
                      <AppButton href={card.href} variant="secondary" className="w-full whitespace-normal text-center">{language === "ru" ? "Начать" : language === "en" ? "Start" : "Boshlash"}</AppButton>
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
