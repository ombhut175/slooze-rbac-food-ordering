"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Utensils, AlertCircle, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { AppNavigation } from "@/components/app-navigation";
import { useRestaurants } from "@/hooks/use-restaurants";
import { CountryBadge } from "@/components/food-ordering/country-badge";
import hackLog from "@/lib/logger";
import type { Restaurant } from "@/types/food-ordering";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

// Skeleton loader for restaurant cards
function RestaurantCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="animate-pulse">
        <div className="mb-4 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="mb-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  );
}

// Restaurant card component
interface RestaurantCardProps {
  restaurant: Restaurant;
}

function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const isActive = restaurant.status === 'ACTIVE';

  return (
    <Link href={ROUTES.FOOD_ORDERING.RESTAURANT_MENU(restaurant.id) as any}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-orange-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-orange-300 hover:shadow-lg dark:border-orange-900/30 dark:bg-slate-800/80 dark:hover:border-orange-700"
      >
        {/* Gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-orange-700 dark:text-slate-100 dark:group-hover:text-orange-300">
              {restaurant.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <CountryBadge country={restaurant.country} size="md" />
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
                  isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-600' : 'bg-gray-600'}`}></span>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-all group-hover:scale-110 group-hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:group-hover:bg-orange-900/40">
            <Utensils className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Empty state component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
        <Utensils className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
        No restaurants available
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        There are no restaurants in your area at the moment.
        <br />
        Please check back later.
      </p>
    </motion.div>
  );
}

// Error state component
interface ErrorStateProps {
  error: any;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
        Failed to load restaurants
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        {error?.message || 'An error occurred while loading restaurants.'}
      </p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </motion.div>
  );
}

export default function RestaurantsPage() {
  const { user, publicUser } = useAuthStore();
  const { shouldRender } = useAuthProtection();
  const { restaurants, isLoading, error, isEmpty, refetch } = useRestaurants();

  React.useEffect(() => {
    hackLog.componentMount('RestaurantsPage', {
      hasUser: !!user,
      userId: user?.id,
      userRole: publicUser?.role,
      userCountry: publicUser?.country,
      isAuthenticated: !!user,
      timestamp: new Date().toISOString(),
    });

    return () => {
      hackLog.dev('RestaurantsPage unmounting', {
        timestamp: new Date().toISOString(),
      });
    };
  }, [user, publicUser]);

  // Handle restaurant click
  const handleRestaurantClick = (restaurantId: string) => {
    hackLog.dev('User clicked restaurant', {
      restaurantId,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
  };

  // Handle retry
  const handleRetry = () => {
    hackLog.dev('User clicked retry', {
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    refetch();
  };

  // Don't render if user is not authenticated
  if (!shouldRender || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950">
      {/* Background Aura Effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-red-400/30 to-orange-400/20 blur-3xl dark:from-red-600/20 dark:to-orange-600/10" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-400/25 to-green-400/20 blur-3xl dark:from-amber-600/15 dark:to-green-600/10" />
        <div
          className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(55%_60%_at_50%_40%,black,transparent)] dark:opacity-[0.25]"
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
              Restaurants
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-3 text-lg text-orange-600 dark:text-orange-300"
            >
              Browse restaurants and discover delicious food options
            </motion.p>
            
            {/* User Role and Country Info */}
            {publicUser && publicUser.role !== 'ADMIN' && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      You are a <span className="font-bold">{publicUser.role}</span> in{" "}
                      <span className="font-bold">
                        {publicUser.country === "IN" ? "🇮🇳 India" : "🇺🇸 United States"}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                      You can only see restaurants available in your country. Admins can view restaurants from all countries.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Admin Info */}
            {publicUser && publicUser.role === 'ADMIN' && (
              <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      You are an <span className="font-bold">ADMIN</span>
                    </p>
                    <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
                      You can view restaurants from all countries (🇮🇳 India and 🇺🇸 United States).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <ErrorState error={error} onRetry={handleRetry} />
          )}

          {/* Empty State */}
          {!isLoading && !error && isEmpty && <EmptyState />}

          {/* Restaurants Grid */}
          {!isLoading && !error && !isEmpty && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {restaurants.map((restaurant) => (
                <motion.div
                  key={restaurant.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
