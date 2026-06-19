# HanziFlow AI Ma'lumotlar Bazasi Keyingi Qadamlar

## Imtihon Natijalari va HSK Bosqichlari

Imtihonlar uchun 80% o‘tish bali, to‘rtta bo‘lim natijasi va eski urinishlar tarixini saqlash kerak. Mavjud `exam_results` jadvaliga quyidagi maydonlarni qo‘shing:

```sql
alter table public.exam_results
add column if not exists level int,
add column if not exists overall_score int default 0,
add column if not exists passing_score int default 80,
add column if not exists section_scores jsonb default '{}'::jsonb,
add column if not exists weak_skills jsonb default '[]'::jsonb,
add column if not exists recommended_lesson_ids jsonb default '[]'::jsonb,
add column if not exists answers jsonb default '[]'::jsonb;

alter table public.exam_results enable row level security;

drop policy if exists "exam_results_select_own" on public.exam_results;
drop policy if exists "exam_results_insert_own" on public.exam_results;
drop policy if exists "exam_results_update_own" on public.exam_results;

create policy "exam_results_select_own" on public.exam_results
for select using (auth.uid() = user_id);

create policy "exam_results_insert_own" on public.exam_results
for insert with check (auth.uid() = user_id);

create policy "exam_results_update_own" on public.exam_results
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

Ilova yangi va legacy ustunlarni birgalikda yozadi. Jadval yoki migratsiya hali mavjud bo‘lmasa, `hsk_exam_results` LocalStorage fallback ishlaydi. Unlock logikasi har bir daraja uchun eng yaxshi natijani oladi: keyingi HSK darajasi faqat oldingi imtihonda kamida 80% olinganda ochiladi.

Hozirgi MVP yangi o'quv funksiyalarini LocalStorage orqali saqlaydi. Supabase Auth va mavjud profil/progress oqimi ishlayveradi, yangi modullar esa keyingi bosqichda jadvallarga ko'chirishga tayyor tuzildi.

## Tavsiya Qilingan Jadvallar

- `practice_results`: `id`, `user_id`, `skill`, `hsk_level`, `score`, `total`, `completed_at`
- `speaking_results`: `id`, `user_id`, `word_id`, `lesson_id`, `hsk_level`, `target_hanzi`, `target_pinyin`, `recognized_text`, `score`, `is_correct`, `attempts`, `created_at`
- `game_results`: `id`, `user_id`, `game_type`, `hsk_level`, `score`, `xp`, `completed_at`
- `study_goals`: `id`, `user_id`, `daily_minutes`, `target_level`, `reminder_time`, `streak_freeze_count`, `updated_at`
- `notebook_entries`: `id`, `user_id`, `title`, `chinese`, `pinyin`, `translation`, `note`, `hsk_level`, `created_at`, `updated_at`
- `feedback_items`: `id`, `user_id`, `message`, `created_at`, `status`
- `reported_content`: `id`, `user_id`, `content_id`, `reason`, `created_at`, `status`
- `ai_usage_logs`: `id`, `user_id`, `usage_type`, `count`, `date`, `created_at`
- `app_errors`: `id`, `user_id`, `event_type`, `message`, `metadata`, `page_url`, `created_at`
- `premium_token_logs`: `id`, `user_id`, `source`, `amount`, `created_at`
- `homework_results`: `id`, `user_id`, `task_id`, `completed`, `completed_at`
- `reward_claims`: `id`, `user_id`, `reward_day`, `tokens_awarded`, `created_at`
- `challenge_results`: `id`, `user_id`, `challenge_type`, `score`, `total`, `time_spent_seconds`, `created_at`
- `roleplay_sessions`: `id`, `user_id`, `scenario`, `hsk_level`, `message_count`, `created_at`
- `public_certificates`: `id`, `user_id`, `certificate_id`, `hsk_level`, `score`, `public_slug`, `created_at`
- `mobile_waitlist`: `id`, `user_id`, `email`, `created_at`
- `parent_teacher_reports`: `id`, `user_id`, `report_type`, `snapshot`, `created_at`

### Smart Review va Eslatma Sozlamalari

Smart Review hozir `hsk-ai-progress` va `hanziflow_review_items` LocalStorage fallback orqali ishlaydi. Supabase sinxronizatsiyasini kengaytirish kerak bo‘lsa, quyidagi jadvalni qo‘shing:

```sql
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

alter table public.review_items enable row level security;

create policy "review_items_select_own"
on public.review_items for select
using (auth.uid() = user_id);

create policy "review_items_insert_own"
on public.review_items for insert
with check (auth.uid() = user_id);

create policy "review_items_update_own"
on public.review_items for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

Eslatma sozlamalari hozir `hanziflow-reminder-preferences` LocalStorage kalitida saqlanadi. Account darajasida saqlash kerak bo‘lsa:

```sql
alter table public.profiles
add column if not exists target_hsk_level int default 1,
add column if not exists reminder_enabled boolean default false,
add column if not exists reminder_time text default '19:00',
add column if not exists review_reminder_enabled boolean default true,
add column if not exists streak_reminder_enabled boolean default true,
add column if not exists ui_language text default 'uz',
add column if not exists xp int default 0,
add column if not exists streak_count int default 0,
add column if not exists last_active_at timestamptz;
```

Kunlik topshiriqlar hozir `dailyPlanCompletions` progress store va LocalStorage fallback bilan ishlaydi. Supabase orqali saqlash kerak bo‘lsa:

```sql
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

alter table public.daily_missions enable row level security;

create policy "daily_missions_select_own"
on public.daily_missions for select
using (auth.uid() = user_id);

create policy "daily_missions_insert_own"
on public.daily_missions for insert
with check (auth.uid() = user_id);

create policy "daily_missions_update_own"
on public.daily_missions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

### Hanzi, Ton, Shadowing, Sprint va Study Plan

Yangi amaliy o‘quv modullari quyidagi LocalStorage fallback kalitlari bilan darhol ishlaydi:

- `hanziflow_tone_practice_results`
- `hanziflow_sentence_builder_results`
- `hanziflow_shadowing_results`
- `hanziflow_mistake_loop_progress`
- `hanziflow_sprint_progress`
- `hanziflow_study_plans`
- `hanziflow_roleplay_results`

Supabase sinxronizatsiyasini keyingi bosqichda yoqish uchun ixtiyoriy jadvallar:

```sql
create table if not exists public.tone_practice_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  word_id text not null,
  level int not null,
  selected_tone int,
  correct_tone int,
  correct boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.sentence_builder_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  item_id text not null,
  level int not null,
  answer text,
  correct_answer text,
  correct boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.shadowing_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  source_id text not null,
  level int not null,
  answer text,
  score int default 0,
  done boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.sprint_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  sprint_date date default current_date,
  task_id text not null,
  completed boolean default false,
  completed_at timestamptz,
  unique (user_id, sprint_date, task_id)
);

create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  target_level int not null,
  days_per_week int not null,
  minutes_per_day int not null,
  weak_skill text,
  plan jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.roleplay_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  scenario text not null,
  level int default 1,
  user_answer text,
  corrected_answer text,
  score int default 0,
  created_at timestamptz default now()
);

alter table public.tone_practice_results enable row level security;
alter table public.sentence_builder_results enable row level security;
alter table public.shadowing_results enable row level security;
alter table public.sprint_progress enable row level security;
alter table public.study_plans enable row level security;
alter table public.roleplay_results enable row level security;
```

Har bir jadval uchun RLS qoidasini bir xil uslubda yozing: foydalanuvchi faqat `auth.uid() = user_id` bo‘lgan qatorlarni `select`, `insert`, `update` qila oladi. Jadval bo‘lmasa, ilova brauzer xotirasida ishlashda davom etadi va xato ko‘rsatmaydi.

## Profil Migratsiyasi

Stripe Checkout, trial, onboarding va referral uchun quyidagi migratsiyani Supabase SQL Editor orqali ishga tushiring:

```sql
alter table public.profiles
add column if not exists stripe_customer_id text,
add column if not exists avatar_url text,
add column if not exists stripe_subscription_id text,
add column if not exists subscription_status text default 'free',
add column if not exists subscription_plan text,
add column if not exists stripe_price_id text,
add column if not exists current_period_end timestamptz,
add column if not exists premium_until timestamptz,
add column if not exists trial_started_at timestamptz,
add column if not exists trial_ends_at timestamptz,
add column if not exists trial_used boolean default false,
add column if not exists onboarding_completed boolean default false,
add column if not exists learning_goal text,
add column if not exists daily_goal_minutes int default 10,
add column if not exists referral_code text,
add column if not exists referred_by text,
add column if not exists referral_bonus_days int default 0,
add column if not exists premium_token_balance int default 0,
add column if not exists updated_at timestamptz default now();

create unique index if not exists profiles_referral_code_key
on public.profiles (referral_code)
where referral_code is not null;
```

## AI Limitlari

```sql
create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  usage_type text not null,
  count int default 1,
  date date default current_date,
  created_at timestamptz default now()
);

alter table public.ai_usage_logs enable row level security;
create policy "ai_usage_logs_select_own" on public.ai_usage_logs
for select using (auth.uid() = user_id);
create policy "ai_usage_logs_insert_own" on public.ai_usage_logs
for insert with check (auth.uid() = user_id);
```

Server route limitni tekshiradi va yozadi. Jadval mavjud bo‘lmasa development vaqtida xotira fallbacki ishlaydi; productionda migratsiyani qo‘llash shart.

## Xatolar Jurnali

```sql
create table if not exists public.app_errors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  message text not null,
  metadata jsonb default '{}'::jsonb,
  page_url text,
  created_at timestamptz default now()
);
```

Jurnalga API kalitlari, access token, karta yoki to‘liq to‘lov obyektlarini yozmang.

## Premium Funksiyalar Uchun Qo‘shimcha Jadvallar

Quyidagi SQL MVP LocalStorage fallback’larini Supabase manbasiga ko‘chirish uchun tayyor:

```sql
create table if not exists public.reward_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  reward_day date default current_date,
  tokens_awarded int default 0,
  created_at timestamptz default now()
);

create table if not exists public.challenge_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  challenge_type text not null,
  score int default 0,
  total int default 0,
  time_spent_seconds int default 0,
  created_at timestamptz default now()
);

create table if not exists public.roleplay_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  scenario text not null,
  hsk_level int default 1,
  message_count int default 0,
  created_at timestamptz default now()
);

create table if not exists public.mobile_waitlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  created_at timestamptz default now()
);
```

RLS qoidasini har bir jadvalda foydalanuvchi faqat o‘z qatorlarini ko‘radigan qilib yozing. Server-only service role faqat webhook, usage yoki admin avtomatizatsiyada ishlatiladi.

## Sinxronlash Qoidasi

LocalStorage MVP fallback bo'lib qoladi. Supabase jadvallari qo'shilgach, ilova avval sessiyani tekshiradi, keyin yangi natijani Supabase'ga yozadi. Agar network yoki sessiya ishlamasa, natija brauzer xotirasida qoladi va keyingi sessiyada sinxronlash mumkin.

## AI Bilim Bazasi

AI Tutor hozir lokal HSK kontent va foydalanuvchi progress kontekstidan foydalanadi. Keyingi bosqichda darslar, lug'at, grammatika, imtihon savollari, o'qish/tinglash matnlari va xatolarni Supabase `pgvector` yoki OpenAI Vector Store orqali RAG qidiruviga ulash mumkin.

## Muhim

`.env.local` commit qilinmaydi. Server kalitlari faqat server route ichida ishlatiladi. Client komponentlarda `OPENAI_API_KEY` ishlatilmaydi.

Chat yoki ommaviy joyga yuborilgan `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` yoki Stripe test secret key’larini provider panelida rotate/regenerate qiling.

## Light MVP O‘quv Modullari

Quyidagi modullar hozir xavfsiz LocalStorage fallback bilan ishlaydi. Supabase sinxronizatsiyasi kerak bo‘lganda alohida jadvallar qo‘shilishi mumkin:

- `daily_plans`
- `review_items`
- `placement_results`
- `progress_map_snapshots`
- `streak_shares`
- `mini_lesson_results`
- `grammar_progress`
- `listening_results`
- `sentence_builder_results`
- `dictation_results`
- `mistake_notebook`
- `study_calendar_events`
- `achievements`
- `ai_explainer_logs`

Har bir jadvalda kamida `id`, `user_id`, modulga tegishli natija maydonlari va `created_at` bo‘lishi kerak. RLS yoqilib, foydalanuvchi faqat `auth.uid() = user_id` bo‘lgan qatorlarni ko‘rishi va yozishi kerak. Jadval mavjud bo‘lmasa ilova LocalStorage orqali ishlashda davom etadi; UI xato bermaydi.

## Reading, Listening va Speaking Natijalari

Yangi markaziy kontent tizimi hozir LocalStorage fallback bilan ishlaydi. Supabase sinxronizatsiyasi kerak bo‘lsa, quyidagi jadvallarni qo‘shing:

```sql
create table if not exists public.speaking_task_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  task_id text not null,
  level int not null,
  score int default 0,
  meaning_score int default 0,
  grammar_score int default 0,
  vocabulary_score int default 0,
  fluency_score int default 0,
  user_answer_zh text,
  corrected_answer_zh text,
  feedback jsonb,
  done boolean default false,
  created_at timestamptz default now(),
  unique (user_id, task_id)
);

create table if not exists public.reading_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  passage_id text not null,
  level int not null,
  score int default 0,
  mistakes jsonb,
  done boolean default false,
  created_at timestamptz default now(),
  unique (user_id, passage_id)
);

create table if not exists public.listening_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  listening_id text not null,
  level int not null,
  score int default 0,
  replay_count int default 0,
  mistakes jsonb,
  done boolean default false,
  created_at timestamptz default now(),
  unique (user_id, listening_id)
);
```

RLS tavsiyasi: foydalanuvchi faqat `auth.uid() = user_id` bo‘lgan qatorlarni ko‘rsin, kiritsin, yangilasin va kerak bo‘lsa o‘chirsin. Har bir jadval uchun quyidagi shakldagi siyosatlar qo‘llanadi:

```sql
alter table public.reading_results enable row level security;

create policy "reading_results_select_own"
on public.reading_results for select
using (auth.uid() = user_id);

create policy "reading_results_insert_own"
on public.reading_results for insert
with check (auth.uid() = user_id);

create policy "reading_results_update_own"
on public.reading_results for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "reading_results_delete_own"
on public.reading_results for delete
using (auth.uid() = user_id);
```

Shu siyosatlarni jadval nomini almashtirib `listening_results`, `speaking_task_results`, `lesson_progress`, `mistakes` va `ai_usage_logs` uchun ham qo‘llang. Server-only service role faqat admin sinxronizatsiya yoki xavfsiz API route ichida ishlatiladi; u mijoz kodida ishlatilmaydi.

## Dars Curriculum Progressi

Dars kontenti `data/hsk/lessonCurriculum.ts` ichida qoladi. Faqat foydalanuvchi natijasini saqlash uchun quyidagi optional jadval ishlatiladi:

```sql
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  level int,
  lesson_id text not null,
  completed_sections text[] default '{}',
  sections jsonb default '{}'::jsonb,
  progress int default 0,
  quiz_score int default 0,
  quiz_total int default 0,
  completed boolean default false,
  done boolean default false,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "lesson_progress_select_own"
on public.lesson_progress for select
using (auth.uid() = user_id);

create policy "lesson_progress_insert_own"
on public.lesson_progress for insert
with check (auth.uid() = user_id);

create policy "lesson_progress_update_own"
on public.lesson_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "lesson_progress_delete_own"
on public.lesson_progress for delete
using (auth.uid() = user_id);
```

Login paytida `utils/supabaseProgressSync.ts` Supabase’dagi natijalarni LocalStorage bilan xavfsiz birlashtiradi. Jadval mavjud bo‘lmasa `hsk_lesson_progress`, `hsk_learning_progress`, `hsk_reading_progress`, `hsk_listening_progress` va `hsk_speaking_progress` LocalStorage kalitlari ishlashda davom etadi.

`quiz_score` va `quiz_total` mini test natijasini alohida saqlaydi. Umumiy dars progressi section-based hisoblanadi: `vocabulary`, `grammar`, `reading`, `listening`, `speaking`, `miniTest` tugallansa `progress = 100`, `done = true`, `completed = true` bo‘ladi. Mini test 60% yoki undan yuqori bo‘lsa `miniTest` bo‘limi tugallangan hisoblanadi; mini test foizi umumiy progressni 95% kabi oraliqda ushlab qolmasligi kerak.
