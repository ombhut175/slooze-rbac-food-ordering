# RBAC Food Ordering Backend

A Role-Based Access Control (RBAC) food ordering system built with NestJS, Drizzle ORM, and Supabase Auth. The system implements country-scoped access control with three user roles: ADMIN, MANAGER, and MEMBER.

## Features

- **Role-Based Access Control**: Three user roles (ADMIN, MANAGER, MEMBER) with different permissions
- **Country-Scoped Access**: Data isolation based on user's assigned country (India or United States)
- **Restaurant Management**: Browse restaurants and menus with country-based filtering
- **Order Management**: Create, manage, checkout, and cancel orders
- **Mock Payment Processing**: Database-only payment simulation for testing
- **Payment Method Management**: ADMIN-controlled payment method configuration
- **Comprehensive API Documentation**: Swagger/OpenAPI documentation at `/api/docs`

## Technology Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI

## Description

This backend API implements a complete food ordering system with role-based access control and country-scoped data access.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Supabase account

### Installation

```bash
npm install
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

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Supabase Documentation](https://supabase.com/docs)
- [API Documentation](./RBAC_API.md)

## License

This project is licensed under the MIT License.
