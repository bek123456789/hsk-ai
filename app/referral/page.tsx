"use client";

import { Check, Copy, Gift, Loader2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useI18n } from "@/utils/i18n";

export default function ReferralPage() {
  const { language } = useI18n();
  const [code, setCode] = useState("");
  const [bonusDays, setBonusDays] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;
        const response = await fetch("/api/referral", { headers: { Authorization: `Bearer ${token}` } });
        const result = (await response.json()) as { referralCode?: string; bonusDays?: number };
        setCode(result.referralCode ?? "");
        setBonusDays(result.bonusDays ?? 0);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const inviteUrl = typeof window !== "undefined" && code ? `${window.location.origin}/register?ref=${encodeURIComponent(code)}` : "";

  async function copyLink() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-12 lg:py-14">
        <div className="rounded-[2.5rem] border border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/45 p-7 shadow-premium sm:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow"><Gift className="h-8 w-8" /></div>
          <h1 className="mt-6 text-5xl font-black text-ink sm:text-7xl">{language === "ru" ? "Пригласить друга" : "Do‘st taklif qilish"}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">{language === "ru" ? "Получите бонус, если друг зарегистрируется" : "Do‘stingiz ro‘yxatdan o‘tsa bonus olasiz"}</p>

          <div className="mt-8 rounded-[2rem] bg-white/90 p-5 shadow-soft">
            {loading ? <Loader2 className="mx-auto h-7 w-7 animate-spin text-orange-brand" /> : (
              <>
                <p className="text-sm font-black text-stone-500">{language === "ru" ? "Ваша ссылка" : "Sizning havolangiz"}</p>
                <p className="mt-2 break-all rounded-2xl bg-cream px-4 py-3 text-sm font-black text-ink">{inviteUrl}</p>
                <button onClick={() => void copyLink()} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-4 text-sm font-black text-white shadow-card sm:w-auto">
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  {copied ? (language === "ru" ? "Ссылка скопирована" : "Havola nusxalandi") : (language === "ru" ? "Скопировать ссылку" : "Havolani nusxalash")}
                </button>
              </>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-3xl bg-orange-soft px-5 py-4 font-black text-orange-deep">
            <Share2 className="h-5 w-5" /> {language === "ru" ? `Бонусных дней: ${bonusDays}` : `Bonus kunlari: ${bonusDays}`}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
