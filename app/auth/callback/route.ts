import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerConfig } from "@/lib/supabase/server";
import { getSafeNextPath } from "@/utils/authRedirect";

function getOAuthDisplayName(metadata: Record<string, unknown> | undefined, email: string) {
  const fullName = metadata?.full_name;
  const name = metadata?.name;
  if (typeof fullName === "string" && fullName.trim()) return fullName.trim();
  if (typeof name === "string" && name.trim()) return name.trim();
  return email.split("@")[0] || "HanziFlow AI";
}

function getOAuthAvatar(metadata: Record<string, unknown> | undefined) {
  const avatar = metadata?.avatar_url;
  const picture = metadata?.picture;
  if (typeof avatar === "string" && avatar.trim()) return avatar.trim();
  if (typeof picture === "string" && picture.trim()) return picture.trim();
  return null;
}

async function ensureOAuthProfile(supabase: ReturnType<typeof createServerClient>, user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) {
  if (!user.email) return;

  const displayName = getOAuthDisplayName(user.user_metadata, user.email);
  const avatarUrl = getOAuthAvatar(user.user_metadata);
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id,name")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      name: displayName,
      current_hsk_level: 1,
      preferred_language: "uz",
      premium: false,
      subscription_status: "free",
      updated_at: now
    });
  } else if (!existing.name) {
    await supabase.from("profiles").update({ name: displayName, updated_at: now }).eq("id", user.id);
  }

  if (avatarUrl) {
    await supabase.from("profiles").update({ avatar_url: avatarUrl, updated_at: now }).eq("id", user.id);
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"), "/dashboard");
  const redirectUrl = new URL(nextPath, requestUrl.origin);
  let response = NextResponse.redirect(redirectUrl);

  const { url, anonKey } = getSupabaseServerConfig();
  if (!url || !anonKey || !code) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", requestUrl.origin));
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", requestUrl.origin));
  }

  try {
    await ensureOAuthProfile(supabase, data.user);
  } catch {
    // Profile will be retried by the client auth store; do not fail a valid OAuth login.
  }

  return response;
}
