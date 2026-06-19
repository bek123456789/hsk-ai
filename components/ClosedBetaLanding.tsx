"use client";

import { ArrowRight, BookOpen, Bot, CheckCircle2, GraduationCap, Headphones, MessageCircle, Search, Sparkles, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { AppButton } from "@/components/AppButton";
import { BrandLogo } from "@/components/BrandLogo";
import { useI18n } from "@/utils/i18n";

const featureCards = [
  {
    icon: BookOpen,
    uz: "Ketma-ket darslar",
    ru: "Уроки по порядку",
    detailUz: "Har bir HSK daraja bosqichma-bosqich ochiladi.",
    detailRu: "Каждый уровень HSK открывается шаг за шагом."
  },
  {
    icon: Sparkles,
    uz: "Aqlli takrorlash",
    ru: "Умное повторение",
    detailUz: "Zaif so‘zlar o‘z vaqtida qaytib keladi.",
    detailRu: "Слабые слова возвращаются вовремя."
  },
  {
    icon: Bot,
    uz: "AI murabbiy",
    ru: "AI-тренер",
    detailUz: "AI sizga keyingi real qadamni tushuntiradi.",
    detailRu: "AI объясняет следующий реальный шаг."
  },
  {
    icon: Trophy,
    uz: "Imtihon markazi",
    ru: "Экзаменационный центр",
    detailUz: "Listening, Reading, Speaking va Writing bo‘limlari.",
    detailRu: "Разделы Listening, Reading, Speaking и Writing."
  },
  {
    icon: MessageCircle,
    uz: "Speaking mashqi",
    ru: "Говорение",
    detailUz: "Xitoycha javob yozing yoki ovoz bilan mashq qiling.",
    detailRu: "Отвечайте по-китайски письменно или голосом."
  },
  {
    icon: Search,
    uz: "Lug‘at",
    ru: "Словарь",
    detailUz: "Hanzi, pinyin, o‘zbekcha va ruscha ma’nolar.",
    detailRu: "Иероглифы, pinyin, узбекские и русские значения."
  }
];

const flow = [
  { uz: "Dars", ru: "Урок" },
  { uz: "Mashq", ru: "Практика" },
  { uz: "Takrorlash", ru: "Повторение" },
  { uz: "Imtihon", ru: "Экзамен" },
  { uz: "Keyingi HSK", ru: "Следующий HSK" }
];

function HeroAppPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -inset-6 rounded-[3.5rem] bg-orange-brand/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.5rem] border border-orange-soft/80 bg-white/88 p-4 shadow-phone backdrop-blur-xl sm:p-5">
        <div className="absolute right-5 top-5 rounded-full bg-orange-soft/75 px-3 py-1.5 text-xs font-black text-orange-deep">Demo ko‘rinish</div>
        <div className="rounded-[2rem] bg-gradient-to-br from-cream via-white to-orange-soft/55 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <BrandLogo variant="icon" size="sm" showText={false} />
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-black text-stone-600 shadow-soft">
              <Sparkles className="h-4 w-4 text-orange-brand" /> HSK 1
            </div>
          </div>

          <div className="mt-5 rounded-[1.7rem] bg-white p-4 shadow-premium">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-orange-deep">Joriy dars</p>
                <h3 className="mt-1 text-xl font-black leading-tight text-ink">HSK 1 — 1-dars</h3>
                <p className="mt-2 text-sm font-semibold text-stone-500">Salomlashish va tanishish</p>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-orange-soft text-lg font-black text-orange-deep">0%</div>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-orange-soft">
              <div className="h-full w-0 rounded-full bg-orange-brand" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[1.4rem] bg-white p-4 shadow-soft">
              <p className="text-xs font-black text-stone-500">Bugungi reja</p>
              <p className="mt-1 text-2xl font-black text-ink">5</p>
              <p className="mt-1 text-xs font-bold text-stone-500">vazifa</p>
            </div>
            <div className="rounded-[1.4rem] bg-white p-4 shadow-soft">
              <p className="text-xs font-black text-stone-500">Takrorlash</p>
              <p className="mt-1 text-2xl font-black text-ink">0</p>
              <p className="mt-1 text-xs font-bold text-stone-500">so‘z</p>
            </div>
          </div>

          <div className="mt-4 rounded-[1.7rem] border border-orange-soft/70 bg-white/85 p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-brand text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div>
              <p className="text-sm font-black text-ink">AI murabbiy</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-stone-600">Bugun 15 daqiqalik reja bilan boshlang.</p>
              </div>
            </div>
          </div>
        </div>

        {["汉", "你", "学", "好"].map((char, index) => (
          <span
            key={char}
            className="absolute grid h-12 w-12 place-items-center rounded-2xl border border-orange-soft/70 bg-white/90 text-xl font-black text-orange-deep shadow-soft"
            style={{
              left: index % 2 === 0 ? "-0.4rem" : "auto",
              right: index % 2 === 1 ? "-0.4rem" : "auto",
              top: `${5.5 + index * 5.4}rem`
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ClosedBetaLanding() {
  const { language } = useI18n();

  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(255,107,26,0.16),transparent_28%),radial-gradient(circle_at_85%_22%,rgba(255,177,92,0.16),transparent_28%),linear-gradient(135deg,#fffdf8,#fff7ed_48%,#fff2df)] text-ink">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:py-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-soft bg-white/85 px-4 py-2 text-sm font-black text-orange-deep shadow-soft">
            <Sparkles className="h-4 w-4" />
            HSK 1–6 + AI yordamchi
          </div>
          <h1 className="max-w-3xl text-balance text-4xl font-black leading-[1.03] text-ink sm:text-6xl lg:text-7xl">
            {language === "ru" ? "Изучайте китайский по HSK с AI" : "Xitoy tilini HSK bo‘yicha AI bilan o‘rganing"}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-stone-600 sm:text-lg sm:leading-8">
            {language === "ru"
              ? "HanziFlow AI ведёт вас через уроки, повторение, speaking, listening и подготовку к экзамену шаг за шагом."
              : "HanziFlow AI sizga darslar, takrorlash, speaking, listening va imtihon tayyorgarligini bosqichma-bosqich o‘rgatadi."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AppButton href="/register" className="min-h-12 px-6">
              {language === "ru" ? "Начать бесплатно" : "Bepul boshlash"} <ArrowRight className="h-4 w-4" />
            </AppButton>
            <AppButton href="/exam" variant="secondary" className="min-h-12 px-6">
              {language === "ru" ? "Посмотреть экзамены" : "Imtihon markazini ko‘rish"}
            </AppButton>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {["HSK 1–6", language === "ru" ? "AI-тренер" : "AI murabbiy", language === "ru" ? "Умное повторение" : "Aqlli takrorlash", language === "ru" ? "4 навыка" : "4 ko‘nikma"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-black text-stone-600 shadow-soft">
                <CheckCircle2 className="h-4 w-4 text-orange-brand" /> {item}
              </span>
            ))}
          </div>
        </div>
        <HeroAppPreview />
      </section>

      <section id="learn" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-7 max-w-2xl">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{language === "ru" ? "Возможности" : "Imkoniyatlar"}</p>
          <h2 className="mt-2 text-3xl font-black text-ink sm:text-5xl">
            {language === "ru" ? "Учитесь как в сильной edtech-платформе" : "Kuchli edtech platformadek o‘rganing"}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.uz} className="rounded-[2rem] border border-orange-soft/70 bg-white/88 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-premium">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-orange-deep">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-black text-ink">{language === "ru" ? feature.ru : feature.uz}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{language === "ru" ? feature.detailRu : feature.detailUz}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="lessons" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="rounded-[2.5rem] border border-orange-soft/70 bg-white/86 p-6 shadow-premium sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{language === "ru" ? "Как это работает" : "Qanday ishlaydi"}</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-5xl">
                {language === "ru" ? "От урока до следующего HSK" : "Darsdan keyingi HSK bosqichigacha"}
              </h2>
              <p className="mt-4 text-base font-semibold leading-7 text-stone-600">
                {language === "ru"
                  ? "Прогресс не случайный: уроки открываются по порядку, экзамен требует 80% или выше."
                  : "Rivojlanish tasodifiy emas: darslar ketma-ket ochiladi, imtihon esa 80% yoki undan yuqori ball talab qiladi."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-5">
              {flow.map((step, index) => (
                <div key={step.uz} className="relative rounded-[1.5rem] bg-cream p-4 text-center shadow-soft">
                  <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-orange-brand text-sm font-black text-white">{index + 1}</div>
                  <p className="mt-3 text-sm font-black text-ink">{language === "ru" ? step.ru : step.uz}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-8 text-center sm:px-8 lg:pb-24">
        <div className="rounded-[2.5rem] border border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/60 p-7 shadow-premium sm:p-10">
          <GraduationCap className="mx-auto h-12 w-12 text-orange-brand" />
          <h2 className="mt-4 text-3xl font-black text-ink sm:text-5xl">{language === "ru" ? "Начните китайский сегодня" : "Bugun Xitoy tilini boshlang"}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-stone-600">
            {language === "ru" ? "Создайте аккаунт и начните HSK 1 с первого урока." : "Hisob yarating va HSK 1 birinchi darsidan boshlang."}
          </p>
          <div className="mt-6">
            <AppButton href="/register">{language === "ru" ? "Начать бесплатно" : "Bepul boshlash"} <ArrowRight className="h-4 w-4" /></AppButton>
          </div>
        </div>
      </section>
    </main>
  );
}
