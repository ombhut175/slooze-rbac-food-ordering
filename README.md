# 🍽️ Avengers DineOps

> A full-stack food ordering platform with enterprise-grade Role-Based Access Control (RBAC) and country-scoped data management

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles & Permissions](#user-roles--permissions)
- [Test Accounts](#test-accounts)
- [Development Workflow](#development-workflow)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Documentation Links](#documentation-links)

## 🎯 Overview

Avengers DineOps is a production-ready food ordering application built with modern web technologies. The system implements sophisticated role-based access control (RBAC) with country-scoped data isolation, allowing organizations to manage multi-region food ordering operations with granular permission controls.

**Key Capabilities:**
- 🔐 Three-tier role system (ADMIN, MANAGER, MEMBER)
- 🌍 Country-scoped data access (India & United States)
- 🛒 Real-time shopping cart with persistent state
- 💳 Mock payment processing for testing
- 📱 Fully responsive design with dark mode
- 🎨 Consistent orange/amber gradient theme
- 📊 Comprehensive logging for debugging and AI assistance

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  Next.js 14 (App Router) + TypeScript + Tailwind CSS       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │    Hooks     │     │
│  │  (Routes)    │  │   (UI/UX)    │  │ (Data Logic) │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                       │
│                   │   Helpers       │                       │
│                   │  (API/Errors)   │                       │
│                   └────────┬────────┘                       │
└────────────────────────────┼──────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   REST API      │
                    │  (HTTP/JSON)    │
                    └────────┬────────┘
                             │
┌────────────────────────────▼──────────────────────────────┐
│                         Backend                            │
│         NestJS + TypeScript + Drizzle ORM                 │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Guards     │  │   Modules    │  │  Repositories│   │
│  │ (Auth/RBAC)  │  │  (Business)  │  │  (Data Layer)│   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                            │                               │
│                   ┌────────▼────────┐                     │
│                   │   Supabase      │                     │
│                   │  Auth Service   │                     │
│                   └─────────────────┘                     │
└────────────────────────────┬──────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │    Database     │
                    └─────────────────┘
```

### Data Flow

1. **Authentication Flow:**
   - User authenticates via Supabase Auth → Receives JWT token
   - Token sent in Authorization header with each request
   - Backend validates token and fetches user details (role, country)
   - User context attached to request for downstream processing

2. **Authorization Flow:**
   - RolesGuard checks endpoint role requirements
   - Country-scoped filtering applied based on user role
   - ADMIN sees all data, MANAGER/MEMBER see only their country

3. **API Request Flow:**
   - Frontend: Component → Hook → Helper (request.ts) → API
   - Backend: Guard → Controller → Service → Repository → Database
   - Response: Database → Repository → Service → Controller → Frontend
   - Error: Any layer → helpers/errors.ts → User-friendly message

## ✨ Key Features

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

Users select their country during signup (India or United States):
- **Country Selection**: Users choose their country during account registration
- **Data Filtering**: Non-admin users see only restaurants and orders from their country
- **Admin Access**: Admin users see data from all countries with country indicators
- **Currency Formatting**: Matches user's country (₹ for India, $ for US)
- **Visual Indicators**: Country badges and flags displayed throughout the interface
- **Default Country**: Defaults to India (IN) if not specified during signup

For detailed information about the country selection feature, see [Feature Documentation](./docs/FEATURES.md#country-selection-during-signup).

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

## 🛠️ Technology Stack

### Frontend ([Detailed Documentation](./frontend/README.md))

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | React framework with SSR/SSG |
| **Language** | TypeScript 5.7+ | Type-safe development |
| **Styling** | Tailwind CSS 4.x | Utility-first CSS framework |
| **UI Components** | Shadcn/ui + Radix UI | Accessible component library |
| **Animations** | Framer Motion | Smooth page transitions |
| **State Management** | Zustand | Lightweight global state |
| **Data Fetching** | SWR | React hooks for data fetching |
| **Forms** | React Hook Form + Zod | Form validation & handling |
| **Notifications** | Sonner | Toast notifications |
| **HTTP Client** | Axios | API communication |
| **Logging** | Custom hackLog | Structured logging for debugging |

### Backend ([Detailed Documentation](./backend/README.md))

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | NestJS 11.x | Node.js framework with TypeScript |
| **Language** | TypeScript 5.7+ | Type-safe development |
| **Database** | PostgreSQL | Relational database |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Authentication** | Supabase Auth | JWT-based authentication |
| **Validation** | class-validator | DTO validation |
| **API Docs** | Swagger/OpenAPI | Interactive API documentation |
| **Testing** | Jest | Unit and E2E testing |

### Infrastructure & DevOps

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Version Control** | Git | Source code management |
| **Package Manager** | npm | Dependency management |
| **Code Quality** | ESLint + Prettier | Linting and formatting |
| **Type Checking** | TypeScript Compiler | Static type checking |

## 🚀 Getting Started

### 📖 Quick Start Guide

**New to the project?** Follow our [QUICK_START.md](./docs/QUICK_START.md) guide to get running in 5 minutes!

The quick start guide includes:
- ✅ Step-by-step setup instructions
- ✅ Environment configuration
- ✅ Database setup and seeding
- ✅ Server startup commands
- ✅ Verification steps
- ✅ Troubleshooting tips
- ✅ Learning path recommendations

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Supabase Account** ([Sign up](https://supabase.com))

### Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd avengers-dineops

# 2. Install dependencies (both frontend and backend)
cd backend && npm install
cd ../frontend && npm install

# 3. Set up environment variables
cd ../backend
cp env.example.txt .env.local
# Edit .env.local with your Supabase and database credentials

cd ../frontend
cp .env.example .env.local
# Edit .env.local with your backend API URL

# 4. Set up database
cd ../backend
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
npm run db:seed      # Seed test data

# 5. Start development servers (in separate terminals)
# Terminal 1 - Backend
cd backend
npm run start:dev    # Runs on http://localhost:3000

# Terminal 2 - Frontend
cd frontend
npm run dev          # Runs on http://localhost:5321

# 6. Access the application
# Open http://localhost:5321 in your browser
```

### Detailed Setup Instructions

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp env.example.txt .env.local

# Edit .env.local with your actual values:
# - SUPABASE_URL: Your Supabase project URL
# - SUPABASE_ANON_KEY: Your Supabase anon key
# - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
# - DATABASE_URL: PostgreSQL connection string

# Set up database
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations to database
npm run db:seed      # Seed with test data (6 users, 6 restaurants, menu items)

# Start development server
npm run start:dev    # API available at http://localhost:3000

# View API documentation
# Open http://localhost:3000/api/docs in your browser
```

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Edit .env.local with your backend URL:
# NEXT_PUBLIC_API_URL=http://localhost:3000

# Start development server
npm run dev          # App available at http://localhost:5321
```

#### 3. Verify Installation

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3000/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Frontend Access:**
   - Open http://localhost:5321
   - You should see the login page

3. **Test Login:**
   - Email: `admin@example.com`
   - Password: `Password123!`
   - Should redirect to dashboard

### Environment Variables

#### Backend (.env.local)

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Application Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5321
REDIRECT_TO_FRONTEND_URL=http://localhost:5321/login

# Optional: Swagger Protection
SWAGGER_USER=admin
SWAGGER_PASSWORD=super-secure-password
```

#### Frontend (.env.local)

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Logging Level
NEXT_PUBLIC_LOG_LEVEL=debug
```

### Troubleshooting

**Database Connection Issues:**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Ensure database exists: `createdb your_database_name`

**Supabase Authentication Issues:**
- Verify Supabase project is active
- Check API keys are correct in .env.local
- Ensure service role key has admin permissions

**Port Already in Use:**
- Backend: Change PORT in backend/.env.local
- Frontend: Use `npm run dev -- -p 3001` to run on different port

**Migration Issues:**
- Delete drizzle/ folder and regenerate: `npm run db:generate`
- Check database schema matches expectations
- Verify DATABASE_URL is correct

## 📁 Project Structure

```
avengers-dineops/
├── backend/                    # NestJS Backend Application
│   ├── src/
│   │   ├── common/            # Shared utilities, guards, decorators
│   │   │   ├── guards/        # AuthGuard, RolesGuard
│   │   │   ├── decorators/    # @Roles(), @CurrentUser()
│   │   │   ├── filters/       # Exception filters
│   │   │   └── interfaces/    # Shared interfaces
│   │   ├── config/            # Configuration files
│   │   │   ├── env.loader.ts  # Environment variable loader
│   │   │   └── supabase.config.ts
│   │   ├── core/
│   │   │   ├── database/      # Database configuration
│   │   │   │   ├── schema/    # Drizzle schema definitions
│   │   │   │   └── repositories/  # Data access layer
│   │   │   └── supabase/      # Supabase client setup
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── users/         # User management (ADMIN)
│   │   │   ├── restaurants/   # Restaurant & menu endpoints
│   │   │   ├── orders/        # Order management
│   │   │   ├── payment-methods/  # Payment methods (ADMIN)
│   │   │   └── health-check/  # Health check endpoint
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Application entry point
│   ├── scripts/
│   │   └── seed.ts            # Database seeding script
│   ├── test/                  # E2E tests
│   ├── drizzle/               # Migration files
│   ├── drizzle.config.ts      # Drizzle ORM configuration
│   ├── package.json
│   └── README.md              # Backend documentation
│
├── frontend/                   # Next.js Frontend Application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── (auth)/        # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   └── forgot-password/
│   │   │   ├── (other)/       # Protected pages
│   │   │   │   ├── dashboard/
│   │   │   │   ├── restaurants/
│   │   │   │   ├── orders/
│   │   │   │   ├── checkout/
│   │   │   │   └── payment-methods/
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── page.tsx       # Home page
│   │   ├── components/        # React components
│   │   │   ├── ui/            # Shadcn/ui components
│   │   │   ├── auth/          # Auth-related components
│   │   │   ├── food-ordering/ # Food ordering components
│   │   │   ├── shared/        # Shared components
│   │   │   └── visuals/       # Visual elements
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── use-auth-store.ts
│   │   │   ├── use-cart-store.ts
│   │   │   ├── use-restaurants.ts
│   │   │   ├── use-orders.ts
│   │   │   └── use-role-check.ts
│   │   ├── helpers/           # Business logic (MANDATORY)
│   │   │   ├── request.ts     # ALL API calls go here
│   │   │   └── errors.ts      # ALL error handling goes here
│   │   ├── lib/               # Core setup
│   │   │   ├── store.ts       # Zustand stores
│   │   │   ├── swr-config.ts  # SWR configuration
│   │   │   ├── logger.ts      # Custom logger (hackLog)
│   │   │   └── utils.ts       # Utility functions
│   │   ├── constants/         # Application constants
│   │   │   ├── api.ts         # API endpoints
│   │   │   ├── routes.ts      # Route paths
│   │   │   ├── messages.ts    # User messages
│   │   │   └── config.ts      # App configuration
│   │   ├── types/             # TypeScript types
│   │   │   └── food-ordering.ts
│   │   └── styles/            # Global styles
│   ├── docs/
│   │   └── rules.md           # Development rules & guidelines
│   ├── public/                # Static assets
│   ├── package.json
│   └── README.md              # Frontend documentation
│
├── .git/                      # Git repository
├── .gitignore
└── README.md                  # This file
```

### Key Directories Explained

#### Backend

- **`src/common/`**: Shared code used across modules (guards, decorators, filters)
- **`src/config/`**: Configuration files for environment variables and external services
- **`src/core/`**: Core functionality (database, Supabase client)
- **`src/modules/`**: Feature modules following NestJS module pattern
- **`scripts/`**: Utility scripts (database seeding, migrations)
- **`drizzle/`**: Auto-generated migration files

#### Frontend

- **`src/app/`**: Next.js pages using App Router (file-based routing)
- **`src/components/`**: Reusable React components organized by feature
- **`src/hooks/`**: Custom React hooks for data fetching and state management
- **`src/helpers/`**: **MANDATORY** - All API calls and error handling
- **`src/lib/`**: Core setup (stores, SWR config, utilities)
- **`src/constants/`**: All constants (API endpoints, routes, messages)
- **`src/types/`**: TypeScript type definitions
- **`docs/`**: Development documentation and guidelines

## 💻 Development Workflow

### Code Organization Principles

1. **Separation of Concerns**: Business logic in helpers, UI in components
2. **Type Safety**: TypeScript everywhere with strict mode
3. **Consistent Patterns**: Follow established patterns for API calls and error handling
4. **Comprehensive Logging**: Use hackLog for all logging (never console.log)
5. **Role-Based Access**: Check permissions at both frontend and backend

### Mandatory Development Rules

#### Frontend Rules (See [frontend/docs/rules.md](./frontend/docs/rules.md) for details)

1. **API Calls**: ALL API calls MUST go through `@/helpers/request` (never use fetch() directly)
   ```typescript
   // ❌ NEVER DO THIS
   const response = await fetch('/api/users');
   
   // ✅ ALWAYS DO THIS
   import { apiRequest } from '@/helpers/request';
   const response = await apiRequest('GET', '/api/users');
   ```

2. **Error Handling**: ALL errors MUST be processed with `@/helpers/errors`
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
     handleError(error, 'UserForm');
   }
   ```

3. **Logging**: Use `hackLog` methods for all logging (never use console.log)
   ```typescript
   // ❌ NEVER DO THIS
   console.log('User created:', user);
   
   // ✅ ALWAYS DO THIS
   import hackLog from '@/lib/logger';
   hackLog.dev('User created', { user, component: 'UserForm' });
   ```

4. **Constants**: Store all constants in `@/constants/` directory
   - API endpoints → `constants/api.ts`
   - User messages → `constants/messages.ts`
   - Route paths → `constants/routes.ts`
   - App config → `constants/config.ts`

5. **Type Safety**: Use TypeScript interfaces for all data structures
   - Define types in `src/types/` directory
   - Use strict TypeScript mode
   - No `any` types without justification

6. **Role Checks**: Use `useRoleCheck()` hook for conditional rendering
   ```typescript
   const { canCheckout, canManagePaymentMethods } = useRoleCheck();
   
   {canCheckout() && <CheckoutButton />}
   ```

#### Backend Rules

1. **Module Structure**: Follow NestJS module pattern
   - Each feature in its own module
   - Controllers handle HTTP requests
   - Services contain business logic
   - Repositories handle data access

2. **Authentication**: Use AuthGuard on all protected endpoints
   ```typescript
   @UseGuards(AuthGuard)
   @Get()
   async findAll() { }
   ```

3. **Authorization**: Use RolesGuard for role-based access
   ```typescript
   @UseGuards(AuthGuard, RolesGuard)
   @Roles('ADMIN', 'MANAGER')
   @Post('checkout')
   async checkout() { }
   ```

4. **Validation**: Use DTOs with class-validator
   ```typescript
   export class CreateOrderDto {
     @IsUUID()
     restaurantId: string;
   }
   ```

5. **Error Handling**: Use NestJS exception filters
   - Return appropriate HTTP status codes
   - Provide user-friendly error messages

### Development Workflow Steps

1. **Start with Constants**
   - Define API endpoints in `constants/api.ts`
   - Add user messages in `constants/messages.ts`
   - Set up routes in `constants/routes.ts`

2. **Build Backend First**
   - Create database schema in `src/core/database/schema/`
   - Generate and run migrations
   - Create module with controller, service, repository
   - Add authentication and authorization guards
   - Test with Swagger UI

3. **Build Frontend**
   - Create types in `src/types/`
   - Build custom hook in `src/hooks/`
   - Create components in `src/components/`
   - Add page in `src/app/`
   - Test with different user roles

4. **Testing & Validation**
   - Run type checking
   - Run linting
   - Test with all user roles (ADMIN, MANAGER, MEMBER)
   - Test with both countries (IN, US)
   - Verify logging output

### Testing Commands

#### Frontend

```bash
cd frontend

# Type checking
npm run type-check          # Standard type check
npm run type-check:strict   # Strict type check

# Linting
npm run lint:check          # Check for linting errors
npm run lint                # Fix linting errors automatically
npm run lint:strict         # Strict linting (no warnings)

# Validation (type-check + lint)
npm run validate            # Run both checks
npm run validate:strict     # Strict validation

# Development
npm run dev                 # Start dev server (port 5321)
npm run dev:turbo           # Start with Turbopack

# Build
npm run build               # Production build
npm run start               # Start production server
```

#### Backend

```bash
cd backend

# Type checking
npm run type-check          # Standard type check
npm run type-check:strict   # Strict type check

# Linting
npm run lint:check          # Check for linting errors
npm run lint                # Fix linting errors automatically
npm run lint:strict         # Strict linting (no warnings)

# Validation (type-check + lint)
npm run validate            # Run both checks
npm run validate:strict     # Strict validation

# Testing
npm test                    # Run unit tests
npm run test:watch          # Run tests in watch mode
npm run test:cov            # Run tests with coverage
npm run test:e2e            # Run E2E tests

# Database
npm run db:generate         # Generate migrations
npm run db:migrate          # Apply migrations
npm run db:push             # Push schema changes (dev only)
npm run db:studio           # Launch Drizzle Studio
npm run db:seed             # Seed database with test data

# Development
npm run start:dev           # Start dev server with watch mode
npm run start:debug         # Start in debug mode
npm run start:prod          # Start production server

# Build
npm run build               # Build for production
```

### Pre-Commit Checklist

Before committing code, ensure:

- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] No linting errors (`npm run lint:check`)
- [ ] All console.log replaced with hackLog methods
- [ ] All API calls go through helpers/request
- [ ] All errors handled with helpers/errors
- [ ] Constants used instead of hardcoded values
- [ ] Types defined for all data structures
- [ ] Role checks implemented where needed
- [ ] Tested with different user roles
- [ ] Tested with both countries (IN, US)
- [ ] Logging output verified in console

## �  Resources & Documentation

### 📚 Complete Documentation Set

| Resource | Location | Description |
|----------|----------|-------------|
| **Quick Start Guide** | [docs/QUICK_START.md](./docs/QUICK_START.md) | 5-minute setup guide |
| **Architecture & Design** | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture, design patterns, scalability |
| **API Documentation** | [backend/docs/RBAC_API.md](./backend/docs/RBAC_API.md) | Complete API reference with examples |
| **Test Datasets** | [backend/docs/DATASETS.md](./backend/docs/DATASETS.md) | Seed data, test accounts, menu items |
| **Postman Collection** | [backend/docs/postman_collection.json](./backend/docs/postman_collection.json) | Ready-to-import API collection |
| **Backend README** | [backend/README.md](./backend/README.md) | Backend setup, database, testing |
| **Frontend README** | [frontend/README.md](./frontend/README.md) | Frontend architecture, components, hooks |
| **Development Rules** | [frontend/docs/rules.md](./frontend/docs/rules.md) | Mandatory development guidelines |
| **Swagger UI** | http://localhost:3000/api/docs | Interactive API documentation (when running) |

### 🎯 Quick Access by Role

**For Developers:**
1. Start with [README.md](./README.md) (this file) for overview
2. Read [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design
3. Follow [backend/README.md](./backend/README.md) for backend setup
4. Follow [frontend/README.md](./frontend/README.md) for frontend setup
5. Review [frontend/docs/rules.md](./frontend/docs/rules.md) for coding standards

**For API Users:**
1. Import [backend/docs/postman_collection.json](./backend/docs/postman_collection.json) into Postman
2. Read [backend/docs/RBAC_API.md](./backend/docs/RBAC_API.md) for API reference
3. Check [backend/docs/DATASETS.md](./backend/docs/DATASETS.md) for test accounts
4. Use http://localhost:3000/api/docs for interactive testing

**For Testers:**
1. Review [backend/docs/DATASETS.md](./backend/docs/DATASETS.md) for test data
2. Use test accounts from datasets documentation
3. Import Postman collection for API testing
4. Check [backend/docs/RBAC_API.md](./backend/docs/RBAC_API.md) for expected behaviors

### 🔧 Postman Collection

**Import Instructions:**

1. Open Postman
2. Click "Import" button
3. Select `backend/docs/postman_collection.json`
4. Collection will be imported with all endpoints

**Collection Features:**
- ✅ Pre-configured base URL variable
- ✅ Automatic token management
- ✅ All API endpoints organized by feature
- ✅ Example requests for all roles (ADMIN, MANAGER, MEMBER)
- ✅ Auto-save response variables (restaurant_id, order_id, etc.)
- ✅ Test scripts for common scenarios

**Quick Start with Postman:**

```bash
# 1. Start backend
cd backend && npm run start:dev

# 2. Import collection into Postman
# File: backend/docs/postman_collection.json

# 3. Run "Login - Admin" request
# Token will be automatically saved

# 4. Test other endpoints
# All subsequent requests will use the saved token
```

### 📊 Test Datasets

**Quick Reference:**

| Account Type | Email | Password | Role | Country |
|--------------|-------|----------|------|---------|
| Admin | nick@example.com | Password123! | ADMIN | IN |
| Manager (US) | captain.america@example.com | Password123! | MANAGER | US |
| Manager (IN) | captain.marvel@example.com | Password123! | MANAGER | IN |
| Member (US) | travis@example.com | Password123! | MEMBER | US |
| Member (IN) | thanos@example.com | Password123! | MEMBER | IN |
| Member (IN) | thor@example.com | Password123! | MEMBER | IN |

**Restaurants:**
- 3 restaurants in India (22 menu items)
- 3 restaurants in United States (21 menu items)
- All restaurants are ACTIVE status
- Prices in INR (India) and USD (United States)

**Payment Methods:**
- 2 mock payment methods (Visa, Mastercard)
- No real payment processing
- All payments succeed for testing

For complete dataset details, see [backend/docs/DATASETS.md](./backend/docs/DATASETS.md)

### 🏗️ Architecture Documentation

The [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) document provides:

- **System Overview**: High-level architecture diagrams
- **Architecture Patterns**: Layered architecture, repository pattern, guard pattern
- **Technology Stack**: Detailed breakdown of all technologies
- **System Components**: Frontend and backend component structure
- **Data Flow**: Authentication, API requests, order creation flows
- **Security Architecture**: JWT authentication, RBAC, input validation
- **Database Design**: Entity relationship diagrams, design decisions
- **API Design**: RESTful principles, response formats
- **Frontend Architecture**: Component hierarchy, state management
- **Design Decisions**: Why we chose each technology
- **Scalability Considerations**: Future enhancements and optimizations

## 📚 API Documentation

### Interactive API Documentation

The backend provides comprehensive interactive API documentation using Swagger/OpenAPI:

**URL**: http://localhost:3000/api/docs

**Features**:
- Interactive API testing
- Request/response schemas
- Authentication configuration
- Example payloads
- Error response documentation

### API Endpoints Overview

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/forgot-password` - Password reset

#### Users (ADMIN only)
- `GET /users` - Get all users
- `PATCH /users/:id/role` - Update user role
- `PATCH /users/:id/country` - Update user country

#### Restaurants
- `GET /restaurants` - Get restaurants (country-filtered)
- `GET /restaurants/all` - Get all restaurants (ADMIN only)
- `GET /restaurants/:id/menu` - Get restaurant menu
- `POST /restaurants` - Create restaurant (ADMIN only)
- `PATCH /restaurants/:id` - Update restaurant (ADMIN only)

#### Orders
- `GET /orders` - Get orders (country-filtered)
- `GET /orders/:id` - Get order details
- `POST /orders` - Create order
- `POST /orders/:id/items` - Add item to order
- `DELETE /orders/:id/items/:itemId` - Remove item from order
- `POST /orders/:id/checkout` - Checkout order (ADMIN/MANAGER)
- `POST /orders/:id/cancel` - Cancel order (ADMIN/MANAGER)

#### Payment Methods
- `GET /payment-methods` - Get payment methods
- `POST /payment-methods` - Create payment method (ADMIN only)
- `PATCH /payment-methods/:id` - Update payment method (ADMIN only)

For detailed API documentation with request/response examples, see [backend/RBAC_API.md](./backend/RBAC_API.md)

## 📖 Documentation Links

### Main Documentation
- **[Quick Start Guide](./docs/QUICK_START.md)** - Get running in 5 minutes
- **[Architecture Documentation](./docs/ARCHITECTURE.md)** - System design and patterns
- **[Feature Documentation](./docs/FEATURES.md)** - Detailed feature implementations (Country Selection, RBAC, etc.)
- **[Backend README](./backend/README.md)** - Backend setup, API, database, testing
- **[Frontend README](./frontend/README.md)** - Frontend architecture, components, hooks
- **[Frontend Development Rules](./frontend/docs/rules.md)** - Mandatory development guidelines
- **[API Documentation](./backend/docs/RBAC_API.md)** - Complete API reference with examples
- **[Test Datasets](./backend/docs/DATASETS.md)** - Seed data and test accounts

### Quick Links
- **Swagger UI**: http://localhost:3000/api/docs (when backend is running)
- **Frontend App**: http://localhost:5321 (when frontend is running)
- **Drizzle Studio**: Run `npm run db:studio` in backend directory

## 🤝 Contributing

### How to Contribute

1. **Read the Documentation**
   - Review [frontend/docs/rules.md](./frontend/docs/rules.md) for frontend guidelines
   - Review [backend/README.md](./backend/README.md) for backend guidelines
   - Understand the architecture and data flow

2. **Follow Development Rules**
   - Use helpers/request for ALL API calls
   - Use helpers/errors for ALL error handling
   - Use hackLog for ALL logging (never console.log)
   - Store constants in constants/ directory
   - Use TypeScript types for all data structures

3. **Test Thoroughly**
   - Test with all user roles (ADMIN, MANAGER, MEMBER)
   - Test with both countries (IN, US)
   - Verify country-scoped data filtering
   - Check role-based UI visibility
   - Test error scenarios

4. **Code Quality**
   - Run `npm run validate` before committing
   - Fix all TypeScript errors
   - Fix all linting errors
   - Ensure no console.log statements
   - Add comprehensive logging with hackLog

5. **Documentation**
   - Update README files if adding new features
   - Document new API endpoints in RBAC_API.md
   - Update frontend/docs/rules.md for new patterns
   - Add JSDoc comments for complex functions

### Development Best Practices

- **Commit Messages**: Use clear, descriptive commit messages
- **Branch Naming**: Use feature/, bugfix/, or hotfix/ prefixes
- **Pull Requests**: Include description, testing steps, and screenshots
- **Code Reviews**: Review code for adherence to guidelines
- **Testing**: Add tests for new features and bug fixes

### Getting Help

- **Issues**: Check existing issues or create a new one
- **Documentation**: Refer to README files and docs/ directory
- **Logging**: Use hackLog for debugging and AI assistance
- **API Docs**: Use Swagger UI for API testing and exploration

## 🎓 Learning Resources

### Next.js & React
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### NestJS & Backend
- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Supabase Documentation](https://supabase.com/docs)

### UI & Styling
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Framer Motion Documentation](https://www.framer.com/motion/)

### State Management & Data Fetching
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [SWR Documentation](https://swr.vercel.app)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by enterprise-grade food ordering platforms
- Designed for scalability and maintainability

---

**Made with ❤️ by the Avengers DineOps Team**