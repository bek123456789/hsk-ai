import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthShell } from "@/components/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="HanziFlow AI hisobingizni yarating"
      subtitle="Xitoy tilini HSK bo‘yicha AI yordamchi bilan o‘rganishni boshlang."
      footer={
        <>
          Hisobingiz bormi?{" "}
          <Link href="/login" className="font-black text-orange-brand">Kirish</Link>
        </>
      }
    >
      <Suspense fallback={<div className="rounded-3xl bg-cream p-6 text-sm font-black text-stone-500">Yuklanmoqda...</div>}>
        <AuthForm mode="register" />
      </Suspense>
    </AuthShell>
  );
}
