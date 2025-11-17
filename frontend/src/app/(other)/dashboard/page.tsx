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
      <div className="flex min-h-screen items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950">
      {/* App Navigation */}
      <AppNavigation />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-100 sm:text-4xl">
                  Welcome back, {user.email?.split('@')[0]}! 🍽️
                </h1>
                <p className="mt-2 text-orange-600 dark:text-orange-300">
                  Your food ordering dashboard
                </p>
              </div>
              <div className="flex items-center gap-2">
                {country && <CountryBadge country={country} />}
                {role && <RoleBadge role={role} />}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Orders</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {ordersLoading ? '...' : totalOrders}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
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
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {ordersLoading ? '...' : paidOrders}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
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
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {ordersLoading ? '...' : pendingOrders}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
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
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Restaurants</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {restaurantsLoading ? '...' : restaurants?.length || 0}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                    <Utensils className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
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
                        className="mt-4"
                        onClick={() => router.push(ROUTES.FOOD_ORDERING.RESTAURANTS)}
                      >
                        Browse Restaurants
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900/50"
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
                        </div>
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
              </div>
            </div>

            {/* Quick Actions & Account Info */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Quick Actions
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => router.push(ROUTES.FOOD_ORDERING.RESTAURANTS)}
                  >
                    <Utensils className="mr-2 h-4 w-4" />
                    Browse Restaurants
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => router.push(ROUTES.FOOD_ORDERING.ORDERS)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                  {canManagePaymentMethods() && (
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => router.push(ROUTES.FOOD_ORDERING.PAYMENT_METHODS)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Methods
                    </Button>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    <User className="h-5 w-5 text-indigo-600" />
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
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
