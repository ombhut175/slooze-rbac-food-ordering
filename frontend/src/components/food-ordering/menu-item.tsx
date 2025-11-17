"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Minus, Loader2 } from "lucide-react";
import { hackLog } from "@/lib/logger";
import type { MenuItem as MenuItemType } from "@/types/food-ordering";

/**
 * Menu Item Component
 * 
 * Displays a menu item card with add to cart functionality
 * Features:
 * - Item name, description, and price
 * - Quantity selector
 * - Add to cart button with loading state
 * - Currency formatting (INR/USD)
 * - Framer Motion animations
 * - Disabled state for unavailable items
 */

export interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (itemId: string, quantity: number) => Promise<void>;
  isAdding?: boolean;
  className?: string;
}

export function MenuItem({
  item,
  onAddToCart,
  isAdding = false,
  className,
}: MenuItemProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    hackLog.componentMount("MenuItem", {
      itemId: item.id,
      itemName: item.name,
      priceCents: item.priceCents,
      currency: item.currency,
      available: item.available,
    });
  }, [item.id, item.name, item.priceCents, item.currency, item.available]);

  const handleAddToCart = async () => {
    if (!item.available || isProcessing || isAdding) return;

    hackLog.dev("Add to cart clicked", {
      itemId: item.id,
      itemName: item.name,
      quantity,
    });

    setIsProcessing(true);
    try {
      await onAddToCart(item.id, quantity);
      // Reset quantity after successful add
      setQuantity(1);
    } catch (error) {
      hackLog.error("Failed to add item to cart", {
        error,
        itemId: item.id,
        quantity,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const formatPrice = (priceCents: number, currency: string) => {
    const amount = priceCents / 100;
    if (currency === "INR") {
      return `₹${amount.toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const isDisabled = !item.available || isProcessing || isAdding;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-slate-800",
        item.available
          ? "border-slate-200 dark:border-slate-700"
          : "border-slate-300 opacity-60 dark:border-slate-600",
        className
      )}
    >
      {/* Image Placeholder */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20">
        <div className="flex h-full items-center justify-center">
          <span className="text-6xl opacity-40">🍽️</span>
        </div>
        
        {/* Unavailable Overlay */}
        {!item.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-white">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Item Name */}
        <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {item.description}
          </p>
        )}

        {/* Price */}
        <div className="mb-4 text-2xl font-bold text-orange-600 dark:text-orange-400">
          {formatPrice(item.priceCents, item.currency)}
        </div>

        {/* Quantity Selector and Add Button */}
        <div className="flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={decrementQuantity}
              disabled={isDisabled || quantity <= 1}
              className="p-2 text-slate-600 transition-colors hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-orange-400"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
              {quantity}
            </span>
            
            <button
              type="button"
              onClick={incrementQuantity}
              disabled={isDisabled || quantity >= 99}
              className="p-2 text-slate-600 transition-colors hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-orange-400"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isDisabled}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              "bg-orange-600 text-white hover:bg-orange-700",
              "disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
            )}
          >
            {isProcessing || isAdding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hover Gradient Overlay */}
      {item.available && (
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-amber-500/0 opacity-0 transition-opacity group-hover:opacity-5" />
      )}
    </motion.div>
  );
}

/**
 * Menu Item Skeleton
 * Loading state for menu items
 */
export function MenuItemSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      <div className="aspect-video w-full animate-pulse bg-slate-200 dark:bg-slate-700" />
      <div className="p-4">
        <div className="mb-1 h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-3 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-4 h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-3">
          <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
