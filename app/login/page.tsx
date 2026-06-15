import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="HanziFlow AI hisobingizga kiring"
      subtitle="HSK darslaringiz, zaif so‘zlar takrori va AI yordamchi mashqlarini davom ettiring."
      footer={
        <>
          HanziFlow AI’da yangimisiz?{" "}
          <Link href="/register" className="font-black text-orange-brand">Hisob yaratish</Link>
          <span className="mx-2">·</span>
          <Link href="/forgot-password" className="font-black text-orange-brand">Parolni unutdingizmi?</Link>
        </>
      }
    >
      <Suspense fallback={<div className="rounded-3xl bg-cream p-6 text-sm font-black text-stone-500">Yuklanmoqda...</div>}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
