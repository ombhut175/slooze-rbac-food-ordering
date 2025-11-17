"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CountryBadge } from "./country-badge";
import { hackLog } from "@/lib/logger";
import type { Restaurant } from "@/types/food-ordering";

/**
 * Restaurant Card Component
 * 
 * Displays a restaurant card with hover effects and animations
 * Features:
 * - Restaurant name and country badge
 * - Status indicator (active/inactive)
 * - Hover scale effect
 * - Click to navigate to menu
 * - Framer Motion animations
 */

export interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  className?: string;
}

export function RestaurantCard({
  restaurant,
  onClick,
  className,
}: RestaurantCardProps) {
  React.useEffect(() => {
    hackLog.componentMount("RestaurantCard", {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      country: restaurant.country,
      status: restaurant.status,
    });
  }, [restaurant.id, restaurant.name, restaurant.country, restaurant.status]);

  const handleClick = () => {
    hackLog.dev("Restaurant card clicked", {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
    onClick();
  };

  const isActive = restaurant.status === "ACTIVE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-slate-800",
        isActive
          ? "border-slate-200 dark:border-slate-700"
          : "border-slate-300 opacity-60 dark:border-slate-600",
        className
      )}
    >
      {/* Card Content */}
      <div className="p-6">
        {/* Header with Status Indicator */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
              {restaurant.name}
            </h3>
          </div>
          
          {/* Status Indicator */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                isActive
                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                  : "bg-slate-400 dark:bg-slate-600"
              )}
              title={isActive ? "Active" : "Inactive"}
            />
          </div>
        </div>

        {/* Country Badge */}
        <div className="flex items-center gap-2">
          <CountryBadge country={restaurant.country} size="sm" />
          {!isActive && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Inactive
            </span>
          )}
        </div>

        {/* Hover Indicator */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-orange-400">
          <span>View Menu</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Gradient Overlay on Hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-amber-500/0 opacity-0 transition-opacity group-hover:opacity-5" />
    </motion.div>
  );
}

/**
 * Restaurant Card Skeleton
 * Loading state for restaurant cards
 */
export function RestaurantCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}
