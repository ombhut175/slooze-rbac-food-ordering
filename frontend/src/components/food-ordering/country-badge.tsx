import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Country } from "@/types/food-ordering";

/**
 * Country Badge Component
 * 
 * Displays country indicators with flag emojis
 * - IN: 🇮🇳 India
 * - US: 🇺🇸 United States
 */

const countryBadgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  {
    variants: {
      size: {
        sm: "text-[10px] px-2 py-0.5 gap-1",
        md: "text-xs px-2.5 py-0.5 gap-1.5",
        lg: "text-sm px-3 py-1 gap-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const countryConfig: Record<Country, { flag: string; name: string }> = {
  IN: {
    flag: "🇮🇳",
    name: "India",
  },
  US: {
    flag: "🇺🇸",
    name: "United States",
  },
};

export interface CountryBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof countryBadgeVariants> {
  country: Country;
  showName?: boolean;
  showFlag?: boolean;
}

export function CountryBadge({
  country,
  size,
  showName = true,
  showFlag = true,
  className,
  ...props
}: CountryBadgeProps) {
  const config = countryConfig[country];

  return (
    <span
      className={cn(countryBadgeVariants({ size }), className)}
      title={config.name}
      {...props}
    >
      {showFlag && <span className="text-base leading-none">{config.flag}</span>}
      {showName && country}
    </span>
  );
}
