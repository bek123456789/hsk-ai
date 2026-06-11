import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "HSK AI | Xitoy tili o‘quv markazi",
  description: "HSK 1 dan HSK 6 gacha lug‘at, kartochkalar, testlar va AI tutor UI bilan o‘rganing.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "HSK AI",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#FF7A1A",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main className="app-shell">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
