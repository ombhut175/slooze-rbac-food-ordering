/**
 * Food Ordering Type Definitions
 * TypeScript interfaces for the RBAC Food Ordering Backend API
 */

// ============================================================================
// Restaurant Types
// ============================================================================

export interface Restaurant {
  id: string;
  name: string;
  country: 'IN' | 'US';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Menu Item Types
// ============================================================================

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: 'INR' | 'USD';
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELED';

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  country: 'IN' | 'US';
  status: OrderStatus;
  totalAmountCents: number;
  currency: 'INR' | 'USD';
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  restaurant?: Restaurant;
  paymentMethodId?: string | null;
  paymentMethod?: PaymentMethod | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPriceCents: number;
  createdAt: string;
  menuItem?: MenuItem;
}

// ============================================================================
// Payment Method Types
// ============================================================================

export type PaymentProvider = 'MOCK' | 'STRIPE';

export interface PaymentMethod {
  id: string;
  provider: PaymentProvider;
  label: string;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
  country: 'IN' | 'US' | null;
  active: boolean;
  isDefault: boolean;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API Request Types
// ============================================================================

export interface CreateOrderRequest {
  restaurantId: string;
}

export interface AddOrderItemRequest {
  menuItemId: string;
  quantity: number;
}

export interface UpdateOrderItemRequest {
  quantity: number;
}

export interface CheckoutOrderRequest {
  paymentMethodId: string;
}

export interface CreatePaymentMethodRequest {
  label: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  country?: 'IN' | 'US';
  isDefault?: boolean;
}

export interface UpdatePaymentMethodRequest {
  label?: string;
  active?: boolean;
  isDefault?: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface RestaurantsResponse {
  restaurants: Restaurant[];
}

export interface RestaurantMenuResponse {
  restaurant: Restaurant;
  menuItems: MenuItem[];
}

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}

export interface PaymentMethodsResponse {
  paymentMethods: PaymentMethod[];
}

// ============================================================================
// Utility Types
// ============================================================================

export type Country = 'IN' | 'US';
export type Currency = 'INR' | 'USD';

// Helper type for status badge colors
export type StatusColor = 'gray' | 'yellow' | 'green' | 'red';

// Helper type for role-based permissions
export type UserRole = 'ADMIN' | 'MANAGER' | 'MEMBER';
