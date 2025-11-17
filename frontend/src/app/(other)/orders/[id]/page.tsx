"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  CreditCard,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { useRoleCheck } from "@/hooks/use-role-check";
import { AppNavigation } from "@/components/app-navigation";
import { useOrder } from "@/hooks/use-order";
import { useOrderActions } from "@/hooks/use-order-actions";
import { StatusBadge } from "@/components/food-ordering/status-badge";
import { CountryBadge } from "@/components/food-ordering/country-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import hackLog from "@/lib/logger";
import { ROUTES } from "@/constants/routes";

// Skeleton loader for order details
function OrderDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="mb-4 h-8 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-6 w-64 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items list skeleton */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 h-6 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex-1">
                    <div className="mb-2 h-5 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
                  </div>
                  <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary skeleton */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 h-6 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="space-y-3">
              <div className="h-8 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-10 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error state component
interface ErrorStateProps {
  error: any;
  onBack: () => void;
}

function ErrorState({ error, onBack }: ErrorStateProps) {
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
        Failed to load order
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        {error?.message || "An error occurred while loading the order."}
      </p>
      <button
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </button>
    </motion.div>
  );
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user, publicUser } = useAuthStore();
  const { shouldRender } = useAuthProtection();
  const { order, isLoading, error } = useOrder(id);
  const { cancel, isProcessing } = useOrderActions();
  const { 
    canCheckout, 
    canCancelOrders, 
    isAdmin, 
    getUnavailableFeatureMessage 
  } = useRoleCheck();

  // Cancel confirmation dialog state
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  // Check user role for permissions
  const userRole = publicUser?.role;

  React.useEffect(() => {
    hackLog.componentMount("OrderDetailsPage", {
      orderId: id,
      hasUser: !!user,
      userId: user?.id,
      userRole,
      userCountry: publicUser?.country,
      isAuthenticated: !!user,
      canCheckout: canCheckout(),
      canCancelOrders: canCancelOrders(),
      publicUserData: publicUser,
      timestamp: new Date().toISOString(),
    });

    return () => {
      hackLog.dev("OrderDetailsPage unmounting", {
        orderId: id,
        timestamp: new Date().toISOString(),
      });
    };
  }, [id, user, publicUser, userRole, canCheckout, canCancelOrders]);

  // Format currency
  const formatCurrency = (cents: number, currency: string) => {
    const amount = cents / 100;
    if (currency === "INR") {
      return `₹${amount.toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle back navigation
  const handleBack = () => {
    hackLog.dev("User clicked back button", {
      orderId: id,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    router.push(ROUTES.FOOD_ORDERING.ORDERS as any);
  };

  // Handle proceed to checkout
  const handleCheckout = () => {
    hackLog.dev("User clicked proceed to checkout", {
      orderId: id,
      userId: user?.id,
      userRole,
      timestamp: new Date().toISOString(),
    });
    router.push(ROUTES.FOOD_ORDERING.CHECKOUT(id) as any);
  };

  // Handle edit cart
  const handleEditCart = () => {
    hackLog.dev("User clicked edit cart", {
      orderId: id,
      restaurantId: order?.restaurantId,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    if (order?.restaurantId) {
      router.push(ROUTES.FOOD_ORDERING.RESTAURANT_MENU(order.restaurantId) as any);
    }
  };

  // Handle cancel order
  const handleCancelClick = () => {
    hackLog.dev("User clicked cancel order button", {
      orderId: id,
      userId: user?.id,
      userRole,
      timestamp: new Date().toISOString(),
    });
    setShowCancelDialog(true);
  };

  // Confirm cancel order
  const handleConfirmCancel = async () => {
    hackLog.dev("User confirmed order cancellation", {
      orderId: id,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });

    const result = await cancel(id);
    if (result) {
      setShowCancelDialog(false);
      // Order will be updated via SWR revalidation
    }
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 inline-flex items-center gap-2 text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Orders</span>
          </button>

          {/* Loading State */}
          {isLoading && <OrderDetailsSkeleton />}

          {/* Error State */}
          {!isLoading && error && (
            <ErrorState error={error} onBack={handleBack} />
          )}

          {/* Order Details */}
          {!isLoading && !error && order && (
            <>
              {/* Page Header */}
              <div className="mb-8 flex flex-col gap-4">
                <div>
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <h1 className="text-2xl font-bold text-orange-700 dark:text-orange-100 sm:text-3xl lg:text-4xl">
                      Order #{order.id.substring(0, 8)}
                    </h1>
                    <StatusBadge status={order.status} size="lg" />
                  </div>
                  <p className="text-orange-600 dark:text-orange-300">
                    {order.restaurant?.name || "Unknown Restaurant"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                  {isAdmin() && (
                    <div className="mt-2">
                      <CountryBadge country={order.country} size="sm" />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                  {/* Edit Cart Button (for DRAFT orders) */}
                  {order.status === "DRAFT" && (
                    <button
                      onClick={handleEditCart}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:w-auto"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Cart
                    </button>
                  )}

                  {/* Proceed to Checkout Button (ADMIN/MANAGER only, DRAFT orders) */}
                  {(() => {
                    const showCheckout = order.status === "DRAFT" && canCheckout();
                    hackLog.dev("Checkout button visibility check", {
                      orderStatus: order.status,
                      canCheckout: canCheckout(),
                      showCheckout,
                      userRole: publicUser?.role,
                      publicUser,
                    });
                    return showCheckout ? (
                      <button
                        onClick={handleCheckout}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 sm:w-auto"
                      >
                        <CreditCard className="h-4 w-4" />
                        Proceed to Checkout
                      </button>
                    ) : null;
                  })()}

                  {/* Cancel Order Button (ADMIN/MANAGER only, PAID orders) */}
                  {order.status === "PAID" && canCancelOrders() && (
                    <button
                      onClick={handleCancelClick}
                      disabled={isProcessing}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {isProcessing ? "Canceling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>

              {/* Helpful messages for unavailable features */}
              {order.status === "DRAFT" && !canCheckout() && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-amber-900 dark:text-amber-100">
                        Checkout Unavailable
                      </p>
                      <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                        {getUnavailableFeatureMessage('checkout')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {order.status === "PAID" && !canCancelOrders() && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-amber-900 dark:text-amber-100">
                        Order Cancellation Unavailable
                      </p>
                      <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                        {getUnavailableFeatureMessage('cancel')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Content */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Order Items */}
                <div className="lg:col-span-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Order Items
                    </h2>

                    {/* Items List */}
                    <div className="space-y-4">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item) => {
                          const subtotal = item.unitPriceCents * item.quantity;
                          return (
                            <div
                              key={item.id}
                              className="flex items-start justify-between border-b border-slate-200 pb-4 last:border-0 last:pb-0 dark:border-slate-700"
                            >
                              <div className="flex-1">
                                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                                  {item.menuItem?.name || "Unknown Item"}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                  {formatCurrency(
                                    item.unitPriceCents,
                                    order.currency
                                  )}{" "}
                                  × {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                  {formatCurrency(subtotal, order.currency)}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-slate-600 dark:text-slate-400">
                          No items in this order
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Order Summary
                    </h2>

                    {/* Total */}
                    <div className="mb-6 border-t border-slate-200 pt-4 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-slate-900 dark:text-slate-100">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {formatCurrency(
                            order.totalAmountCents,
                            order.currency
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Payment Information (for PAID orders) */}
                    {order.status === "PAID" && order.paymentMethod && (
                      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="mb-2 flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="font-medium text-green-900 dark:text-green-100">
                            Payment Completed
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {order.paymentMethod.label}
                        </p>
                        {order.paymentMethod.brand &&
                          order.paymentMethod.last4 && (
                            <p className="text-sm text-green-700 dark:text-green-300">
                              {order.paymentMethod.brand} ••••{" "}
                              {order.paymentMethod.last4}
                            </p>
                          )}
                      </div>
                    )}

                    {/* Order Status Info */}
                    <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
                      <div className="flex items-start gap-3">
                        <ShoppingBag className="mt-0.5 h-5 w-5 text-slate-600 dark:text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            Order Status
                          </p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {order.status === "DRAFT" &&
                              "This order is in draft status. Complete checkout to finalize."}
                            {order.status === "PENDING" &&
                              "Your order is being processed."}
                            {order.status === "PAID" &&
                              "Your order has been completed and paid."}
                            {order.status === "CANCELED" &&
                              "This order has been canceled."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </main>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone. The order status will be changed to CANCELED.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Canceling...
                </>
              ) : (
                "Cancel Order"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
