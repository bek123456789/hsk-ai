"use client";

import { Award, CalendarDays, Download, UserRound } from "lucide-react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { PremiumLock } from "@/components/PremiumLock";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import type { HSKLevel } from "@/types";
import { printCertificate } from "@/utils/certificatePdf";
import { useI18n } from "@/utils/i18n";
import { isPremiumProfile } from "@/utils/premium";

function parseLevel(value: string | string[] | undefined): HSKLevel {
  const raw = Array.isArray(value) ? value[0] : value;
  const numberValue = Number(raw);
  return numberValue >= 1 && numberValue <= 6 ? (numberValue as HSKLevel) : 1;
}

export default function CertificatePage() {
  const params = useParams();
  const level = parseLevel(params.level);
  const user = useAuthStore((state) => state.user);
  const certificate = useProgressStore((state) => state.certificates.find((item) => item.hskLevel === level));
  const bestScore = useProgressStore((state) => state.bestScoreByLevel[level] ?? 0);
  const { t } = useI18n();
  const date = certificate?.date ? new Date(certificate.date).toLocaleDateString() : new Date().toLocaleDateString();
  const premium = isPremiumProfile(user);

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 pb-36 pt-10 sm:px-8 md:pb-10 lg:py-14">
        {!premium ? <PremiumLock featureKey="certificates" /> : (
        <>
        <div className="mb-8 text-center">
          <p className="text-sm font-black text-orange-deep">{t("certificate.title")}</p>
          <h1 className="mt-2 text-5xl font-black text-ink">{t("certificate.subtitle")}</h1>
        </div>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-orange-brand/20 bg-gradient-to-br from-white via-cream to-orange-soft p-8 text-center shadow-premium sm:p-12">
          <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-orange-soft blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-lavender blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-brand to-amber-300 text-white shadow-glow">
              <Award className="h-12 w-12" />
            </div>
            <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{t("certificate.label")}</p>
            <h2 className="mt-4 text-5xl font-black text-ink">HSK {level}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-stone-600">{t("certificate.subtitle")}</p>
            <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/80 p-5 shadow-soft"><UserRound className="mx-auto mb-2 h-6 w-6 text-orange-brand" /><p className="font-black text-ink">{user?.name ?? "HanziFlow AI"}</p></div>
              <div className="rounded-3xl bg-white/80 p-5 shadow-soft"><Award className="mx-auto mb-2 h-6 w-6 text-orange-brand" /><p className="font-black text-ink">{certificate?.score ?? bestScore}%</p></div>
              <div className="rounded-3xl bg-white/80 p-5 shadow-soft"><CalendarDays className="mx-auto mb-2 h-6 w-6 text-orange-brand" /><p className="font-black text-ink">{date}</p></div>
            </div>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <AppButton href="/exam" variant="secondary">{t("nav.exam")}</AppButton>
              <button onClick={printCertificate} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-4 text-sm font-black text-white shadow-card">
                <Download className="h-5 w-5" /> {t("certificate.share")}
              </button>
            </div>
          </div>
        </div>
        </>
        )}
      </section>
    </ProtectedRoute>
  );
}
