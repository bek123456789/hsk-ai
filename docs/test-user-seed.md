# HanziFlow AI Test User Seed

Bu script faqat local yoki staging terminal muhitida test user yaratish uchun. Public API route emas va browser/client kodda ishlatilmaydi.

## Test login

```text
Email: test@hanziflow.ai
Password: Test123456!
```

## Ishga tushirish

```bash
npm run seed:test-user
```

## Kerakli env nomlari

```text
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Script `.env.local` faylidan shu nomlarni o‘qiy oladi, lekin qiymatlarni hech qachon terminalga chiqarmaydi.

## Nima seed qilinadi

- Supabase Auth user yaratiladi yoki yangilanadi.
- `profiles` qatori premium test holatiga o‘tkaziladi:
  - `target_hsk_level = 6`
  - `daily_goal_minutes = 30`
  - `ui_language = uz`
  - `onboarding_completed = true`
  - `subscription_status = beta_premium`
  - `subscription_plan = test`
  - `premium_until = now() + 1 year`
  - `xp = 9999`
  - `streak_count = 30`
- `lesson_progress`: barcha HSK 1–6 darslari `done=true`, `progress=100`.
- `exam_results`: HSK 1–6 imtihonlari 80% dan yuqori passed natija bilan.
- `review_items`: HSK 1–2 lug‘atidan kamida 20 review so‘z.
- `daily_missions`: bugungi lesson/review/speaking/listening/AI coach missionlari completed.
- `user_achievements`: mavjud bo‘lsa asosiy achievementlar unlocked.

## Xavfsizlik

- Faqat development/staging uchun ishlating.
- Production public launch oldidan bu passwordni o‘zgartiring yoki test accountni o‘chirib tashlang.
- `SUPABASE_SERVICE_ROLE_KEY` faqat terminal script ichida server-side ishlatiladi.
- Service role key client komponentga, browserga yoki public API route’ga qo‘yilmaydi.
- `.env.local` commit qilinmaydi.

## Idempotent behavior

Scriptni bir necha marta ishlatish mumkin:

- Auth user mavjud bo‘lsa yangilanadi.
- Test user progress jadval qatorlari o‘chirilib qayta seed qilinadi.
- Optional jadval yoki ustun yo‘q bo‘lsa script crash qilmaydi, safe summary ichida skipped sifatida ko‘rsatadi.
