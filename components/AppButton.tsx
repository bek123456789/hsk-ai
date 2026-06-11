import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  children: ReactNode;
  className?: string;
};

const variants = {
  primary: "bg-gradient-to-r from-orange-brand to-orange-hot text-white shadow-glow hover:shadow-card",
  secondary: "bg-white/90 text-ink shadow-soft hover:bg-orange-soft dark:bg-white/10 dark:text-cream dark:hover:bg-white/15",
  dark: "bg-ink text-white shadow-soft hover:bg-stone-800 dark:bg-cream dark:text-ink",
  ghost: "bg-transparent text-ink hover:bg-white/70 dark:text-cream dark:hover:bg-white/10"
};

export function AppButton({ href, variant = "primary", children, className = "", ...props }: AppButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-black transition duration-200 hover:-translate-y-1 active:translate-y-0 ${variants[variant]} ${className}`;

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
