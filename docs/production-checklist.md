# HanziFlow AI Production Checklist

Bu checklist HanziFlow AI’ni Vercel, Supabase, Stripe va OpenAI bilan production muhitga chiqarishdan oldin tekshirish uchun.

## Vercel Environment Variables

Vercel Project Settings -> Environment Variables bo‘limida quyidagilar sozlangan bo‘lishi kerak:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PREMIUM_MONTHLY=
STRIPE_PRICE_PREMIUM_YEARLY=
NEXT_PUBLIC_APP_URL=https://hsk-ai-one.vercel.app
```

Qoidalar:

- `NEXT_PUBLIC_*` bo‘lmagan kalitlar faqat server tomonda ishlatiladi.
- `.env.local` commit qilinmaydi.
- Health endpointlar faqat `configured: true/false` kabi boolean holatlarni qaytaradi.
- Secret qiymatlarni log, UI, metadata yoki hujjat ichiga yozmang.
- Production’da `NEXT_PUBLIC_APP_URL` hech qachon `localhost` bo‘lmasin.
- Custom domain ulanganda `NEXT_PUBLIC_APP_URL=https://hanzi.uz` qilib almashtiring.

## Supabase

1. `docs/database-next-steps.md` ichidagi zarur migratsiyalarni SQL Editor orqali ishga tushiring.
2. `profiles`, `lesson_progress`, `exam_results`, `ai_usage_logs`, `review_items` va optional feature jadvallarida RLS yoqilganini tekshiring.
3. Foydalanuvchi faqat o‘z `user_id` qatorlarini o‘qishi va yozishi kerak.
4. Service role kaliti client kodda ishlatilmaganini tasdiqlang.
5. Jadval bo‘lmasa ham LocalStorage fallback ishlashini manual tekshiring.

## Google OAuth

1. Supabase Authentication -> Providers ichida Google provider yoqilgan bo‘lsin.
2. Google Client ID va Client Secret Supabase Dashboard ichida saqlansin.
3. Redirect URL allow list:

```text
http://localhost:3000/auth/callback
https://hsk-ai-one.vercel.app/auth/callback
```

4. `/login?next=/ai-tutor` orqali Google login ichki route’ga qaytishini tekshiring.
5. Tashqi URL bilan `next` yuborilganda `/dashboard` fallback ishlashini tekshiring.

## Stripe

1. Stripe Dashboard’da product va monthly/yearly price ID lar sozlangan bo‘lsin.
2. Vercel webhook endpoint:

```text
https://hsk-ai-one.vercel.app/api/stripe/webhook
```

3. Kerakli eventlar:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

4. Webhook signing secret `STRIPE_WEBHOOK_SECRET` sifatida Vercel’da saqlansin.
5. `/premium`, Checkout return, `/premium/success`, `/api/subscription/status` oqimini test qiling.
6. Stripe Checkout `success_url` production’da `https://hsk-ai-one.vercel.app/premium/success?session_id=...` bo‘lishi kerak.
7. Stripe Checkout `cancel_url` production’da `https://hsk-ai-one.vercel.app/premium` bo‘lishi kerak.

## OpenAI

1. `OPENAI_API_KEY` faqat server env sifatida sozlangan bo‘lsin.
2. `/api/ai/health` haqiqiy kalit qiymatini qaytarmasligi kerak.
3. AI Tutor va Speaking evaluation limitni OpenAI chaqiruvidan oldin tekshiradi.
4. Muvaffaqiyatsiz AI chaqiruv usage limitni kamaytirmasligi kerak.

## Local Test Buyruqlari

Production builddan oldin:

```bash
npm run validate:content
npm run validate:translations
npm run test:speaking-evaluation
npm run test:content-quality
npm run test:learning-progress
npm run test:unlock-flow
npm run test:ui
npx tsc --noEmit
npm run lint
npm run build
```

`npm run test:ui` uchun local server kerak:

```bash
npm run dev
```

## Manual QA

Tekshiriladigan asosiy route’lar:

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/lessons`
- `/lesson/1/hsk1-lesson-01`
- `/learning-path`
- `/practice`
- `/review`
- `/hanzi-builder`
- `/tone-trainer`
- `/sentence-builder`
- `/shadowing`
- `/mistakes`
- `/mistakes/loop`
- `/sprint`
- `/roleplay`
- `/study-plan`
- `/dictionary`
- `/exam`
- `/ai-tutor`
- `/premium`
- `/profile`
- `/settings`

Manual flow:

1. Yangi user register/login qiladi.
2. Onboarding faqat yangi userga ko‘rinadi.
3. HSK 1 birinchi dars ochiq, keyingi darslar ketma-ket ochiladi.
4. Dars faqat required sectionlar tugagandan keyin `done=true` bo‘ladi.
5. Exam faqat barcha darslar tugagandan keyin ochiladi.
6. 79% exam keyingi HSK darajani ochmaydi.
7. 80% exam keyingi HSK darajani ochadi.
8. Review faqat o‘rganilgan yoki xato qilingan so‘zlardan tuziladi.
9. Dashboard locked kontentni tavsiya qilmaydi.
10. Free user premium locklarni ko‘radi.
11. Premium user ortiqcha upgrade CTA ko‘rmaydi.
12. AI xatolari foydalanuvchiga texnik JSON ko‘rsatmaydi.

## Responsive QA

390px mobil:

- horizontal overflow yo‘q
- bottom nav CTA/inputlarni yopmaydi
- auth forma va lesson detail o‘qilishi oson
- speaking/writing inputlari kesilmaydi

1440px desktop:

- kontent max-width ichida
- kartalar tekis
- dashboard va profile cho‘zilib ketmagan
- landing va auth sahifalari premium ko‘rinadi

## Security Scan

Release oldidan qidiring:

```bash
rg -n "OPENAI_API_KEY|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|SUPABASE_SERVICE_ROLE_KEY|GOOGLE_CLIENT_SECRET" . --glob '!node_modules/**' --glob '!.next/**'
```

Natijalar faqat hujjatdagi env nomlari yoki server-only kod yo‘llari bo‘lishi kerak. Haqiqiy qiymatlar bo‘lmasligi kerak.

## Rollback

1. Vercel’da oldingi working deployment’ni redeploy qiling.
2. Stripe webhook secret yoki price ID o‘zgargan bo‘lsa, eski qiymatlarga qaytaring.
3. Supabase migratsiya muammosi bo‘lsa, RLS va ustun nomlarini tekshiring; kontent ilova kodida qolganligi sababli o‘quv kontenti yo‘qolmaydi.
4. LocalStorage fallback sababli optional jadval nosozligi normal user flow’ni to‘xtatmasligi kerak.
