"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { useI18n } from "@/utils/i18n";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const { t } = useI18n();
  const [fallbackReady, setFallbackReady] = useState(false);

  useEffect(() => {
    setFallbackReady(false);
    initializeAuth();
    const timer = window.setTimeout(() => setFallbackReady(true), 7500);
    return () => window.clearTimeout(timer);
  }, [initializeAuth, pathname]);

  useEffect(() => {
    if ((hasHydrated || fallbackReady) && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [fallbackReady, hasHydrated, pathname, router, user]);

  if ((!hasHydrated && !fallbackReady) || !user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="rounded-5xl border border-white/70 bg-white/82 p-8 text-center shadow-premium backdrop-blur-xl">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-brand" />
          <p className="mt-4 text-sm font-black text-stone-500">{t("auth.checking")}</p>
        </div>
      </div>
    );
  }

  return children;
}
