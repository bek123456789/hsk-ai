import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { appendLocalItem } from "@/utils/localLearning";

type LocalFeatureItem = { id: string };

export async function saveOptionalFeatureResult<T extends LocalFeatureItem>({
  localKey,
  table,
  localItem,
  supabasePayload
}: {
  localKey: string;
  table: string;
  localItem: T;
  supabasePayload: Record<string, unknown>;
}) {
  appendLocalItem(localKey, localItem);
  await syncOptionalFeatureResult(table, supabasePayload);
}

export async function syncOptionalFeatureResult(table: string, supabasePayload: Record<string, unknown>) {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;
    await supabase.from(table).insert({ user_id: userId, ...supabasePayload });
  } catch {
    // Optional feature tables are documented but not required. LocalStorage remains the safe fallback.
  }
}
