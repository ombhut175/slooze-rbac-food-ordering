# 📚 Backend Documentation Index

This directory contains all backend-specific documentation for the Avengers DineOps API.

## 📖 Available Documentation

### Core Documentation

#### [RBAC_API.md](./RBAC_API.md)
**Complete API Reference**
- All API endpoints with examples
- Request/response schemas
- Authentication requirements
- Role-based access control rules
- Error handling
- cURL examples
- Testing workflows

#### [DATASETS.md](./DATASETS.md)
**Test Data & Seed Information**
- 6 test user accounts with roles
- User permissions by role
- 6 restaurants (3 India, 3 US)
- 42 menu items across all restaurants
- 2 mock payment methods
- Data relationships
- Seeding instructions

#### [postman_collection.json](./postman_collection.json)
**Postman API Collection**
- Ready-to-import collection
- All endpoints organized by feature
- Pre-configured authentication
- Automatic token management
- Example requests for all roles

### Additional Documentation

#### [auth-api-documentation.md](./auth-api-documentation.md)
**Authentication API Details**
- Auth endpoints
- Token management
- User registration
- Password reset

#### [drizzle-setup.md](./drizzle-setup.md)
**Database ORM Setup**
- Drizzle ORM configuration
- Schema definitions
- Migration workflow

#### [rules.md](./rules.md)
**Backend Coding Standards**
- NestJS best practices
- Module structure
- Error handling
- Validation patterns

## 🎯 Quick Access

### For API Users
1. **[RBAC_API.md](./RBAC_API.md)** - Complete API reference
2. **[postman_collection.json](./postman_collection.json)** - Import into Postman
3. **[DATASETS.md](./DATASETS.md)** - Test accounts and data
4. **http://localhost:3000/api/docs** - Interactive Swagger UI

### For Backend Developers
1. **[../README.md](../README.md)** - Backend setup guide
2. **[rules.md](./rules.md)** - Coding standards
3. **[drizzle-setup.md](./drizzle-setup.md)** - Database setup
4. **[RBAC_API.md](./RBAC_API.md)** - API reference

### For Testers
1. **[DATASETS.md](./DATASETS.md)** - Test accounts (password: Password123!)
2. **[postman_collection.json](./postman_collection.json)** - API testing
3. **[RBAC_API.md](./RBAC_API.md)** - Expected behaviors

## 🔗 Related Documentation

- **[Root README](../../README.md)** - Project overview
- **[Quick Start Guide](../../docs/QUICK_START.md)** - Setup guide
- **[Architecture](../../docs/ARCHITECTURE.md)** - System design
- **[Backend README](../README.md)** - Backend documentation
- **[Frontend README](../../frontend/README.md)** - Frontend documentation

## 📝 Test Accounts Quick Reference

All accounts use password: **Password123!**

| Email | Role | Country | Capabilities |
|-------|------|---------|--------------|
| nick@example.com | ADMIN | IN | Full access |
| captain.marvel@example.com | MANAGER | IN | Checkout/cancel |
| captain.america@example.com | MANAGER | US | Checkout/cancel |
| thanos@example.com | MEMBER | IN | Browse only |
| thor@example.com | MEMBER | IN | Browse only |
| travis@example.com | MEMBER | US | Browse only |

See [DATASETS.md](./DATASETS.md) for complete details.

## 🚀 Quick Start with Postman

1. Import [postman_collection.json](./postman_collection.json) into Postman
2. Run "Login - Admin" request (nick@example.com / Password123!)
3. Token will be automatically saved
4. Test other endpoints with saved token

## 📊 API Endpoints Overview

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration (with country selection: IN or US)

### Users (ADMIN only)
- `GET /users` - Get all users
- `PATCH /users/:id/role` - Update user role
- `PATCH /users/:id/country` - Update user country

### Restaurants
- `GET /restaurants` - Get restaurants (country-filtered)
- `GET /restaurants/all` - Get all restaurants (ADMIN)
- `GET /restaurants/:id/menu` - Get restaurant menu

### Orders
- `GET /orders` - Get orders (country-filtered)
- `POST /orders` - Create order
- `POST /orders/:id/items` - Add item to order
- `POST /orders/:id/checkout` - Checkout (ADMIN/MANAGER)
- `POST /orders/:id/cancel` - Cancel order (ADMIN/MANAGER)

### Payment Methods
- `GET /payment-methods` - Get payment methods
- `POST /payment-methods` - Create payment method (ADMIN)

See [RBAC_API.md](./RBAC_API.md) for complete details.

---

**Last Updated:** 2024-01-15
