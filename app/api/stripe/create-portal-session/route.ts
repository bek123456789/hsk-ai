import { NextResponse } from "next/server";
import { getAuthenticatedServerUser } from "@/lib/supabase/server";
import { getAppUrl, getStripeServerClient } from "@/lib/stripe";
import type { AppLanguage } from "@/types";

function errorMessage(key: "auth" | "missing" | "portal", language: AppLanguage) {
  const messages = {
    uz: {
      auth: "Avval tizimga kiring",
      missing: "Sizda hali faol obuna yo‘q",
      portal: "Obuna sahifasini ochib bo‘lmadi"
    },
    ru: {
      auth: "Сначала войдите в аккаунт",
      missing: "У вас пока нет активной подписки",
      portal: "Не удалось открыть страницу подписки"
    },
    en: {
      auth: "Sign in first",
      missing: "You do not have an active subscription yet",
      portal: "Could not open the subscription page"
    }
  };
  return messages[language][key];
}

export async function POST(request: Request) {
  let language: AppLanguage = "uz";
  try {
    const body = (await request.json()) as { language?: AppLanguage };
    language = body.language === "ru" || body.language === "en" ? body.language : "uz";
  } catch {
    language = "uz";
  }

  try {
    const { user, supabase } = await getAuthenticatedServerUser(request);
    if (!user || !supabase) {
      return NextResponse.json({ error: errorMessage("auth", language) }, { status: 401 });
    }

    const { data: profile, error } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
    if (error) throw error;
    const customerId = typeof profile?.stripe_customer_id === "string" ? profile.stripe_customer_id : null;

    if (!customerId) {
      return NextResponse.json({ error: errorMessage("missing", language) }, { status: 400 });
    }

    const stripe = getStripeServerClient();
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getAppUrl()}/profile`
    });

    return NextResponse.json({ url: portal.url });
  } catch {
    return NextResponse.json({ error: errorMessage("portal", language) }, { status: 500 });
  }
}
