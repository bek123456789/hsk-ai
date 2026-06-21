import { getBaseUrlWithEnv, getStripeRedirectUrlsForBaseUrl } from "../utils/getBaseUrl";

function assertEqual(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const productionEnv = {
  NODE_ENV: "production"
} as NodeJS.ProcessEnv;

assertEqual(
  getBaseUrlWithEnv({ ...productionEnv, NEXT_PUBLIC_APP_URL: "https://hsk-ai-one.vercel.app" }),
  "https://hsk-ai-one.vercel.app",
  "NEXT_PUBLIC_APP_URL production base URL"
);

const request = new Request("https://ignored.local/api/stripe/create-checkout-session", {
  headers: {
    "x-forwarded-proto": "https",
    "x-forwarded-host": "hsk-ai-one.vercel.app"
  }
});
assertEqual(getBaseUrlWithEnv(productionEnv, request), "https://hsk-ai-one.vercel.app", "request host production base URL");

assertEqual(
  getBaseUrlWithEnv({ ...productionEnv, VERCEL_URL: "hsk-ai-one.vercel.app" }),
  "https://hsk-ai-one.vercel.app",
  "VERCEL_URL production base URL"
);

let threw = false;
try {
  getBaseUrlWithEnv({ ...productionEnv, NEXT_PUBLIC_APP_URL: "http://localhost:3000" });
} catch {
  threw = true;
}
assert(threw, "production must not fall back to localhost");

const urls = getStripeRedirectUrlsForBaseUrl("https://hsk-ai-one.vercel.app");
assertEqual(
  urls.successUrl,
  "https://hsk-ai-one.vercel.app/premium/success?session_id={CHECKOUT_SESSION_ID}",
  "Stripe success URL"
);
assertEqual(urls.cancelUrl, "https://hsk-ai-one.vercel.app/premium", "Stripe cancel URL");
assert(!urls.successUrl.includes("localhost"), "Stripe success URL must not include localhost");
assert(!urls.cancelUrl.includes("localhost"), "Stripe cancel URL must not include localhost");

console.log("Production URL tests passed.");
