"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { CountryBadge } from "./country-badge";
import { ChevronRight } from "lucide-react";
import { hackLog } from "@/lib/logger";
import type { Order } from "@/types/food-ordering";

/**
 * Order Card Component
 * 
 * Displays an order card with status and details
 * Features:
 * - Order ID (truncated), restaurant name, total, status, date
 * - Color-coded status badge
 * - Country badge for ADMIN users
 * - Click to view order details
 * - Framer Motion animations
 * - Responsive layout (horizontal on desktop, vertical on mobile)
 */

export interface OrderCardProps {
  order: Order;
  onClick: () => void;
  showCountry?: boolean;
  className?: string;
}

export function OrderCard({
  order,
  onClick,
  showCountry = false,
  className,
}: OrderCardProps) {
  React.useEffect(() => {
    hackLog.componentMount("OrderCard", {
      orderId: order.id,
      status: order.status,
      totalAmountCents: order.totalAmountCents,
      restaurantName: order.restaurant?.name,
    });
  }, [order.id, order.status, order.totalAmountCents, order.restaurant?.name]);

  const handleClick = () => {
    hackLog.dev("Order card clicked", {
      orderId: order.id,
      status: order.status,
    });
    onClick();
  };

  const formatPrice = (priceCents: number, currency: string) => {
    const amount = priceCents / 100;
    if (currency === "INR") {
      return `₹${amount.toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const truncateId = (id: string) => {
    if (id.length <= 8) return id;
    return `${id.slice(0, 8)}...`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-orange-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-700",
        className
      )}
    >
      {/* Card Content */}
      <div className="p-5">
        {/* Header: Order ID and Status */}
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Order
            </span>
            <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {truncateId(order.id)}
            </code>
          </div>
          
          <StatusBadge status={order.status} size="sm" />
        </div>

        {/* Restaurant Name */}
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {order.restaurant?.name || "Unknown Restaurant"}
        </h3>

        {/* Order Details Grid */}
        <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
          {/* Total Amount */}
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Total
            </div>
            <div className="font-semibold text-orange-600 dark:text-orange-400">
              {formatPrice(order.totalAmountCents, order.currency)}
            </div>
          </div>

          {/* Item Count */}
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Items
            </div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {order.items?.length || 0}
            </div>
          </div>
        </div>

        {/* Footer: Date and Country */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <time className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(order.createdAt)}
            </time>
            {showCountry && (
              <CountryBadge country={order.country} size="sm" showName={false} />
            )}
          </div>

          {/* View Details Indicator */}
          <div className="flex items-center gap-1 text-xs font-medium text-orange-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-orange-400">
            <span>View Details</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* Hover Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-amber-500/0 opacity-0 transition-opacity group-hover:opacity-5" />

      {/* Status Accent Border */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 transition-opacity",
          order.status === "DRAFT" && "bg-slate-400 dark:bg-slate-600",
          order.status === "PENDING" && "bg-yellow-400 dark:bg-yellow-600",
          order.status === "PAID" && "bg-green-500 dark:bg-green-600",
          order.status === "CANCELED" && "bg-red-500 dark:bg-red-600",
          "opacity-0 group-hover:opacity-100"
        )}
      />
    </motion.div>
  );
}

/**
 * Order Card Skeleton
 * Loading state for order cards
 */
export function OrderCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        
        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1 h-3 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div>
            <div className="mb-1 h-3 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
