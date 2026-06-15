import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hsk-ai-one.vercel.app";
  const routes = ["", "/login", "/register", "/premium", "/help", "/changelog", "/beta-status", "/mobile-app"];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/premium" ? 0.8 : 0.6
  }));
}
