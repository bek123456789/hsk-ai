import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { OfflineBanner } from "@/components/OfflineBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://hsk-ai-one.vercel.app"),
  title: {
    default: "HanziFlow AI — Uzbek tilida Xitoy tili va HSK tayyorgarlik",
    template: "%s | HanziFlow AI"
  },
  description: "Uzbek o‘quvchilar uchun AI yordamida xitoy tili, HSK darslari, listening, speaking, writing, diktant va xatodan o‘rganish platformasi.",
  applicationName: "HanziFlow AI",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/brand/hanziflow-icon.png"
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "HanziFlow AI",
    title: "HanziFlow AI — Uzbek tilida Xitoy tili va HSK tayyorgarlik",
    description: "AI yordamida HSK darslari, diktant, speaking, writing, smart review va xatodan o‘rganish platformasi.",
    url: "/",
    images: [
      {
        url: "/brand/hanziflow-logo.png",
        width: 1254,
        height: 1254,
        alt: "HanziFlow AI"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "HanziFlow AI — Uzbek tilida Xitoy tili va HSK tayyorgarlik",
    description: "Uzbek o‘quvchilar uchun AI yordamida xitoy tili va HSK tayyorgarlik platformasi."
  },
  appleWebApp: {
    capable: true,
    title: "HanziFlow AI",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#FF6B1A",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <OfflineBanner />
        <main className="app-shell">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
