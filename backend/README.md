# 🍽️ Avengers DineOps - Backend

> Enterprise-grade NestJS backend with Role-Based Access Control (RBAC) and country-scoped data management

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Avengers DineOps backend is a production-ready RESTful API built with NestJS that implements sophisticated role-based access control (RBAC) with country-scoped data isolation. The system supports multi-region food ordering operations with granular permission controls.

**Key Capabilities:**
- 🔐 JWT-based authentication with Supabase Auth
- 👥 Three-tier role system (ADMIN, MANAGER, MEMBER)
- 🌍 Country-scoped data access (India & United States)
- 🛡️ Guard-based authorization at endpoint level
- 💳 Mock payment processing for testing
- 📊 Comprehensive API documentation with Swagger
- 🗄️ Type-safe database queries with Drizzle ORM
- ✅ Input validation with class-validator

## ✨ Features

### Core Features

- **Role-Based Access Control**: Three user roles (ADMIN, MANAGER, MEMBER) with different permissions
- **Country-Scoped Access**: Data isolation based on user's assigned country (India or United States)
- **Restaurant Management**: Browse restaurants and menus with country-based filtering
- **Order Management**: Create, manage, checkout, and cancel orders with status tracking
- **Mock Payment Processing**: Database-only payment simulation for testing without external APIs
- **Payment Method Management**: ADMIN-controlled payment method configuration
- **User Management**: ADMIN can manage user roles and country assignments
- **Health Check**: Endpoint for monitoring service health

### Security Features

- JWT token validation with Supabase Auth
- Role-based endpoint protection with guards
- Country-scoped data filtering
- Input validation on all endpoints
- Secure password handling (via Supabase)
- CORS configuration for frontend integration

### Developer Features

- Interactive Swagger/OpenAPI documentation
- Comprehensive error handling
- Structured logging
- Database migrations with Drizzle
- Seed script for test data
- TypeScript strict mode
- ESLint and Prettier integration

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | NestJS | 11.x | Node.js framework with TypeScript |
| **Language** | TypeScript | 5.7+ | Type-safe development |
| **Database** | PostgreSQL | 14+ | Relational database |
| **ORM** | Drizzle ORM | 0.44+ | Type-safe database queries |
| **Authentication** | Supabase Auth | 2.81+ | JWT-based authentication |
| **Validation** | class-validator | 0.14+ | DTO validation |
| **Transformation** | class-transformer | 0.5+ | Object transformation |
| **API Docs** | Swagger/OpenAPI | 11.2+ | Interactive API documentation |
| **Testing** | Jest | 29.x | Unit and E2E testing |
| **Code Quality** | ESLint + Prettier | Latest | Linting and formatting |

### Key Dependencies

```json
{
  "@nestjs/common": "^11.0.0",
  "@nestjs/core": "^11.0.0",
  "@nestjs/config": "^4.0.2",
  "@nestjs/swagger": "^11.2.0",
  "@supabase/supabase-js": "^2.81.1",
  "drizzle-orm": "^0.44.7",
  "drizzle-kit": "^0.31.0",
  "pg": "^8.16.3",
  "class-validator": "^0.14.2",
  "class-transformer": "^0.5.1"
}
```

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Request                          │
│              (Authorization: Bearer <token>)             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   NestJS Middleware                      │
│              (CORS, Body Parser, Logging)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Guards Layer                           │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  AuthGuard   │→ │  RolesGuard  │                    │
│  │ (JWT Verify) │  │ (Role Check) │                    │
│  └──────────────┘  └──────────────┘                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Controller Layer                       │
│  (HTTP Endpoints, DTO Validation, Response Formatting)  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│        (Business Logic, Country Filtering)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Repository Layer                       │
│         (Database Queries with Drizzle ORM)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                    │
│  (Users, Restaurants, Orders, Payments, Menu Items)     │
└─────────────────────────────────────────────────────────┘
```

### Module Structure

```
src/
├── common/                 # Shared code across modules
│   ├── guards/            # AuthGuard, RolesGuard
│   ├── decorators/        # @Roles(), @CurrentUser()
│   ├── filters/           # Exception filters
│   └── interfaces/        # Shared interfaces
├── config/                # Configuration
│   ├── env.loader.ts      # Environment variables
│   └── supabase.config.ts # Supabase client
├── core/                  # Core functionality
│   ├── database/          # Database setup
│   │   ├── schema/        # Drizzle schemas
│   │   └── repositories/  # Data access layer
│   └── supabase/          # Supabase client
├── modules/               # Feature modules
│   ├── auth/              # Authentication
│   ├── users/             # User management
│   ├── restaurants/       # Restaurants & menus
│   ├── orders/            # Order management
│   ├── payment-methods/   # Payment methods
│   └── health-check/      # Health check
└── main.ts                # Application entry
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **Supabase Account** ([Sign up](https://supabase.com))

### Installation & Setup (5 Minutes)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp env.example.txt .env.local

# Edit .env.local with your actual values:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - DATABASE_URL

# 4. Set up database
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations
npm run db:seed      # Seed test data

# 5. Start development server
npm run start:dev    # API runs on http://localhost:3000

# 6. View API documentation
# Open http://localhost:3000/api/docs in your browser
```

### Verify Installation

```bash
# Test health check endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-15T10:00:00.000Z"}

# View Swagger documentation
# Open http://localhost:3000/api/docs
```

## Configuration

### Environment Variables Setup

This project uses environment variables with a priority system for configuration.

**Priority Order:**
1. **`.env.local`** (highest priority - local development overrides)
2. **`.env`** (fallback - shared/team configuration)

**Setup Instructions:**

```bash
# Copy the example file to create your environment configuration
cp env.example.txt .env.local

# Edit .env.local with your actual values
```

**Required Environment Variables:**

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
FRONTEND_URL=http://localhost:3656
REDIRECT_TO_FRONTEND_URL=http://localhost:3656/login
```

**Optional Environment Variables:**

```bash
# Swagger / API Docs Protection
SWAGGER_USER=admin
SWAGGER_PASSWORD=super-secure-password
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and keys from Project Settings → API
3. Update your `.env.local` file with the actual values
4. Ensure your PostgreSQL database is accessible

## Database Setup

### Run Migrations

Generate and apply database migrations:

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:migrate
```

### Seed Database

Populate the database with test data:

```bash
npm run db:seed
```

This will create:
- 6 test user accounts (see Test Accounts section below)
- 6 restaurants (3 in India, 3 in United States)
- Menu items for each restaurant
- 2 mock payment methods

## Running the Application

### Development Mode

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Other Run Commands

```bash
# Standard start
npm run start

# Debug mode
npm run start:debug
```

## Test Accounts

All test accounts use the password: **Password123!**

| Name              | Email                          | Role    | Country |
|-------------------|--------------------------------|---------|---------|
| Nick              | nick@example.com               | ADMIN   | IN      |
| Captain Marvel    | captain.marvel@example.com     | MANAGER | IN      |
| Captain America   | captain.america@example.com    | MANAGER | US      |
| Thanos            | thanos@example.com             | MEMBER  | IN      |
| Thor              | thor@example.com               | MEMBER  | IN      |
| Travis            | travis@example.com             | MEMBER  | US      |

### Role Permissions

- **ADMIN**: Full access to all resources across all countries, can manage payment methods
- **MANAGER**: Can checkout and cancel orders, access restricted to their country
- **MEMBER**: Can browse and create orders, access restricted to their country, cannot checkout or cancel

## API Documentation

### Swagger UI

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

### Comprehensive API Guide

See [RBAC_API.md](./RBAC_API.md) for detailed API documentation including:
- All endpoint specifications
- Request/response examples
- Authentication requirements
- Role-based access control rules
- Error handling
- Complete cURL examples

## Testing

### Run Unit Tests

```bash
npm test
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Run Tests with Coverage

```bash
npm run test:cov
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

## Code Quality

### Validation

Run type checking and linting together:

```bash
npm run validate
```

This runs:
- TypeScript type checking (`npm run type-check`)
- ESLint linting (`npm run lint:check`)

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

# Fix linting errors automatically
npm run lint

# Strict linting (no warnings allowed)
npm run lint:strict
```

### Code Formatting

```bash
npm run format
```

## Database Management

### Drizzle Studio

Launch Drizzle Studio to visually manage your database:

```bash
npm run db:studio
```

### Push Schema Changes

Push schema changes directly to database (development only):

```bash
npm run db:push
```

## Project Structure

```
backend/
├── src/
│   ├── common/              # Shared utilities, guards, decorators
│   │   ├── guards/          # AuthGuard, RolesGuard
│   │   ├── decorators/      # @Roles(), @CurrentUser()
│   │   ├── filters/         # Exception filters
│   │   └── interfaces/      # Shared interfaces
│   ├── core/
│   │   └── database/        # Database configuration and repositories
│   │       ├── schema/      # Drizzle schema definitions
│   │       └── repositories/# Data access layer
│   ├── modules/
│   │   ├── restaurants/     # Restaurant and menu endpoints
│   │   ├── orders/          # Order management endpoints
│   │   └── payment-methods/ # Payment method endpoints
│   └── main.ts              # Application entry point
├── scripts/
│   └── seed.ts              # Database seeding script
├── test/                    # E2E tests
└── drizzle/                 # Migration files
```

## Key Features Implementation

### Authentication Flow

1. User authenticates with Supabase Auth to get access token
2. Access token sent in Authorization header: `Bearer <token>`
3. AuthGuard validates token with Supabase Auth API
4. User details (role, country) fetched from database
5. User context attached to request for downstream use

### Authorization Flow

1. RolesGuard checks endpoint role requirements from @Roles() decorator
2. Compares user role against required roles
3. Returns 403 Forbidden if user lacks required role
4. Allows request to proceed if authorized

### Country Scoping

- ADMIN users: See all data from all countries
- MANAGER users: See only data from their assigned country
- MEMBER users: See only data from their assigned country
- Orders automatically assigned to user's country on creation

### Mock Payment Processing

- No external payment API integration
- All payment processing simulated in database
- Payment methods stored with provider='MOCK'
- Payments always succeed unless validation fails
- Useful for testing without real payment setup

## Troubleshooting

### Database Connection Issues

- Verify DATABASE_URL is correct in .env.local
- Ensure PostgreSQL is running
- Check database credentials and permissions

### Supabase Authentication Issues

- Verify SUPABASE_URL and keys are correct
- Ensure Supabase project is active
- Check that users exist in Supabase Auth

### Migration Issues

- Run `npm run db:generate` before `npm run db:migrate`
- Check migration files in drizzle/ directory
- Verify database schema matches expectations

### Seed Script Issues

- Ensure migrations are applied first
- Check that Supabase service role key has admin permissions
- Verify DATABASE_URL points to correct database

## Development Workflow

1. **Setup**: Install dependencies and configure environment variables
2. **Database**: Run migrations and seed data
3. **Development**: Start dev server with `npm run start:dev`
4. **Testing**: Write and run tests with `npm test`
5. **Validation**: Run `npm run validate` before committing
6. **Documentation**: Update API docs and README as needed

## 📊 API Endpoints

### Overview

| Module | Endpoints | Access |
|--------|-----------|--------|
| **Health** | `GET /health` | Public |
| **Auth** | `POST /auth/login`, `POST /auth/signup` | Public |
| **Users** | `GET /users`, `PATCH /users/:id/role`, `PATCH /users/:id/country` | ADMIN |
| **Restaurants** | `GET /restaurants`, `GET /restaurants/all`, `POST /restaurants`, `PATCH /restaurants/:id` | All / ADMIN |
| **Menu** | `GET /restaurants/:id/menu` | All |
| **Orders** | `GET /orders`, `POST /orders`, `GET /orders/:id`, `POST /orders/:id/items`, `DELETE /orders/:id/items/:itemId` | All |
| **Checkout** | `POST /orders/:id/checkout`, `POST /orders/:id/cancel` | ADMIN, MANAGER |
| **Payments** | `GET /payment-methods`, `POST /payment-methods`, `PATCH /payment-methods/:id` | All / ADMIN |

For detailed API documentation with request/response examples, see [RBAC_API.md](./RBAC_API.md)

## 🔐 Authentication & Authorization

### Authentication Flow

1. **User Login**: User provides email and password
2. **Supabase Auth**: Credentials validated by Supabase Auth
3. **JWT Token**: Supabase returns JWT access token
4. **Token Storage**: Frontend stores token (localStorage)
5. **API Requests**: Token sent in Authorization header
6. **Token Validation**: Backend validates token with Supabase
7. **User Context**: User details (role, country) attached to request

### Authorization Flow

1. **AuthGuard**: Validates JWT token and fetches user details
2. **RolesGuard**: Checks if user has required role for endpoint
3. **Country Filtering**: Applies country-scoped filtering based on role
4. **Access Decision**: Allow or deny request

### Role Permissions

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access to all endpoints, sees all countries, can manage users and payment methods |
| **MANAGER** | Can checkout and cancel orders, restricted to their country, cannot manage users or payment methods |
| **MEMBER** | Can browse and create orders, restricted to their country, cannot checkout or cancel orders |

### Country Scoping

- **ADMIN**: Sees data from all countries (IN and US)
- **MANAGER**: Sees only data from their assigned country
- **MEMBER**: Sees only data from their assigned country
- **Orders**: Automatically assigned to user's country on creation

## 🗄️ Database

### Schema Overview

```sql
-- Users table (managed by Supabase Auth)
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  role VARCHAR,  -- ADMIN, MANAGER, MEMBER
  country VARCHAR,  -- IN, US
  is_email_verified BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Restaurants table
restaurants (
  id UUID PRIMARY KEY,
  name VARCHAR,
  country VARCHAR,  -- IN, US
  status VARCHAR,  -- ACTIVE, INACTIVE
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Menu items table
menu_items (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  name VARCHAR,
  description TEXT,
  price_cents INTEGER,
  currency VARCHAR,  -- INR, USD
  available BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Orders table
orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  restaurant_id UUID REFERENCES restaurants(id),
  country VARCHAR,  -- IN, US
  status VARCHAR,  -- DRAFT, PENDING, PAID, CANCELED
  total_amount_cents INTEGER,
  currency VARCHAR,  -- INR, USD
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Order items table
order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER,
  unit_price_cents INTEGER,
  created_at TIMESTAMP
)

-- Payment methods table
payment_methods (
  id UUID PRIMARY KEY,
  provider VARCHAR,  -- MOCK, STRIPE
  label VARCHAR,
  brand VARCHAR,
  last4 VARCHAR,
  exp_month INTEGER,
  exp_year INTEGER,
  country VARCHAR,  -- IN, US
  active BOOLEAN,
  is_default BOOLEAN,
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Payments table
payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  payment_method_id UUID REFERENCES payment_methods(id),
  amount_cents INTEGER,
  currency VARCHAR,  -- INR, USD
  status VARCHAR,  -- REQUIRES_ACTION, SUCCEEDED, FAILED, CANCELED
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Database Commands

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema changes (development only)
npm run db:push

# Launch Drizzle Studio (visual database manager)
npm run db:studio

# Seed database with test data
npm run db:seed
```

### Seed Data

The seed script creates:
- **6 test users** (2 ADMIN, 2 MANAGER, 2 MEMBER)
- **6 restaurants** (3 in India, 3 in United States)
- **Menu items** for each restaurant
- **2 mock payment methods**

All test accounts use password: `Password123!`

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm test -- users.service.spec.ts
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with specific config
npm run test:e2e -- --config=./test/jest-e2e.json
```

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123!"}'

# Get restaurants (with auth token)
curl http://localhost:3000/restaurants \
  -H "Authorization: Bearer <your_token>"

# Create order
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"<restaurant_id>"}'
```

## 🔧 Code Quality

### Validation

```bash
# Run type-check + lint
npm run validate

# Strict validation
npm run validate:strict
```

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

### Code Formatting

```bash
# Format code with Prettier
npm run format
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── common/                 # Shared code
│   │   ├── constants/         # Constants
│   │   ├── controllers/       # Base controllers
│   │   ├── decorators/        # Custom decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/           # Exception filters
│   │   ├── guards/            # Guards
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── helpers/           # Helper functions
│   │   └── interfaces/        # Shared interfaces
│   │
│   ├── config/                # Configuration
│   │   ├── env.loader.ts      # Environment loader
│   │   ├── env.validation.ts  # Env validation
│   │   └── supabase.config.ts # Supabase config
│   │
│   ├── core/                  # Core functionality
│   │   ├── database/          # Database setup
│   │   │   ├── schema/        # Drizzle schemas
│   │   │   │   ├── users.schema.ts
│   │   │   │   ├── restaurants.schema.ts
│   │   │   │   ├── menu-items.schema.ts
│   │   │   │   ├── orders.schema.ts
│   │   │   │   ├── order-items.schema.ts
│   │   │   │   ├── payment-methods.schema.ts
│   │   │   │   └── payments.schema.ts
│   │   │   └── repositories/  # Data access layer
│   │   └── supabase/          # Supabase client
│   │
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── dto/
│   │   ├── users/             # User management
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   ├── restaurants/       # Restaurants
│   │   │   ├── restaurants.controller.ts
│   │   │   ├── restaurants.service.ts
│   │   │   └── dto/
│   │   ├── orders/            # Orders
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── dto/
│   │   ├── payment-methods/   # Payment methods
│   │   │   ├── payment-methods.controller.ts
│   │   │   ├── payment-methods.service.ts
│   │   │   └── dto/
│   │   ├── health-check/      # Health check
│   │   └── test/              # Test endpoints
│   │
│   ├── app.module.ts          # Root module
│   ├── app.controller.ts      # Root controller
│   ├── app.service.ts         # Root service
│   └── main.ts                # Entry point
│
├── scripts/
│   └── seed.ts                # Database seeding
│
├── test/                      # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── drizzle/                   # Migrations
│   └── [timestamp]_migration.sql
│
├── drizzle.config.ts          # Drizzle config
├── nest-cli.json              # NestJS CLI config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── README.md                  # This file
```

## 💻 Development Workflow

### 1. Create New Feature

```bash
# Generate module
nest g module modules/feature-name

# Generate controller
nest g controller modules/feature-name

# Generate service
nest g service modules/feature-name
```

### 2. Define Database Schema

```typescript
// src/core/database/schema/feature.schema.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const features = pgTable('features', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### 3. Generate and Run Migration

```bash
npm run db:generate
npm run db:migrate
```

### 4. Create DTOs

```typescript
// src/modules/feature-name/dto/create-feature.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

### 5. Implement Service

```typescript
// src/modules/feature-name/feature-name.service.ts
@Injectable()
export class FeatureNameService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateFeatureDto) {
    return this.db.insert(features).values(dto);
  }
}
```

### 6. Implement Controller

```typescript
// src/modules/feature-name/feature-name.controller.ts
@Controller('features')
@UseGuards(AuthGuard)
export class FeatureNameController {
  constructor(private readonly service: FeatureNameService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateFeatureDto) {
    return this.service.create(dto);
  }
}
```

### 7. Test

```bash
# Run validation
npm run validate

# Test endpoint
curl -X POST http://localhost:3000/features \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Feature"}'
```

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to database

**Solutions**:
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env.local
- Ensure database exists: `createdb your_database_name`
- Check PostgreSQL logs for errors

### Supabase Authentication Issues

**Problem**: Token validation fails

**Solutions**:
- Verify Supabase project is active
- Check SUPABASE_URL and keys in .env.local
- Ensure service role key has admin permissions
- Test Supabase connection in Supabase dashboard

### Migration Issues

**Problem**: Migration fails to apply

**Solutions**:
- Delete drizzle/ folder and regenerate: `npm run db:generate`
- Check schema syntax in src/core/database/schema/
- Verify DATABASE_URL is correct
- Check PostgreSQL version compatibility

### Seed Script Issues

**Problem**: Seed script fails

**Solutions**:
- Ensure migrations are applied first: `npm run db:migrate`
- Check Supabase service role key permissions
- Verify DATABASE_URL points to correct database
- Check for existing data conflicts

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solutions**:
- Change PORT in .env.local
- Kill process using port: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)
- Use different port: `PORT=3001 npm run start:dev`

### TypeScript Errors

**Problem**: TypeScript compilation errors

**Solutions**:
- Run `npm run type-check` to see all errors
- Check tsconfig.json configuration
- Ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📚 Additional Resources

### Project Documentation
- **[Root README](../README.md)** - Project overview and quick start
- **[Quick Start Guide](../docs/QUICK_START.md)** - 5-minute setup guide
- **[Architecture Documentation](../docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[Frontend README](../frontend/README.md)** - Frontend documentation
- **[API Documentation](./docs/RBAC_API.md)** - Complete API reference with examples
- **[Test Datasets](./docs/DATASETS.md)** - Seed data, test accounts, menu items
- **[Postman Collection](./docs/postman_collection.json)** - Ready-to-import API collection
- **[Swagger UI](http://localhost:3000/api/docs)** - Interactive API docs (when running)

### Testing Resources

**Postman Collection:**
- Import `backend/docs/postman_collection.json` into Postman
- Pre-configured with all API endpoints
- Automatic token management
- Example requests for all user roles

**Test Accounts:**
- See [docs/DATASETS.md](./docs/DATASETS.md) for complete list
- All accounts use password: `Password123!`
- 6 test users (ADMIN, MANAGER, MEMBER)
- 2 countries (India, United States)

**Test Data:**
- 6 restaurants (3 in India, 3 in US)
- 42 menu items across all restaurants
- 2 mock payment methods
- Comprehensive seed script

### External Resources
- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)

## 🤝 Contributing

1. Follow NestJS module pattern
2. Use DTOs with class-validator for validation
3. Implement guards for authentication and authorization
4. Add Swagger decorators for API documentation
5. Write unit tests for services
6. Run validation before committing

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ by the Avengers DineOps Team**
