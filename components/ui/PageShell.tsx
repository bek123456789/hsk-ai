import type { ReactNode } from "react";

export function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`premium-grid mx-auto w-full max-w-7xl px-5 pb-36 pt-10 sm:px-8 md:pb-12 lg:py-14 ${className}`}>{children}</section>;
}
