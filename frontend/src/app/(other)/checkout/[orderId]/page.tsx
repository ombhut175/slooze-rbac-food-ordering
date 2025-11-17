"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { AppNavigation } from "@/components/app-navigation";
import { useOrder } from "@/hooks/use-order";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { useCheckout } from "@/hooks/use-checkout";
import { StatusBadge } from "@/components/food-ordering/status-badge";
import { CountryBadge } from "@/components/food-ordering/country-badge";
import hackLog from "@/lib/logger";
import { ROUTES } from "@/constants/routes";
import type { PaymentMethod } from "@/types/food-ordering";

// Skeleton loader for checkout page
function CheckoutSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="mb-4 h-8 w-48 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-6 w-64 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order summary skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 h-6 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded bg-slate-200 dark:bg-slate-700"></div>
            ))}
          </div>
        </div>

        {/* Payment methods skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 h-6 w-32 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded bg-slate-200 dark:bg-slate-700"></div>
            ))}
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
  onRetry?: () => void;
}

function ErrorState({ error, onBack, onRetry }: ErrorStateProps) {
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
        Failed to load checkout
      </h3>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        {error?.message || "An error occurred while loading the checkout page."}
      </p>
      <div className="mt-6 flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
          >
            Retry
          </button>
        )}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Order
        </button>
      </div>
    </motion.div>
  );
}

// Payment method card component
interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
}

function PaymentMethodCard({
  paymentMethod,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
        isSelected
          ? "border-orange-600 bg-orange-50 dark:border-orange-500 dark:bg-orange-900/20"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {paymentMethod.label}
            </span>
            {paymentMethod.isDefault && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Default
              </span>
            )}
          </div>
          {paymentMethod.brand && paymentMethod.last4 && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {paymentMethod.brand} •••• {paymentMethod.last4}
            </p>
          )}
          {paymentMethod.expMonth && paymentMethod.expYear && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">
              Expires {paymentMethod.expMonth.toString().padStart(2, "0")}/
              {paymentMethod.expYear}
            </p>
          )}
          {paymentMethod.country && (
            <div className="mt-2">
              <CountryBadge country={paymentMethod.country} size="sm" />
            </div>
          )}
        </div>
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            isSelected
              ? "border-orange-600 bg-orange-600 dark:border-orange-500 dark:bg-orange-500"
              : "border-slate-300 dark:border-slate-600"
          }`}
        >
          {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
        </div>
      </div>
    </button>
  );
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = React.use(params);
  const router = useRouter();
  const { user, publicUser } = useAuthStore();
  const { shouldRender } = useAuthProtection();
  const { order, isLoading: orderLoading, error: orderError, refetch: refetchOrder } = useOrder(orderId);
  const {
    activePaymentMethods,
    isLoading: paymentMethodsLoading,
    error: paymentMethodsError,
    isEmpty: noPaymentMethods,
    refetch: refetchPaymentMethods,
  } = usePaymentMethods();
  const { checkout, isProcessing } = useCheckout();

  // Selected payment method state
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState<string | null>(null);
  
  // Checkout error state
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);

  // Check user role for permissions
  const userRole = publicUser?.role;
  const canCheckout = userRole === "ADMIN" || userRole === "MANAGER";

  // Combined loading state
  const isLoading = orderLoading || paymentMethodsLoading;
  
  // Combined error state
  const error = orderError || paymentMethodsError;

  React.useEffect(() => {
    hackLog.componentMount("CheckoutPage", {
      orderId: orderId,
      hasUser: !!user,
      userId: user?.id,
      userRole,
      userCountry: publicUser?.country,
      isAuthenticated: !!user,
      canCheckout,
      timestamp: new Date().toISOString(),
    });

    return () => {
      hackLog.dev("CheckoutPage unmounting", {
        orderId: orderId,
        timestamp: new Date().toISOString(),
      });
    };
  }, [orderId, user, publicUser, userRole, canCheckout]);

  // Auto-select default payment method
  React.useEffect(() => {
    if (activePaymentMethods.length > 0 && !selectedPaymentMethodId) {
      const defaultMethod = activePaymentMethods.find((pm) => pm.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethodId(defaultMethod.id);
        hackLog.dev("Auto-selected default payment method", {
          paymentMethodId: defaultMethod.id,
          label: defaultMethod.label,
        });
      } else {
        // Select first available method if no default
        setSelectedPaymentMethodId(activePaymentMethods[0].id);
        hackLog.dev("Auto-selected first payment method", {
          paymentMethodId: activePaymentMethods[0].id,
          label: activePaymentMethods[0].label,
        });
      }
    }
  }, [activePaymentMethods, selectedPaymentMethodId]);

  // Redirect if user doesn't have checkout permission
  React.useEffect(() => {
    if (user && !canCheckout) {
      hackLog.dev("User does not have checkout permission, redirecting", {
        userId: user.id,
        userRole,
        orderId: orderId,
      });
      router.push(ROUTES.FOOD_ORDERING.ORDER_DETAILS(orderId) as any);
    }
  }, [user, canCheckout, userRole, orderId, router]);

  // Redirect if order is not in DRAFT status
  React.useEffect(() => {
    if (order && order.status !== "DRAFT") {
      hackLog.dev("Order is not in DRAFT status, redirecting", {
        orderId: order.id,
        status: order.status,
      });
      router.push(ROUTES.FOOD_ORDERING.ORDER_DETAILS(orderId) as any);
    }
  }, [order, orderId, router]);

  // Format currency
  const formatCurrency = (cents: number, currency: string) => {
    const amount = cents / 100;
    if (currency === "INR") {
      return `₹${amount.toFixed(2)}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  // Handle back navigation
  const handleBack = () => {
    hackLog.dev("User clicked back button", {
      orderId: orderId,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    router.push(ROUTES.FOOD_ORDERING.ORDER_DETAILS(orderId) as any);
  };

  // Handle retry
  const handleRetry = () => {
    hackLog.dev("User clicked retry button", {
      orderId: orderId,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    setCheckoutError(null);
    refetchOrder();
    refetchPaymentMethods();
  };

  // Handle complete order
  const handleCompleteOrder = async () => {
    if (!selectedPaymentMethodId) {
      setCheckoutError("Please select a payment method");
      return;
    }

    if (!order) {
      setCheckoutError("Order not found");
      return;
    }

    hackLog.dev("User clicked complete order", {
      orderId: orderId,
      paymentMethodId: selectedPaymentMethodId,
      userId: user?.id,
      userRole,
      totalAmount: order.totalAmountCents,
      timestamp: new Date().toISOString(),
    });

    setCheckoutError(null);

    try {
      const result = await checkout(orderId, selectedPaymentMethodId);
      
      if (result) {
        hackLog.dev("Checkout successful, navigating to confirmation", {
          orderId: result.id,
          status: result.status,
        });
        
        // Navigate to confirmation page
        router.push(ROUTES.FOOD_ORDERING.ORDER_CONFIRMATION(orderId) as any);
      } else {
        setCheckoutError("Checkout failed. Please try again.");
      }
    } catch (err: any) {
      hackLog.error("Checkout error in component", {
        error: err,
        orderId: orderId,
        paymentMethodId: selectedPaymentMethodId,
      });
      setCheckoutError(err?.message || "An error occurred during checkout");
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
            disabled={isProcessing}
            className="mb-6 inline-flex items-center gap-2 text-orange-600 transition-colors hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-orange-400 dark:hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Order</span>
          </button>

          {/* Loading State */}
          {isLoading && <CheckoutSkeleton />}

          {/* Error State */}
          {!isLoading && error && (
            <ErrorState error={error} onBack={handleBack} onRetry={handleRetry} />
          )}

          {/* Checkout Content */}
          {!isLoading && !error && order && (
            <>
              {/* Page Header */}
              <div className="mb-8">
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-100 sm:text-4xl">
                    Checkout
                  </h1>
                  <StatusBadge status={order.status} size="lg" />
                </div>
                <p className="text-orange-600 dark:text-orange-300">
                  Complete your order from {order.restaurant?.name || "Unknown Restaurant"}
                </p>
              </div>

              {/* Checkout Error Message */}
              {checkoutError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 dark:text-red-100">
                        Checkout Error
                      </p>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {checkoutError}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Checkout Grid */}
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {/* Order Summary (Left Side) */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </h2>

                  {/* Order Items */}
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
                                {formatCurrency(item.unitPriceCents, order.currency)} × {item.quantity}
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

                  {/* Total */}
                  <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-slate-900 dark:text-slate-100">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(order.totalAmountCents, order.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection (Right Side) */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </h2>

                  {/* No Payment Methods */}
                  {noPaymentMethods && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <div>
                          <p className="font-medium text-amber-900 dark:text-amber-100">
                            No Payment Methods Available
                          </p>
                          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                            Please contact an administrator to set up payment methods.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Methods List */}
                  {!noPaymentMethods && (
                    <div className="space-y-3">
                      {activePaymentMethods.map((paymentMethod) => (
                        <PaymentMethodCard
                          key={paymentMethod.id}
                          paymentMethod={paymentMethod}
                          isSelected={selectedPaymentMethodId === paymentMethod.id}
                          onSelect={() => {
                            setSelectedPaymentMethodId(paymentMethod.id);
                            setCheckoutError(null);
                            hackLog.dev("Payment method selected", {
                              paymentMethodId: paymentMethod.id,
                              label: paymentMethod.label,
                            });
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Complete Order Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleCompleteOrder}
                      disabled={isProcessing || noPaymentMethods || !selectedPaymentMethodId}
                      className="w-full rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Complete Order
                        </span>
                      )}
                    </button>
                    
                    {!noPaymentMethods && (
                      <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-500">
                        By completing this order, you agree to the terms and conditions
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
