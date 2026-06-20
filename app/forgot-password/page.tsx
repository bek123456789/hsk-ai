import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      mode="forgot"
      title={{ uz: "Parolni tiklash", ru: "Восстановление пароля" }}
      subtitle={{
        uz: "Emailingizni kiriting, tiklash havolasini yuboramiz.",
        ru: "Введите email, и мы отправим ссылку для восстановления."
      }}
      footer={
        {
          uz: (
            <>
              Esladingizmi?{" "}
              <Link href="/login" className="font-black text-orange-brand">Kirishga qaytish</Link>
            </>
          ),
          ru: (
            <>
              Вспомнили пароль?{" "}
              <Link href="/login" className="font-black text-orange-brand">Вернуться ко входу</Link>
            </>
          )
        }
      }
    >
      <Suspense fallback={<div className="rounded-3xl bg-cream p-6 text-sm font-black text-stone-500">Yuklanmoqda...</div>}>
        <AuthForm mode="forgot" />
      </Suspense>
    </AuthShell>
  );
}
