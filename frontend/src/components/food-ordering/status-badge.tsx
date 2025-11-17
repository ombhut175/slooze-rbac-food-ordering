import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/food-ordering";

/**
 * Status Badge Component
 * 
 * Displays color-coded badges for order status
 * - DRAFT: Gray
 * - PENDING: Yellow
 * - PAID: Green
 * - CANCELED: Red
 */

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors",
  {
    variants: {
      status: {
        DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        PAID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        CANCELED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      status: "DRAFT",
      size: "md",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: OrderStatus;
}

export function StatusBadge({
  status,
  size,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ status, size }), className)}
      {...props}
    >
      {status}
    </span>
  );
}
