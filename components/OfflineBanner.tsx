"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/utils/i18n";

export function OfflineBanner() {
  const { language } = useI18n();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-x-4 top-24 z-50 mx-auto flex max-w-xl items-center gap-3 rounded-full border border-orange-soft bg-cream px-5 py-3 text-sm font-black text-orange-deep shadow-premium">
      <WifiOff className="h-5 w-5" />
      {language === "ru" ? "Нет интернета. Прогресс синхронизируется позже." : "Internet yo‘q. Progress keyin sinxronlanadi."}
    </div>
  );
}
