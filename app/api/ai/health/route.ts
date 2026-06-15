import { NextResponse } from "next/server";
import { getAIEnvStatus, getAIHealthMessage } from "@/lib/env";
import type { AppLanguage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const language: AppLanguage = new URL(request.url).searchParams.get("language") === "ru" ? "ru" : "uz";
  const status = getAIEnvStatus();

  return NextResponse.json({
    ...status,
    message: getAIHealthMessage(language, status)
  });
}
