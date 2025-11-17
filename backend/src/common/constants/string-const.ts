// Environment Variables
export enum ENV {
  SUPABASE_URL = 'SUPABASE_URL',
  SUPABASE_ANON_KEY = 'SUPABASE_ANON_KEY',
  SUPABASE_SERVICE_ROLE_KEY = 'SUPABASE_SERVICE_ROLE_KEY',
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  SWAGGER_USER = 'SWAGGER_USER',
  SWAGGER_PASSWORD = 'SWAGGER_PASSWORD',
  SWAGGER_ENABLED = 'SWAGGER_ENABLED',
  SWAGGER_UI_DEEP_LINKING = 'SWAGGER_UI_DEEP_LINKING',
  SWAGGER_UI_DOC_EXPANSION = 'SWAGGER_UI_DOC_EXPANSION',
  SWAGGER_UI_FILTER = 'SWAGGER_UI_FILTER',
  FRONTEND_URL = 'FRONTEND_URL',
  REDIRECT_TO_FRONTEND_URL = 'REDIRECT_TO_FRONTEND_URL',
  COOKIE_DOMAIN = 'COOKIE_DOMAIN',

  // Database Configuration
  DATABASE_URL = 'DATABASE_URL',
  DATABASE_HOST = 'DATABASE_HOST',
  DATABASE_PORT = 'DATABASE_PORT',
  DATABASE_NAME = 'DATABASE_NAME',
  DATABASE_USER = 'DATABASE_USER',
  DATABASE_PASSWORD = 'DATABASE_PASSWORD',
}

// Common Messages
export enum MESSAGES {
  // Generic
  SUCCESS = 'Success',
  CREATED = 'Created',
  UPDATED = 'Updated',
  DELETED = 'Deleted',

  // Errors
  UNEXPECTED_ERROR = 'Unexpected error occurred',
  VALIDATION_ERROR = 'Validation error',
  NOT_FOUND = 'Resource not found',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  INTERNAL_SERVER_ERROR = 'Internal server error',

  // Auth
  INVALID_TOKEN = 'Invalid token',
  TOKEN_EXPIRED = 'Token expired',
  NO_TOKEN_PROVIDED = 'No authorization token provided',
  INVALID_OR_EXPIRED_TOKEN = 'Invalid or expired token',
  USER_NOT_FOUND = 'User not found',
  USER_NOT_FOUND_IN_DATABASE = 'User not found in database',
  USER_ROLE_NOT_FOUND = 'User role not found',
  AUTHENTICATION_FAILED = 'Authentication failed',
  ACCESS_DENIED = 'Access denied',
  ACCESS_DENIED_ROLE_REQUIRED = 'Access denied: Required role(s)',
  TASK_NOT_FOUND = 'Task not found',
  LOGIN_SUCCESSFUL = 'Login successful',
  SIGNUP_SUCCESSFUL = 'Account created successfully',
  PASSWORD_RESET_SENT = 'Password reset email sent',
  INVALID_CREDENTIALS = 'Invalid email or password',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  WEAK_PASSWORD = 'Password is too weak',
  INVALID_EMAIL = 'Invalid email format',

  // Food Ordering
  RESTAURANT_NOT_FOUND = 'Restaurant not found',
  ORDER_NOT_FOUND = 'Order not found',
  ORDER_ITEM_NOT_FOUND = 'Order item not found',
  ORDER_NOT_DRAFT = 'Order is not in DRAFT status and cannot be modified',
  ORDER_INVALID_STATUS_FOR_CHECKOUT = 'Order status must be DRAFT or PENDING for checkout',
  ORDER_EMPTY = 'Order must have at least one item before checkout',
  MENU_ITEM_NOT_FOUND = 'Menu item not found',
  MENU_ITEM_NOT_AVAILABLE = 'Menu item is not available',
  MENU_ITEM_WRONG_RESTAURANT = 'Menu item does not belong to the order restaurant',
  PAYMENT_METHOD_NOT_FOUND = 'Payment method not found',
  PAYMENT_NOT_FOUND = 'Payment not found',
  PAYMENT_FAILED = 'Payment processing failed',

  // Supabase
  SUPABASE_CONNECTION_ERROR = 'Failed to connect to database',
  SUPABASE_QUERY_ERROR = 'Database query failed',
}

// API Response Messages
export enum API_MESSAGES {
  USERS_FETCHED = 'Users fetched successfully',
  USER_CREATED = 'User created successfully',
  USER_UPDATED = 'User updated successfully',
  USER_DELETED = 'User deleted successfully',
}

// Table Names (for future use)
export enum TABLES {
  USERS = 'users',
  TASKS = 'tasks',
  PROFILES = 'profiles',
}

// Queue Names (for future BullMQ usage)
export enum QUEUES {
  JOBS = 'jobs',
  EMAILS = 'emails',
  NOTIFICATIONS = 'notifications',
}

// Cookie Keys
export enum COOKIES {
  AUTH_TOKEN = 'auth_token',
}

// User Roles
export enum USER_ROLES {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

// Country Codes
export enum COUNTRY_CODES {
  IN = 'IN',
  US = 'US',
}
