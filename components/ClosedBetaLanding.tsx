"use client";

import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  Headphones,
  Keyboard,
  LineChart,
  LockKeyhole,
  MessageCircle,
  Mic,
  NotebookPen,
  PenLine,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Volume2
} from "lucide-react";
import Link from "next/link";
import { AppButton } from "@/components/AppButton";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";

type Localized = {
  uz: string;
  ru: string;
};

type CardItem = {
  icon: typeof BookOpen;
  title: Localized;
  detail: Localized;
  href?: string;
};

function text(value: Localized, language: "uz" | "ru") {
  return value[language];
}

const problems: CardItem[] = [
  {
    icon: Search,
    title: { uz: "Ierogliflarni eslab qolish qiyin", ru: "Трудно запоминать иероглифы" },
    detail: { uz: "Hanzi shakli, ma’nosi va pinyin bir vaqtda mustahkamlanishi kerak.", ru: "Нужно одновременно закреплять форму, смысл и pinyin." }
  },
  {
    icon: Volume2,
    title: { uz: "Tonlarni farqlash qiyin", ru: "Трудно различать тоны" },
    detail: { uz: "Ohang o‘zgarsa, so‘z ma’nosi ham o‘zgarishi mumkin.", ru: "Если тон меняется, значение слова тоже может измениться." }
  },
  {
    icon: Keyboard,
    title: { uz: "Gap tartibi boshqacha", ru: "Порядок слов другой" },
    detail: { uz: "Xitoycha gaplar qisqa, lekin tartib va yuklamalar muhim.", ru: "Китайские фразы короткие, но порядок и частицы важны." }
  },
  {
    icon: MessageCircle,
    title: { uz: "Speaking va writingda feedback kerak", ru: "Нужна обратная связь в speaking и writing" },
    detail: { uz: "Javob to‘g‘rimi, qaysi joyi yetishmayapti — buni tez bilish kerak.", ru: "Важно быстро понять, верен ли ответ и чего не хватает." }
  }
];

const solutions: CardItem[] = [
  {
    icon: Search,
    title: { uz: "Hanzi Builder", ru: "Hanzi Builder" },
    detail: { uz: "Ieroglifni pinyin, ma’no, misol va eslab qolish usuli bilan tahlil qiladi.", ru: "Разбирает иероглиф через pinyin, смысл, пример и способ запомнить." },
    href: "/hanzi-builder"
  },
  {
    icon: Volume2,
    title: { uz: "Ton mashqi", ru: "Тренировка тонов" },
    detail: { uz: "Eshitib tonni tanlaysiz va ohanglarni farqlashni o‘rganasiz.", ru: "Слушаете и выбираете тон, тренируя различение звучания." },
    href: "/tone-trainer"
  },
  {
    icon: Keyboard,
    title: { uz: "Gap tuzish", ru: "Составление предложений" },
    detail: { uz: "So‘zlarni to‘g‘ri tartibga qo‘yib, xitoycha gap tuzilishini tushunasiz.", ru: "Ставите слова в правильном порядке и понимаете структуру фразы." },
    href: "/sentence-builder"
  },
  {
    icon: RotateCcw,
    title: { uz: "Aqlli takrorlash", ru: "Умное повторение" },
    detail: { uz: "Zaif so‘zlar tezroq qaytadi, o‘zlashtirilganlari esa kamroq chiqadi.", ru: "Слабые слова возвращаются чаще, освоенные — реже." },
    href: "/review"
  },
  {
    icon: Brain,
    title: { uz: "AI Study Coach", ru: "AI Study Coach" },
    detail: { uz: "Rivojlanishingizga qarab keyingi real qadamni tavsiya qiladi.", ru: "Советует следующий реальный шаг на основе прогресса." },
    href: "/ai-tutor"
  },
  {
    icon: LineChart,
    title: { uz: "Imtihonga tayyorlik", ru: "Готовность к экзамену" },
    detail: { uz: "Dars, takrorlash va imtihon natijalari asosida zaif ko‘nikmalarni ko‘rsatadi.", ru: "Показывает слабые навыки по урокам, повторению и экзаменам." },
    href: "/exam"
  }
];

const flow = [
  { uz: "Onboarding", ru: "Onboarding" },
  { uz: "HSK 1 darsini boshlash", ru: "Начать урок HSK 1" },
  { uz: "Vocabulary + Grammar", ru: "Vocabulary + Grammar" },
  { uz: "Reading + Listening", ru: "Reading + Listening" },
  { uz: "Speaking + Writing", ru: "Speaking + Writing" },
  { uz: "Mini test", ru: "Мини-тест" },
  { uz: "Exam 80%", ru: "Экзамен 80%" },
  { uz: "Keyingi HSK ochiladi", ru: "Открывается следующий HSK" }
];

const tools: CardItem[] = [
  { icon: RotateCcw, title: { uz: "Aqlli takrorlash", ru: "Умное повторение" }, detail: { uz: "Bugungi so‘zlar", ru: "Слова на сегодня" }, href: "/review" },
  { icon: Search, title: { uz: "Ieroglif tahlili", ru: "Разбор иероглифа" }, detail: { uz: "Hanzi va pinyin", ru: "Hanzi и pinyin" }, href: "/hanzi-builder" },
  { icon: Volume2, title: { uz: "Ton mashqi", ru: "Тоны" }, detail: { uz: "Eshitib tanlash", ru: "Слушать и выбрать" }, href: "/tone-trainer" },
  { icon: Headphones, title: { uz: "Shadowing", ru: "Shadowing" }, detail: { uz: "Eshiting va takrorlang", ru: "Слушайте и повторяйте" }, href: "/shadowing" },
  { icon: NotebookPen, title: { uz: "Xatolarni tuzatish", ru: "Исправление ошибок" }, detail: { uz: "2 marta to‘g‘ri", ru: "2 верных ответа" }, href: "/mistakes/loop" },
  { icon: MessageCircle, title: { uz: "Real vaziyat", ru: "Реальная ситуация" }, detail: { uz: "Dialog mashqi", ru: "Практика диалога" }, href: "/roleplay" },
  { icon: Target, title: { uz: "HSK Sprint", ru: "HSK Sprint" }, detail: { uz: "7 kunlik reja", ru: "План на 7 дней" }, href: "/sprint" },
  { icon: PenLine, title: { uz: "O‘quv reja", ru: "Учебный план" }, detail: { uz: "Shaxsiy jadval", ru: "Личный график" }, href: "/study-plan" }
];

function SectionHeader({ eyebrow, title, detail, center = false }: { eyebrow: Localized; title: Localized; detail?: Localized; center?: boolean }) {
  const { language } = useI18n();
  return (
    <div className={center ? "mx-auto mb-9 max-w-3xl text-center" : "mb-8 max-w-3xl"}>
      <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{text(eyebrow, language)}</p>
      <h2 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-5xl">{text(title, language)}</h2>
      {detail ? <p className="mt-4 text-base font-semibold leading-7 text-stone-600">{text(detail, language)}</p> : null}
    </div>
  );
}

function ProductCard({ item }: { item: CardItem }) {
  const { language } = useI18n();
  const Icon = item.icon;
  const content = (
    <article className="h-full rounded-[1.65rem] border border-orange-soft/70 bg-white/88 p-5 shadow-soft transition hover:-translate-y-1 hover:border-orange-brand/40 hover:shadow-premium">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-lg font-black leading-tight text-ink">{text(item.title, language)}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{text(item.detail, language)}</p>
    </article>
  );
  return item.href ? <Link href={item.href} className="block h-full">{content}</Link> : content;
}

function HeroAppPreview() {
  const { language } = useI18n();
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -inset-4 rounded-[3rem] bg-orange-brand/12 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-orange-soft/80 bg-white/90 p-4 shadow-phone backdrop-blur-xl sm:p-5">
        <span className="absolute right-4 top-4 rounded-full bg-cream/90 px-3 py-1.5 text-xs font-black text-orange-deep shadow-soft">
          {language === "ru" ? "Демо-вид" : "Demo ko‘rinish"}
        </span>
        <div className="rounded-[1.75rem] bg-gradient-to-br from-cream via-white to-orange-soft/55 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4 pt-8 sm:pt-0">
            <BrandLogo variant="icon" size="sm" showText={false} />
            <div className="flex items-center gap-2 rounded-full bg-white/82 px-3 py-2 text-xs font-black text-stone-600 shadow-soft">
              <Sparkles className="h-4 w-4 text-orange-brand" /> HSK 1
            </div>
          </div>

          <div className="mt-5 rounded-[1.6rem] bg-white p-4 shadow-premium">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">{language === "ru" ? "Текущий урок" : "Joriy dars"}</p>
                <h3 className="mt-1 text-xl font-black leading-tight text-ink">HSK 1 — 1-dars</h3>
                <p className="mt-2 text-sm font-semibold text-stone-500">{language === "ru" ? "Приветствие и знакомство" : "Salomlashish va tanishish"}</p>
              </div>
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-orange-soft text-lg font-black text-orange-deep">0%</div>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-orange-soft">
              <div className="h-full w-0 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[1.35rem] bg-white p-4 shadow-soft">
              <p className="text-xs font-black text-stone-500">{language === "ru" ? "План на сегодня" : "Bugungi reja"}</p>
              <p className="mt-1 text-2xl font-black text-ink">5</p>
              <p className="mt-1 text-xs font-bold text-stone-500">{language === "ru" ? "заданий" : "vazifa"}</p>
            </div>
            <div className="rounded-[1.35rem] bg-white p-4 shadow-soft">
              <p className="text-xs font-black text-stone-500">{language === "ru" ? "Повторение" : "Takrorlash"}</p>
              <p className="mt-1 text-2xl font-black text-ink">0</p>
              <p className="mt-1 text-xs font-bold text-stone-500">{language === "ru" ? "слов" : "so‘z"}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[1.55rem] border border-orange-soft/70 bg-white/88 p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-brand text-white">
                <Brain className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black text-ink">{language === "ru" ? "AI-тренер" : "AI murabbiy"}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-stone-600">{language === "ru" ? "Начните сегодня с плана на 15 минут." : "Bugun 15 daqiqalik reja bilan boshlang."}</p>
              </div>
            </div>
          </div>
        </div>

        {["汉", "你", "学", "好"].map((char, index) => (
          <span
            key={char}
            className="absolute hidden h-11 w-11 place-items-center rounded-2xl border border-orange-soft/70 bg-white/92 text-lg font-black text-orange-deep shadow-soft sm:grid"
            style={{
              left: index % 2 === 0 ? "-0.35rem" : "auto",
              right: index % 2 === 1 ? "-0.35rem" : "auto",
              top: `${5.25 + index * 5.2}rem`
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

function HeroSection() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);
  const primaryHref = user ? "/dashboard" : "/register";

  return (
    <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-soft bg-white/86 px-4 py-2 text-sm font-black text-orange-deep shadow-soft">
          <Sparkles className="h-4 w-4" />
          HSK 1–6 + AI yordamchi
        </div>
        <h1 className="max-w-3xl text-balance text-4xl font-black leading-[1.06] text-ink sm:text-6xl lg:text-[4rem]">
          {language === "ru" ? (
            <>Изучайте китайский по HSK <span className="text-orange-brand">проще</span></>
          ) : (
            <>Xitoy tilini HSK bo‘yicha <span className="text-orange-brand">osonroq</span> o‘rganing</>
          )}
        </h1>
        <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-stone-600 sm:text-lg sm:leading-8">
          {language === "ru"
            ? "HanziFlow AI шаг за шагом помогает проходить уроки, умное повторение, speaking, listening и подготовку к экзамену."
            : "HanziFlow AI sizga darslar, aqlli takrorlash, speaking, listening va imtihon tayyorgarligini bosqichma-bosqich o‘rgatadi."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <AppButton href={primaryHref} className="min-h-12 px-6">
            {user ? (language === "ru" ? "Перейти в кабинет" : "Panelga o‘tish") : language === "ru" ? "Начать бесплатно" : "Bepul boshlash"} <ArrowRight className="h-4 w-4" />
          </AppButton>
          <AppButton href="/exam" variant="secondary" className="min-h-12 px-6">
            {language === "ru" ? "Посмотреть экзамены" : "Imtihon markazini ko‘rish"}
          </AppButton>
        </div>
        <div className="mt-7 flex flex-wrap gap-2">
          {["HSK 1–6", language === "ru" ? "AI-тренер" : "AI murabbiy", language === "ru" ? "Умное повторение" : "Aqlli takrorlash", language === "ru" ? "4 навыка" : "4 ko‘nikma"].map((item) => (
            <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/82 px-4 py-2 text-xs font-black text-stone-600 shadow-soft">
              <CheckCircle2 className="h-4 w-4 text-orange-brand" /> {item}
            </span>
          ))}
        </div>
      </div>
      <HeroAppPreview />
    </section>
  );
}

function ExamSection() {
  const { language } = useI18n();
  const checks = language === "ru"
    ? ["Listening", "Reading", "Speaking", "Writing", "Правило 80%", "Готовность к экзамену", "Поиск слабых навыков"]
    : ["Listening", "Reading", "Speaking", "Writing", "80% o‘tish bali", "Imtihonga tayyorlik", "Zaif ko‘nikmalarni topish"];

  return (
    <section id="exam" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
      <div className="grid gap-7 rounded-[2.5rem] border border-orange-soft/70 bg-white/88 p-6 shadow-premium sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
        <div>
          <SectionHeader
            eyebrow={{ uz: "Imtihon", ru: "Экзамен" }}
            title={{ uz: "HSK imtihoniga tayyorgarlik", ru: "Подготовка к экзамену HSK" }}
            detail={{
              uz: "Darslar tugagandan keyin HSK uslubidagi imtihon ochiladi. Keyingi daraja uchun 80% yoki undan yuqori ball kerak.",
              ru: "После завершения уроков открывается экзамен в стиле HSK. Для следующего уровня нужно 80% или выше."
            }}
          />
          <AppButton href="/exam" className="min-h-12 px-6">
            {language === "ru" ? "Посмотреть экзамены" : "Imtihon markazini ko‘rish"} <ArrowRight className="h-4 w-4" />
          </AppButton>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {checks.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-[1.4rem] border border-orange-soft/70 bg-cream/80 p-4 shadow-soft">
              <ShieldCheck className="h-5 w-5 shrink-0 text-orange-brand" />
              <span className="text-sm font-black text-ink">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumSection() {
  const { language } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
      <SectionHeader
        center
        eyebrow={{ uz: "Premium", ru: "Premium" }}
        title={{ uz: "Ko‘proq AI tekshiruv va chuqurroq mashqlar", ru: "Больше AI-проверок и глубоких упражнений" }}
        detail={{
          uz: "Bepul boshlang. Tayyor bo‘lganingizda chuqurroq roleplay, analytics va AI tekshiruvlarni oching.",
          ru: "Начните бесплатно. Когда будете готовы, откройте больше roleplay, analytics и AI-проверок."
        }}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-orange-soft/70 bg-white/88 p-6 shadow-soft">
          <p className="text-sm font-black text-stone-500">{language === "ru" ? "Бесплатно" : "Bepul"}</p>
          <h3 className="mt-2 text-3xl font-black text-ink">{language === "ru" ? "Начало" : "Boshlash"}</h3>
          <ul className="mt-5 space-y-3 text-sm font-semibold text-stone-600">
            {(language === "ru" ? ["Основные уроки", "Ограниченные AI-проверки", "Базовое повторение"] : ["Asosiy darslar", "Cheklangan AI tekshiruvlar", "Asosiy takrorlash"]).map((item) => (
              <li key={item} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-orange-brand" />{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-[2rem] border border-orange-brand/30 bg-gradient-to-br from-white via-cream to-orange-soft/55 p-6 shadow-premium">
          <p className="text-sm font-black text-orange-deep">Premium</p>
          <h3 className="mt-2 text-3xl font-black text-ink">HanziFlow AI</h3>
          <ul className="mt-5 space-y-3 text-sm font-semibold text-stone-600">
            {(language === "ru" ? ["Больше AI-проверок", "Продвинутые разговорные сценарии", "Полная аналитика прогресса", "Учебный план", "Готовность к экзамену"] : ["Ko‘proq AI tekshiruvlar", "Kengaytirilgan suhbat mashqlari", "To‘liq rivojlanish tahlili", "O‘quv reja", "Imtihonga tayyorlik"]).map((item) => (
              <li key={item} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-orange-brand" />{item}</li>
            ))}
          </ul>
          <div className="mt-6">
            <AppButton href="/premium">{language === "ru" ? "Посмотреть Premium" : "Premiumni ko‘rish"}</AppButton>
          </div>
        </article>
      </div>
    </section>
  );
}

export function ClosedBetaLanding() {
  const { language } = useI18n();
  const user = useAuthStore((state) => state.user);

  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(255,107,26,0.16),transparent_28%),radial-gradient(circle_at_85%_22%,rgba(255,177,92,0.16),transparent_28%),linear-gradient(135deg,#fffdf8,#fff7ed_48%,#fff2df)] text-ink">
      <HeroSection />

      <section id="learn" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionHeader
          center
          eyebrow={{ uz: "Muammo", ru: "Проблема" }}
          title={{ uz: "Nega xitoy tili qiyin?", ru: "Почему китайский кажется сложным?" }}
          detail={{
            uz: "Hanzi, pinyin, ton, gap tartibi va speaking bir-biri bilan bog‘liq. HanziFlow AI shu jarayonni bosqichlarga ajratadi.",
            ru: "Hanzi, pinyin, тоны, порядок слов и speaking связаны между собой. HanziFlow AI делит этот путь на понятные этапы."
          }}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {problems.map((item) => <ProductCard key={item.title.uz} item={item} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionHeader
          center
          eyebrow={{ uz: "Yechim", ru: "Решение" }}
          title={{ uz: "HanziFlow AI buni qanday osonlashtiradi?", ru: "Как HanziFlow AI упрощает обучение?" }}
          detail={{
            uz: "Har bir vosita xitoy tilidagi aniq qiyinchilikni hal qiladi: eslab qolish, eshitish, gap tuzish va imtihonga tayyorgarlik.",
            ru: "Каждый инструмент решает конкретную трудность: запоминание, слух, порядок слов и подготовку к экзамену."
          }}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {solutions.map((item) => <ProductCard key={item.title.uz} item={item} />)}
        </div>
      </section>

      <section id="lessons" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="rounded-[2.5rem] border border-orange-soft/70 bg-white/86 p-6 shadow-premium sm:p-8 lg:p-10">
          <SectionHeader
            eyebrow={{ uz: "O‘quv yo‘li", ru: "Учебный путь" }}
            title={{ uz: "Bosqichma-bosqich o‘quv yo‘li", ru: "Пошаговый путь обучения" }}
            detail={{
              uz: "Darslar ketma-ket ochiladi. Barcha bo‘limlar tugagandan keyin imtihon ochiladi.",
              ru: "Уроки открываются по порядку. После завершения всех разделов открывается экзамен."
            }}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((step, index) => (
              <div key={step.uz} className="rounded-[1.45rem] border border-orange-soft/70 bg-cream/80 p-4 shadow-soft">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-brand text-sm font-black text-white">{index + 1}</div>
                <p className="mt-3 text-sm font-black leading-5 text-ink">{language === "ru" ? step.ru : step.uz}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ExamSection />

      <section id="practice" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <SectionHeader
          center
          eyebrow={{ uz: "Mashq", ru: "Практика" }}
          title={{ uz: "Har kuni mashq qilish uchun vositalar", ru: "Инструменты для ежедневной практики" }}
          detail={{
            uz: "Kundalik qisqa mashqlar xotira, tinglash va gapirish ishonchini oshiradi.",
            ru: "Короткая ежедневная практика укрепляет память, слух и уверенность в речи."
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((item) => <ProductCard key={item.title.uz} item={item} />)}
        </div>
      </section>

      <section id="ai" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-7 rounded-[2.5rem] border border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/50 p-6 shadow-premium sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <SectionHeader
              eyebrow={{ uz: "AI murabbiy", ru: "AI-тренер" }}
              title={{ uz: "AI murabbiy siz bilan birga o‘rganadi", ru: "AI-тренер учится вместе с вами" }}
              detail={{
                uz: "AI darslaringiz, zaif so‘zlaringiz va imtihon natijalaringizga qarab amaliy tavsiya beradi.",
                ru: "AI даёт практичные советы по вашим урокам, слабым словам и результатам экзаменов."
              }}
            />
            <AppButton href="/ai-tutor" className="min-h-12 px-6">
              {language === "ru" ? "Открыть AI-тренера" : "AI murabbiyni ochish"} <ArrowRight className="h-4 w-4" />
            </AppButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(language === "ru"
              ? ["Личные рекомендации", "Speaking evaluation", "Writing feedback", "Разбор ошибок", "Учебный план", "Поиск слабых навыков"]
              : ["Shaxsiy tavsiyalar", "Speaking evaluation", "Writing feedback", "Xatolarni tushuntirish", "O‘quv reja", "Zaif ko‘nikmalarni topish"]
            ).map((item) => (
              <div key={item} className="rounded-[1.35rem] border border-orange-soft/70 bg-white/85 p-4 text-sm font-black text-ink shadow-soft">
                <CheckCircle2 className="mb-2 h-5 w-5 text-orange-brand" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PremiumSection />

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-8 text-center sm:px-8 lg:pb-24">
        <div className="rounded-[2.5rem] border border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/60 p-7 shadow-premium sm:p-10">
          <GraduationCap className="mx-auto h-12 w-12 text-orange-brand" />
          <h2 className="mt-4 text-3xl font-black text-ink sm:text-5xl">{language === "ru" ? "Начните с HSK 1 сегодня" : "Bugun HSK 1-dan boshlang"}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-stone-600">
            {language === "ru"
              ? "Учитесь понемногу каждый день, исправляйте ошибки и готовьтесь к экзамену."
              : "Har kuni oz-ozdan o‘rganing, xatolaringizni tuzating va imtihonga tayyorlaning."}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <AppButton href={user ? "/dashboard" : "/register"}>{user ? (language === "ru" ? "Перейти в кабинет" : "Panelga o‘tish") : language === "ru" ? "Начать бесплатно" : "Bepul boshlash"} <ArrowRight className="h-4 w-4" /></AppButton>
            <AppButton href="/login" variant="secondary">{language === "ru" ? "Войти" : "Kirish"}</AppButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-orange-soft/70 bg-white/60 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <BrandLogo variant="full" size="sm" />
            <p className="mt-3 max-w-lg text-sm font-semibold leading-6 text-stone-600">
              {language === "ru" ? "Платформа для изучения китайского и подготовки к HSK." : "Xitoy tili va HSK tayyorgarlik platformasi."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-black text-stone-600">
            {[
              ["/lessons", language === "ru" ? "Уроки" : "Darslar"],
              ["/practice", language === "ru" ? "Практика" : "Mashqlar"],
              ["/exam", language === "ru" ? "Экзамен" : "Imtihon"],
              ["/premium", "Premium"],
              ["/login", language === "ru" ? "Войти" : "Kirish"]
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full px-3 py-2 transition hover:bg-orange-soft hover:text-orange-deep">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
