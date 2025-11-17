/**
 * API Configuration and Endpoints
 * NEXT_PUBLIC_API_URL must be set in .env.local file
 * Next.js will inline this at build time
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Testing API Endpoints (relative URLs - prefix handled by apiClient)
export const API_ENDPOINTS = {
  // Test endpoints
  TESTING: {
    DATA: 'test/testing', // 🚨 Relative URL - prefix added by apiClient
    SUPABASE_STATUS: 'test/supabase-status', 
    DATABASE_STATUS: 'test/database-status',
  },
  
  // Auth endpoints (from existing constants)
  AUTH: {
    LOGIN: 'auth/login',
    SIGNUP: 'auth/signup',
    LOGOUT: 'auth/logout',
    IS_LOGGED_IN: 'auth/isLoggedIn',
    FORGOT_PASSWORD: 'auth/forgot-password',
    ME: 'auth/me',
  },
  
  // User endpoints (from existing constants)
  USERS: {
    ME: 'auth/me', // Changed from 'users/me' to 'auth/me'
    ORGANIZATION_MEMBERSHIP: 'users/organization-membership',
  },
  
  // Food Ordering endpoints
  FOOD_ORDERING: {
    // Restaurants
    RESTAURANTS: 'restaurants',
    RESTAURANT_DETAILS: (id: string) => `restaurants/${id}`,
    RESTAURANT_MENU: (id: string) => `restaurants/${id}/menu`,
    
    // Orders
    ORDERS: 'orders',
    ORDER_DETAILS: (id: string) => `orders/${id}`,
    ORDER_ITEMS: (orderId: string) => `orders/${orderId}/items`,
    ORDER_ITEM: (orderId: string, itemId: string) => `orders/${orderId}/items/${itemId}`,
    ORDER_CHECKOUT: (id: string) => `orders/${id}/checkout`,
    ORDER_CANCEL: (id: string) => `orders/${id}/cancel`,
    
    // Payment Methods
    PAYMENT_METHODS: 'payment-methods',
    PAYMENT_METHOD: (id: string) => `payment-methods/${id}`,
  },
} as const;

// Request Configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;
