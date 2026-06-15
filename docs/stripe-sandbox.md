# HanziFlow AI Stripe Sandbox

Bu integratsiya faqat Stripe test rejimi uchun. Real pul yechilmaydi.

## Product

HanziFlow AI Premium

## Test Price ID

Monthly:
`price_1ThP2u7IHas0TlLoSP7XvGo2`

Yearly:
`price_1ThP3s7IHas0TlLoKX2trWAF`

## Env Vars

Local `.env.local`:

```bash
STRIPE_SECRET_KEY=<stripe_test_secret_key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe_test_publishable_key>
STRIPE_WEBHOOK_SECRET=<stripe_webhook_signing_secret>
STRIPE_PRICE_PREMIUM_MONTHLY=price_1ThP2u7IHas0TlLoSP7XvGo2
STRIPE_PRICE_PREMIUM_YEARLY=price_1ThP3s7IHas0TlLoKX2trWAF
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=server_only_key
NEXT_PUBLIC_ENABLE_TRIAL=false
```

Vercel:

```bash
NEXT_PUBLIC_APP_URL=https://hsk-ai-one.vercel.app
```

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` va `SUPABASE_SERVICE_ROLE_KEY` faqat server tomonda ishlatiladi. Ularni client komponentlarda ishlatmang.

## Test Card

Card:
`4242 4242 4242 4242`

Expiry:
har qanday kelajak sana

CVC:
har qanday 3 raqam

## Local Webhook Test

Local webhook secret olish tartibi:

1. Dev serverni ishga tushiring:

```bash
npm run dev
```

2. Ikkinchi terminalda Stripe CLI listen qiling:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. CLI chiqargan `whsec_...` qiymatini nusxalang.

4. `.env.local` ichiga qo‘shing:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

5. Dev serverni qayta ishga tushiring:

```bash
npm run dev
```

6. Health route’ni oching:

```text
http://localhost:3000/api/stripe/health
```

7. `webhookSecretConfigured: true` ekanini tasdiqlang.

## Vercel Webhook

Live/Vercel webhook sozlash:

1. Stripe Dashboard → Developers → Webhooks → Add endpoint.

2. Endpoint URL:

```text
https://hsk-ai-one.vercel.app/api/stripe/webhook
```

3. Eventlarni tanlang:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

4. Endpointni saqlang.

5. Signing secret’ni reveal qiling va `whsec_...` qiymatini oling.

6. Vercel Environment Variables ichiga qo‘shing:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

7. Vercel loyihasini qayta deploy qiling.

Muhim: local `whsec_...` va Vercel/live `whsec_...` boshqa-boshqa bo‘ladi. Local webhook secret’ni Vercel uchun qayta ishlatmang.

## Supabase Profile Columns

```sql
alter table public.profiles
add column if not exists stripe_customer_id text,
add column if not exists stripe_subscription_id text,
add column if not exists subscription_status text default 'free',
add column if not exists subscription_plan text,
add column if not exists stripe_price_id text,
add column if not exists current_period_end timestamptz,
add column if not exists premium_until timestamptz,
add column if not exists updated_at timestamptz default now();
```

RLS policy’larni zaiflashtirmang. Browser user faqat o‘z profilini o‘qishi/yangilashi kerak. Webhook update server-only `SUPABASE_SERVICE_ROLE_KEY` orqali bajariladi.

## Security

- `.env.local` commit qilinmaydi.
- Stripe secret key va webhook signing secret repo fayllariga yozilmaydi.
- Client `price_id` yubormaydi; client faqat `monthly` yoki `yearly` yuboradi.
- Webhook Stripe signature orqali tekshiriladi.
- Agar test secret key biror joyda public paste qilingan bo‘lsa, Stripe Dashboard ichida rotate qiling.
- Chat yoki ommaviy joyga yuborilgan Supabase service role va OpenAI kalitlarini ham tegishli panelda rotate/regenerate qiling.
- Keyin iOS/Android uchun digital subscription kerak bo‘lsa, Apple In-App Purchase yoki Google Play Billing talab qilinishi mumkin.

## Checkout Diagnostikasi

Development vaqtida `/api/stripe/health` haqiqiy qiymatlarni emas, faqat kerakli env mavjud yoki yo‘qligini qaytaradi. `/premium` sahifasidagi diagnostika paneli oxirgi HTTP holati va xavfsiz xato kodini ko‘rsatadi.

`missing_stripe_secret_key` ko‘rinsa, `.env.local` va Vercel Environment Variables ichida `STRIPE_SECRET_KEY` yo‘q. Kalitni qo‘shgandan keyin local dev serverni qayta ishga tushiring yoki Vercel deploymentni qayta deploy qiling.

`webhookSecretConfigured: false` ko‘rinsa, `STRIPE_WEBHOOK_SECRET` hali sozlanmagan. Local test uchun Stripe CLI bergan `whsec_...`, Vercel uchun Stripe Dashboard endpoint signing secret’i kerak.

## To‘lov Muvaffaqiyatli, Lekin Premium Ochilmasa

Tekshiruv tartibi:

1. Stripe Checkout qaytish URL ichida `session_id` borligini tekshiring.
2. `/premium/success` sahifasi `/api/stripe/verify-session` route’ini chaqiradi. Bu route webhook kechiksa ham Checkout Session va Subscription’ni Stripe’dan server tomonda tekshiradi.
3. `/api/subscription/status` route’i profildagi `subscription_status`, `stripe_subscription_id`, `current_period_end` va premium hisobini qaytaradi. Secret qiymatlar qaytmaydi.
4. `profiles` jadvalida `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`, `subscription_plan`, `stripe_price_id`, `current_period_end`, `premium_until` ustunlari borligini tekshiring.
5. Webhook uchun haqiqiy `whsec_...` qiymati kerak. Placeholder qiymat bilan webhook ishlamaydi.
6. Local testda `stripe listen --forward-to localhost:3000/api/stripe/webhook` ishlayotgan bo‘lishi kerak.
7. Vercel’da `NEXT_PUBLIC_APP_URL=https://hsk-ai-one.vercel.app` qilib qo‘yilganini tekshiring.

Development rejimida `/premium` diagnostika paneli va `/api/stripe/health` faqat boolean holatlarni ko‘rsatadi. Secret qiymatlarni hech qachon ko‘rsatmaydi.

## Manual QA Checklist

### Local test

1. `.env.local` to‘ldirilganini tekshiring.
2. `npm run dev` ishga tushiring.
3. Ikkinchi terminalda `stripe listen --forward-to localhost:3000/api/stripe/webhook` ishga tushiring.
4. CLI bergan `whsec_...` qiymatini `.env.local` ichidagi `STRIPE_WEBHOOK_SECRET` ga qo‘shing.
5. `npm run dev`ni qayta ishga tushiring.
6. `/api/stripe/health` ni oching.
7. Barcha kerakli configured flaglar `true` ekanini tasdiqlang.
8. Test foydalanuvchi bilan login qiling.
9. `/premium` sahifasini oching.
10. Monthly rejani test karta bilan sotib oling: `4242 4242 4242 4242`.
11. `/premium/success` ga qaytganini tekshiring.
12. `/api/subscription/status` `isPremium: true` qaytarishini tasdiqlang.
13. Supabase `profiles` qatorini tekshiring:
    - `subscription_status = active`
    - `stripe_customer_id` `cus_` bilan boshlanadi
    - `stripe_subscription_id` `sub_` bilan boshlanadi
    - `stripe_price_id` `price_` bilan boshlanadi
14. Premium sahifalar ochilganini tasdiqlang.

### Live Vercel test

1. Vercel Environment Variables ichiga barcha env qiymatlarini qo‘shing.
2. Stripe Dashboard’da Vercel endpoint uchun webhook yarating.
3. Vercel loyihasini redeploy qiling.
4. Live `/premium` sahifasini oching.
5. Login qiling.
6. Stripe test karta bilan sotib oling.
7. Supabase profile yangilanganini tasdiqlang.
8. Premium sahifalar ochilganini tasdiqlang.

## Secret Safety

- OpenAI key, Supabase service role key yoki Stripe secret key chat/public joyga yuborilgan bo‘lsa, productiondan oldin rotate/regenerate qiling.
- `.env.local` commit qilinmasligi kerak.
- Live deployment uchun Vercel Environment Variables ishlatiladi.
- Server-only kalitlarga hech qachon `NEXT_PUBLIC_` prefix qo‘ymang.
