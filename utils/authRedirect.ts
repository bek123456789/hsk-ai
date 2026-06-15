export function getSafeNextPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value) return fallback;

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }

  const trimmed = decoded.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("\\") || trimmed.includes("\n") || trimmed.includes("\r")) return fallback;
  if (/^\/[a-z][a-z0-9+.-]*:/i.test(trimmed)) return fallback;

  return trimmed;
}
