"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Calendar, Shield, 
  ShoppingBag, Utensils, CreditCard, 
  TrendingUp, Clock, CheckCircle 
} from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { AppNavigation } from "@/components/app-navigation";
import { RoleBadge } from "@/components/food-ordering/role-badge";
import { CountryBadge } from "@/components/food-ordering/country-badge";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";
import { useRestaurants } from "@/hooks/use-restaurants";
import { useRoleCheck } from "@/hooks/use-role-check";
import { ROUTES } from "@/constants/routes";
import hackLog from "@/lib/logger";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthUser();
  const { shouldRender } = useAuthProtection();
  const { allOrders, isLoading: ordersLoading } = useOrders();
  const { restaurants, isLoading: restaurantsLoading } = useRestaurants();
  const { role, country, canManagePaymentMethods } = useRoleCheck();

  React.useEffect(() => {
    hackLog.componentMount('DashboardPage', {
      hasUser: !!user,
      userId: user?.id,
      role: role,
      country: country,
    });
  }, [user, role, country]);

  // Don't render if user is not authenticated
  if (!shouldRender || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = allOrders?.length || 0;
  const paidOrders = allOrders?.filter((o) => o.status === 'PAID').length || 0;
  const pendingOrders = allOrders?.filter((o) => o.status === 'PENDING' || o.status === 'DRAFT').length || 0;
  const recentOrders = allOrders?.slice(0, 3) || [];

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
          {/* Hero Welcome Section */}
          <div className="mb-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="bg-gradient-to-r from-orange-700 via-red-600 to-pink-600 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl dark:from-orange-400 dark:via-red-400 dark:to-pink-400"
                >
                  Welcome back, {user.email?.split('@')[0]}! 🍽️
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-3 text-lg text-orange-600 dark:text-orange-300"
                >
                  Your food ordering dashboard
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                {country && <CountryBadge country={country} />}
                {role && <RoleBadge role={role} />}
              </motion.div>
            </div>
          </div>

          {/* Stats Grid - Premium Design */}
          <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Orders</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {ordersLoading ? '...' : totalOrders}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900/20 dark:text-blue-400">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Completed Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {ordersLoading ? '...' : paidOrders}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 transition-transform group-hover:scale-110 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pending Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {ordersLoading ? '...' : pendingOrders}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 transition-transform group-hover:scale-110 dark:bg-yellow-900/20 dark:text-yellow-400">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Restaurants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Restaurants</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {restaurantsLoading ? '...' : restaurants?.length || 0}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 transition-transform group-hover:scale-110 dark:bg-orange-900/20 dark:text-orange-400">
                    <Utensils className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Orders - Premium Card */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="overflow-hidden rounded-xl border border-orange-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-orange-900/30 dark:bg-slate-800/80"
              >
                <div className="border-b border-orange-200/50 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 dark:border-orange-900/30 dark:from-orange-950/30 dark:to-amber-950/30">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-orange-900 dark:text-orange-100">
                    <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Recent Orders
                  </h2>
                </div>
                
                <div className="p-6">
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="py-8 text-center">
                      <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                        No orders yet. Start by browsing restaurants!
                      </p>
                      <Button 
                        className="mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        onClick={() => router.push(ROUTES.FOOD_ORDERING.RESTAURANTS)}
                      >
                        Browse Restaurants
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.map((order, idx) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          whileHover={{ scale: 1.01, x: 4 }}
                          className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-orange-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-orange-700"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              Order #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                              order.status === 'PAID' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400'
                            }`}>
                              {order.status}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(ROUTES.FOOD_ORDERING.ORDER_DETAILS(order.id) as any)}
                            >
                              View
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push(ROUTES.FOOD_ORDERING.ORDERS)}
                      >
                        View All Orders
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions & Account Info - Premium Cards */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="overflow-hidden rounded-xl border border-orange-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-orange-900/30 dark:bg-slate-800/80"
              >
                <div className="border-b border-orange-200/50 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 dark:border-orange-900/30 dark:from-orange-950/30 dark:to-amber-950/30">
                  <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                    Quick Actions
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full justify-start border-orange-200/50 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-900/30 dark:hover:border-orange-700 dark:hover:bg-orange-950/30"
                      variant="outline"
                      onClick={() => router.push(ROUTES.FOOD_ORDERING.RESTAURANTS)}
                    >
                      <Utensils className="mr-2 h-4 w-4 text-orange-600 dark:text-orange-400" />
                      Browse Restaurants
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full justify-start border-orange-200/50 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-900/30 dark:hover:border-orange-700 dark:hover:bg-orange-950/30"
                      variant="outline"
                      onClick={() => router.push(ROUTES.FOOD_ORDERING.ORDERS)}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4 text-orange-600 dark:text-orange-400" />
                      My Orders
                    </Button>
                  </motion.div>
                  {canManagePaymentMethods() && (
                    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full justify-start border-orange-200/50 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-900/30 dark:hover:border-orange-700 dark:hover:bg-orange-950/30"
                        variant="outline"
                        onClick={() => router.push(ROUTES.FOOD_ORDERING.PAYMENT_METHODS)}
                      >
                        <CreditCard className="mr-2 h-4 w-4 text-orange-600 dark:text-orange-400" />
                        Payment Methods
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Account Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="overflow-hidden rounded-xl border border-orange-200/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-orange-900/30 dark:bg-slate-800/80"
              >
                <div className="border-b border-orange-200/50 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 dark:border-orange-900/30 dark:from-orange-950/30 dark:to-amber-950/30">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-orange-900 dark:text-orange-100">
                    <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Account
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">Email</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">Member Since</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Email Status */}
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      user.isEmailVerified 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">Status</p>
                      <p className={`text-sm ${
                        user.isEmailVerified 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {user.isEmailVerified ? 'Verified ✓' : 'Not Verified'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
