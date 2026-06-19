import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hskLessonCurriculum } from "../data/hsk/lessonCurriculum";
import { vocabularyEntries } from "../data/hsk/vocabulary";

const testEmail = "test@hanziflow.ai";
const testPassword = "Test123456!";
const now = new Date();
const nowIso = now.toISOString();
const oneYearIso = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

type SeedSummary = {
  seeded: string[];
  skipped: string[];
};

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!key || process.env[key]) continue;
    const rawValue = rest.join("=").trim();
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function missingColumnName(message: string) {
  return message.match(/'([^']+)' column/)?.[1] ?? message.match(/column "([^"]+)" does not exist/)?.[1] ?? null;
}

function isMissingTableError(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  const message = error.message ?? "";
  return error.code === "42P01" || error.code === "PGRST205" || /relation .* does not exist|Could not find the table/i.test(message);
}

async function safeDeleteByUser(supabase: SupabaseClient, table: string, userId: string, summary: SeedSummary) {
  const { error } = await supabase.from(table).delete().eq("user_id", userId);
  if (!error) return true;
  if (isMissingTableError(error)) {
    summary.skipped.push(`${table} (jadval topilmadi)`);
    return false;
  }
  summary.skipped.push(`${table} delete (${error.message})`);
  return false;
}

async function safeInsertRows(supabase: SupabaseClient, table: string, rows: Array<Record<string, unknown>>, summary: SeedSummary) {
  if (!rows.length) return;
  let workingRows = rows.map((row) => ({ ...row }));
  const removedColumns = new Set<string>();

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const { error } = await supabase.from(table).insert(workingRows);
    if (!error) {
      summary.seeded.push(removedColumns.size ? `${table} (missing ustunlar o‘tkazildi: ${[...removedColumns].join(", ")})` : table);
      return;
    }

    if (isMissingTableError(error)) {
      summary.skipped.push(`${table} (jadval topilmadi)`);
      return;
    }

    const column = missingColumnName(error.message);
    if (column && workingRows.some((row) => Object.prototype.hasOwnProperty.call(row, column))) {
      removedColumns.add(column);
      workingRows = workingRows.map((row) => {
        const next = { ...row };
        delete next[column];
        return next;
      });
      continue;
    }

    summary.skipped.push(`${table} (${error.message})`);
    return;
  }

  summary.skipped.push(`${table} (ustunlarni moslashtirish limiti tugadi)`);
}

async function safeUpsertOne(supabase: SupabaseClient, table: string, row: Record<string, unknown>, summary: SeedSummary, onConflict = "id") {
  let workingRow = { ...row };
  const removedColumns = new Set<string>();

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const { error } = await supabase.from(table).upsert(workingRow, { onConflict });
    if (!error) {
      summary.seeded.push(removedColumns.size ? `${table} (missing ustunlar o‘tkazildi: ${[...removedColumns].join(", ")})` : table);
      return;
    }

    if (isMissingTableError(error)) {
      summary.skipped.push(`${table} (jadval topilmadi)`);
      return;
    }

    const column = missingColumnName(error.message);
    if (column && Object.prototype.hasOwnProperty.call(workingRow, column)) {
      removedColumns.add(column);
      delete workingRow[column];
      continue;
    }

    summary.skipped.push(`${table} (${error.message})`);
    return;
  }

  summary.skipped.push(`${table} (ustunlarni moslashtirish limiti tugadi)`);
}

async function findUserByEmail(supabase: SupabaseClient, email: string) {
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const user = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (data.users.length < 100) return null;
  }
  return null;
}

async function createOrUpdateAuthUser(supabase: SupabaseClient) {
  const metadata = { display_name: "Test User", name: "Test User" };
  const created = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: metadata
  });

  if (!created.error && created.data.user) return created.data.user;

  const existing = await findUserByEmail(supabase, testEmail);
  if (!existing) throw created.error;

  const updated = await supabase.auth.admin.updateUserById(existing.id, {
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: {
      ...(existing.user_metadata ?? {}),
      ...metadata
    }
  });
  if (updated.error || !updated.data.user) throw updated.error;
  return updated.data.user;
}

function lessonProgressRows(userId: string) {
  return hskLessonCurriculum.map((lesson) => ({
    user_id: userId,
    lesson_id: lesson.id,
    level: lesson.level,
    completed_sections: ["vocabulary", "grammar", "reading", "listening", "speaking", "miniTest"],
    sections: {
      vocabulary: true,
      grammar: true,
      reading: true,
      listening: true,
      speaking: true,
      miniTest: true
    },
    progress: 100,
    quiz_score: 95,
    quiz_total: 100,
    completed: true,
    done: true,
    completed_at: nowIso,
    updated_at: nowIso
  }));
}

function examRows(userId: string) {
  const scores = [92, 90, 88, 86, 85, 84];
  return scores.map((score, index) => {
    const level = index + 1;
    return {
      user_id: userId,
      hsk_level: level,
      level,
      score,
      total_questions: 100,
      accuracy: score,
      total: 100,
      overall_score: score,
      passing_score: 80,
      passed: true,
      section_scores: {
        listening: Math.min(95, score + 2),
        reading: Math.min(95, score + 1),
        speaking: Math.max(80, score - 4),
        writing: Math.max(80, score - 5)
      },
      weak_skills: [],
      recommended_lesson_ids: [],
      answers: {},
      created_at: new Date(now.getTime() - (6 - level) * 60_000).toISOString()
    };
  });
}

function reviewRows(userId: string) {
  return vocabularyEntries
    .filter((word) => word.level === 1 || word.level === 2)
    .slice(0, 20)
    .map((word) => ({
      user_id: userId,
      word_id: word.id,
      level: word.level,
      hsk_level: word.level,
      lesson_id: null,
      status: "review",
      source: "seed",
      ease: 3,
      interval_days: 1,
      due_at: nowIso,
      correct_count: 3,
      wrong_count: 1,
      last_reviewed_at: nowIso,
      updated_at: nowIso
    }));
}

function dailyMissionRows(userId: string) {
  const today = nowIso.slice(0, 10);
  return [
    ["lesson", "lesson", 30],
    ["review", "review", 20],
    ["speaking", "speaking", 20],
    ["listening", "listening", 20],
    ["ai-coach", "ai", 15]
  ].map(([taskId, taskType, xp]) => ({
    user_id: userId,
    mission_date: today,
    task_id: taskId,
    task_type: taskType,
    completed: true,
    xp_awarded: xp,
    completed_at: nowIso,
    updated_at: nowIso
  }));
}

function achievementRows(userId: string) {
  return [
    "first_lesson_completed",
    "hsk1_exam_passed",
    "hsk2_exam_passed",
    "review_champion",
    "first_ai_tutor_chat",
    "speaking_practice_completed"
  ].map((achievementId) => ({
    user_id: userId,
    achievement_id: achievementId,
    unlocked: true,
    unlocked_at: nowIso,
    progress: 100,
    source: "seed"
  }));
}

async function main() {
  loadLocalEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY kerak.");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const summary: SeedSummary = { seeded: [], skipped: [] };

  const user = await createOrUpdateAuthUser(supabase);
  const userId = user.id;

  await safeUpsertOne(supabase, "profiles", {
    id: userId,
    user_id: userId,
    email: testEmail,
    name: "Test User",
    display_name: "Test User",
    target_hsk_level: 6,
    current_hsk_level: 6,
    daily_goal_minutes: 30,
    preferred_language: "uz",
    ui_language: "uz",
    onboarding_completed: true,
    onboarding_completed_at: nowIso,
    subscription_status: "beta_premium",
    subscription_plan: "test",
    premium: true,
    premium_until: oneYearIso,
    xp: 9999,
    streak_count: 30,
    reminder_enabled: true,
    reminder_time: "19:00",
    updated_at: nowIso
  }, summary);

  if (await safeDeleteByUser(supabase, "lesson_progress", userId, summary)) {
    await safeInsertRows(supabase, "lesson_progress", lessonProgressRows(userId), summary);
  }

  if (await safeDeleteByUser(supabase, "exam_results", userId, summary)) {
    await safeInsertRows(supabase, "exam_results", examRows(userId), summary);
  }

  if (await safeDeleteByUser(supabase, "review_items", userId, summary)) {
    await safeInsertRows(supabase, "review_items", reviewRows(userId), summary);
  }

  if (await safeDeleteByUser(supabase, "daily_missions", userId, summary)) {
    await safeInsertRows(supabase, "daily_missions", dailyMissionRows(userId), summary);
  }

  if (await safeDeleteByUser(supabase, "user_achievements", userId, summary)) {
    await safeInsertRows(supabase, "user_achievements", achievementRows(userId), summary);
  }

  console.log("Test user created/updated.");
  console.log(`User ID: ${userId}`);
  console.log(`Email: ${testEmail}`);
  console.log(`Seeded tables: ${summary.seeded.length ? [...new Set(summary.seeded)].join(", ") : "none"}`);
  console.log(`Skipped optional tables: ${summary.skipped.length ? [...new Set(summary.skipped)].join(", ") : "none"}`);
}

main().catch((error) => {
  console.error(`Seed failed: ${error instanceof Error ? error.message : "unknown error"}`);
  process.exit(1);
});
