"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Loading Overlay Component
 * 
 * Full-screen loading overlay with spinner and optional message
 * Used for blocking operations like checkout processing
 * 
 * Features:
 * - Full-screen overlay with backdrop
 * - Animated spinner
 * - Optional loading message
 * - Smooth fade in/out animations
 * - Prevents user interaction during loading
 */

export interface LoadingOverlayProps {
  isOpen: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  isOpen,
  message = "Processing...",
  className,
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-2xl dark:bg-slate-800"
          >
            {/* Spinner */}
            <Loader2 className="h-12 w-12 animate-spin text-orange-600 dark:text-orange-400" />
            
            {/* Message */}
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {message}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Please wait...
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Inline Loading Spinner
 * 
 * Small inline spinner for buttons and inline loading states
 */

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin text-current",
        sizeClasses[size],
        className
      )}
    />
  );
}
