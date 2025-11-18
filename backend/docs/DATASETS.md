# 📊 Avengers DineOps - Test Datasets

This document describes all test data seeded into the database for development and testing purposes.

## 📋 Table of Contents

- [Overview](#overview)
- [Test User Accounts](#test-user-accounts)
- [Restaurants & Menus](#restaurants--menus)
- [Payment Methods](#payment-methods)
- [Data Relationships](#data-relationships)
- [Seeding Instructions](#seeding-instructions)

## 🎯 Overview

The seed script (`backend/scripts/seed.ts`) populates the database with comprehensive test data including:

- **6 test user accounts** (2 ADMIN, 2 MANAGER, 2 MEMBER)
- **6 restaurants** (3 in India, 3 in United States)
- **42 menu items** across all restaurants
- **2 mock payment methods**

All test accounts use the same password: **`Password123!`**

## 👥 Test User Accounts

### User Roles & Countries

| Name | Email | Password | Role | Country | Description |
|------|-------|----------|------|---------|-------------|
| **Nick** | nick@example.com | Password123! | ADMIN | IN | Full access, can manage users and payment methods |
| **Captain Marvel** | captain.marvel@example.com | Password123! | MANAGER | IN | Can checkout/cancel orders, India only |
| **Captain America** | captain.america@example.com | Password123! | MANAGER | US | Can checkout/cancel orders, US only |
| **Thanos** | thanos@example.com | Password123! | MEMBER | IN | Can browse and create orders, India only |
| **Thor** | thor@example.com | Password123! | MEMBER | IN | Can browse and create orders, India only |
| **Travis** | travis@example.com | Password123! | MEMBER | US | Can browse and create orders, US only |

### Role Permissions

#### ADMIN (Nick)
- ✅ View all users
- ✅ Update user roles and countries
- ✅ View all restaurants (all countries)
- ✅ Create/update restaurants
- ✅ View all orders (all countries)
- ✅ Create orders
- ✅ Checkout orders
- ✅ Cancel orders
- ✅ Manage payment methods

#### MANAGER (Captain Marvel, Captain America)
- ❌ Cannot manage users
- ✅ View restaurants (their country only)
- ❌ Cannot create/update restaurants
- ✅ View orders (their country only)
- ✅ Create orders
- ✅ Checkout orders
- ✅ Cancel orders
- ❌ Cannot manage payment methods

#### MEMBER (Thanos, Thor, Travis)
- ❌ Cannot manage users
- ✅ View restaurants (their country only)
- ❌ Cannot create/update restaurants
- ✅ View orders (their country only)
- ✅ Create orders
- ❌ Cannot checkout orders
- ❌ Cannot cancel orders
- ❌ Cannot manage payment methods

## 🍽️ Restaurants & Menus

### India (IN) - 3 Restaurants, 22 Menu Items

#### 1. Spice Paradise (IN)
**Status:** ACTIVE  
**Menu Items:** 7 items

| Item | Description | Price | Currency |
|------|-------------|-------|----------|
| Butter Chicken | Creamy tomato-based curry with tender chicken | ₹350.00 | INR |
| Paneer Tikka Masala | Grilled cottage cheese in rich masala gravy | ₹280.00 | INR |
| Biryani | Fragrant basmati rice with spiced meat | ₹320.00 | INR |
| Naan Bread | Freshly baked Indian flatbread | ₹50.00 | INR |
| Samosa | Crispy pastry filled with spiced potatoes | ₹80.00 | INR |
| Mango Lassi | Sweet yogurt drink with mango | ₹120.00 | INR |
| Dal Makhani | Creamy black lentils slow-cooked overnight | ₹220.00 | INR |

#### 2. Mumbai Street Food (IN)
**Status:** ACTIVE  
**Menu Items:** 8 items

| Item | Description | Price | Currency |
|------|-------------|-------|----------|
| Pav Bhaji | Spiced vegetable mash with buttered bread rolls | ₹150.00 | INR |
| Vada Pav | Spiced potato fritter in a bread bun | ₹80.00 | INR |
| Pani Puri | Crispy shells filled with tangy water | ₹100.00 | INR |
| Dosa | Crispy rice crepe with potato filling | ₹120.00 | INR |
| Idli Sambar | Steamed rice cakes with lentil soup | ₹100.00 | INR |
| Masala Chai | Spiced Indian tea with milk | ₹50.00 | INR |
| Bhel Puri | Puffed rice with vegetables and tangy sauce | ₹90.00 | INR |
| Chole Bhature | Spiced chickpeas with fried bread | ₹180.00 | INR |

#### 3. Tandoor House (IN)
**Status:** ACTIVE  
**Menu Items:** 5 items

| Item | Description | Price | Currency |
|------|-------------|-------|----------|
| Tandoori Chicken | Clay oven roasted chicken with spices | ₹380.00 | INR |
| Seekh Kebab | Minced meat skewers grilled in tandoor | ₹320.00 | INR |
| Garlic Naan | Naan bread topped with garlic and butter | ₹70.00 | INR |
| Paneer Tikka | Grilled cottage cheese marinated in spices | ₹280.00 | INR |
| Chicken Tikka | Boneless chicken pieces marinated and grilled | ₹350.00 | INR |

### United States (US) - 3 Restaurants, 21 Menu Items

#### 4. American Diner (US)
**Status:** ACTIVE  
**Menu Items:** 7 items

| Item | Description | Price | Currency |
|------|-------------|-------|----------|
| Classic Burger | Beef patty with lettuce, tomato, and cheese | $12.99 | USD |
| French Fries | Crispy golden fries with sea salt | $4.99 | USD |
| Chicken Wings | Buffalo wings with ranch dressing | $10.99 | USD |
| Caesar Salad | Romaine lettuce with parmesan and croutons | $8.99 | USD |
| Milkshake | Thick and creamy vanilla milkshake | $5.99 | USD |
| Hot Dog | All-beef hot dog with classic toppings | $6.99 | USD |
| Onion Rings | Crispy battered onion rings | $5.49 | USD |

#### 5. Pizza Palace (US)
**Status:** ACTIVE  
**Menu Items:** 8 items

| Item | Description | Price | Currency |
|------|-------------|-------|----------|
| Margherita Pizza | Classic pizza with tomato, mozzarella, and basil | $14.99 | USD |
| Pepperoni Pizza | Loaded with pepperoni and cheese | $16.99 | USD |
| BBQ Chicken Pizza | Grilled chicken with BBQ sauce and red onions | $17.99 | USD |
| Veggie Supreme | Loaded with fresh vegetables | $15.99 | USD |
| Garlic Bread | Toasted bread with garlic butter | $5.99 | USD |
| Mozzarella Sticks | Breaded mozzarella with marinara sauce | $7.99 | USD |
| Soda | Refreshing soft drink | $2.99 | USD |
| Tiramisu | Classic Italian dessert | $6.99 | USD |

#### 6. Steakhouse Grill (US)
**Status:** ACTIVE  
**Menu Items:** 6 items

| Item | Description | Price | Currency |
|------|-------------|-------|----------|
| Ribeye Steak | 12oz premium ribeye cooked to perfection | $34.99 | USD |
| Filet Mignon | 8oz tender filet with herb butter | $39.99 | USD |
| Grilled Salmon | Fresh Atlantic salmon with lemon | $27.99 | USD |
| Baked Potato | Loaded with butter, sour cream, and chives | $6.99 | USD |
| Grilled Asparagus | Fresh asparagus with olive oil | $7.99 | USD |
| Lobster Tail | Butter-poached lobster tail | $42.99 | USD |

## 💳 Payment Methods

### Mock Payment Methods

| Label | Provider | Brand | Last 4 | Expiry | Default | Created By |
|-------|----------|-------|--------|--------|---------|------------|
| Mock Visa Card | MOCK | MOCK | 4242 | 12/2025 | ✅ Yes | Nick (ADMIN) |
| Mock Mastercard | MOCK | MOCK | 5555 | 06/2026 | ❌ No | Nick (ADMIN) |

**Note:** All payment methods use the MOCK provider for testing. No real payment processing occurs.

## 🔗 Data Relationships

### Entity Relationship Overview

```
Users (6)
  ├── Orders (created by users)
  │   ├── Order Items (menu items in orders)
  │   └── Payments (payment for orders)
  └── Payment Methods (created by ADMIN users)

Restaurants (6)
  ├── Menu Items (42 total)
  └── Orders (orders from this restaurant)

Countries (2: IN, US)
  ├── Users (assigned to country)
  ├── Restaurants (located in country)
  └── Orders (country-scoped)
```

### Country Distribution

**India (IN):**
- 3 Users (1 ADMIN, 1 MANAGER, 2 MEMBER)
- 3 Restaurants
- 22 Menu Items

**United States (US):**
- 3 Users (1 MANAGER, 1 MEMBER)
- 3 Restaurants
- 21 Menu Items

### Currency by Country

- **India (IN):** INR (Indian Rupees) - Prices in paise (cents)
- **United States (US):** USD (US Dollars) - Prices in cents

**Example:**
- ₹350.00 = 35000 paise (stored as `priceCents: 35000`)
- $12.99 = 1299 cents (stored as `priceCents: 1299`)

## 🌱 Seeding Instructions

### Prerequisites

1. Backend environment variables configured (`.env.local`)
2. PostgreSQL database running
3. Supabase project set up
4. Database migrations applied

### Run Seed Script

```bash
cd backend

# Ensure migrations are applied first
npm run db:migrate

# Run seed script
npm run db:seed
```

### Expected Output

```
🌱 Starting database seed...

Database URL: postgresql://...
Supabase URL: https://...
Default Password: Password123!

=== Seeding Users ===
Creating auth user: Nick (nick@example.com)
✓ Auth user created: Nick with ID xxx
✓ Database user created: Nick (ADMIN, IN)
...
✓ Successfully seeded 6 users

=== Seeding Restaurants ===
Seeding restaurant: Spice Paradise (IN)
✓ Restaurant created: Spice Paradise
✓ Added 7 menu items to Spice Paradise
...
✓ Successfully seeded 6 restaurants with 42 menu items

=== Seeding Payment Methods ===
✓ Payment method created: Mock Visa Card (MOCK ending in 4242)
✓ Payment method created: Mock Mastercard (MOCK ending in 5555)
✓ Successfully seeded 2 payment methods

✅ Database seeding completed successfully!

=== Test Accounts ===
All accounts use password: Password123!

Nick                 | nick@example.com                    | ADMIN      | IN
Captain Marvel       | captain.marvel@example.com          | MANAGER    | IN
Captain America      | captain.america@example.com         | MANAGER    | US
Thanos               | thanos@example.com                  | MEMBER     | IN
Thor                 | thor@example.com                    | MEMBER     | IN
Travis               | travis@example.com                  | MEMBER     | US
```

### Verify Seeded Data

#### Using Drizzle Studio

```bash
cd backend
npm run db:studio
```

Open http://localhost:4983 to visually inspect the database.

#### Using API Endpoints

```bash
# Login as admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nick@example.com","password":"Password123!"}'

# Get restaurants (save token from login)
curl http://localhost:3000/restaurants \
  -H "Authorization: Bearer <your_token>"
```

#### Using Swagger UI

1. Open http://localhost:3000/api/docs
2. Click "Authorize" button
3. Login to get token
4. Use token to test endpoints

## 🔄 Re-seeding Database

To clear and re-seed the database:

```bash
cd backend

# Option 1: Drop and recreate database (PostgreSQL)
dropdb your_database_name
createdb your_database_name

# Option 2: Delete all data manually
# (Use Drizzle Studio or SQL client)

# Apply migrations
npm run db:migrate

# Run seed script
npm run db:seed
```

## 📝 Notes

### Password Security

- All test accounts use the same password: `Password123!`
- This is for testing purposes only
- In production, use strong, unique passwords
- Passwords are hashed by Supabase Auth

### Mock Payment Processing

- Payment methods use MOCK provider
- No real payment APIs are integrated
- All payments succeed unless validation fails
- Useful for testing without payment setup

### Country Scoping

- Non-admin users only see data from their country
- Orders are automatically assigned to user's country
- Currency formatting matches country (INR/USD)

### Data Consistency

- All menu items have `available: true`
- All restaurants have `status: ACTIVE`
- All payment methods have `active: true`
- All users have `isEmailVerified: true`

## 🔗 Related Documentation

- **[Backend README](../README.md)** - Backend setup and configuration
- **[API Documentation](./RBAC_API.md)** - Complete API reference
- **[Seed Script](../scripts/seed.ts)** - Source code for seeding
- **[Architecture Documentation](../../docs/ARCHITECTURE.md)** - System architecture
- **[Quick Start Guide](../../docs/QUICK_START.md)** - Setup guide

---

**Last Updated:** 2024-01-15  
**Seed Script Version:** 1.0.0
