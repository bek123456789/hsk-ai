import { NextResponse } from "next/server";
import { getAIEnvStatus, getAIHealthMessage } from "@/lib/env";
import type { AppLanguage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const languageParam = new URL(request.url).searchParams.get("language");
  const language: AppLanguage = languageParam === "ru" || languageParam === "en" ? languageParam : "uz";
  const status = getAIEnvStatus();

  return NextResponse.json({
    ...status,
    message: getAIHealthMessage(language, status)
  });
}
