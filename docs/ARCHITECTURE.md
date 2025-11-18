# 🏗️ Avengers DineOps - Architecture & Design

This document provides a comprehensive overview of the system architecture, design decisions, and technical implementation details.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Technology Stack](#technology-stack)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Database Design](#database-design)
- [API Design](#api-design)
- [Frontend Architecture](#frontend-architecture)
- [State Management](#state-management)
- [Design Decisions](#design-decisions)
- [Scalability Considerations](#scalability-considerations)

## 🎯 System Overview

Avengers DineOps is a full-stack food ordering platform built with a modern microservices-inspired architecture, featuring:

- **Separation of Concerns**: Clear boundaries between frontend, backend, and database layers
- **Role-Based Access Control (RBAC)**: Three-tier permission system with country-scoped data
- **RESTful API**: Stateless API design with JWT authentication
- **Reactive Frontend**: Real-time UI updates with optimistic rendering
- **Type Safety**: End-to-end TypeScript for compile-time safety

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (Port 5321)                 │  │
│  │  - React 19 with App Router                              │  │
│  │  - TypeScript for type safety                            │  │
│  │  - Tailwind CSS for styling                              │  │
│  │  - SWR for data fetching & caching                       │  │
│  │  - Zustand for client state                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST (JSON)
                             │ Authorization: Bearer <JWT>
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Application Layer                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              NestJS Backend (Port 3000)                   │  │
│  │  - Node.js with TypeScript                               │  │
│  │  - Guards for authentication & authorization             │  │
│  │  - DTOs for validation                                   │  │
│  │  - Services for business logic                           │  │
│  │  - Repositories for data access                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ SQL Queries
                             │ Drizzle ORM
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                        Data Layer                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                          │  │
│  │  - Relational data model                                 │  │
│  │  - ACID transactions                                     │  │
│  │  - Foreign key constraints                               │  │
│  │  - Indexes for performance                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Supabase Auth                                │  │
│  │  - JWT token generation                                  │  │
│  │  - User authentication                                   │  │
│  │  - Password hashing                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## 🏛️ Architecture Patterns

### 1. Layered Architecture

The system follows a strict layered architecture pattern:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components, Pages, UI)          │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Application Layer               │
│  (Hooks, State Management, API Calls)   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Business Logic Layer            │
│  (Controllers, Services, Validation)    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Data Access Layer               │
│  (Repositories, ORM, Database)          │
└─────────────────────────────────────────┘
```

**Benefits:**
- Clear separation of concerns
- Easy to test each layer independently
- Maintainable and scalable codebase
- Enforces single responsibility principle

### 2. Repository Pattern

Data access is abstracted through repositories:

```typescript
// Repository Layer
class UserRepository {
  async findById(id: string): Promise<User> { }
  async findByEmail(email: string): Promise<User> { }
  async create(data: CreateUserDto): Promise<User> { }
}

// Service Layer uses Repository
class UserService {
  constructor(private userRepo: UserRepository) {}
  
  async getUser(id: string) {
    return this.userRepo.findById(id);
  }
}
```

**Benefits:**
- Decouples business logic from data access
- Easy to mock for testing
- Can swap database implementations
- Centralized query logic

### 3. Guard Pattern (Authorization)

NestJS guards handle authentication and authorization:

```typescript
// Authentication Guard
@Injectable()
class AuthGuard {
  canActivate(context: ExecutionContext): boolean {
    // Validate JWT token
    // Attach user to request
  }
}

// Authorization Guard
@Injectable()
class RolesGuard {
  canActivate(context: ExecutionContext): boolean {
    // Check user role against required roles
  }
}

// Usage
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN', 'MANAGER')
@Post('checkout')
async checkout() { }
```

**Benefits:**
- Centralized security logic
- Declarative authorization
- Easy to test and maintain
- Reusable across endpoints

### 4. DTO Pattern (Data Transfer Objects)

DTOs validate and transform data:

```typescript
class CreateOrderDto {
  @IsUUID()
  restaurantId: string;
}

class OrderResponseDto {
  id: string;
  status: string;
  totalAmountCents: number;
  // ... other fields
}
```

**Benefits:**
- Input validation at API boundary
- Type-safe data transfer
- Clear API contracts
- Prevents over-posting attacks

## 🛠️ Technology Stack

### Frontend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 | React framework with SSR/SSG |
| **UI Library** | React 19 | Component-based UI |
| **Language** | TypeScript 5.7 | Type safety |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Components** | Shadcn/ui + Radix | Accessible components |
| **State** | Zustand | Client state management |
| **Data Fetching** | SWR | Server state with caching |
| **Forms** | React Hook Form + Zod | Form handling & validation |
| **HTTP** | Axios | API communication |
| **Animations** | Framer Motion | UI animations |

### Backend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | NestJS 11 | Node.js framework |
| **Language** | TypeScript 5.7 | Type safety |
| **Database** | PostgreSQL 14+ | Relational database |
| **ORM** | Drizzle ORM | Type-safe queries |
| **Auth** | Supabase Auth | JWT authentication |
| **Validation** | class-validator | DTO validation |
| **API Docs** | Swagger/OpenAPI | Interactive docs |
| **Testing** | Jest | Unit & E2E tests |

## 🧩 System Components

### Frontend Components

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   └── (other)/           # Protected pages (dashboard, orders)
│
├── components/            # React components
│   ├── ui/               # Base UI components (Shadcn)
│   ├── auth/             # Auth-specific components
│   ├── food-ordering/    # Feature components
│   └── shared/           # Shared components
│
├── hooks/                # Custom React hooks
│   ├── use-auth-store.ts      # Authentication
│   ├── use-cart-store.ts      # Shopping cart
│   ├── use-restaurants.ts     # Data fetching
│   └── use-role-check.ts      # Authorization
│
├── helpers/              # Business logic
│   ├── request.ts        # API calls (MANDATORY)
│   └── errors.ts         # Error handling (MANDATORY)
│
├── lib/                  # Core setup
│   ├── store.ts          # Zustand stores
│   ├── swr-config.ts     # SWR configuration
│   └── logger.ts         # Custom logger
│
└── constants/            # Application constants
    ├── api.ts            # API endpoints
    ├── routes.ts         # Route paths
    └── messages.ts       # User messages
```

### Backend Components

```
backend/src/
├── common/               # Shared code
│   ├── guards/          # AuthGuard, RolesGuard
│   ├── decorators/      # @Roles(), @CurrentUser()
│   └── filters/         # Exception filters
│
├── config/              # Configuration
│   ├── env.loader.ts    # Environment variables
│   └── supabase.config.ts
│
├── core/                # Core functionality
│   ├── database/        # Database setup
│   │   ├── schema/      # Drizzle schemas
│   │   └── repositories/# Data access
│   └── supabase/        # Supabase client
│
└── modules/             # Feature modules
    ├── auth/            # Authentication
    ├── users/           # User management
    ├── restaurants/     # Restaurants & menus
    ├── orders/          # Order management
    └── payment-methods/ # Payment methods
```

## 🔄 Data Flow

### 1. Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Enter credentials
     ▼
┌─────────────────┐
│  Login Page     │
└────┬────────────┘
     │ 2. POST /auth/login
     ▼
┌─────────────────┐
│  Auth Service   │
└────┬────────────┘
     │ 3. Validate with Supabase
     ▼
┌─────────────────┐
│ Supabase Auth   │
└────┬────────────┘
     │ 4. Return JWT token
     ▼
┌─────────────────┐
│  Frontend       │
│  (Store token)  │
└────┬────────────┘
     │ 5. Redirect to dashboard
     ▼
┌─────────────────┐
│  Dashboard      │
└─────────────────┘
```

### 2. API Request Flow

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ 1. Trigger action
       ▼
┌─────────────┐
│  Hook       │
└──────┬──────┘
       │ 2. Call helper
       ▼
┌─────────────┐
│ request.ts  │ (MANDATORY)
└──────┬──────┘
       │ 3. HTTP request + token
       ▼
┌─────────────┐
│  AuthGuard  │
└──────┬──────┘
       │ 4. Validate token
       ▼
┌─────────────┐
│ RolesGuard  │
└──────┬──────┘
       │ 5. Check permissions
       ▼
┌─────────────┐
│ Controller  │
└──────┬──────┘
       │ 6. Validate DTO
       ▼
┌─────────────┐
│  Service    │
└──────┬──────┘
       │ 7. Business logic
       ▼
┌─────────────┐
│ Repository  │
└──────┬──────┘
       │ 8. Database query
       ▼
┌─────────────┐
│  Database   │
└──────┬──────┘
       │ 9. Return data
       ▼
┌─────────────┐
│  Component  │
│  (Update UI)│
└─────────────┘
```

### 3. Order Creation Flow

```
User selects restaurant
       │
       ▼
POST /orders {restaurantId}
       │
       ▼
Create order in DRAFT status
(country = user's country)
       │
       ▼
User adds items to cart
       │
       ▼
POST /orders/:id/items {menuItemId, quantity}
       │
       ▼
Add item to order
Calculate total
       │
       ▼
User clicks checkout
       │
       ▼
POST /orders/:id/checkout {paymentMethodId}
(ADMIN/MANAGER only)
       │
       ▼
Validate order has items
Process payment (MOCK)
Update order status to PAID
       │
       ▼
Clear cart
Show confirmation
```

## 🔐 Security Architecture

### 1. Authentication

**JWT Token-Based Authentication:**

```
┌─────────────────────────────────────────────────────────┐
│                    JWT Token Structure                   │
├─────────────────────────────────────────────────────────┤
│  Header:                                                 │
│    {                                                     │
│      "alg": "HS256",                                    │
│      "typ": "JWT"                                       │
│    }                                                     │
├─────────────────────────────────────────────────────────┤
│  Payload:                                                │
│    {                                                     │
│      "sub": "user-id",                                  │
│      "email": "user@example.com",                       │
│      "iat": 1234567890,                                 │
│      "exp": 1234571490                                  │
│    }                                                     │
├─────────────────────────────────────────────────────────┤
│  Signature:                                              │
│    HMACSHA256(                                          │
│      base64UrlEncode(header) + "." +                   │
│      base64UrlEncode(payload),                         │
│      secret                                             │
│    )                                                     │
└─────────────────────────────────────────────────────────┘
```

**Token Flow:**
1. User logs in with credentials
2. Supabase Auth validates and returns JWT
3. Frontend stores token in localStorage
4. Token sent in Authorization header: `Bearer <token>`
5. Backend validates token with Supabase on each request
6. User details attached to request context

### 2. Authorization (RBAC)

**Three-Tier Role System:**

```
┌─────────────────────────────────────────────────────────┐
│                      ADMIN                               │
│  - Full access to all resources                         │
│  - Can manage users (roles, countries)                  │
│  - Can manage payment methods                           │
│  - Sees data from all countries                         │
│  - Can create/update restaurants                        │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                     MANAGER                              │
│  - Can checkout and cancel orders                       │
│  - Restricted to their assigned country                 │
│  - Cannot manage users or payment methods               │
│  - Cannot create/update restaurants                     │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      MEMBER                              │
│  - Can browse restaurants and menus                     │
│  - Can create orders and add items                      │
│  - Cannot checkout or cancel orders                     │
│  - Restricted to their assigned country                 │
│  - Cannot manage anything                               │
└─────────────────────────────────────────────────────────┘
```

**Country Scoping:**

```typescript
// Service layer applies country filtering
async getRestaurants(user: User) {
  if (user.role === 'ADMIN') {
    // Admin sees all restaurants
    return this.restaurantRepo.findAll();
  } else {
    // Others see only their country
    return this.restaurantRepo.findByCountry(user.country);
  }
}
```

### 3. Input Validation

**Multi-Layer Validation:**

1. **Frontend Validation** (React Hook Form + Zod)
   - Immediate user feedback
   - Prevents unnecessary API calls
   - Client-side type checking

2. **Backend Validation** (class-validator)
   - Server-side validation
   - Prevents malicious input
   - Type coercion and transformation

3. **Database Constraints**
   - Foreign key constraints
   - NOT NULL constraints
   - Unique constraints
   - Check constraints

### 4. Security Best Practices

- ✅ HTTPS in production
- ✅ CORS configuration
- ✅ Rate limiting (can be added)
- ✅ SQL injection prevention (ORM)
- ✅ XSS prevention (React escaping)
- ✅ CSRF protection (SameSite cookies)
- ✅ Password hashing (Supabase)
- ✅ JWT expiration
- ✅ Environment variable protection

## 🗄️ Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
│─────────────────│
│ id (PK)         │◄──────────┐
│ email           │           │
│ role            │           │
│ country         │           │
│ is_email_verified│          │
│ created_at      │           │
│ updated_at      │           │
└─────────────────┘           │
        │                     │
        │ 1:N                 │
        ▼                     │
┌─────────────────┐           │
│     Orders      │           │
│─────────────────│           │
│ id (PK)         │           │
│ user_id (FK)    │───────────┘
│ restaurant_id(FK)│──────┐
│ country         │      │
│ status          │      │
│ total_amount_cents│    │
│ currency        │      │
│ created_at      │      │
│ updated_at      │      │
└─────────────────┘      │
        │                │
        │ 1:N            │
        ▼                │
┌─────────────────┐      │
│  Order Items    │      │
│─────────────────│      │
│ id (PK)         │      │
│ order_id (FK)   │      │
│ menu_item_id(FK)│──┐   │
│ quantity        │  │   │
│ unit_price_cents│  │   │
│ created_at      │  │   │
└─────────────────┘  │   │
                     │   │
        ┌────────────┘   │
        │                │
        ▼                │
┌─────────────────┐      │
│   Menu Items    │      │
│─────────────────│      │
│ id (PK)         │      │
│ restaurant_id(FK)│─────┤
│ name            │      │
│ description     │      │
│ price_cents     │      │
│ currency        │      │
│ available       │      │
│ created_at      │      │
│ updated_at      │      │
└─────────────────┘      │
                         │
        ┌────────────────┘
        │
        ▼
┌─────────────────┐
│  Restaurants    │
│─────────────────│
│ id (PK)         │
│ name            │
│ country         │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### Key Design Decisions

1. **UUID Primary Keys**: Better for distributed systems, no sequential leaks
2. **Timestamps**: All tables have created_at and updated_at for auditing
3. **Soft Deletes**: Can be added with deleted_at column (not implemented)
4. **Price Storage**: Stored in cents to avoid floating-point issues
5. **Country Enum**: Limited to 'IN' and 'US' for data integrity
6. **Status Enums**: Predefined statuses for orders and restaurants

## 🌐 API Design

### RESTful Principles

The API follows REST conventions:

| HTTP Method | Purpose | Example |
|-------------|---------|---------|
| GET | Retrieve resources | GET /restaurants |
| POST | Create resources | POST /orders |
| PATCH | Partial update | PATCH /users/:id/role |
| DELETE | Delete resources | DELETE /orders/:id/items/:itemId |

### Response Format

**Success Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "path": "/orders"
}
```

### Pagination (Future Enhancement)

```typescript
// Query parameters
GET /orders?page=1&limit=10&sortBy=createdAt&order=desc

// Response
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🎨 Frontend Architecture

### Component Hierarchy

```
App Layout
├── Navigation
│   ├── Logo
│   ├── Menu Items
│   └── User Menu
│       ├── Role Badge
│       └── Logout Button
│
├── Page Content
│   ├── Restaurants Page
│   │   ├── Restaurant Card (multiple)
│   │   │   ├── Country Badge
│   │   │   └── Status Badge
│   │   └── Empty State
│   │
│   ├── Restaurant Menu Page
│   │   ├── Restaurant Header
│   │   ├── Menu Item (multiple)
│   │   │   ├── Add to Cart Button
│   │   │   └── Quantity Selector
│   │   └── Cart Sidebar
│   │       ├── Cart Items
│   │       └── Checkout Button
│   │
│   └── Orders Page
│       ├── Status Filter
│       ├── Order Card (multiple)
│       │   ├── Status Badge
│       │   ├── Country Badge
│       │   └── View Details Button
│       └── Empty State
│
└── Toast Notifications
```

### State Management Strategy

**Server State (SWR):**
- Restaurants list
- Restaurant menu
- Orders list
- Order details
- Payment methods

**Client State (Zustand):**
- Authentication (user, token)
- Cart (orderId, restaurantId, isOpen)
- UI state (theme, modals)

**Local State (useState):**
- Form inputs
- UI toggles
- Temporary data

## 🎯 Design Decisions

### 1. Why Next.js App Router?

**Pros:**
- Server-side rendering for better SEO
- File-based routing for simplicity
- Built-in API routes (not used, separate backend)
- Excellent developer experience

**Cons:**
- Learning curve for App Router
- Some features still in beta

**Decision:** Use App Router for modern React patterns and better performance.

### 2. Why NestJS?

**Pros:**
- TypeScript-first framework
- Modular architecture
- Built-in dependency injection
- Excellent for enterprise applications
- Great documentation

**Cons:**
- More boilerplate than Express
- Steeper learning curve

**Decision:** Use NestJS for scalability and maintainability.

### 3. Why Drizzle ORM?

**Pros:**
- Type-safe queries
- Lightweight and fast
- SQL-like syntax
- Great TypeScript support
- No runtime overhead

**Cons:**
- Smaller community than Prisma
- Fewer features than TypeORM

**Decision:** Use Drizzle for type safety and performance.

### 4. Why Supabase Auth?

**Pros:**
- Easy to set up
- JWT-based authentication
- Built-in user management
- Free tier available
- Good documentation

**Cons:**
- Vendor lock-in
- Limited customization

**Decision:** Use Supabase for rapid development and reliability.

### 5. Why Mock Payments?

**Pros:**
- No external dependencies
- Easy to test
- No payment gateway fees
- Faster development

**Cons:**
- Not production-ready
- Need to integrate real gateway later

**Decision:** Use mock payments for MVP, integrate Stripe later.

## 📈 Scalability Considerations

### Current Limitations

1. **Single Database**: All data in one PostgreSQL instance
2. **No Caching**: No Redis or CDN caching
3. **No Load Balancing**: Single backend instance
4. **No Message Queue**: Synchronous processing
5. **No Microservices**: Monolithic backend

### Future Enhancements

#### 1. Caching Layer

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Redis     │ ◄── Cache frequently accessed data
└──────┬──────┘
       │ Cache miss
       ▼
┌─────────────┐
│   Backend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Database   │
└─────────────┘
```

#### 2. Horizontal Scaling

```
┌─────────────┐
│Load Balancer│
└──────┬──────┘
       │
       ├──────────┬──────────┬──────────┐
       ▼          ▼          ▼          ▼
┌──────────┐┌──────────┐┌──────────┐┌──────────┐
│Backend #1││Backend #2││Backend #3││Backend #N│
└──────────┘└──────────┘└──────────┘└──────────┘
       │          │          │          │
       └──────────┴──────────┴──────────┘
                  │
                  ▼
           ┌──────────┐
           │ Database │
           └──────────┘
```

#### 3. Microservices Architecture

```
┌─────────────────────────────────────────────────────┐
│                   API Gateway                        │
└────────┬────────────────────────────────────────────┘
         │
         ├──────────┬──────────┬──────────┬──────────┐
         ▼          ▼          ▼          ▼          ▼
    ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
    │  Auth  ││ Users  ││Restaur.││ Orders ││Payment │
    │Service ││Service ││Service ││Service ││Service │
    └────────┘└────────┘└────────┘└────────┘└────────┘
         │          │          │          │          │
         └──────────┴──────────┴──────────┴──────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │Message Queue │
                    │   (RabbitMQ) │
                    └──────────────┘
```

#### 4. Database Optimization

- **Read Replicas**: Separate read and write databases
- **Sharding**: Partition data by country
- **Indexing**: Add indexes on frequently queried columns
- **Connection Pooling**: Reuse database connections

#### 5. CDN & Asset Optimization

- **Static Assets**: Serve from CDN (Cloudflare, AWS CloudFront)
- **Image Optimization**: Use Next.js Image component
- **Code Splitting**: Lazy load components
- **Bundle Optimization**: Tree shaking and minification

## 🔗 Related Documentation

- **[Root README](../README.md)** - Project overview
- **[Quick Start Guide](./QUICK_START.md)** - 5-minute setup guide
- **[Backend README](../backend/README.md)** - Backend documentation
- **[Frontend README](../frontend/README.md)** - Frontend documentation
- **[API Documentation](../backend/docs/RBAC_API.md)** - API reference
- **[Datasets](../backend/docs/DATASETS.md)** - Test data documentation

---

**Last Updated:** 2024-01-15  
**Architecture Version:** 1.0.0
