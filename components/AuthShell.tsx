"use client";

import { BarChart3, Bot, BookOpen, CheckCircle2, GraduationCap, Headphones, RotateCcw, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useI18n } from "@/utils/i18n";

type LocalizedCopy = string | {
  uz: string;
  ru: string;
};

type LocalizedNode = ReactNode | {
  uz: ReactNode;
  ru: ReactNode;
};

type AuthShellMode = "login" | "register" | "forgot";

function pickCopy(copy: LocalizedCopy, language: "uz" | "ru") {
  return typeof copy === "string" ? copy : copy[language];
}

function pickNode(node: LocalizedNode, language: "uz" | "ru") {
  if (node && typeof node === "object" && "uz" in node && "ru" in node) return node[language];
  return node as ReactNode;
}

function AuthFeaturePreview({ mode, language }: { mode: AuthShellMode; language: "uz" | "ru" }) {
  const register = mode === "register";
  const headline = register
    ? {
        uz: "Xitoy tili va HSK tayyorgarligi bir joyda",
        ru: "Китайский язык и подготовка к HSK в одном месте"
      }
    : {
        uz: "Darslaringizni davom ettiring",
        ru: "Продолжайте обучение"
      };
  const subtitle = register
    ? {
        uz: "Darslar, speaking, listening, reading, writing, aqlli takrorlash va AI yordamchi bilan o‘rganing.",
        ru: "Учитесь с уроками, speaking, listening, reading, writing, умным повторением и AI-помощником."
      }
    : {
        uz: "Zaif so‘zlar, kunlik topshiriqlar, AI yordamchi va HSK rivojlanishingiz hisobingizda saqlanadi.",
        ru: "Слабые слова, ежедневные задания, AI-помощник и прогресс HSK сохраняются в аккаунте."
      };
  const miniCards = register
    ? [
        { icon: GraduationCap, uz: "HSK 1–6 yo‘l", ru: "Путь HSK 1–6" },
        { icon: Bot, uz: "AI yordamchi", ru: "AI-помощник" },
        { icon: Headphones, uz: "4 ko‘nikma", ru: "4 навыка" },
        { icon: RotateCcw, uz: "Aqlli takrorlash", ru: "Умное повторение" }
      ]
    : [
        { icon: RotateCcw, uz: "Aqlli takrorlash", ru: "Умное повторение" },
        { icon: Bot, uz: "AI murabbiy", ru: "AI-тренер" },
        { icon: BarChart3, uz: "Imtihon natijalari", ru: "Результаты экзаменов" }
      ];

  return (
    <aside className="hidden lg:block">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-orange-soft/70 bg-white/78 p-7 shadow-premium backdrop-blur-xl">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-orange-soft/65 blur-2xl" />
        <div className="relative">
          <BrandLogo variant="full" size="md" />
          <h2 className="mt-8 max-w-lg text-4xl font-black leading-tight text-ink">{language === "ru" ? headline.ru : headline.uz}</h2>
          <p className="mt-4 max-w-lg text-base font-semibold leading-7 text-stone-600">{language === "ru" ? subtitle.ru : subtitle.uz}</p>

          <div className={`mt-7 grid gap-3 ${register ? "grid-cols-2" : "grid-cols-3"}`}>
            {miniCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.uz} className="rounded-[1.4rem] border border-orange-soft/60 bg-cream/80 p-4 shadow-soft">
                  <Icon className="h-5 w-5 text-orange-brand" />
                  <p className="mt-3 text-sm font-black leading-5 text-ink">{language === "ru" ? card.ru : card.uz}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-7 rounded-[2rem] border border-orange-soft/70 bg-gradient-to-br from-white to-orange-soft/45 p-5 shadow-soft">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-black text-orange-deep shadow-soft">
              <Sparkles className="h-4 w-4" />
              {language === "ru" ? "Демо-вид" : "Demo ko‘rinish"}
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-normal text-orange-deep">{language === "ru" ? "Текущий урок" : "Joriy dars"}</p>
                  <h3 className="mt-1 text-lg font-black text-ink">HSK 1 — 1-dars</h3>
                </div>
                <span className="rounded-full bg-orange-soft px-3 py-1.5 text-xs font-black text-orange-deep">0%</span>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-orange-soft" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-[1.3rem] bg-white/88 p-4 shadow-soft">
                <Target className="h-5 w-5 text-orange-brand" />
                <p className="mt-2 text-xs font-black text-stone-500">{language === "ru" ? "План на сегодня" : "Bugungi reja"}</p>
              </div>
              <div className="rounded-[1.3rem] bg-white/88 p-4 shadow-soft">
                <BookOpen className="h-5 w-5 text-orange-brand" />
                <p className="mt-2 text-xs font-black text-stone-500">{language === "ru" ? "Повторение: 0 слов" : "Takrorlash: 0 so‘z"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AuthShell({ mode = "login", title, subtitle, children, footer }: { mode?: AuthShellMode; title: LocalizedCopy; subtitle: LocalizedCopy; children: ReactNode; footer: LocalizedNode }) {
  const { language, setLanguage } = useI18n();
  const compact = mode === "forgot";

  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(255,107,26,0.14),transparent_28%),linear-gradient(135deg,#fffdf8,#fff7ed_48%,#fff2df)] px-4 py-5 text-ink sm:px-6 lg:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="warm-focus inline-flex rounded-[1.3rem]" aria-label="HanziFlow AI">
          <BrandLogo variant="full" size="sm" />
        </Link>
        <div className="inline-flex rounded-full border border-orange-soft bg-white/90 p-1 shadow-soft">
          {(["uz", "ru"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLanguage(item)}
              className={`min-h-9 rounded-full px-3 text-xs font-black transition ${
                language === item ? "bg-orange-brand text-white" : "text-stone-500 hover:bg-orange-soft hover:text-ink"
              }`}
            >
              {item === "uz" ? "UZ" : "RU"}
            </button>
          ))}
        </div>
      </header>

      <div className={`mx-auto grid min-h-[calc(100vh-6rem)] items-center gap-8 py-8 ${compact ? "max-w-md" : "max-w-6xl lg:grid-cols-[1.02fr_0.98fr] lg:gap-12"}`}>
        {!compact ? <AuthFeaturePreview mode={mode} language={language} /> : null}

        <div className="mx-auto w-full max-w-md">
          <div className="mb-5 text-center lg:text-left">
            {compact ? <BrandLogo variant="icon" size="lg" showText className="mb-5 justify-center lg:justify-start" /> : null}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-soft bg-white/80 px-3 py-1.5 text-xs font-black text-orange-deep shadow-soft">
              <CheckCircle2 className="h-4 w-4" />
              HanziFlow AI
            </div>
            <h1 className="text-3xl font-black leading-tight text-ink sm:text-5xl">{pickCopy(title, language)}</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-stone-600 sm:text-base sm:leading-7">{pickCopy(subtitle, language)}</p>
          </div>
          <div className="rounded-[2rem] border border-orange-soft/70 bg-white/92 p-5 shadow-premium backdrop-blur-xl sm:p-7">
            {children}
            <div className="mt-6 text-center text-sm font-bold leading-6 text-stone-500">{pickNode(footer, language)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
