# HanziFlow AI bilim bazasi

Hozirgi AI Tutor oqimi server tomonda ishlaydi:

1. Client `/api/ai-tutor` route’ga faqat foydalanuvchi xabari, tanlangan til, HSK darajasi va ixcham LocalStorage progress kontekstini yuboradi.
2. API route Supabase access token orqali sessiyani tekshiradi.
3. `lib/ai/contextBuilder.ts` lokal HSK materiallari va Supabase user data asosida ixcham kontekst yaratadi.
4. Server `OPENAI_API_KEY` bilan OpenAI API’ga murojaat qiladi.

## Hozir ishlatilayotgan manbalar

- `data/hskVocabulary.ts`
- `data/hskLessons.ts`
- `data/hskGrammar.ts`
- `data/hskExamQuestions.ts`
- `data/hskReadingPassages.ts`
- `data/hskListeningTexts.ts`
- `data/hskWritingTasks.ts`
- Supabase: `profiles`, `user_progress`, `quiz_results`, `exam_results`, `weak_words`, `mistakes`

## Keyingi bosqich: Supabase pgvector

Keyinroq lokal data bo‘laklarga ajratilib `knowledge_chunks` jadvaliga yoziladi:

- `id`
- `hsk_level`
- `content_type`
- `language`
- `title`
- `content`
- `metadata`
- `embedding`

Qidiruv oqimi:

1. User message embedding qilinadi.
2. `match_knowledge_chunks` RPC orqali eng yaqin materiallar olinadi.
3. User progress va mistake data bilan birlashtiriladi.
4. OpenAI’ga faqat topilgan kerakli kontekst yuboriladi.

## Keyingi bosqich: OpenAI Vector Store / File Search

Alternativ yo‘l:

1. HSK lessons, vocabulary, grammar va exam explanations fayl ko‘rinishida tayyorlanadi.
2. Admin panel orqali fayllar OpenAI Vector Store’ga yuklanadi.
3. API route foydalanuvchi savoli bilan File Search chaqiradi.
4. Topilgan context Supabase user progress bilan birlashtiriladi.

## Admin-managed knowledge base

Production versiyada o‘quv kontentini admin paneldan boshqarish foydali:

- yangi HSK lesson qo‘shish
- grammar explanation tahrirlash
- exam-style practice savollarini versiyalash
- har bir chunk uchun sifat statusi saqlash
- embeddinglarni fon job orqali yangilash

Muhim qoida: HanziFlow AI imtihonlari rasmiy imtihon deb ko‘rsatilmaydi. Ular HSK uslubidagi tayyorgarlik testlari sifatida belgilanadi.

## Final QA eslatmalari

Local muhitda AI Tutor ishlashi uchun `.env.local` fayliga server-only kalit qo‘shiladi:

```bash
OPENAI_API_KEY=<server_api_key>
```

Ixtiyoriy model sozlamasi:

```bash
OPENAI_MODEL=gpt-4o-mini
```

`.env.local` faylini commit qilmang. U maxfiy sozlamalar uchun ishlatiladi va repoga tushmasligi kerak.

Local AI Tutor testida Supabase Auth email tasdiqlash talab qilsa, test user emailini Supabase Auth panelida tasdiqlang yoki local development vaqtida Supabase Auth settings ichida email confirmation talabini vaqtincha o‘chiring. Production muhitda email confirmation’ni faqat product/security qarori bo‘lsa o‘chiring.

Vercel’da shu kalitlar Project Settings → Environment Variables bo‘limiga qo‘shiladi:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` ixtiyoriy

Client komponentlarda `OPENAI_API_KEY` ishlatilmaydi. Kalit faqat `app/api/ai-tutor/route.ts` server route ichida o‘qiladi.

Keyingi RAG bosqichida local data qidiruvi Supabase pgvector yoki OpenAI Vector Store bilan almashtiriladi. Hozirgi `lib/ai/contextBuilder.ts` shu ko‘chirish uchun tayyor joy: u user progress, zaif so‘zlar, xatolar va HSK contentni bitta ixcham contextga yig‘adi.
