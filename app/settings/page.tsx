"use client";

import { Bell, CreditCard, Crown, Loader2, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppButton } from "@/components/AppButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useI18n } from "@/utils/i18n";
import { getSubscriptionStatusLabel, isPremiumProfile } from "@/utils/premium";

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const { language, t } = useI18n();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [dangerOpen, setDangerOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reviewReminder, setReviewReminder] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("19:00");
  const premium = isPremiumProfile(user);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("hanziflow-last-progress-sync");
    if (stored) setLastSyncAt(stored);
    const refresh = () => {
      const now = new Date().toISOString();
      window.localStorage.setItem("hanziflow-last-progress-sync", now);
      setLastSyncAt(now);
    };
    window.addEventListener("hsk-progress-synced", refresh);
    return () => window.removeEventListener("hsk-progress-synced", refresh);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(window.localStorage.getItem("hanziflow-reminder-preferences") ?? "{}") as {
        reminderEnabled?: boolean;
        reviewReminder?: boolean;
        streakReminder?: boolean;
        reminderTime?: string;
      };
      if (typeof stored.reminderEnabled === "boolean") setReminderEnabled(stored.reminderEnabled);
      if (typeof stored.reviewReminder === "boolean") setReviewReminder(stored.reviewReminder);
      if (typeof stored.streakReminder === "boolean") setStreakReminder(stored.streakReminder);
      if (typeof stored.reminderTime === "string") setReminderTime(stored.reminderTime);
    } catch {
      // Reminder preferences are optional and local-first.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      "hanziflow-reminder-preferences",
      JSON.stringify({ reminderEnabled, reviewReminder, streakReminder, reminderTime })
    );
    if (!user?.id) return;
    const supabase = getSupabaseBrowserClient();
    void supabase
      .from("profiles")
      .update({
        reminder_enabled: reminderEnabled,
        reminder_time: reminderTime,
        review_reminder_enabled: reviewReminder,
        streak_reminder_enabled: streakReminder,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);
  }, [reminderEnabled, reminderTime, reviewReminder, streakReminder, user?.id]);

  async function openPortal() {
    setPortalLoading(true);
    setPortalError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error(language === "ru" ? "Сначала войдите в аккаунт" : "Avval tizimga kiring");
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ language })
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || (language === "ru" ? "Не удалось открыть страницу подписки" : "Obuna sahifasini ochib bo‘lmadi"));
      window.location.href = result.url;
    } catch (error) {
      setPortalError(error instanceof Error ? error.message : language === "ru" ? "Не удалось открыть страницу подписки" : "Obuna sahifasini ochib bo‘lmadi");
    } finally {
      setPortalLoading(false);
    }
  }

  const cards = [
    { icon: Crown, title: t("common.premium"), detail: "HanziFlow AI", action: premium ? "Premium faol" : "Bepul reja" },
    { icon: ShieldCheck, title: t("settings.browserStorage"), detail: user?.email || "HanziFlow AI", action: "Lokal saqlash" }
  ];

  const syncTime = lastSyncAt
    ? new Date(lastSyncAt).toLocaleString("uz-UZ", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;

  function handleLocalReset() {
    if (confirmText.trim() !== "TOZALASH") return;
    resetProgress();
    setConfirmText("");
    setDangerOpen(false);
    setResetMessage(language === "ru" ? "Локальный прогресс очищен." : "Lokal rivojlanish tozalandi.");
  }

  return (
    <ProtectedRoute>
      <section className="premium-grid mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-normal text-orange-deep">{t("nav.settings")}</p>
          <h1 className="mt-2 text-5xl font-black text-ink sm:text-7xl">{t("settings.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-stone-600">{t("settings.subtitle")}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-5xl border border-orange-soft/70 bg-gradient-to-br from-white via-cream to-orange-soft/40 p-6 shadow-premium backdrop-blur-xl md:col-span-2">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-brand to-orange-hot text-white shadow-glow">
                  <Crown className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Статус подписки" : "Obuna holati"}</h2>
                <p className="mt-2 font-semibold text-stone-600">{getSubscriptionStatusLabel(user?.subscriptionStatus, language)}</p>
                <p className="mt-3 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-orange-deep shadow-soft">
                  {language === "ru" ? "Подписка в тестовом режиме · Реальные деньги не списываются" : "Obuna test rejimida · Real pul yechilmaydi"}
                </p>
                {portalError ? <p className="mt-3 rounded-3xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">{portalError}</p> : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <AppButton href={premium ? "/usage" : "/premium"}>
                  {premium ? (language === "ru" ? "Возможности Premium" : "Premium imkoniyatlari") : (language === "ru" ? "Перейти на Premium" : "Premiumga o‘tish")}
                </AppButton>
                {user?.stripeCustomerId ? (
                  <button onClick={() => void openPortal()} disabled={portalLoading} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-6 py-3.5 text-sm font-black text-ink shadow-soft transition hover:-translate-y-1 disabled:opacity-60">
                    {portalLoading ? <Loader2 className="h-5 w-5 animate-spin text-orange-brand" /> : <CreditCard className="h-5 w-5 text-orange-brand" />}
                    {language === "ru" ? "Управлять подпиской" : "Obunani boshqarish"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl md:col-span-2">
            <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Использование и помощь" : "Foydalanish va yordam"}</h2>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <AppButton href="/usage" variant="secondary">{language === "ru" ? "Лимиты AI" : "AI limitlari"}</AppButton>
              <AppButton href="/referral" variant="secondary">{language === "ru" ? "Пригласить друга" : "Do‘st taklif qilish"}</AppButton>
              <AppButton href="/help" variant="secondary">{language === "ru" ? "Центр помощи" : "Yordam markazi"}</AppButton>
            </div>
          </div>
          <div className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep">
              <Bell className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Напоминания" : "Eslatmalar"}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">
              {language === "ru" ? "Здесь сохраняются предпочтения. Настоящие push-уведомления пока не включены." : "Bu yerda eslatma sozlamalari saqlanadi. Hozircha haqiqiy push bildirishnoma yoqilmagan."}
            </p>
            <div className="mt-5 space-y-3">
              <label className="flex items-center justify-between gap-4 rounded-3xl bg-cream px-4 py-3 text-sm font-black text-ink">
                <span>{language === "ru" ? "Ежедневное напоминание" : "Kunlik eslatma"}</span>
                <input type="checkbox" checked={reminderEnabled} onChange={(event) => setReminderEnabled(event.target.checked)} className="h-5 w-5 accent-orange-brand" />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-3xl bg-cream px-4 py-3 text-sm font-black text-ink">
                <span>{language === "ru" ? "Напоминание о повторении" : "Takrorlash eslatmasi"}</span>
                <input type="checkbox" checked={reviewReminder} onChange={(event) => setReviewReminder(event.target.checked)} className="h-5 w-5 accent-orange-brand" />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-3xl bg-cream px-4 py-3 text-sm font-black text-ink">
                <span>{language === "ru" ? "Напоминание о серии дней" : "Seriya eslatmasi"}</span>
                <input type="checkbox" checked={streakReminder} onChange={(event) => setStreakReminder(event.target.checked)} className="h-5 w-5 accent-orange-brand" />
              </label>
              <label className="block rounded-3xl bg-cream px-4 py-3 text-sm font-black text-ink">
                <span className="mb-2 block">{language === "ru" ? "Время" : "Vaqt"}</span>
                <input type="time" value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} className="min-h-11 w-full rounded-2xl border border-orange-soft bg-white px-4 font-black text-ink outline-none focus:border-orange-brand" />
              </label>
            </div>
          </div>
          <div className="rounded-5xl border border-emerald-100 bg-emerald-50/80 p-6 shadow-premium backdrop-blur-xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-emerald-700 shadow-soft">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-ink">{language === "ru" ? "Прогресс сохраняется" : "Rivojlanish saqlanmoqda"}</h2>
            <p className="mt-2 font-semibold text-stone-600">
              {user ? (language === "ru" ? "Прогресс сохраняется в вашем аккаунте." : "Rivojlanish hisobingizda saqlanadi.") : (language === "ru" ? "Войдите, чтобы сохранять прогресс в аккаунте." : "Progress hisobingizda saqlanishi uchun tizimga kiring.")}
            </p>
            {syncTime ? <p className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-soft">{language === "ru" ? "Последнее обновление" : "Oxirgi yangilanish"}: {syncTime}</p> : null}
          </div>
          {cards.map((card) => (
            <div key={card.title} className="rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-soft text-orange-deep">
                <card.icon className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-ink">{card.title}</h2>
              <p className="mt-2 font-semibold text-stone-500">{card.detail}</p>
              <p className="mt-4 rounded-full bg-cream px-4 py-2 text-sm font-black text-stone-600">{card.action}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-5xl border border-white/70 bg-white/82 p-6 shadow-premium backdrop-blur-xl">
          <h2 className="text-2xl font-black text-ink">{t("settings.session")}</h2>
          <p className="mt-2 font-semibold text-stone-500">{t("settings.loggedInAs")}: {user?.name}</p>
          <div className="mt-5">
            <AppButton
              onClick={() => {
                logout().finally(() => router.replace("/login"));
              }}
              variant="danger"
            >
              {t("settings.logout")}
            </AppButton>
          </div>
        </div>

        <div className="mt-6 rounded-5xl border border-rose-100 bg-white/82 p-6 shadow-premium backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setDangerOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <span>
              <span className="flex items-center gap-2 text-2xl font-black text-ink"><TriangleAlert className="h-6 w-6 text-rose-500" /> {language === "ru" ? "Опасная зона" : "Xavfli zona"}</span>
              <span className="mt-2 block text-sm font-semibold text-stone-500">{language === "ru" ? "Редкие действия с локальными данными." : "Lokal ma’lumotlar uchun kam ishlatiladigan amallar."}</span>
            </span>
            <span className="rounded-full bg-rose-50 px-4 py-2 text-xs font-black text-rose-700">{dangerOpen ? (language === "ru" ? "Скрыть" : "Yopish") : (language === "ru" ? "Открыть" : "Ochish")}</span>
          </button>

          {dangerOpen ? (
            <div className="mt-5 rounded-[1.6rem] border border-rose-200 bg-rose-50/70 p-5">
              <h3 className="text-xl font-black text-rose-800">{language === "ru" ? "Очистить прогресс" : "Rivojlanishni tozalash"}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-rose-700">
                {language === "ru"
                  ? "Это действие нельзя отменить. Будет очищен только локальный прогресс на этом устройстве. Данные аккаунта в Supabase не удаляются."
                  : "Bu amalni ortga qaytarib bo‘lmaydi. Faqat shu qurilmadagi lokal rivojlanish tozalanadi. Supabase hisob ma’lumotlari o‘chirilmaydi."}
              </p>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-black text-rose-800">{language === "ru" ? "Чтобы продолжить, введите TOZALASH" : "Davom etish uchun TOZALASH deb yozing"}</span>
                <input value={confirmText} onChange={(event) => setConfirmText(event.target.value)} className="min-h-12 w-full rounded-2xl border border-rose-200 bg-white px-4 font-black text-ink outline-none focus:border-rose-400" />
              </label>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => { setDangerOpen(false); setConfirmText(""); }} className="min-h-12 rounded-full bg-white px-6 py-3 text-sm font-black text-ink shadow-soft">
                  {language === "ru" ? "Отмена" : "Bekor qilish"}
                </button>
                <button type="button" onClick={handleLocalReset} disabled={confirmText.trim() !== "TOZALASH"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-black text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-45">
                  <RotateCcw className="h-4 w-4" /> {language === "ru" ? "Да, очистить" : "Ha, tozalash"}
                </button>
              </div>
            </div>
          ) : null}
          {resetMessage ? <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-black text-stone-600">{resetMessage}</p> : null}
        </div>
      </section>
    </ProtectedRoute>
  );
}
