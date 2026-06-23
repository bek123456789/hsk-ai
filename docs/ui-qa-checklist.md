# HanziFlow AI UI/UX QA Checklist

## Viewports

- Mobile: 390 x 844
- Desktop: 1440 x 1000

## Routes

- `/`
- `/login`
- `/register`
- `/premium`
- `/premium/success`
- `/dashboard`
- `/ai-tutor`
- `/practice`
- `/speaking`
- `/exam`
- `/exam/1`
- `/exam/2`
- `/exam-simulator`
- `/exam-simulator/1`
- `/homework`
- `/reports`
- `/reports/parent`
- `/reports/teacher`
- `/rewards`
- `/challenges`
- `/challenges/vocabulary`
- `/challenges/listening`
- `/challenges/speaking`
- `/challenges/speed`
- `/roleplay`
- `/roleplay/restaurant`
- `/usage`
- `/profile`
- `/settings`
- `/mobile-app`

## Checks

- Sahifa 404 bermaydi.
- Runtime yoki hydration xato ko‘rinmaydi.
- 390px mobile’da gorizontal scroll yo‘q.
- 1440px desktop’da kontent markazlangan va bo‘sh joy me’yorida.
- Bottom navigation input yoki tugmalarni yopmaydi.
- Header, card, button va premium lock kartalari cream/orange uslubida.
- Dark green fon yoki chat theme yo‘q.
- Tugmalar bir xil radius, padding va shadow tizimiga yaqin.
- Uzun matnlar bubble/card ichida sinib chiqmaydi.
- User-facing inglizcha UI so‘zlar yo‘q, HSK/AI/Premium kabi nomlar bundan mustasno.
- Uzbek lotin matnida `o‘` va `g‘` apostroflari to‘g‘ri ishlatilgan.
- Uzbek UI tabiiy, eski til tanlash yoki aralash UI matni ko‘rinmaydi.
- Loading va error holatlari raw JSON yoki stack trace ko‘rsatmaydi.

## AI Tutor Extra Checks

- Empty state assistant avatar va label bilan ko‘rinadi.
- Assistant message: oq/cream bubble, avatar, `AI yordamchi` yoki `AI-помощник` label.
- User message: orange gradient, oq matn.
- Suggested prompt chips mobile’da overflow qilmaydi.
- Input mobile’da bottom nav ortida qolmaydi.
- Error state: rose card, retry button ko‘rinadi.
- Loading state: soft typing dots.
