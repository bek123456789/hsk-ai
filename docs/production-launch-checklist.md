# HanziFlow AI Production Launch Checklist

Bu checklist Vercel deployment va real user testing oldidan oxirgi tekshiruv uchun.

## Pushdan oldin

- `git status`ni tekshiring va `.env.local` commit qilinmaganiga ishonch hosil qiling.
- `npm run test:production-launch` o‘tsin.
- `npm run validate:content`, `npm run validate:translations`, `npm run lint`, `npx tsc --noEmit`, `npm run build` o‘tsin.
- `NEXT_PUBLIC_APP_URL` production’da `https://hsk-ai-one.vercel.app` bo‘lsin.
- `rg "localhost:3000"` natijasida faqat local dev/test/docs kontekstlari qolgan bo‘lsin.

## Vercel env

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=https://hsk-ai-one.vercel.app
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PREMIUM_MONTHLY=
STRIPE_PRICE_PREMIUM_YEARLY=
```

Secret qiymatlarni UI, log, metadata yoki hujjatlarga yozmang.

## Supabase

- Site URL: `https://hsk-ai-one.vercel.app`
- Redirect URL: `https://hsk-ai-one.vercel.app/auth/callback`
- Google provider Supabase Dashboard ichida sozlangan bo‘lsin.
- Optional feature jadvallari bo‘lmasa ham app LocalStorage fallback bilan ishlashi kerak.
- Service role key faqat server route/scriptlarda ishlatiladi.

## Stripe

- Checkout `success_url`: `https://hsk-ai-one.vercel.app/premium/success?session_id={CHECKOUT_SESSION_ID}`
- Checkout `cancel_url`: `https://hsk-ai-one.vercel.app/premium`
- Webhook endpoint: `https://hsk-ai-one.vercel.app/api/stripe/webhook`
- Webhook events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- Test mode checkoutdan keyin `/premium/success` sessiyani tekshirishi kerak.

## Manual QA

1. Login/register/email/password.
2. Google login va `/login?next=/ai-tutor` redirect.
3. Protected route login redirect.
4. Premium checkout test mode, cancel, success.
5. Dashboard, Practice, Lesson completion, Quiz mistake.
6. AI HSK Ustoz, Dictation, Stories, Boss Battle, Mentor Report.
7. Mobile 390px: overflow yo‘q, bottom nav kontentni yopmaydi.
8. Desktop 1440px: landing/dashboard/practice/premium balanced.
9. HanziFlow AI rasmiy HSK tashkiloti mahsuloti emasligi disclaimeri ko‘rinadi.
10. Taqiqlangan platform/payment copy va eski brend matni ko‘rinmaydi.

## Rollback

- Vercel’da oldingi working deployment’ni redeploy qiling.
- Stripe price/webhook env noto‘g‘ri bo‘lsa, avvalgi qiymatlarni qaytaring.
- Supabase optional jadval muammosida app fallback bilan ishlashi kerak; keyin migratsiyani alohida tuzating.
