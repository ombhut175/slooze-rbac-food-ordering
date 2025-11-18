# 🍽️ Avengers DineOps - Frontend

> Modern Next.js frontend with Role-Based Access Control (RBAC) and real-time cart management

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Components](#components)
- [Hooks](#hooks)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Avengers DineOps frontend is a production-ready Next.js application built with TypeScript, featuring a sophisticated role-based access control system, real-time cart management, and a beautiful responsive UI with dark mode support.

**Key Capabilities:**
- 🎨 Modern UI with orange/amber gradient theme
- 🔐 Role-based UI rendering (ADMIN, MANAGER, MEMBER)
- 🌍 Country-scoped data display (India & United States)
- 🛒 Real-time shopping cart with persistent state
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🌙 Dark mode support
- ✨ Smooth animations with Framer Motion
- 📊 Comprehensive logging for debugging

## ✨ Features

### User Features

- **Authentication**: Login, signup, forgot password with Supabase Auth
- **Restaurant Browsing**: View restaurants filtered by user's country
- **Menu Viewing**: Browse restaurant menus with prices and descriptions
- **Shopping Cart**: Add items, update quantities, remove items with persistent state
- **Order Management**: Create orders, view order history, track status
- **Checkout**: Select payment method and complete orders (ADMIN/MANAGER only)
- **Order Cancellation**: Cancel orders with confirmation (ADMIN/MANAGER only)
- **Payment Methods**: Manage payment methods (ADMIN only)

### UI/UX Features

- **Responsive Design**: Works seamlessly on all devices
- **Dark Mode**: Full dark mode support with theme toggle
- **Animations**: Smooth page transitions and interactions
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: User-friendly error messages with retry options
- **Toast Notifications**: Success and error feedback
- **Role Badges**: Visual indicators for user roles
- **Country Badges**: Flag emojis for country identification
- **Status Badges**: Color-coded order status indicators

### Developer Features

- **Type Safety**: Full TypeScript with strict mode
- **Custom Logger**: Structured logging with hackLog
- **Error Handling**: Centralized error processing
- **API Abstraction**: All API calls through helpers/request
- **Constants Management**: Centralized constants
- **Role Checks**: Reusable role checking hooks
- **SWR Integration**: Automatic caching and revalidation
- **Zustand Stores**: Lightweight state management

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 16.0+ | React framework with App Router |
| **Language** | TypeScript | 5.7+ | Type-safe development |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **UI Components** | Shadcn/ui | Latest | Accessible component library |
| **UI Primitives** | Radix UI | Latest | Unstyled accessible components |
| **Animations** | Framer Motion | 12.x | Animation library |
| **State Management** | Zustand | 5.x | Lightweight state management |
| **Data Fetching** | SWR | 2.x | React hooks for data fetching |
| **Forms** | React Hook Form | 7.x | Form validation & handling |
| **Validation** | Zod | 3.x | Schema validation |
| **HTTP Client** | Axios | 1.x | API communication |
| **Notifications** | Sonner | 2.x | Toast notifications |
| **Icons** | Lucide React | 0.553+ | Icon library |

### Key Dependencies

```json
{
  "next": "^16.0.2",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "typescript": "^5.7.3",
  "tailwindcss": "^4.1.9",
  "framer-motion": "^12.23.24",
  "zustand": "^5.0.8",
  "swr": "^2.3.6",
  "react-hook-form": "^7.60.0",
  "zod": "^3.25.67",
  "axios": "^1.13.2",
  "sonner": "^2.0.7",
  "lucide-react": "^0.553.0"
}
```

## 🏗️ Architecture

### Application Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Interaction                      │
│              (Click, Form Submit, Navigation)            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Component Layer                        │
│         (UI Components, Pages, Layouts)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Hooks Layer                            │
│  (useRestaurants, useOrders, useCart, useAuth)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Helpers Layer                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ request.ts   │  │  errors.ts   │                    │
│  │ (API Calls)  │  │ (Error Proc) │                    │
│  └──────────────┘  └──────────────┘                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend API                            │
│              (NestJS REST API)                           │
└─────────────────────────────────────────────────────────┘
```

### State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Component                              │
│              (Triggers Action)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Custom Hook                            │
│         (useCart, useOrders, etc.)                       │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│     SWR      │          │   Zustand    │
│  (Server     │          │   (Client    │
│   State)     │          │    State)    │
└──────┬───────┘          └──────┬───────┘
       │                         │
       │                         │
       └────────────┬────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│                   Component Re-render                    │
│              (Updated UI)                                │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Backend API** running on http://localhost:3000

### Installation & Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3000

# 4. Start development server
npm run dev          # Runs on http://localhost:5321

# 5. Open in browser
# Navigate to http://localhost:5321
```

### Test Login

Use these credentials to test the application:

**Admin User:**
- Email: `admin@example.com`
- Password: `Password123!`

**Manager User (US):**
- Email: `manager.us@example.com`
- Password: `Password123!`

**Member User (India):**
- Email: `member.in@example.com`
- Password: `Password123!`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   ├── layout.tsx     # Auth layout
│   │   │   └── _components/   # Auth-specific components
│   │   ├── (other)/           # Protected pages
│   │   │   ├── dashboard/
│   │   │   ├── restaurants/
│   │   │   │   └── [id]/      # Restaurant menu page
│   │   │   ├── orders/
│   │   │   │   ├── [id]/      # Order details
│   │   │   │   └── [id]/confirmation/
│   │   │   ├── checkout/
│   │   │   │   └── [orderId]/
│   │   │   └── payment-methods/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── auth/             # Auth components
│   │   │   ├── auth-provider.tsx
│   │   │   └── ...
│   │   ├── food-ordering/    # Food ordering components
│   │   │   ├── restaurant-card.tsx
│   │   │   ├── menu-item.tsx
│   │   │   ├── cart-sidebar.tsx
│   │   │   ├── order-card.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── role-badge.tsx
│   │   │   └── country-badge.tsx
│   │   ├── shared/           # Shared components
│   │   └── visuals/          # Visual elements
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-auth-store.ts
│   │   ├── use-cart-store.ts
│   │   ├── use-restaurants.ts
│   │   ├── use-restaurant-menu.ts
│   │   ├── use-orders.ts
│   │   ├── use-order.ts
│   │   ├── use-cart.ts
│   │   ├── use-checkout.ts
│   │   ├── use-order-actions.ts
│   │   ├── use-payment-methods.ts
│   │   └── use-role-check.ts
│   │
│   ├── helpers/              # Business logic (MANDATORY)
│   │   ├── request.ts        # ALL API calls
│   │   └── errors.ts         # ALL error handling
│   │
│   ├── lib/                  # Core setup
│   │   ├── store.ts          # Zustand stores
│   │   ├── swr-config.ts     # SWR configuration
│   │   ├── logger.ts         # Custom logger (hackLog)
│   │   └── utils.ts          # Utility functions
│   │
│   ├── constants/            # Application constants
│   │   ├── api.ts            # API endpoints
│   │   ├── routes.ts         # Route paths
│   │   ├── messages.ts       # User messages
│   │   └── config.ts         # App configuration
│   │
│   ├── types/                # TypeScript types
│   │   └── food-ordering.ts
│   │
│   └── styles/               # Global styles
│       ├── globals.css
│       └── tokens.css
│
├── docs/
│   └── rules.md              # Development rules
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md                 # This file
```

## 📖 Development Guidelines

### Mandatory Rules

**See [docs/rules.md](./docs/rules.md) for complete guidelines**

#### 1. API Calls (CRITICAL)

ALL API calls MUST go through `@/helpers/request`:

```typescript
// ❌ NEVER DO THIS
const response = await fetch('/api/users');

// ✅ ALWAYS DO THIS
import { apiRequest } from '@/helpers/request';
const response = await apiRequest('GET', '/api/users');
```

#### 2. Error Handling (CRITICAL)

ALL errors MUST be processed with `@/helpers/errors`:

```typescript
// ❌ NEVER DO THIS
try {
  // code
} catch (error) {
  console.error(error);
}

// ✅ ALWAYS DO THIS
import { handleError } from '@/helpers/errors';
try {
  // code
} catch (error) {
  handleError(error, 'ComponentName');
}
```

#### 3. Logging (CRITICAL)

Use `hackLog` for ALL logging (never console.log):

```typescript
// ❌ NEVER DO THIS
console.log('User created:', user);

// ✅ ALWAYS DO THIS
import hackLog from '@/lib/logger';
hackLog.dev('User created', { user, component: 'UserForm' });
```

#### 4. Constants

Store ALL constants in `@/constants/`:

```typescript
// constants/api.ts
export const API_ENDPOINTS = {
  RESTAURANTS: '/restaurants',
  ORDERS: '/orders',
};

// constants/messages.ts
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Order created successfully',
};

// constants/routes.ts
export const ROUTES = {
  DASHBOARD: '/dashboard',
  RESTAURANTS: '/restaurants',
};
```

#### 5. Type Safety

Use TypeScript interfaces for all data:

```typescript
// types/food-ordering.ts
export interface Restaurant {
  id: string;
  name: string;
  country: 'IN' | 'US';
  status: 'ACTIVE' | 'INACTIVE';
}
```

#### 6. Role Checks

Use `useRoleCheck()` for conditional rendering:

```typescript
const { canCheckout, canManagePaymentMethods } = useRoleCheck();

{canCheckout() && <CheckoutButton />}
{canManagePaymentMethods() && <ManagePaymentsLink />}
```

### Development Workflow

1. **Define Constants**: Add API endpoints, messages, routes
2. **Create Types**: Define TypeScript interfaces
3. **Build Hook**: Create custom hook for data fetching
4. **Create Components**: Build UI components
5. **Add Page**: Create page in app/ directory
6. **Test**: Test with different roles and countries

## 🧩 Components

### UI Components (Shadcn/ui)

Located in `src/components/ui/`:
- `button.tsx` - Button component with variants
- `card.tsx` - Card container component
- `dialog.tsx` - Modal dialog component
- `input.tsx` - Input field component
- `select.tsx` - Select dropdown component
- `toast.tsx` - Toast notification component
- And many more...

### Food Ordering Components

Located in `src/components/food-ordering/`:

- **`restaurant-card.tsx`**: Restaurant card with hover effects, country badge, status indicator
- **`menu-item.tsx`**: Menu item card with image, price, add to cart button
- **`cart-sidebar.tsx`**: Slide-in cart with items, quantities, checkout button
- **`order-card.tsx`**: Order summary card with status, total, date
- **`status-badge.tsx`**: Color-coded status badges (DRAFT, PENDING, PAID, CANCELED)
- **`role-badge.tsx`**: Role indicator badges (ADMIN, MANAGER, MEMBER)
- **`country-badge.tsx`**: Country badges with flag emojis (🇮🇳, 🇺🇸)
- **`payment-method-form.tsx`**: Modal form for payment method management

### Auth Components

Located in `src/components/auth/`:
- **`auth-provider.tsx`**: Auth context provider with protection hooks
- **`auth-card.tsx`**: Shared UI primitives for auth pages

## 🪝 Hooks

### Data Fetching Hooks

- **`use-restaurants.ts`**: Fetch restaurants list (country-filtered)
- **`use-restaurant-menu.ts`**: Fetch restaurant details and menu
- **`use-orders.ts`**: Fetch user's orders list
- **`use-order.ts`**: Fetch single order details
- **`use-payment-methods.ts`**: Fetch payment methods list

### Action Hooks

- **`use-cart.ts`**: Cart operations (add, remove, update quantity)
- **`use-checkout.ts`**: Checkout processing
- **`use-order-actions.ts`**: Order actions (cancel)
- **`use-payment-method-actions.ts`**: Payment method CRUD operations

### State Management Hooks

- **`use-auth-store.ts`**: Authentication state (login, signup, logout)
- **`use-cart-store.ts`**: Cart state (orderId, restaurantId, sidebar visibility)
- **`use-app-store.ts`**: Global app state

### Utility Hooks

- **`use-role-check.ts`**: Role-based permission checks
- **`use-mobile.ts`**: Mobile device detection

## 🗄️ State Management

### Zustand Stores

#### Auth Store (`use-auth-store.ts`)

```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}
```

#### Cart Store (`use-cart-store.ts`)

```typescript
interface CartStore {
  orderId: string | null;
  restaurantId: string | null;
  isCartOpen: boolean;
  setOrderId: (id: string | null) => void;
  setRestaurantId: (id: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}
```

### SWR Configuration

Global SWR configuration in `lib/swr-config.ts`:

```typescript
export const swrConfig = {
  fetcher: (url: string) => apiRequest('GET', url),
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  errorRetryCount: 3,
};
```

## 🌐 API Integration

### API Endpoints

All endpoints defined in `constants/api.ts`:

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  RESTAURANTS: '/restaurants',
  RESTAURANT_MENU: (id: string) => `/restaurants/${id}/menu`,
  ORDERS: '/orders',
  ORDER_DETAILS: (id: string) => `/orders/${id}`,
  ORDER_CHECKOUT: (id: string) => `/orders/${id}/checkout`,
  ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,
  PAYMENT_METHODS: '/payment-methods',
};
```

### API Request Helper

Located in `helpers/request.ts`:

```typescript
export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  data?: any
): Promise<T> {
  // Logs request
  hackLog.apiRequest(method, url, data);
  
  try {
    const response = await axios({ method, url, data });
    hackLog.apiSuccess(method, url, response.data);
    return response.data;
  } catch (error) {
    hackLog.apiError(method, url, error);
    throw error;
  }
}
```

## 🎨 Styling

### Tailwind CSS

The application uses Tailwind CSS 4.x with custom configuration:

**Theme Colors:**
- Primary: Orange/Amber gradient
- Background: White → Orange-50 → Amber-50
- Dark mode: Appropriate color adjustments

**Key Classes:**
```css
/* Gradient background */
.bg-gradient-to-b from-white via-orange-50 to-amber-50

/* Card styles */
.rounded-lg border bg-card text-card-foreground shadow-sm

/* Button variants */
.bg-primary text-primary-foreground hover:bg-primary/90
```

### Dark Mode

Dark mode is supported throughout the application:

```typescript
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();

// Toggle theme
setTheme(theme === 'dark' ? 'light' : 'dark');
```

### Animations

Framer Motion is used for smooth animations:

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## 🧪 Testing

### Type Checking

```bash
# Standard type check
npm run type-check

# Strict type check
npm run type-check:strict
```

### Linting

```bash
# Check for linting errors
npm run lint:check

# Fix linting errors
npm run lint

# Strict linting (no warnings)
npm run lint:strict
```

### Validation

```bash
# Run type-check + lint
npm run validate

# Strict validation
npm run validate:strict
```

### Manual Testing Checklist

- [ ] Test with ADMIN role
- [ ] Test with MANAGER role (IN and US)
- [ ] Test with MEMBER role (IN and US)
- [ ] Test cart functionality
- [ ] Test checkout flow (ADMIN/MANAGER)
- [ ] Test order cancellation
- [ ] Test payment methods (ADMIN)
- [ ] Test responsive design
- [ ] Test dark mode
- [ ] Verify logging output

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed:**
- Verify backend is running on http://localhost:3000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check browser console for CORS errors

**Authentication Issues:**
- Clear browser localStorage
- Check Supabase credentials in backend
- Verify token is being sent in Authorization header

**Cart Not Persisting:**
- Check localStorage is enabled
- Verify cart store is properly initialized
- Check browser console for errors

**Role-Based UI Not Working:**
- Verify user role in backend database
- Check useRoleCheck() hook implementation
- Verify AuthGuard is working on backend

**Styling Issues:**
- Clear .next directory: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind configuration

### Debug Tools

**Logger Demo Page:**
Visit `/testing` to see logger demo and test all logging methods.

**Browser DevTools:**
- Console: View hackLog output
- Network: Monitor API requests
- Application: Check localStorage state

**React DevTools:**
- Install React DevTools extension
- Inspect component props and state
- Monitor re-renders

## 📚 Additional Resources

### Project Documentation
- **[Root README](../README.md)** - Project overview and quick start
- **[Quick Start Guide](../docs/QUICK_START.md)** - 5-minute setup guide
- **[Architecture Documentation](../docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[Development Rules](./docs/rules.md)** - Complete development guidelines (MANDATORY)
- **[Backend README](../backend/README.md)** - Backend documentation
- **[API Documentation](../backend/docs/RBAC_API.md)** - Complete API reference
- **[Test Datasets](../backend/docs/DATASETS.md)** - Test accounts and seed data
- **[Postman Collection](../backend/docs/postman_collection.json)** - API testing collection

### Testing Resources

**Test Accounts:**
All accounts use password: `Password123!`

| Role | Email | Country | Capabilities |
|------|-------|---------|--------------|
| ADMIN | nick@example.com | IN | Full access |
| MANAGER | captain.america@example.com | US | Checkout/cancel orders |
| MANAGER | captain.marvel@example.com | IN | Checkout/cancel orders |
| MEMBER | travis@example.com | US | Browse only |
| MEMBER | thanos@example.com | IN | Browse only |
| MEMBER | thor@example.com | IN | Browse only |

**Test Data:**
- 6 restaurants (3 India, 3 US)
- 42 menu items
- 2 mock payment methods
- See [backend/docs/DATASETS.md](../backend/docs/DATASETS.md) for details

### Architecture Resources

**System Design:**
- See [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for:
  - Component hierarchy
  - State management strategy
  - Data flow diagrams
  - Security architecture
  - Design decisions
  - Scalability considerations

**Frontend Patterns:**
- Layered architecture
- Component composition
- Custom hooks pattern
- Centralized API calls (helpers/request.ts)
- Centralized error handling (helpers/errors.ts)
- Structured logging (lib/logger.ts)

## 🤝 Contributing

1. Read [docs/rules.md](./docs/rules.md) for guidelines
2. Follow mandatory rules for API calls and error handling
3. Use hackLog for all logging
4. Test with all user roles and countries
5. Run validation before committing

---

**Made with ❤️ by the Avengers DineOps Team**
