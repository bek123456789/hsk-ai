# HanziFlow AI Google Login

Google orqali kirish Supabase Auth OAuth provider orqali ishlaydi. Google Client Secret ilova kodiga yoki Vercel env qiymatlariga qo‘yilmaydi; u Supabase Dashboard ichida saqlanadi.

## Supabase sozlash

1. Supabase Dashboard oching.
2. Authentication → Providers bo‘limiga kiring.
3. Google provider’ni yoqing.
4. Google Cloud’dan olingan Client ID qiymatini kiriting.
5. Google Cloud’dan olingan Client Secret qiymatini kiriting.
6. Save tugmasini bosing.

## Supabase URL sozlamalari

Site URL:

```text
https://hsk-ai-one.vercel.app
```

Local test vaqtida kerak bo‘lsa:

```text
http://localhost:3000
```

Redirect URL / Allow list:

```text
http://localhost:3000/auth/callback
https://hsk-ai-one.vercel.app/auth/callback
```

Vercel preview deploy ishlatilsa, preview domenlari uchun alohida allow rule qo‘shing.

## Google Cloud sozlash

1. Google Cloud Console’da OAuth Client ID yarating.
2. Application type: Web application.
3. Supabase Google provider ko‘rsatgan authorized redirect URI qiymatini Google Cloud ichiga qo‘shing.
4. Zarur bo‘lsa, authorized JavaScript origins ichiga local va production originlarni qo‘shing:

```text
http://localhost:3000
https://hsk-ai-one.vercel.app
```

## Profile avatar ustuni

Google profil rasmini saqlash uchun optional ustun:

```sql
alter table public.profiles
add column if not exists avatar_url text;
```

Ustun bo‘lmasa ham login ishlaydi. Ilova avatar yozishni xavfsiz retry qiladi va xato foydalanuvchiga ko‘rinmaydi.

## Xavfsizlik

- `GOOGLE_CLIENT_SECRET` kodga yozilmaydi.
- `GOOGLE_CLIENT_SECRET` client env sifatida ishlatilmaydi.
- `NEXT_PUBLIC_SUPABASE_URL` va `NEXT_PUBLIC_SUPABASE_ANON_KEY` client uchun yetarli.
- `/auth/callback` faqat ichki `next` pathlarni qabul qiladi; tashqi URL redirect qilinmaydi.
- `.env.local` commit qilinmaydi.

Placeholder nomlar:

```text
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
