"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Users, Utensils, TrendingUp, Activity } from "lucide-react";
import type { PublicUser } from "@/lib/api/users";
import type { Restaurant } from "@/types/food-ordering";

interface StatsCardsProps {
  users: PublicUser[] | undefined;
  restaurants: Restaurant[] | undefined;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
  isLoading?: boolean;
}

function StatCard({ title, value, subtitle, icon, gradient, delay, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-900/90 dark:shadow-lg dark:shadow-slate-950/50">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700/50"></div>
            <div className="h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700/50"></div>
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700/50"></div>
          </div>
          <div className="h-12 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700/50"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group overflow-hidden rounded-xl border border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:scale-[1.02] dark:border-slate-700/50 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-900/90 dark:shadow-lg dark:shadow-slate-950/50 dark:hover:border-slate-600/50 dark:hover:shadow-xl dark:hover:shadow-slate-950/60"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white dark:drop-shadow-sm">{value}</p>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md dark:shadow-lg dark:group-hover:shadow-xl`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function StatsCards({ users, restaurants, isLoading }: StatsCardsProps) {
  const stats = React.useMemo(() => {
    if (!users || !restaurants) {
      return {
        totalUsers: 0,
        adminCount: 0,
        managerCount: 0,
        memberCount: 0,
        totalRestaurants: 0,
        activeRestaurants: 0,
        inactiveRestaurants: 0,
      };
    }

    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const managerCount = users.filter((u) => u.role === "MANAGER").length;
    const memberCount = users.filter((u) => u.role === "MEMBER").length;
    const activeRestaurants = restaurants.filter((r) => r.status === "ACTIVE").length;
    const inactiveRestaurants = restaurants.filter((r) => r.status === "INACTIVE").length;

    return {
      totalUsers: users.length,
      adminCount,
      managerCount,
      memberCount,
      totalRestaurants: restaurants.length,
      activeRestaurants,
      inactiveRestaurants,
    };
  }, [users, restaurants]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        subtitle={`${stats.adminCount} Admin, ${stats.managerCount} Manager, ${stats.memberCount} Member`}
        icon={<Users className="h-6 w-6" />}
        gradient="from-blue-500 to-blue-600"
        delay={0.1}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Total Restaurants"
        value={stats.totalRestaurants}
        subtitle={`${stats.activeRestaurants} Active, ${stats.inactiveRestaurants} Inactive`}
        icon={<Utensils className="h-6 w-6" />}
        gradient="from-orange-500 to-red-600"
        delay={0.2}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Active Restaurants"
        value={stats.activeRestaurants}
        subtitle={`${Math.round((stats.activeRestaurants / Math.max(stats.totalRestaurants, 1)) * 100)}% of total`}
        icon={<Activity className="h-6 w-6" />}
        gradient="from-green-500 to-emerald-600"
        delay={0.3}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Platform Health"
        value={stats.totalUsers > 0 && stats.totalRestaurants > 0 ? "Healthy" : "Growing"}
        subtitle={`${stats.totalUsers + stats.totalRestaurants} total entities`}
        icon={<TrendingUp className="h-6 w-6" />}
        gradient="from-purple-500 to-pink-600"
        delay={0.4}
        isLoading={isLoading}
      />
    </div>
  );
}
