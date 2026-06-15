"use client";

import { Download, Flame, Share2, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";

export default function ShareStreakPage() {
  const { language } = useI18n();
  const streak = useProgressStore((state) => state.streak);
  const level = useProgressStore((state) => state.currentLevel);
  const learned = useProgressStore((state) => state.knownWordIds.length);
  const xp = useProgressStore((state) => state.xp);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [notice, setNotice] = useState("");

  function renderCard() {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, "#fff8ec");
    gradient.addColorStop(1, "#ffd7ad");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "#ff7a1a";
    ctx.beginPath(); ctx.roundRect(90, 90, 900, 900, 70); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 64px sans-serif"; ctx.fillText("HanziFlow AI", 150, 210);
    ctx.font = "900 130px sans-serif"; ctx.fillText(`${streak} ${language === "ru" ? "дней" : "kun"}`, 150, 430);
    ctx.font = "800 52px sans-serif"; ctx.fillText(`HSK ${level}  ·  ${learned} ${language === "ru" ? "слов" : "so‘z"}`, 150, 570);
    ctx.fillStyle = "#fff1df"; ctx.beginPath(); ctx.roundRect(150, 680, 780, 150, 40); ctx.fill();
    ctx.fillStyle = "#7c3b08"; ctx.font = "800 44px sans-serif"; ctx.fillText(`${xp} XP`, 205, 775);
    ctx.fillStyle = "#ffffff"; ctx.font = "700 34px sans-serif"; ctx.fillText(language === "ru" ? "Я учусь в HanziFlow AI" : "Men HanziFlow AI’da o‘rganyapman", 150, 920);
    return canvas;
  }

  function download() {
    const canvas = renderCard();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "hanziflow-seriya.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setNotice(language === "ru" ? "Карточка сохранена." : "Karta saqlandi.");
  }

  async function share() {
    const canvas = renderCard();
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob && navigator.share && navigator.canShare?.({ files: [new File([blob], "hanziflow.png", { type: "image/png" })] })) {
      await navigator.share({ files: [new File([blob], "hanziflow.png", { type: "image/png" })], title: "HanziFlow AI" });
      return;
    }
    download();
  }

  return (
    <ProtectedRoute>
      <PageShell className="max-w-5xl">
        <PageHeader eyebrow="HanziFlow AI" title={language === "ru" ? "Карточка серии" : "Seriya kartasi"} description={language === "ru" ? "Поделитесь своим сегодняшним результатом с друзьями." : "Bugungi natijangizni do‘stlaringiz bilan ulashing."} icon={Flame} />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
          <div className="rounded-[2rem] bg-gradient-to-br from-orange-brand to-orange-hot p-8 text-white shadow-glow">
            <Sparkles className="h-9 w-9" />
            <p className="mt-8 text-sm font-black uppercase">{language === "ru" ? "Мой результат сегодня" : "Bugungi natijam"}</p>
            <p className="mt-2 text-7xl font-black">{streak}</p>
            <p className="text-xl font-black">{language === "ru" ? "дней подряд" : "kunlik seriya"}</p>
            <div className="mt-7 rounded-3xl bg-white/18 p-5 font-black">HSK {level} · {learned} {language === "ru" ? "слов" : "so‘z"} · {xp} XP</div>
            <p className="mt-7 font-bold">{language === "ru" ? "Я учусь в HanziFlow AI" : "Men HanziFlow AI’da o‘rganyapman"}</p>
          </div>
          <div className="rounded-[2rem] bg-white/88 p-6 shadow-premium">
            <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Поделиться с друзьями" : "Do‘stlar bilan ulashish"}</h2>
            <div className="mt-6 grid gap-3">
              <button onClick={() => void share()} className="warm-focus inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-brand to-orange-hot px-6 py-4 text-sm font-black text-white shadow-glow"><Share2 className="h-5 w-5" /> {language === "ru" ? "Поделиться" : "Ulashish"}</button>
              <button onClick={download} className="warm-focus inline-flex items-center justify-center gap-2 rounded-full border border-orange-soft bg-white px-6 py-4 text-sm font-black text-ink shadow-soft"><Download className="h-5 w-5 text-orange-brand" /> {language === "ru" ? "Скачать изображение" : "Rasmni yuklab olish"}</button>
            </div>
            {notice ? <p className="mt-4 rounded-2xl bg-orange-soft p-3 text-sm font-black text-orange-deep">{notice}</p> : null}
          </div>
        </div>
        <canvas ref={canvasRef} width={1080} height={1080} className="hidden" />
      </PageShell>
    </ProtectedRoute>
  );
}
