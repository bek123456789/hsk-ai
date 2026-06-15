import { Activity, CheckCircle2, Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AppHealthPage() {
  const development = process.env.NODE_ENV !== "production";
  const checks = development
    ? [
        ["Supabase", Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)],
        ["Stripe to‘lov sessiyasi", Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_PREMIUM_MONTHLY && process.env.STRIPE_PRICE_PREMIUM_YEARLY)],
        ["Stripe xabarnomasi", Boolean(process.env.STRIPE_WEBHOOK_SECRET)],
        ["AI yordamchi", Boolean(process.env.OPENAI_API_KEY)]
      ]
    : [];

  return (
    <section className="premium-grid mx-auto max-w-3xl px-5 pb-36 pt-10 sm:px-8 md:pb-12 lg:py-14">
      <div className="rounded-[2.5rem] bg-white/88 p-7 shadow-premium sm:p-10">
        <Activity className="h-12 w-12 text-orange-brand" />
        <h1 className="mt-5 text-4xl font-black text-ink sm:text-6xl">Ilova holati</h1>
        {!development ? (
          <p className="mt-5 flex items-center gap-3 rounded-3xl bg-cream p-5 font-black text-stone-700"><CheckCircle2 className="h-5 w-5 text-orange-brand" /> Tizim holati nazorat qilinmoqda</p>
        ) : (
          <div className="mt-7 space-y-3">{checks.map(([label, configured]) => <p key={String(label)} className="flex items-center justify-between rounded-3xl bg-cream px-5 py-4 font-black text-stone-700"><span>{String(label)}</span><span className={configured ? "text-emerald-700" : "text-rose-700"}>{configured ? "sozlangan" : "sozlanmagan"}</span></p>)}</div>
        )}
        <p className="mt-5 flex items-start gap-3 text-sm font-semibold leading-6 text-stone-500"><Wrench className="mt-0.5 h-4 w-4 shrink-0 text-orange-brand" /> Bu sahifa kalitlar, to‘lov ma’lumotlari yoki foydalanuvchi loglarini ko‘rsatmaydi.</p>
      </div>
    </section>
  );
}
