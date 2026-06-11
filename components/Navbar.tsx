"use client";

import { Bot, Crown, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { t } = useI18n();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-cream/78 backdrop-blur-2xl dark:border-white/10 dark:bg-obsidian/76">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow">
            <Bot className="h-6 w-6" />
            <Sparkles className="absolute -right-1 -top-1 h-4 w-4 fill-amber-200 text-amber-200" />
          </span>
          <span className="text-xl font-black tracking-normal text-ink dark:text-cream">HSK AI</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {[
            ["/dashboard", t("nav.learn")],
            ["/roadmap", t("nav.roadmap")],
            ["/exam", t("nav.exam")],
            ["/progress", t("nav.stats")]
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                pathname === href ? "bg-orange-soft text-orange-deep" : "text-stone-500 hover:bg-white/70 hover:text-ink dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-cream"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
          <ThemeToggle />
          <Link
            href={user ? "/settings" : "/register"}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-3 text-sm font-black text-white shadow-card transition hover:-translate-y-0.5 sm:px-4"
          >
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">{t("common.premium")}</span>
          </Link>
          {user ? (
            <button onClick={handleLogout} aria-label={t("settings.logout")} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 shadow-soft transition hover:-translate-y-0.5 dark:bg-white/10">
              <LogOut className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
