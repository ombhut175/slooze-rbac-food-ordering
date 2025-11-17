"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function PremiumButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: PremiumButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-4";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white shadow-md shadow-orange-500/40 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 active:scale-95 focus-visible:ring-orange-500/40",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
    ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  };
  
  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-13 px-8 text-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && !disabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity hover:opacity-100"
          style={{
            backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          }}
        />
      )}
    </motion.button>
  );
}