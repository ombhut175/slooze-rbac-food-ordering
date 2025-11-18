"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, Users, Utensils } from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { AppNavigation } from "@/components/app-navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ROUTES } from "@/constants/routes";
import hackLog from "@/lib/logger";
import { UsersManagement } from "./_components/users-management";
import { RestaurantsManagement } from "./_components/restaurants-management";
import { StatsCards } from "./_components/stats-cards";
import { useAllUsers } from "@/hooks/use-all-users";
import { useAllRestaurants } from "@/hooks/use-all-restaurants";

export default function AdminPage() {
  const router = useRouter();
  const { user, publicUser } = useAuthStore();
  const { shouldRender } = useAuthProtection();
  const [activeTab, setActiveTab] = React.useState<"users" | "restaurants">("users");
  const { users, isLoading: isLoadingUsers } = useAllUsers();
  const { restaurants, isLoading: isLoadingRestaurants } = useAllRestaurants();

  React.useEffect(() => {
    hackLog.componentMount("AdminPage", {
      hasUser: !!user,
      userId: user?.id,
      role: publicUser?.role,
    });
  }, [user, publicUser]);

  // Redirect non-ADMIN users to dashboard
  React.useEffect(() => {
    if (publicUser && publicUser.role !== "ADMIN") {
      hackLog.dev("Non-admin user attempted to access admin page, redirecting", {
        userId: user?.id,
        role: publicUser.role,
      });
      router.push(ROUTES.DASHBOARD);
    }
  }, [publicUser, router, user]);

  // Don't render if user is not authenticated or not loaded yet
  if (!shouldRender || !user || !publicUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render content for non-admin users (will redirect)
  if (publicUser.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Redirecting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Aura Effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-red-400/30 to-orange-400/20 blur-3xl dark:from-orange-500/30 dark:to-red-500/20" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-400/25 to-green-400/20 blur-3xl dark:from-amber-500/25 dark:to-orange-500/15" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/15 blur-3xl dark:from-purple-500/20 dark:to-pink-500/15" />
        <div
          className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(55%_60%_at_50%_40%,black,transparent)] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(100,116,139,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "-1px -1px",
          }}
        />
      </div>

      {/* App Navigation */}
      <AppNavigation />

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Header with Gradient */}
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-gradient-to-r from-orange-700 via-red-600 to-pink-600 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl dark:from-orange-400 dark:via-red-400 dark:to-pink-400"
            >
              Admin Panel
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-3 text-lg text-orange-600 dark:text-orange-300"
            >
              Manage users and restaurants across the platform
            </motion.p>
          </div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <StatsCards 
              users={users} 
              restaurants={restaurants}
              isLoading={isLoadingUsers || isLoadingRestaurants}
            />
          </motion.div>

          {/* Admin Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 overflow-hidden rounded-xl border border-purple-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-900/90 dark:shadow-lg dark:shadow-purple-950/30"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 shadow-sm dark:bg-purple-500/20 dark:text-purple-400 dark:shadow-purple-500/20 dark:ring-1 dark:ring-purple-500/30">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Administrator Access
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    You have full administrative privileges. You can manage user roles, countries, and restaurant information across all regions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabbed Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="overflow-hidden rounded-xl border border-orange-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-orange-500/30 dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-900/90 dark:shadow-xl dark:shadow-slate-950/50"
          >
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "users" | "restaurants")}>
              <div className="border-b border-orange-200/50 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 dark:border-orange-500/20 dark:from-slate-800/50 dark:to-slate-900/50">
                <div className="flex items-center justify-between gap-4">
                  <TabsList className="h-auto w-auto bg-transparent p-0">
                    <TabsTrigger 
                      value="users" 
                      className="flex items-center gap-2 rounded-lg border border-transparent px-4 py-2.5 transition-all data-[state=active]:border-orange-300 data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm dark:text-slate-400 dark:hover:text-slate-300 dark:data-[state=active]:border-orange-500/50 dark:data-[state=active]:bg-slate-700/50 dark:data-[state=active]:text-orange-400 dark:data-[state=active]:shadow-orange-500/10"
                    >
                      <Users className="h-4 w-4" />
                      User Management
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="h-auto w-auto bg-transparent p-0">
                    <TabsTrigger 
                      value="restaurants" 
                      className="flex items-center gap-2 rounded-lg border border-transparent px-4 py-2.5 transition-all data-[state=active]:border-orange-300 data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm dark:text-slate-400 dark:hover:text-slate-300 dark:data-[state=active]:border-orange-500/50 dark:data-[state=active]:bg-slate-700/50 dark:data-[state=active]:text-orange-400 dark:data-[state=active]:shadow-orange-500/10"
                    >
                      <Utensils className="h-4 w-4" />
                      Restaurant Management
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="p-6">
                <TabsContent value="users">
                  <UsersManagement />
                </TabsContent>

                <TabsContent value="restaurants">
                  <RestaurantsManagement />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
