"use client";

import { BookOpen, Dumbbell, House, Trophy, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/utils/i18n";

const items = [
  { href: "/dashboard", labelKey: "nav.homeShort", icon: House },
  { href: "/lessons", labelKey: "nav.lessonsShort", icon: BookOpen },
  { href: "/practice", labelKey: "nav.practiceShort", icon: Dumbbell },
  { href: "/exam", labelKey: "nav.examShort", icon: Trophy },
  { href: "/profile", labelKey: "nav.profile", icon: UserRound }
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const hidden = pathname === "/" || ["/login", "/register", "/forgot-password", "/onboarding"].includes(pathname) || pathname.startsWith("/auth/");

  if (hidden) return null;

  function isActive(href: string) {
    if (href === "/lessons") return pathname === "/lesson" || pathname.startsWith("/lesson/") || pathname === "/lessons" || pathname.startsWith("/lessons/");
    if (href === "/practice") {
      return (
        pathname === "/practice" ||
        pathname === "/review" ||
        pathname.startsWith("/flashcard/") ||
        pathname.startsWith("/quiz/") ||
        pathname.startsWith("/reading") ||
        pathname.startsWith("/listening") ||
        pathname.startsWith("/writing") ||
        pathname.startsWith("/speaking") ||
        pathname.startsWith("/grammar") ||
        pathname.startsWith("/mini-lessons") ||
        pathname.startsWith("/listening-lab") ||
        pathname.startsWith("/dictation") ||
        pathname.startsWith("/mistake-notebook") ||
        pathname.startsWith("/ai-explainer") ||
        pathname.startsWith("/games") ||
        pathname.startsWith("/stroke-order") ||
        pathname.startsWith("/sentence-builder") ||
        pathname.startsWith("/conversation") ||
        pathname.startsWith("/voice-conversation")
      );
    }
    if (href === "/exam") return pathname === "/exam" || pathname.startsWith("/exam/") || pathname.startsWith("/placement-test") || pathname.startsWith("/exam-coach") || pathname.startsWith("/certificate");
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/roadmap" || pathname === "/progress-map" || pathname === "/progress" || pathname === "/daily-plan";
    if (href === "/profile") return pathname === "/profile" || pathname === "/settings" || pathname === "/usage" || pathname === "/referral" || pathname === "/study-calendar" || pathname === "/achievements" || pathname.startsWith("/help");
    return pathname === href;
  }

  return (
    <div className="fixed inset-x-0 z-50 px-3 md:hidden" style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <nav className="mx-auto flex max-w-md justify-between rounded-[1.6rem] border border-orange-soft/70 bg-white/94 p-1.5 shadow-phone backdrop-blur-2xl">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.2rem] px-1.5 py-1.5 text-[10px] font-black transition ${
                active ? "bg-gradient-to-r from-orange-brand to-orange-hot text-white shadow-card" : "text-stone-500 hover:bg-orange-soft hover:text-ink"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
