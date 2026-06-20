"use client";

import { BarChart3, Brain, CheckCircle2, GraduationCap, LineChart, RotateCcw, Sparkles, Target } from "lucide-react";
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
  const forgot = mode === "forgot";
  const headline = register
    ? {
        uz: <>Xitoy tili va HSK tayyorgarligi <span className="text-[#FF6B1A]">bir joyda</span></>,
        ru: <>Китайский и подготовка к HSK <span className="text-[#FF6B1A]">в одном месте</span></>
      }
    : forgot
      ? {
          uz: <>Hisobingizga qaytish <span className="text-[#FF6B1A]">oson</span></>,
          ru: <>Вернуться к аккаунту <span className="text-[#FF6B1A]">просто</span></>
        }
      : {
          uz: <>Darslaringizni davom <span className="text-[#FF6B1A]">ettiring</span></>,
          ru: <>Продолжайте <span className="text-[#FF6B1A]">обучение</span></>
        };

  const subtitle = register
    ? {
        uz: "Darslar, speaking, listening, reading, writing, aqlli takrorlash va AI yordamchi bilan o‘rganing.",
        ru: "Учитесь с уроками, speaking, listening, reading, writing, умным повторением и AI-помощником."
      }
    : forgot
      ? {
          uz: "Emailingizga tiklash havolasi yuboriladi, keyin parolni xavfsiz yangilaysiz.",
          ru: "Мы отправим ссылку восстановления на email, затем вы безопасно обновите пароль."
        }
      : {
          uz: "Zaif so‘zlar takrorlanadi, AI yordamchisi yo‘l-yo‘riq beradi, natijalar esa sizni oldinga yetaklaydi.",
          ru: "Слабые слова повторяются, AI-помощник подсказывает путь, а результаты ведут вас вперёд."
        };

  const features = [
    {
      icon: RotateCcw,
      titleUz: "Aqlli takrorlash",
      titleRu: "Умное повторение",
      detailUz: "Zaif so‘zlaringizni aniqlab, samarali takrorlaysiz.",
      detailRu: "Находите слабые слова и повторяйте их эффективно."
    },
    {
      icon: Brain,
      titleUz: "AI murabbiy",
      titleRu: "AI-тренер",
      detailUz: "Shaxsiy tavsiyalar va o‘quv rejalari.",
      detailRu: "Личные рекомендации и учебные планы."
    },
    {
      icon: BarChart3,
      titleUz: "Imtihon natijalari",
      titleRu: "Результаты экзаменов",
      detailUz: "Yutuqlaringizni kuzatib boring.",
      detailRu: "Следите за своими достижениями."
    }
  ];

  return (
    <aside className="hidden lg:block">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#F3D8C3]/80 bg-white/70 p-7 shadow-[0_24px_70px_rgba(120,74,28,0.12)] backdrop-blur-xl xl:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#FFB15C]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-12 h-64 w-64 rounded-full bg-[#FF6B1A]/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F3D8C3] bg-[#FFF7ED]/90 px-3 py-2 text-xs font-black text-[#9A4B14] shadow-sm">
            <Sparkles className="h-4 w-4 text-[#FF6B1A]" />
            HSK 1–6 + AI yordamchi
          </div>

          <h2 className="mt-7 max-w-xl text-4xl font-black leading-[1.05] text-[#241A14] xl:text-5xl">
            {language === "ru" ? headline.ru : headline.uz}
          </h2>
          <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-[#6F625A]">
            {language === "ru" ? subtitle.ru : subtitle.uz}
          </p>

          <div className="mt-8 grid gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.titleUz} className="group flex gap-4 rounded-[1.5rem] border border-[#F3D8C3]/80 bg-white/82 p-4 shadow-[0_12px_34px_rgba(120,74,28,0.08)] transition hover:-translate-y-0.5 hover:border-[#FFB15C]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0DE] text-[#FF6B1A]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#241A14]">{language === "ru" ? feature.titleRu : feature.titleUz}</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-[#6F625A]">{language === "ru" ? feature.detailRu : feature.detailUz}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-[1.85rem] border border-[#F3D8C3] bg-gradient-to-br from-white via-white to-[#FFF1E2] p-5 shadow-[0_18px_48px_rgba(120,74,28,0.10)]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FFF7ED] px-3 py-1.5 text-xs font-black text-[#B45309]">
              <LineChart className="h-4 w-4" />
              {language === "ru" ? "Демо-вид" : "Demo ko‘rinish"}
            </div>

            <div className="rounded-[1.35rem] border border-[#F3D8C3]/70 bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase text-[#9A4B14]">{language === "ru" ? "Текущий урок" : "JORIY DARS"}</p>
                  <h3 className="mt-1 text-lg font-black text-[#241A14]">HSK 1 — 1-dars</h3>
                </div>
                <span className="rounded-full bg-[#FFF0DE] px-3 py-1.5 text-xs font-black text-[#FF6B1A]">0%</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#FFE5CA]">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#FF4D1D]" />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-[1.25rem] border border-[#F3D8C3]/70 bg-white/88 p-4">
                <Target className="h-5 w-5 text-[#FF6B1A]" />
                <p className="mt-2 text-xs font-black text-[#6F625A]">{language === "ru" ? "План на сегодня" : "Bugungi reja"}</p>
                <p className="mt-1 text-sm font-black text-[#241A14]">{language === "ru" ? "3 упражнения" : "3 ta mashq"}</p>
              </div>
              <div className="rounded-[1.25rem] border border-[#F3D8C3]/70 bg-white/88 p-4">
                <GraduationCap className="h-5 w-5 text-[#FF6B1A]" />
                <p className="mt-2 text-xs font-black text-[#6F625A]">{language === "ru" ? "Повторение" : "Takrorlash"}</p>
                <p className="mt-1 text-sm font-black text-[#241A14]">{language === "ru" ? "0 слов" : "0 so‘z"}</p>
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

  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_10%,rgba(255,177,92,0.28),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(255,107,26,0.12),transparent_26%),linear-gradient(135deg,#fffdf8,#fff7ed_52%,#fff1df)] px-4 py-4 text-[#241A14] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,107,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,26,0.035)_1px,transparent_1px)] bg-[size:42px_42px] opacity-45" />

      <header className="relative z-10 mx-auto flex max-w-[1180px] items-center justify-between gap-4">
        <Link href="/" className="warm-focus inline-flex rounded-2xl" aria-label="HanziFlow AI">
          <BrandLogo variant="full" size="sm" />
        </Link>
        <div className="inline-flex rounded-full border border-[#F3D8C3] bg-white/86 p-1 shadow-[0_12px_34px_rgba(120,74,28,0.08)] backdrop-blur">
          {(["uz", "ru"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLanguage(item)}
              className={`min-h-9 rounded-full px-3 text-xs font-black transition ${
                language === item ? "bg-[#FF6B1A] text-white shadow-sm" : "text-[#6F625A] hover:bg-[#FFF0DE] hover:text-[#241A14]"
              }`}
            >
              {item === "uz" ? "UZ" : "RU"}
            </button>
          ))}
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5.25rem)] max-w-[1180px] items-center gap-8 py-7 lg:grid-cols-[1fr_0.92fr] lg:gap-12 xl:gap-16">
        <AuthFeaturePreview mode={mode} language={language} />

        <div className="mx-auto w-full max-w-[540px]">
          <div className="mb-5 text-center lg:hidden">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F3D8C3] bg-white/80 px-3 py-1.5 text-xs font-black text-[#B45309] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#FF6B1A]" />
              HSK 1–6 + AI yordamchi
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#F3D8C3] bg-white/94 p-5 shadow-[0_28px_80px_rgba(120,74,28,0.16)] backdrop-blur-xl sm:rounded-[2rem] sm:p-7 lg:p-8">
            <div className="mb-7 text-center">
              <h1 className="text-3xl font-black leading-tight text-[#241A14] sm:text-4xl">{pickCopy(title, language)}</h1>
              <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[#6F625A] sm:text-base">{pickCopy(subtitle, language)}</p>
            </div>
            {children}
            <div className="mt-6 text-center text-sm font-bold leading-6 text-[#6F625A]">{pickNode(footer, language)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
