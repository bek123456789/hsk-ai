import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="HSK AI kirishini tiklash"
      subtitle="Supabase parolni tiklash emailini yuboradi va keyinchalik to‘liq hisob boshqaruviga ulanadi."
      footer={
        <>
          Esladingizmi?{" "}
          <Link href="/login" className="font-black text-orange-brand">Kirishga qaytish</Link>
        </>
      }
    >
      <Suspense fallback={<div className="rounded-3xl bg-cream p-6 text-sm font-black text-stone-500 dark:bg-obsidian/60 dark:text-stone-300">Yuklanmoqda...</div>}>
        <AuthForm mode="forgot" />
      </Suspense>
    </AuthShell>
  );
}
