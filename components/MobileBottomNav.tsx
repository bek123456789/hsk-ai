"use client";

import { BookOpen, LayoutDashboard, LineChart, RotateCcw, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/utils/i18n";

const items = [
  { href: "/dashboard", labelKey: "nav.studyShort", icon: LayoutDashboard },
  { href: "/lesson", labelKey: "nav.cardsShort", icon: BookOpen },
  { href: "/review", labelKey: "nav.reviewShort", icon: RotateCcw },
  { href: "/progress", labelKey: "nav.statsShort", icon: LineChart },
  { href: "/profile", labelKey: "nav.profile", icon: UserRound }
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const hidden = pathname === "/" || ["/login", "/register", "/forgot-password"].includes(pathname);

  if (hidden) return null;

  function isActive(href: string) {
    if (href === "/lesson") return pathname === "/lesson" || pathname.startsWith("/lesson/");
    if (href === "/dashboard") return pathname === "/dashboard" || pathname.startsWith("/flashcard/") || pathname.startsWith("/quiz/");
    return pathname === href;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden">
      <nav className="mx-auto flex max-w-md justify-between rounded-full border border-white/80 bg-white/82 p-2 shadow-phone backdrop-blur-2xl dark:border-white/10 dark:bg-obsidian/82">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-[11px] font-black transition ${
                active ? "bg-gradient-to-r from-orange-brand to-orange-hot text-white shadow-card" : "text-stone-500 hover:bg-orange-soft hover:text-ink dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
