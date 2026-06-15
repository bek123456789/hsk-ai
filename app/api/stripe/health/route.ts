import { NextResponse } from "next/server";
import { getStripeCheckoutReady, getStripeDeploymentReady, getStripeEnvStatus, getWebhookSecretMissingMessage } from "@/lib/env";
import type { AppLanguage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const language: AppLanguage = new URL(request.url).searchParams.get("language") === "ru" ? "ru" : "uz";
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
