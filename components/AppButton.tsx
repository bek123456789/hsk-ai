import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: ReactNode;
  className?: string;
};

const variants = {
  primary: "bg-gradient-to-r from-orange-brand to-orange-hot text-white shadow-glow hover:shadow-card",
  secondary: "border border-orange-soft/80 bg-white/90 text-ink shadow-soft hover:bg-orange-soft",
  danger: "border border-rose-200 bg-rose-50 text-rose-700 shadow-soft hover:bg-rose-100",
  ghost: "bg-transparent text-ink hover:bg-white/70"
};

export function AppButton({ href, variant = "primary", children, className = "", ...props }: AppButtonProps) {
  const classes = `warm-focus inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black transition duration-200 hover:-translate-y-1 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
