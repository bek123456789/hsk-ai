import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="HSK AI beta hisobingizni yarating"
      subtitle="HSK 1 dan boshlang, progressingizni brauzerda saqlang va beta sinov uchun o‘quv profilini tayyorlang."
      footer={
        <>
          Hisobingiz bormi?{" "}
          <Link href="/login" className="font-black text-orange-brand">Kirish</Link>
        </>
      }
    >
      <Suspense fallback={<div className="rounded-3xl bg-cream p-6 text-sm font-black text-stone-500 dark:bg-obsidian/60 dark:text-stone-300">Yuklanmoqda...</div>}>
        <AuthForm mode="register" />
      </Suspense>
    </AuthShell>
  );
}
