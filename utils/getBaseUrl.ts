function cleanUrl(url: string) {
  return url.trim().replace(/\/$/, "");
}

function isLocalUrl(url: string) {
  return /(^|:\/\/|\.|@)localhost(?::|\/|$)|127\.0\.0\.1|0\.0\.0\.0/.test(url);
}

export function getBaseUrl(request?: Request) {
  return getBaseUrlWithEnv(process.env, request);
}

export function getBaseUrlWithEnv(env: NodeJS.ProcessEnv, request?: Request) {
  const envUrl = env.NEXT_PUBLIC_APP_URL?.trim();

  if (envUrl && !isLocalUrl(envUrl)) {
    return cleanUrl(envUrl);
  }

  const forwardedHost = request?.headers.get("x-forwarded-host");
  const host = forwardedHost || request?.headers.get("host");
  const proto = request?.headers.get("x-forwarded-proto") || "https";

  if (host && !isLocalUrl(host)) {
    return cleanUrl(`${proto}://${host}`);
  }

  const vercelUrl = env.VERCEL_URL?.trim();
  if (vercelUrl && !isLocalUrl(vercelUrl)) {
    return cleanUrl(vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`);
  }

  if (env.NODE_ENV === "production") {
    throw new Error("Production base URL is not configured.");
  }

  return cleanUrl(envUrl || "http://localhost:3000");
}

export function getStripeRedirectUrls(request?: Request) {
  const baseUrl = getBaseUrl(request);
  return getStripeRedirectUrlsForBaseUrl(baseUrl);
}

export function getStripeRedirectUrlsForBaseUrl(baseUrl: string) {
  return {
    successUrl: `${baseUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${baseUrl}/premium`
  };
}
