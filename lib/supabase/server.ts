import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  };
}

export function getSupabaseServerClient(accessToken: string) {
  const { url, anonKey } = getSupabaseServerConfig();
  if (!url || !anonKey) throw new Error("Supabase sozlamalari topilmadi.");

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}

export function getSupabaseAdminClient() {
  const { url, serviceRoleKey } = getSupabaseServerConfig();
  if (!url || !serviceRoleKey) throw new Error("Supabase service role sozlamalari topilmadi.");

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function getAuthenticatedServerUser(request: Request) {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
  if (!token) return { user: null, supabase: null, token: null };

  const supabase = getSupabaseServerClient(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) return { user: null, supabase, token };

  return { user: data.user, supabase, token };
}
