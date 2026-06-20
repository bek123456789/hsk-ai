"use client";

import { ArrowRight, Crown, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { BrandLogo } from "@/components/BrandLogo";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { language, setLanguage, t } = useI18n();
  const premium = isPremiumProfile(user);
  const authPathnames = ["/login", "/register", "/forgot-password"];
  const isAuthRoute = authPathnames.includes(pathname) || pathname.startsWith("/auth/");
  const isPublicHome = pathname === "/";

  if (isAuthRoute) return null;

  if (isPublicHome) {
    return (
      <header className="sticky top-0 z-40 border-b border-orange-soft/50 bg-cream/86 backdrop-blur-2xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-18">
          <Link href="/" aria-label="HanziFlow AI" className="warm-focus rounded-2xl">
            <BrandLogo variant="full" size="sm" />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {[
              ["#learn", t("nav.learn")],
              ["#lessons", t("nav.lessons")],
              ["/practice", t("nav.practice")],
              ["/exam", t("nav.exam")],
              ["/ai-tutor", t("nav.aiTutor")]
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full px-4 py-2 text-sm font-black text-stone-500 transition hover:bg-white/80 hover:text-ink">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-orange-soft bg-white/82 p-1 shadow-soft sm:inline-flex">
              {(["uz", "ru"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLanguage(item)}
                  className={`min-h-8 rounded-full px-2.5 text-[11px] font-black transition ${
                    language === item ? "bg-orange-brand text-white" : "text-stone-500 hover:bg-orange-soft hover:text-ink"
                  }`}
                >
                  {item === "uz" ? "UZ" : "RU"}
                </button>
              ))}
            </div>
            {user ? (
              <>
                <Link href="/dashboard" className="warm-focus hidden rounded-full px-4 py-2 text-sm font-black text-stone-600 hover:bg-white/80 sm:inline-flex">
                  {language === "ru" ? "Кабинет" : "Panel"}
                </Link>
                <Link href="/profile" aria-label={t("nav.profile")} className="warm-focus flex h-10 w-10 items-center justify-center rounded-full border border-orange-soft/70 bg-white/88 text-orange-deep shadow-soft">
                  <UserRound className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="warm-focus hidden rounded-full px-4 py-2 text-sm font-black text-stone-600 hover:bg-white/80 sm:inline-flex">
                  {t("auth.login")}
                </Link>
                <Link href="/register" className="warm-focus inline-flex min-h-10 items-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-4 py-2 text-sm font-black text-white shadow-card transition hover:-translate-y-0.5">
                  {t("common.getStarted")} <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    );
  }

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.replace("/login");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-orange-soft/60 bg-cream/88 backdrop-blur-2xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href={user ? "/dashboard" : "/"} aria-label="HanziFlow AI" className="warm-focus rounded-2xl">
          <span className="inline-flex items-center gap-2.5">
            <BrandLogo variant="icon" size="md" showText={false} />
            <span className="hidden text-xl font-black tracking-normal text-ink sm:inline">HanziFlow <span className="text-orange-brand">AI</span></span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {[
            ["/dashboard", t("nav.learn")],
            ["/lessons", t("nav.lessons")],
            ["/practice", t("nav.practice")],
            ["/exam", t("nav.exam")],
            ["/ai-tutor", t("nav.aiTutor")],
            ["/profile", t("nav.profile")]
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-2 text-xs font-black transition xl:px-4 xl:text-sm ${
                pathname === href || pathname.startsWith(`${href}/`) ? "bg-orange-soft text-orange-deep" : "text-stone-500 hover:bg-white/70 hover:text-ink"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-stone-600">
          <Link
            href={user ? (premium ? "/profile" : "/premium") : "/register"}
            className={`inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-black shadow-card transition hover:-translate-y-0.5 sm:h-11 sm:px-4 ${
              premium ? "bg-amber-100 text-amber-800" : "bg-gradient-to-r from-orange-brand to-orange-hot text-white"
            }`}
          >
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">{premium ? "Premium" : t("common.premium")}</span>
          </Link>
          {user ? (
            <button onClick={handleLogout} aria-label={t("settings.logout")} className="warm-focus flex h-11 w-11 items-center justify-center rounded-full border border-orange-soft/60 bg-white/85 shadow-soft transition hover:-translate-y-0.5 hover:bg-orange-soft">
              <LogOut className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
