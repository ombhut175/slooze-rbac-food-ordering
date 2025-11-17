"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Shield,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Award,
} from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth-store";
import { useAuthProtection } from "@/components/auth/auth-provider";
import { AppNavigation } from "@/components/app-navigation";
import { RoleBadge } from "@/components/food-ordering/role-badge";
import { CountryBadge } from "@/components/food-ordering/country-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useRoleCheck } from "@/hooks/use-role-check";
import { ROUTES } from "@/constants/routes";
import hackLog from "@/lib/logger";
import useSWR from "swr";
import { apiRequest } from "@/helpers/request";
import { API_ENDPOINTS } from "@/constants/api";

interface UserProfile {
  user: {
    id: string;
    email: string;
    email_confirmed_at?: string;
    isEmailVerified: boolean;
    created_at: string;
    updated_at: string;
  };
  publicUser: {
    id: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "MEMBER";
    country: "IN" | "US";
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  isEmailVerified: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthUser();
  const { shouldRender } = useAuthProtection();
  const { role, country } = useRoleCheck();

  // Fetch fresh profile data from API
  const { data: profileData, error, isLoading, mutate } = useSWR<UserProfile>(
    user ? API_ENDPOINTS.USERS.ME : null,
    async (url) => {
      const response = await apiRequest.get<UserProfile>(url);
      return response;
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  React.useEffect(() => {
    hackLog.componentMount("ProfilePage", {
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

  const handleRefresh = () => {
    hackLog.dev("User clicked refresh profile", { userId: user.id });
    mutate();
  };

  // Use API data if available, fallback to constructed data from store
  const displayData = profileData || {
    user: user,
    publicUser: {
      id: user.id,
      email: user.email,
      role: role || 'MEMBER',
      country: country || 'IN',
      isEmailVerified: user.isEmailVerified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
    isEmailVerified: user.isEmailVerified,
  };

  const memberSince = new Date(displayData.user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lastUpdated = new Date(displayData.user.updated_at).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          {/* Header with Gradient */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-orange-700 via-red-600 to-pink-600 bg-clip-text text-3xl font-extrabold leading-tight tracking-tight text-transparent sm:text-4xl dark:from-orange-400 dark:via-red-400 dark:to-pink-400"
              >
                My Profile
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mt-2 text-lg text-orange-600 dark:text-orange-300"
              >
                View your account information
              </motion.p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
            >
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  Failed to load profile data. Showing cached information.
                </p>
              </div>
            </motion.div>
          )}

          {/* Profile Header Card - Premium Design */}
          <Card className="mb-6 overflow-hidden border-orange-200/50 shadow-lg dark:border-orange-900/30">
              <div className="relative h-32 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
                <div className="absolute inset-0 bg-black/10"></div>
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity hover:opacity-100" />
              </div>
              <CardContent className="relative -mt-16 pb-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                  {/* Avatar with Glow Effect */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-red-500 blur-xl opacity-50" />
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-orange-500 to-red-500 text-5xl font-bold text-white shadow-lg dark:border-slate-800">
                      {displayData.user.email.charAt(0).toUpperCase()}
                    </div>
                  </motion.div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {displayData.user.email}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    {displayData.publicUser && <RoleBadge role={displayData.publicUser.role} />}
                    {displayData.publicUser && <CountryBadge country={displayData.publicUser.country} />}
                    {displayData.isEmailVerified ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400">
                        <XCircle className="mr-1 h-3 w-3" />
                        Not Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Account Information - Premium Card */}
            <Card className="border-orange-200/50 shadow-sm backdrop-blur-sm dark:border-orange-900/30 dark:bg-slate-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-600" />
                  Account Information
                </CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Email Address</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 break-all">
                      {displayData.user.email}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Email Verification */}
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      displayData.isEmailVerified
                        ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Email Verification
                    </p>
                    <p
                      className={`text-sm ${
                        displayData.isEmailVerified
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {displayData.isEmailVerified ? "Verified ✓" : "Not Verified"}
                    </p>
                    {displayData.user.email_confirmed_at && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Confirmed on{" "}
                        {new Date(displayData.user.email_confirmed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Country */}
                {displayData.publicUser && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Country</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {displayData.publicUser.country === "IN" ? "🇮🇳 India" : "🇺🇸 United States"}
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Role */}
                {displayData.publicUser && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Role</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {displayData.publicUser.role}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {displayData.publicUser.role === "ADMIN"
                          ? "Full system access"
                          : displayData.publicUser.role === "MANAGER"
                          ? "Can manage orders and checkout"
                          : "Can browse and add to cart"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Activity - Premium Card */}
            <Card className="border-orange-200/50 shadow-sm backdrop-blur-sm dark:border-orange-900/30 dark:bg-slate-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Account Activity
                </CardTitle>
                <CardDescription>Important dates and timestamps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Created At */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Member Since</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{memberSince}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {Math.floor(
                        (Date.now() - new Date(displayData.user.created_at).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days ago
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Updated At */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Last Updated</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{lastUpdated}</p>
                  </div>
                </div>

                <Separator />

                {/* Account Status */}
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Account Active
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Your account is in good standing
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Premium Card */}
          <Card className="mt-6 border-orange-200/50 shadow-sm backdrop-blur-sm dark:border-orange-900/30 dark:bg-slate-800/80">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Navigate to other sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push(ROUTES.DASHBOARD)}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push(ROUTES.FOOD_ORDERING.RESTAURANTS)}
                >
                  Browse Restaurants
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push(ROUTES.FOOD_ORDERING.ORDERS)}
                >
                  My Orders
                </Button>
                {displayData.publicUser?.role === "ADMIN" && (
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => router.push(ROUTES.FOOD_ORDERING.PAYMENT_METHODS)}
                  >
                    Payment Methods
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
