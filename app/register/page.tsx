import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      mode="register"
      title={{ uz: "Hisob yarating", ru: "Создайте аккаунт" }}
      subtitle={{
        uz: "Xitoy tilini o‘rganishni bugunoq boshlang.",
        ru: "Начните изучать китайский в HanziFlow AI шаг за шагом."
      }}
      footer={
        {
          uz: (
            <>
              Hisobingiz bormi?{" "}
              <Link href="/login" className="font-black text-orange-brand">Kirish</Link>
            </>
          ),
          ru: (
            <>
              Уже есть аккаунт?{" "}
              <Link href="/login" className="font-black text-orange-brand">Войти</Link>
            </>
          )
        }
      }
    >
      <Suspense fallback={<div className="rounded-3xl bg-cream p-6 text-sm font-black text-stone-500">Yuklanmoqda...</div>}>
        <AuthForm mode="register" />
      </Suspense>
    </AuthShell>
  );
}
