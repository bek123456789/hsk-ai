import { NextResponse } from "next/server";
import { getStripeCheckoutReady, getStripeDeploymentReady, getStripeEnvStatus, getWebhookSecretMissingMessage } from "@/lib/env";
import type { AppLanguage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const languageParam = new URL(request.url).searchParams.get("language");
  const language: AppLanguage = languageParam === "ru" || languageParam === "en" ? languageParam : "uz";
  const details = getStripeEnvStatus();
  const checkoutReady = getStripeCheckoutReady(details);
  const deploymentReady = getStripeDeploymentReady(details);

  return NextResponse.json({
    ok: checkoutReady,
    deploymentReady,
    ...details,
    ...(!details.webhookSecretConfigured ? { message: getWebhookSecretMissingMessage(language) } : {})
  });
}
