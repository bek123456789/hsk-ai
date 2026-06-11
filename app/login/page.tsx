import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="HSK AI o‘quv markaziga qaytdingiz"
      subtitle="Supabase hisobingiz orqali kiring va HSK seriyangiz, zaif so‘zlar takrori hamda AI tutor mashqlarini davom ettiring."
      footer={
        <>
          HSK AI da yangimisiz?{" "}
          <Link href="/register" className="font-black text-orange-brand">Hisob yaratish</Link>
          <span className="mx-2">·</span>
          <Link href="/forgot-password" className="font-black text-orange-brand">Parolni unutdingizmi?</Link>
        </>
      }
    >
      <Suspense fallback={<div className="rounded-3xl bg-cream p-6 text-sm font-black text-stone-500 dark:bg-obsidian/60 dark:text-stone-300">Yuklanmoqda...</div>}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
