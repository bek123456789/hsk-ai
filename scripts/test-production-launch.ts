import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { getBaseUrlWithEnv, getStripeRedirectUrlsForBaseUrl } from "../utils/getBaseUrl";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function exists(path: string) {
  return existsSync(join(root, path));
}

function walk(dir: string, predicate: (path: string) => boolean, found: string[] = []) {
  const fullDir = join(root, dir);
  if (!existsSync(fullDir)) return found;
  for (const entry of readdirSync(fullDir)) {
    const fullPath = join(fullDir, entry);
    const relPath = relative(root, fullPath);
    if (relPath.includes("node_modules") || relPath.includes(".next")) continue;
    const stats = statSync(fullPath);
    if (stats.isDirectory()) walk(relPath, predicate, found);
    else if (predicate(relPath)) found.push(relPath);
  }
  return found;
}

function assertFilesDoNotContain(paths: string[], pattern: RegExp, message: string, allow?: (path: string, content: string) => boolean) {
  const offenders = paths.filter((path) => {
    const content = read(path);
    return pattern.test(content) && !allow?.(path, content);
  });
  assert(offenders.length === 0, `${message}: ${offenders.slice(0, 8).join(", ")}`);
}

const requiredRoutes = [
  "app/page.tsx",
  "app/login/page.tsx",
  "app/register/page.tsx",
  "app/forgot-password/page.tsx",
  "app/auth/callback/route.ts",
  "app/premium/page.tsx",
  "app/premium/success/page.tsx",
  "app/dashboard/page.tsx",
  "app/practice/page.tsx",
  "app/mastery/page.tsx",
  "app/dictation/page.tsx",
  "app/stories/page.tsx",
  "app/boss-battle/page.tsx",
  "app/mentor-report/page.tsx"
];

for (const route of requiredRoutes) {
  assert(exists(route), `${route} mavjud bo‘lishi kerak`);
}

const productionEnv = { NODE_ENV: "production", NEXT_PUBLIC_APP_URL: "https://hsk-ai-one.vercel.app" } as NodeJS.ProcessEnv;
assert(getBaseUrlWithEnv(productionEnv) === "https://hsk-ai-one.vercel.app", "Production base URL Vercel domenini qaytarishi kerak");
const stripeUrls = getStripeRedirectUrlsForBaseUrl("https://hsk-ai-one.vercel.app");
assert(stripeUrls.successUrl === "https://hsk-ai-one.vercel.app/premium/success?session_id={CHECKOUT_SESSION_ID}", "Stripe success URL production domenida bo‘lishi kerak");
assert(stripeUrls.cancelUrl === "https://hsk-ai-one.vercel.app/premium", "Stripe cancel URL production domenida bo‘lishi kerak");

let localhostBlocked = false;
try {
  getBaseUrlWithEnv({ NODE_ENV: "production", NEXT_PUBLIC_APP_URL: "http://localhost:3000" } as NodeJS.ProcessEnv);
} catch {
  localhostBlocked = true;
}
assert(localhostBlocked, "Production localhost fallback bloklanishi kerak");

const layout = read("app/layout.tsx");
assert(layout.includes("Uzbek tilida Xitoy tili va HSK tayyorgarlik"), "Metadata title production positioning bilan bo‘lishi kerak");
assert(layout.includes("Uzbek o‘quvchilar uchun AI yordamida xitoy tili"), "Metadata description mavjud bo‘lishi kerak");
assert(exists("public/manifest.webmanifest"), "PWA manifest mavjud bo‘lishi kerak");

const checkoutRoute = read("app/api/stripe/create-checkout-session/route.ts");
assert(checkoutRoute.includes("getStripeRedirectUrls(request)"), "Stripe checkout request origin/base URL helperdan foydalanishi kerak");
assert(checkoutRoute.includes('mode: "subscription"'), "Stripe Checkout subscription mode ishlatishi kerak");
assert(checkoutRoute.includes("metadata"), "Stripe session metadata saqlashi kerak");

const authCallback = read("app/auth/callback/route.ts");
assert(authCallback.includes("getSafeNextPath"), "Auth callback safe next path ishlatishi kerak");
assert(authCallback.includes("requestUrl.origin"), "Auth callback request origin bilan redirect qilishi kerak");

const dashboard = read("app/dashboard/page.tsx");
for (const href of ["/mastery", "/homework", "/review", "/exam", "/learning-path", "/practice"]) {
  assert(dashboard.includes(`href: "${href}"`), `Dashboard ${href} linkini ko‘rsatishi kerak`);
}
assert(!dashboard.includes('href: "/boss-battle"') && !dashboard.includes('href: "/dictation"'), "Dashboard deep tool cardlar bilan to‘lib ketmasligi kerak");

const practice = read("app/practice/page.tsx");
for (const label of ["O‘rganish", "Mashq", "Xatolar", "Imtihon", "Maqsad va progress", "Challenge"]) {
  assert(practice.includes(label), `Practice kategoriyasi mavjud bo‘lishi kerak: ${label}`);
}

const mentor = read("app/mentor-report/page.tsx") + read("utils/advancedLearning.ts") + read("components/ClosedBetaLanding.tsx");
assert(mentor.includes("rasmiy HSK sertifikati emas") || mentor.includes("rasmiy HSK tashkiloti mahsuloti emas"), "Rasmiy HSK emasligi disclaimeri bo‘lishi kerak");

assert(exists("utils/featureStorage.ts"), "LocalStorage/Supabase fallback helper mavjud bo‘lishi kerak");

const sourceFiles = walk(".", (path) => /\.(ts|tsx|json|md|webmanifest)$/.test(path));
assertFilesDoNotContain(
  sourceFiles,
  /Telegram|telegram|TON|Stars|Fragment|KYC|BotFather/,
  "Taqiqlangan platform/payment matni qolmasligi kerak",
  (path) => path.startsWith("scripts/test-") || path.includes("manual-qa-checklist.md")
);
assertFilesDoNotContain(
  sourceFiles,
  /HSK AI/,
  "Eski HSK AI brendi qolmasligi kerak",
  (path) => path.startsWith("scripts/test-") || path.includes("manual-qa-checklist.md")
);

const clientFiles = walk("app", (path) => /\.(ts|tsx)$/.test(path))
  .concat(walk("components", (path) => /\.(ts|tsx)$/.test(path)))
  .filter((path) => read(path).trimStart().startsWith('"use client"') || read(path).trimStart().startsWith("'use client'"));
assertFilesDoNotContain(clientFiles, /SUPABASE_SERVICE_ROLE_KEY|serviceRoleKey|STRIPE_SECRET_KEY|OPENAI_API_KEY|GOOGLE_CLIENT_SECRET|STRIPE_WEBHOOK_SECRET/, "Client/UI fayllar secret env nomlarini ishlatmasligi kerak", (path) => path.includes("/api/"));

console.log("Production launch tests passed.");
