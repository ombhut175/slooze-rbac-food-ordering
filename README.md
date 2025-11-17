# avengers-dineops

## Overview

Avengers DineOps is a full-stack food ordering application with role-based access control (RBAC). The system allows users to browse restaurants, manage orders, and process payments with different permission levels based on user roles and country assignments.

## Features

### 🍽️ Food Ordering System

#### Restaurant Browsing
- Browse restaurants filtered by user's country (non-admins)
- View restaurant details and menu items
- Search and filter restaurants
- Responsive grid layout with beautiful cards

#### Order Management
- Create draft orders by adding items to cart
- View order history with status filtering
- Track order status (Draft, Pending, Paid, Canceled)
- View detailed order information with line items
- Country-scoped orders for non-admin users

#### Shopping Cart
- Add items to cart with quantity selection
- Update item quantities
- Remove items from cart
- Persistent cart state (survives page refresh)
- Floating cart summary on menu pages
- Slide-in cart sidebar with animations

#### Checkout & Payments
- Select payment method during checkout
- Complete orders with payment processing
- Order confirmation page with success animation
- Payment methods management (Admin only)
- Support for multiple currencies (INR, USD)

### 🔐 Role-Based Access Control

The system implements three user roles with different permissions:

#### ADMIN
- Full access to all features
- View data from all countries
- Manage payment methods
- Checkout and cancel orders
- Access to admin-only pages

#### MANAGER
- Checkout and cancel orders
- View data from assigned country only
- Cannot manage payment methods
- Full cart and ordering capabilities

#### MEMBER
- Browse restaurants and view menus
- Add items to cart
- View order history
- Cannot checkout or cancel orders
- View data from assigned country only

### 🌍 Country-Scoped Data

Users are assigned to a country (India or United States):
- **Non-admin users** see only restaurants and orders from their country
- **Admin users** see data from all countries with country indicators
- Currency formatting matches user's country (₹ for India, $ for US)
- Country badges displayed throughout the interface

### 🎨 User Interface

- **Consistent Design**: Orange/amber gradient theme matching auth and dashboard pages
- **Responsive Layout**: Works seamlessly on mobile, tablet, and desktop
- **Dark Mode Support**: Full dark mode with appropriate color adjustments
- **Smooth Animations**: Framer Motion animations for page transitions and interactions
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: User-friendly error messages with retry options
- **Toast Notifications**: Success and error feedback for all actions

### 📊 Comprehensive Logging

All components follow strict logging rules for easy debugging:
- API request/response/error logging
- Component lifecycle logging
- State management logging
- Form submission and validation logging
- Performance monitoring
- AI-friendly structured logs for quick troubleshooting

## Test User Accounts

Use these test accounts to explore different role capabilities:

### Admin User
- **Email**: admin@example.com
- **Password**: [Contact team for password]
- **Role**: ADMIN
- **Country**: US
- **Capabilities**: Full access to all features, can manage payment methods, sees all countries

### Manager User (US)
- **Email**: manager.us@example.com
- **Password**: [Contact team for password]
- **Role**: MANAGER
- **Country**: US
- **Capabilities**: Can checkout and cancel orders, sees only US data

### Manager User (India)
- **Email**: manager.in@example.com
- **Password**: [Contact team for password]
- **Role**: MANAGER
- **Country**: IN
- **Capabilities**: Can checkout and cancel orders, sees only India data

### Member User (US)
- **Email**: member.us@example.com
- **Password**: [Contact team for password]
- **Role**: MEMBER
- **Country**: US
- **Capabilities**: Can browse and add to cart, cannot checkout, sees only US data

### Member User (India)
- **Email**: member.in@example.com
- **Password**: [Contact team for password]
- **Role**: MEMBER
- **Country**: IN
- **Capabilities**: Can browse and add to cart, cannot checkout, sees only India data

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: SWR
- **Forms**: React Hook Form
- **Notifications**: Sonner

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with Supabase
- **API**: RESTful API with RBAC middleware

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd avengers-dineops
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Set up environment variables
- Copy `.env.example` to `.env.local` in both frontend and backend directories
- Configure database connection, Supabase credentials, and other settings

5. Run database migrations
```bash
cd backend
npm run migration:run
```

6. Start the development servers

Backend:
```bash
cd backend
npm run start:dev
```

Frontend:
```bash
cd frontend
npm run dev
```

7. Access the application at `http://localhost:3000`

## Development Guidelines

### Code Organization

- **Frontend**: `/frontend/src`
  - `app/` - Next.js pages and routes
  - `components/` - Reusable UI components
  - `hooks/` - Custom React hooks
  - `helpers/` - Business logic and utilities
  - `constants/` - Application constants
  - `types/` - TypeScript type definitions
  - `lib/` - Core setup and configurations

- **Backend**: `/backend/src`
  - `modules/` - Feature modules
  - `common/` - Shared utilities and guards
  - `database/` - Database schemas and migrations

### Mandatory Development Rules

1. **API Calls**: All API calls MUST go through `@/helpers/request` (never use fetch() directly)
2. **Error Handling**: All errors MUST be processed with `@/helpers/errors`
3. **Logging**: Use `hackLog` methods for all logging (never use console.log)
4. **Constants**: Store all constants in `@/constants/` directory
5. **Type Safety**: Use TypeScript interfaces for all data structures
6. **Role Checks**: Use `useRoleCheck()` hook for conditional rendering

### Testing

Run validation before committing:

Frontend:
```bash
cd frontend
npm run validate  # Runs type-check + lint:check
```

Backend:
```bash
cd backend
npm run validate  # Runs type-check + lint:check
```

## Documentation

- **Frontend Rules**: `/frontend/docs/rules.md` - Comprehensive development guidelines
- **Backend API**: `/backend/RBAC_API.md` - API documentation with endpoints and examples
- **Spec Documents**: `/.kiro/specs/frontend-food-ordering-integration/` - Requirements, design, and implementation plan

## Contributing

1. Follow the development rules in `/frontend/docs/rules.md`
2. Use the test user accounts to verify role-based functionality
3. Test with both countries (IN and US) to ensure country-scoped data works correctly
4. Run validation before committing
5. Ensure all new features have proper logging with `hackLog`
6. Document any new pages or components in `/frontend/docs/rules.md`

## License

[Add license information]