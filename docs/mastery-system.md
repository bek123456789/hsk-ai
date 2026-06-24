# AI HSK Mastery System

HanziFlow AI `AI HSK Ustoz` tizimi darslar, xatolar, review, practice va exam natijalaridan shaxsiy HSK diagnoz yaratadi. Tizim LocalStorage orqali ishlaydi; Supabase jadvallari bo‘lmasa app crash bo‘lmaydi.

## Route

- `/mastery` — asosiy “AI HSK Ustoz” sahifasi.

## LocalStorage fallback

- `mastery_diagnosis_cache`
- `mastery_recommendations`
- `pass_prediction_cache`

## Optional Supabase tables

Quyidagi jadvallar production/staging muhitida tarixiy tahlil saqlash uchun qo‘shilishi mumkin. Bular majburiy emas.

```sql
create table if not exists public.mastery_diagnoses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  level int not null,
  readiness int not null default 0,
  diagnosis jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mistake_reasons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  mistake_id text not null,
  reason_type text not null,
  explanation_uz text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mastery_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  recommendation jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.drill_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  mistake_id text,
  drills jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.pass_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  level int not null,
  readiness int not null,
  prediction jsonb not null,
  created_at timestamptz not null default now()
);
```

RLS policylarini loyiha standartiga mos qo‘ying: user faqat o‘z `user_id` yozuvlarini o‘qishi va yozishi kerak.

## Premium behavior

- Bepul foydalanuvchi: asosiy diagnoz, top zaif joylar, kunlik 1 ta AI drill.
- Premium foydalanuvchi: to‘liq diagnoz, ko‘proq AI drill, chuqur speaking/writing va haftalik mastery report.

## Safety

- Service role key client kodida ishlatilmaydi.
- Supabase jadval xatosi catch qilinadi va LocalStorage fallback qoladi.
- Tizim locked HSK darslarini tavsiya qilmasligi kerak.
