// Application routes and navigation paths

// Main app routes
export const ROUTES = {
  // Main pages
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ADMIN: '/admin',
  
  // Auth routes (using Next.js route groups)
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup', 
    FORGOT_PASSWORD: '/forgot-password',
  },
  
  // Food Ordering routes
  FOOD_ORDERING: {
    RESTAURANTS: '/restaurants',
    RESTAURANT_MENU: (id: string) => `/restaurants/${id}`,
    ORDERS: '/orders',
    ORDER_DETAILS: (id: string) => `/orders/${id}`,
    ORDER_CONFIRMATION: (id: string) => `/orders/${id}/confirmation`,
    CHECKOUT: (orderId: string) => `/checkout/${orderId}`,
    PAYMENT_METHODS: '/payment-methods',
  },
  
  // Style guide and docs
  STYLEGUIDE: '/styleguide',
} as const;

// Navigation items for main authenticated app (post-login)
export const NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: 'home',
    adminOnly: false,
  },
  {
    title: 'Restaurants',
    href: ROUTES.FOOD_ORDERING.RESTAURANTS,
    icon: 'utensils',
    adminOnly: false,
  },
  {
    title: 'Orders',
    href: ROUTES.FOOD_ORDERING.ORDERS,
    icon: 'shopping-bag',
    adminOnly: false,
  },
  {
    title: 'Payment Methods',
    href: ROUTES.FOOD_ORDERING.PAYMENT_METHODS,
    icon: 'credit-card',
    adminOnly: true,
  },
  {
    title: 'Admin',
    href: ROUTES.ADMIN,
    icon: 'shield',
    adminOnly: true,
  },
  {
    title: 'Profile',
    href: ROUTES.PROFILE,
    icon: 'user',
    adminOnly: false,
  },
] as const;

// Auth navigation items
export const AUTH_NAV_ITEMS = [
  {
    title: 'Sign In',
    href: ROUTES.AUTH.LOGIN,
  },
  {
    title: 'Sign Up', 
    href: ROUTES.AUTH.SIGNUP,
  },
  {
    title: 'Forgot Password',
    href: ROUTES.AUTH.FORGOT_PASSWORD,
  },
] as const;

// Type definitions
export type RouteValue = typeof ROUTES[keyof typeof ROUTES] | typeof ROUTES.AUTH[keyof typeof ROUTES.AUTH];
export type NavItem = typeof NAV_ITEMS[number];
export type AuthNavItem = typeof AUTH_NAV_ITEMS[number];
