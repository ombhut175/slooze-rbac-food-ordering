"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  delay?: number;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  delay = 0,
  isLoading = false,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      {/* Gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
              {isLoading ? (
                <span className="inline-block h-9 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              ) : (
                value
              )}
            </p>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgColor} ${iconColor} transition-transform group-hover:scale-110`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}