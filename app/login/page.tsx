import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      mode="login"
      title={{ uz: "Hisobingizga kiring", ru: "Войдите в аккаунт" }}
      subtitle={{
        uz: "Darslaringiz, zaif so‘zlar takrori va AI yordamchini davom ettiring.",
        ru: "Продолжайте уроки, повторение слабых слов и AI-помощника."
      }}
      footer={
        {
          uz: (
            <>
              Hisobingiz yo‘qmi?{" "}
              <Link href="/register" className="font-black text-orange-brand">Hisob yaratish</Link>
              <span className="mx-2">·</span>
              <Link href="/forgot-password" className="font-black text-orange-brand">Parolni unutdingizmi?</Link>
            </>
          ),
          ru: (
            <>
              Аккаунта нет?{" "}
              <Link href="/register" className="font-black text-orange-brand">Создать аккаунт</Link>
              <span className="mx-2">·</span>
              <Link href="/forgot-password" className="font-black text-orange-brand">Забыли пароль?</Link>
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
