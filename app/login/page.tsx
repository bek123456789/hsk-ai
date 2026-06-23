import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      mode="login"
      title={{ uz: "Hisobingizga kiring", ru: "Войдите в аккаунт", en: "Sign in to your account" }}
      subtitle={{
        uz: "Hisobingizga kiring va o‘qishni davom ettiring.",
        ru: "Продолжайте уроки, повторение слабых слов и AI-помощника.",
        en: "Sign in and continue your lessons, weak-word review, and AI Coach."
      }}
      footer={
        {
          uz: (
            <>
              Hisobingiz yo‘qmi?{" "}
              <Link href="/register" className="font-black text-orange-brand">Hisob yaratish</Link>
            </>
          ),
          ru: (
            <>
              Аккаунта нет?{" "}
              <Link href="/register" className="font-black text-orange-brand">Создать аккаунт</Link>
            </>
          ),
          en: (
            <>
              Don’t have an account?{" "}
              <Link href="/register" className="font-black text-orange-brand">Create account</Link>
            </>
          )
        }
      }
    >
      <Suspense fallback={<div className="rounded-3xl bg-cream p-6 text-sm font-black text-stone-500">Yuklanmoqda...</div>}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
