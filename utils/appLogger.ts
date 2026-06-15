export type AppErrorEvent =
  | "stripe_checkout_error"
  | "stripe_webhook_error"
  | "ai_usage_limit_reached"
  | "ai_request_error"
  | "supabase_save_error"
  | "speech_recognition_error"
  | "premium_unlock_error";

type LogInput = {
  eventType: AppErrorEvent;
  message: string;
  metadata?: Record<string, string | number | boolean | null>;
  accessToken?: string | null;
};

function safeMetadata(metadata?: LogInput["metadata"]) {
  if (!metadata) return {};
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([key]) => !/(secret|token|key|card|payment)/i.test(key))
      .slice(0, 12)
  );
}

export async function logAppError(input: LogInput) {
  const payload = {
    eventType: input.eventType,
    message: input.message.slice(0, 500),
    metadata: safeMetadata(input.metadata),
    pageUrl: typeof window !== "undefined" ? window.location.pathname : null
  };

  if (process.env.NODE_ENV !== "production") {
    console.warn("[HanziFlow AI]", payload);
  }

  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem("hsk-ai-error-log") ?? "[]") as unknown[];
      localStorage.setItem("hsk-ai-error-log", JSON.stringify([...existing.slice(-19), { ...payload, createdAt: new Date().toISOString() }]));
    } catch {
      // Logging must never block the user flow.
    }
  }

  try {
    await fetch("/api/app-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(input.accessToken ? { Authorization: `Bearer ${input.accessToken}` } : {})
      },
      body: JSON.stringify(payload)
    });
  } catch {
    // Local logging remains available when the server is offline.
  }
}
