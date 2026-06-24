# HanziFlow AI Manual QA Checklist

## Account flows

- New account: register/login, onboarding, dashboard redirect.
- Existing test account: login, progress restore, premium state.
- Google login: `/login?next=/dashboard` and protected route redirect.

## Core pages

- `/dashboard`: continue lesson, AI HSK Ustoz, homework, Smart Review, readiness, HSK roadmap, practice tools.
- `/practice`: categories fit on mobile and desktop; every card opens a real route.
- `/mastery`: empty account shows useful state; progressed account shows diagnosis and next steps.
- `/dictation`: empty answer does not complete; submitted answer shows transcript/missing words.
- `/stories`: pinyin toggle, audio button, explanation and question area.
- `/boss-battle`: HP/energy changes; result does not unlock official HSK level.
- `/homework`: today tasks appear from current level/weak points and save locally.
- `/goals`: create/update goal, target date and status persist after refresh.
- `/mentor-report`: progress summary, non-official disclaimer, print button.

## Responsive QA

- Mobile 390px: no horizontal overflow, bottom nav does not cover actions, cards wrap.
- Desktop 1440px: content is centered, cards align, no huge blank spaces.

## Integrations

- Stripe success/cancel redirects use production URL.
- Supabase optional tables missing: app continues with LocalStorage fallback.
- LocalStorage fallback: feature results persist after refresh.
- Vercel deployment: build routes include all advanced pages.

## Cleanup checks

- Uzbek-only UI in new feature pages.
- Chinese and pinyin content remain visible.
- No Telegram, TON, Stars, Fragment, KYC references.
- No old HSK AI branding.
- No raw Supabase/Stripe/OpenAI errors shown to normal users.
