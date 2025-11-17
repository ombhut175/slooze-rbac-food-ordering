"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { AppNavigation } from "@/components/app-navigation";
import { useOrder } from "@/hooks/use-order";
import { StatusBadge } from "@/components/food-ordering/status-badge";
import hackLog from "@/lib/logger";
import { ROUTES } from "@/constants/routes";

// Celebration animation variants
const celebrationVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.5,
    },
  },
};

const sparkleVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user, publicUser } = useAuthStore();
  const { shouldRender } = useAuthProtection();
  const { order, isLoading, error } = useOrder(id);

  React.useEffect(() => {
    hackLog.componentMount("OrderConfirmationPage", {
      orderId: id,
      hasUser: !!user,
      userId: user?.id,
      userRole: publicUser?.role,
      userCountry: publicUser?.country,
      isAuthenticated: !!user,
      timestamp: new Date().toISOString(),
    });

    return () => {
      hackLog.dev("OrderConfirmationPage unmounting", {
        orderId: id,
        timestamp: new Date().toISOString(),
      });
    };
  }, [id, user, publicUser]);

  // Format currency
  const formatCurrency = (cents: number, currency: string) => {
    const amount = cents / 100;
    if (currency === "INR") {
      return `₹${amount.toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  // Handle view order details
  const handleViewDetails = () => {
    hackLog.dev("User clicked view order details", {
      orderId: id,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    router.push(ROUTES.FOOD_ORDERING.ORDER_DETAILS(id) as any);
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    hackLog.dev("User clicked continue shopping", {
      orderId: id,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    router.push(ROUTES.FOOD_ORDERING.RESTAURANTS as any);
  };

  // Don't render if user is not authenticated
  if (!shouldRender || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-amber-50 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950">
      {/* App Navigation */}
      <AppNavigation />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
              <p className="text-slate-600 dark:text-slate-400">
                Loading order details...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[60vh] flex-col items-center justify-center"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Unable to load order
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {error?.message || "An error occurred while loading the order."}
              </p>
              <button
                onClick={handleContinueShopping}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
              >
                Back to Restaurants
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {!isLoading && !error && order && (
          <div className="relative py-8">
            {/* Floating sparkles */}
            <motion.div
              variants={sparkleVariants}
              initial="initial"
              animate="animate"
              className="absolute left-1/4 top-10 text-amber-400"
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
            <motion.div
              variants={sparkleVariants}
              initial="initial"
              animate="animate"
              style={{ animationDelay: "0.5s" }}
              className="absolute right-1/4 top-20 text-orange-400"
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
            <motion.div
              variants={sparkleVariants}
              initial="initial"
              animate="animate"
              style={{ animationDelay: "1s" }}
              className="absolute left-1/3 top-32 text-amber-300"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>

            {/* Success Icon */}
            <motion.div
              variants={celebrationVariants}
              initial="initial"
              animate="animate"
              className="mb-8 flex justify-center"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                <CheckCircle className="h-14 w-14 text-white" />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="text-center"
            >
              <h1 className="mb-3 text-3xl font-bold text-orange-700 dark:text-orange-100 sm:text-4xl">
                Order Confirmed!
              </h1>
              <p className="mb-2 text-lg text-slate-600 dark:text-slate-400">
                Your order has been successfully placed
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Order ID: <span className="font-mono font-medium">#{order.id.substring(0, 8)}</span>
              </p>
            </motion.div>

            {/* Order Summary Card */}
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-8"
            >
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Order Summary
                  </h2>
                  <StatusBadge status={order.status} size="md" />
                </div>

                {/* Restaurant Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {order.restaurant?.name || "Unknown Restaurant"}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6 space-y-3">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Items
                  </h3>
                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 dark:text-slate-400">
                              {item.quantity}×
                            </span>
                            <span className="text-slate-900 dark:text-slate-100">
                              {item.menuItem?.name || "Unknown Item"}
                            </span>
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {formatCurrency(
                              item.unitPriceCents * item.quantity,
                              order.currency
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      No items
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(order.totalAmountCents, order.currency)}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                {order.paymentMethod && (
                  <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Payment Method: {order.paymentMethod.label}
                    </p>
                    {order.paymentMethod.brand && order.paymentMethod.last4 && (
                      <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                        {order.paymentMethod.brand} •••• {order.paymentMethod.last4}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="mt-8 flex flex-col gap-3 px-4 sm:flex-row sm:justify-center sm:px-0"
            >
              <button
                onClick={handleViewDetails}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-orange-600 bg-white px-6 py-3 font-medium text-orange-600 transition-colors hover:bg-orange-50 dark:border-orange-400 dark:bg-slate-800 dark:text-orange-400 dark:hover:bg-slate-700 sm:w-auto"
              >
                View Order Details
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleContinueShopping}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700 sm:w-auto"
              >
                Continue Shopping
                <ShoppingBag className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
