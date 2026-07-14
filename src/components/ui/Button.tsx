"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors duration-200 select-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--color-accent] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-gradient-accent text-white shadow-[--shadow-glow] hover:brightness-110",
  secondary:
    "bg-white text-ink border border-line hover:border-ink-faint shadow-[--shadow-card]",
  ghost: "text-ink-muted hover:text-ink hover:bg-cream-dim",
  dark: "bg-ink text-cream hover:bg-ink-soft",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <motion.span whileTap={{ scale: 0.97 }} className="inline-flex">
        <Link href={href} className={cls}>
          {children}
        </Link>
      </motion.span>
    );
  }
  return (
    <motion.button whileTap={{ scale: 0.97 }} type={type} onClick={onClick} className={cls}>
      {children}
    </motion.button>
  );
}

export function IconButton({
  children,
  className = "",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-cream-dim hover:text-ink ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
