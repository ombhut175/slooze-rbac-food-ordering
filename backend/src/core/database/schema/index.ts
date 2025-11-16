import { healthChecking } from './health-checking';
import { users, userRoleEnum, countryCodeEnum } from './users';
import {
  restaurants,
  menuItems,
  orders,
  orderItems,
  paymentMethods,
  payments,
  restaurantStatusEnum,
  orderStatusEnum,
  paymentProviderEnum,
  paymentStatusEnum,
} from './food-ordering';

// Schema exports
export const schema = {
  healthChecking,
  users,
  restaurants,
  menuItems,
  orders,
  orderItems,
  paymentMethods,
  payments,
};

// Export individual tables for convenience
export {
  healthChecking,
  users,
  restaurants,
  menuItems,
  orders,
  orderItems,
  paymentMethods,
  payments,
  userRoleEnum,
  countryCodeEnum,
  restaurantStatusEnum,
  orderStatusEnum,
  paymentProviderEnum,
  paymentStatusEnum,
};
