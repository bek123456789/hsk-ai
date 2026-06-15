"use client";

import { Award, Download, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { useI18n } from "@/utils/i18n";

export default function PublicCertificatePage() {
  const params = useParams();
  const { language } = useI18n();
  const certificateId = String(params.certificateId ?? "hanziflow");

  return (
    <main className="premium-grid min-h-screen px-5 py-10 sm:px-8 lg:py-14">
      <section className="mx-auto max-w-4xl">
        <Card className="overflow-hidden border-orange-soft/80 bg-white/92 p-0 shadow-premium">
          <div className="bg-gradient-to-br from-orange-brand via-orange-hot to-amber-300 p-8 text-center text-white sm:p-12">
            <Award className="mx-auto h-20 w-20" />
            <p className="mt-5 text-sm font-black uppercase tracking-normal">
              {language === "ru" ? "Практический сертификат HanziFlow AI" : "HanziFlow AI tayyorgarlik sertifikati"}
            </p>
            <h1 className="mt-3 text-5xl font-black">{language === "ru" ? "Сертификат практики" : "Mashq sertifikati"}</h1>
          </div>
          <div className="p-8 text-center sm:p-12">
            <p className="text-sm font-black text-stone-500">{language === "ru" ? "Номер сертификата" : "Sertifikat raqami"}</p>
            <p className="mt-2 break-words text-2xl font-black text-ink">{certificateId}</p>
            <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-6 text-stone-600">
              {language === "ru"
                ? "Это сертификат практики HanziFlow AI. Он не является официальным сертификатом."
                : "Bu HanziFlow AI mashq sertifikati. U rasmiy sertifikat emas."}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-brand px-6 py-3.5 text-sm font-black text-white shadow-glow">
                <Download className="h-5 w-5" /> {language === "ru" ? "Скачать" : "Yuklab olish"}
              </button>
              <AppButton href="/" variant="secondary">
                <Share2 className="h-5 w-5" /> HanziFlow AI
              </AppButton>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
