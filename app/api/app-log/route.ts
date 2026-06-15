import { NextResponse } from "next/server";
import { getAuthenticatedServerUser, getSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const allowedEvents = new Set([
  "stripe_checkout_error",
  "stripe_webhook_error",
  "ai_usage_limit_reached",
  "ai_request_error",
  "supabase_save_error",
  "speech_recognition_error",
  "premium_unlock_error"
]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      eventType?: unknown;
      message?: unknown;
      metadata?: unknown;
      pageUrl?: unknown;
    };
    if (typeof body.eventType !== "string" || !allowedEvents.has(body.eventType) || typeof body.message !== "string") {
      return NextResponse.json({ error: "Noto‘g‘ri jurnal ma’lumoti" }, { status: 400 });
    }

    const { user } = await getAuthenticatedServerUser(request);
    const row = {
      user_id: user?.id ?? null,
      event_type: body.eventType,
      message: body.message.slice(0, 500),
      metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : {},
      page_url: typeof body.pageUrl === "string" ? body.pageUrl.slice(0, 300) : null
    };

    try {
      const supabase = getSupabaseAdminClient();
      const { error } = await supabase.from("app_errors").insert(row);
      if (error) throw error;
    } catch {
      if (process.env.NODE_ENV !== "production") console.warn("[HanziFlow AI jurnal]", row);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Jurnal yozilmadi" }, { status: 400 });
  }
}
