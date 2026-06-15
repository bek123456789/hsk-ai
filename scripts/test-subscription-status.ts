const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const token = process.env.TEST_SUPABASE_ACCESS_TOKEN ?? process.env.SUPABASE_ACCESS_TOKEN;

async function main() {
  if (!token) {
    console.log("Subscription status: access token yo‘q. Brauzerda login qilib /api/subscription/status ni manual tekshiring.");
    return;
  }

  const response = await fetch(`${appUrl.replace(/\/$/, "")}/api/subscription/status`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    console.log("Subscription status: sessiya yaroqsiz yoki muddati tugagan. Brauzerda qayta login qiling.");
    return;
  }

  if (!response.ok) {
    console.error(`Subscription status tekshiruvi xato: HTTP ${response.status}`);
    process.exit(1);
  }

  const body = (await response.json()) as { isPremium?: boolean; subscriptionStatus?: string };
  if (typeof body.isPremium !== "boolean") {
    console.error("Subscription status javobida isPremium boolean emas.");
    process.exit(1);
  }

  console.log(`Subscription status: tekshirildi, premium=${body.isPremium ? "ha" : "yo‘q"}.`);
}

main().catch((error) => {
  console.error(`Subscription status tekshiruvini bajarib bo‘lmadi: ${error instanceof Error ? error.message : "noma’lum xatolik"}`);
  process.exit(1);
});

export {};
