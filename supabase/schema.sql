create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  current_hsk_level int default 1,
  preferred_language text default 'uz',
  premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, current_hsk_level, preferred_language, premium)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    1,
    'uz',
    false
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
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

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.quiz_results enable row level security;
alter table public.exam_results enable row level security;
alter table public.weak_words enable row level security;
alter table public.mistakes enable row level security;
alter table public.certificates enable row level security;

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
