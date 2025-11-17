"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES, NAV_ITEMS } from "@/constants/routes";
import { ThemeToggle } from "./theme-toggle";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useRoleCheck } from "@/hooks/use-role-check";
import { RoleBadge } from "./food-ordering/role-badge";
import { CountryBadge } from "./food-ordering/country-badge";
import { Button } from "./ui/button";
import { GraduationCap, LogOut } from "lucide-react";
import hackLog from "@/lib/logger";

export function AppNavigation() {
  const pathname = usePathname();
  const { user, publicUser, logout } = useAuthStore();
  const { role, canManagePaymentMethods } = useRoleCheck();

  React.useEffect(() => {
    hackLog.componentMount('AppNavigation', {
      currentPath: pathname,
      isAuthenticated: !!user,
      userRole: role,
    });
  }, [pathname, user, role]);

  const handleLogout = async () => {
    hackLog.authLogout(user?.id);
    await logout();
    hackLog.routeChange(pathname, ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="mr-2 flex sm:mr-4">
          <Link href={ROUTES.HOME} className="mr-2 flex items-center space-x-2 sm:mr-6">
            <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 ring-1 ring-border">
              <GraduationCap className="h-4 w-4 text-white" />
            </span>
            <span className="hidden font-bold sm:inline">Quodo</span>
          </Link>
        </div>

        {/* Main Navigation - Desktop */}
        <nav className="hidden items-center space-x-4 text-sm font-medium md:flex lg:space-x-6">
          {NAV_ITEMS.map((item) => {
            // Hide admin-only items for non-admin users
            if (item.adminOnly && !canManagePaymentMethods()) {
              return null;
            }
            
            return (
              <Link
                key={item.href}
                href={item.href as any}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => {
                  if (pathname !== item.href) {
                    hackLog.routeChange(pathname, item.href);
                  }
                }}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Display country badge if user has a country - Hidden on mobile */}
              {publicUser?.country && (
                <div className="hidden sm:block">
                  <CountryBadge country={publicUser.country} size="sm" showName={false} />
                </div>
              )}
              
              {/* Display role badge if user has a role - Hidden on mobile */}
              {publicUser?.role && (
                <div className="hidden sm:block">
                  <RoleBadge role={publicUser.role} size="sm" />
                </div>
              )}
              
              {/* Welcome message - Hidden on mobile */}
              <span className="hidden text-sm text-muted-foreground lg:inline">
                Welcome, {user.email?.split('@')[0] || 'User'}
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href={ROUTES.AUTH.SIGNUP}>
                <Button size="sm" className="hidden sm:inline-flex">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu - Shown on small screens */}
      {user && (
        <div className="border-t md:hidden">
          <nav className="container flex items-center space-x-4 overflow-x-auto px-4 py-2 text-sm font-medium">
            {NAV_ITEMS.map((item) => {
              // Hide admin-only items for non-admin users
              if (item.adminOnly && !canManagePaymentMethods()) {
                return null;
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={cn(
                    "whitespace-nowrap transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  )}
                  onClick={() => {
                    if (pathname !== item.href) {
                      hackLog.routeChange(pathname, item.href);
                    }
                  }}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
