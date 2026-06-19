create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  current_hsk_level int default 1,
  preferred_language text default 'uz',
  premium boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'free',
  subscription_plan text,
  stripe_price_id text,
  current_period_end timestamptz,
  premium_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists subscription_status text default 'free';
alter table public.profiles add column if not exists subscription_plan text;
alter table public.profiles add column if not exists stripe_price_id text;
alter table public.profiles add column if not exists current_period_end timestamptz;
alter table public.profiles add column if not exists premium_until timestamptz;
alter table public.profiles add column if not exists updated_at timestamptz default now();
alter table public.profiles add column if not exists trial_started_at timestamptz;
alter table public.profiles add column if not exists trial_ends_at timestamptz;
alter table public.profiles add column if not exists trial_used boolean default false;
alter table public.profiles add column if not exists onboarding_completed boolean default false;
alter table public.profiles add column if not exists learning_goal text;
alter table public.profiles add column if not exists daily_goal_minutes int default 10;
alter table public.profiles add column if not exists target_hsk_level int default 1;
alter table public.profiles add column if not exists reminder_enabled boolean default false;
alter table public.profiles add column if not exists reminder_time text default '19:00';
alter table public.profiles add column if not exists review_reminder_enabled boolean default true;
alter table public.profiles add column if not exists streak_reminder_enabled boolean default true;
alter table public.profiles add column if not exists ui_language text default 'uz';
alter table public.profiles add column if not exists xp int default 0;
alter table public.profiles add column if not exists streak_count int default 0;
alter table public.profiles add column if not exists last_active_at timestamptz;
alter table public.profiles add column if not exists referral_code text;
alter table public.profiles add column if not exists referred_by text;
alter table public.profiles add column if not exists referral_bonus_days int default 0;

create unique index if not exists profiles_referral_code_key
on public.profiles (referral_code)
where referral_code is not null;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url, current_hsk_level, preferred_language, premium, onboarding_completed)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    1,
    'uz',
    false,
    false
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  word_id text not null,
  hsk_level int not null,
  lesson_id text,
  status text default 'new',
  correct_count int default 0,
  wrong_count int default 0,
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  ease_level int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, word_id)
);

create table if not exists public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  word_id text not null,
  level int not null,
  lesson_id text,
  ease int default 2,
  interval_days int default 0,
  due_at timestamptz default now(),
  correct_count int default 0,
  wrong_count int default 0,
  last_reviewed_at timestamptz,
  updated_at timestamptz default now(),
  unique (user_id, word_id)
);

create table if not exists public.daily_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  mission_date date not null default current_date,
  task_id text not null,
  task_type text not null,
  completed boolean default false,
  xp_awarded int default 0,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique (user_id, mission_date, task_id)
);

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  hsk_level int not null,
  lesson_id text,
  score int not null,
  total_questions int not null,
  accuracy numeric not null,
  created_at timestamptz default now()
);

create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  hsk_level int not null,
  score int not null,
  total_questions int not null,
  accuracy numeric not null,
  time_spent_seconds int default 0,
  passed boolean default false,
  created_at timestamptz default now()
);

alter table public.exam_results
add column if not exists level int,
add column if not exists overall_score int default 0,
add column if not exists passing_score int default 80,
add column if not exists section_scores jsonb default '{}'::jsonb,
add column if not exists weak_skills jsonb default '[]'::jsonb,
add column if not exists recommended_lesson_ids jsonb default '[]'::jsonb,
add column if not exists answers jsonb default '[]'::jsonb;

create table if not exists public.weak_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  word_id text not null,
  hsk_level int not null,
  lesson_id text,
  reason text,
  created_at timestamptz default now(),
  unique(user_id, word_id)
);

create table if not exists public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  question_id text,
  word_id text,
  hsk_level int,
  user_answer text,
  correct_answer text,
  explanation_uz text,
  explanation_ru text,
  created_at timestamptz default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  hsk_level int not null,
  score int not null,
  certificate_code text unique,
  created_at timestamptz default now()
);

create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  usage_type text not null,
  count int default 1,
  date date default current_date,
  created_at timestamptz default now()
);

create index if not exists ai_usage_logs_user_date_idx
on public.ai_usage_logs (user_id, date, usage_type);

create table if not exists public.app_errors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  message text not null,
  metadata jsonb default '{}'::jsonb,
  page_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.review_items enable row level security;
alter table public.daily_missions enable row level security;
alter table public.quiz_results enable row level security;
alter table public.exam_results enable row level security;
alter table public.weak_words enable row level security;
alter table public.mistakes enable row level security;
alter table public.certificates enable row level security;
alter table public.ai_usage_logs enable row level security;
alter table public.app_errors enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

drop policy if exists "user_progress_select_own" on public.user_progress;
drop policy if exists "user_progress_insert_own" on public.user_progress;
drop policy if exists "user_progress_update_own" on public.user_progress;
drop policy if exists "user_progress_delete_own" on public.user_progress;

create policy "user_progress_select_own" on public.user_progress for select using (auth.uid() = user_id);
create policy "user_progress_insert_own" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "user_progress_update_own" on public.user_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_progress_delete_own" on public.user_progress for delete using (auth.uid() = user_id);

drop policy if exists "review_items_select_own" on public.review_items;
drop policy if exists "review_items_insert_own" on public.review_items;
drop policy if exists "review_items_update_own" on public.review_items;
drop policy if exists "review_items_delete_own" on public.review_items;

create policy "review_items_select_own" on public.review_items for select using (auth.uid() = user_id);
create policy "review_items_insert_own" on public.review_items for insert with check (auth.uid() = user_id);
create policy "review_items_update_own" on public.review_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "review_items_delete_own" on public.review_items for delete using (auth.uid() = user_id);

drop policy if exists "daily_missions_select_own" on public.daily_missions;
drop policy if exists "daily_missions_insert_own" on public.daily_missions;
drop policy if exists "daily_missions_update_own" on public.daily_missions;
drop policy if exists "daily_missions_delete_own" on public.daily_missions;

create policy "daily_missions_select_own" on public.daily_missions for select using (auth.uid() = user_id);
create policy "daily_missions_insert_own" on public.daily_missions for insert with check (auth.uid() = user_id);
create policy "daily_missions_update_own" on public.daily_missions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "daily_missions_delete_own" on public.daily_missions for delete using (auth.uid() = user_id);

drop policy if exists "quiz_results_select_own" on public.quiz_results;
drop policy if exists "quiz_results_insert_own" on public.quiz_results;
drop policy if exists "quiz_results_update_own" on public.quiz_results;
drop policy if exists "quiz_results_delete_own" on public.quiz_results;

create policy "quiz_results_select_own" on public.quiz_results for select using (auth.uid() = user_id);
create policy "quiz_results_insert_own" on public.quiz_results for insert with check (auth.uid() = user_id);
create policy "quiz_results_update_own" on public.quiz_results for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "quiz_results_delete_own" on public.quiz_results for delete using (auth.uid() = user_id);

drop policy if exists "exam_results_select_own" on public.exam_results;
drop policy if exists "exam_results_insert_own" on public.exam_results;
drop policy if exists "exam_results_update_own" on public.exam_results;
drop policy if exists "exam_results_delete_own" on public.exam_results;

create policy "exam_results_select_own" on public.exam_results for select using (auth.uid() = user_id);
create policy "exam_results_insert_own" on public.exam_results for insert with check (auth.uid() = user_id);
create policy "exam_results_update_own" on public.exam_results for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "exam_results_delete_own" on public.exam_results for delete using (auth.uid() = user_id);

drop policy if exists "weak_words_select_own" on public.weak_words;
drop policy if exists "weak_words_insert_own" on public.weak_words;
drop policy if exists "weak_words_update_own" on public.weak_words;
drop policy if exists "weak_words_delete_own" on public.weak_words;

create policy "weak_words_select_own" on public.weak_words for select using (auth.uid() = user_id);
create policy "weak_words_insert_own" on public.weak_words for insert with check (auth.uid() = user_id);
create policy "weak_words_update_own" on public.weak_words for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weak_words_delete_own" on public.weak_words for delete using (auth.uid() = user_id);

drop policy if exists "mistakes_select_own" on public.mistakes;
drop policy if exists "mistakes_insert_own" on public.mistakes;
drop policy if exists "mistakes_update_own" on public.mistakes;
drop policy if exists "mistakes_delete_own" on public.mistakes;

create policy "mistakes_select_own" on public.mistakes for select using (auth.uid() = user_id);
create policy "mistakes_insert_own" on public.mistakes for insert with check (auth.uid() = user_id);
create policy "mistakes_update_own" on public.mistakes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "mistakes_delete_own" on public.mistakes for delete using (auth.uid() = user_id);

drop policy if exists "certificates_select_own" on public.certificates;
drop policy if exists "certificates_insert_own" on public.certificates;
drop policy if exists "certificates_update_own" on public.certificates;
drop policy if exists "certificates_delete_own" on public.certificates;

create policy "certificates_select_own" on public.certificates for select using (auth.uid() = user_id);
create policy "certificates_insert_own" on public.certificates for insert with check (auth.uid() = user_id);
create policy "certificates_update_own" on public.certificates for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "certificates_delete_own" on public.certificates for delete using (auth.uid() = user_id);

drop policy if exists "ai_usage_logs_select_own" on public.ai_usage_logs;
drop policy if exists "ai_usage_logs_insert_own" on public.ai_usage_logs;

create policy "ai_usage_logs_select_own" on public.ai_usage_logs for select using (auth.uid() = user_id);
create policy "ai_usage_logs_insert_own" on public.ai_usage_logs for insert with check (auth.uid() = user_id);

drop policy if exists "app_errors_select_own" on public.app_errors;
drop policy if exists "app_errors_insert_own" on public.app_errors;

create policy "app_errors_select_own" on public.app_errors for select using (auth.uid() = user_id);
create policy "app_errors_insert_own" on public.app_errors for insert with check (auth.uid() = user_id);
