# RBAC Food Ordering API Documentation

## Overview

This document provides comprehensive documentation for the RBAC (Role-Based Access Control) Food Ordering API. The API implements country-scoped access control with three user roles: ADMIN, MANAGER, and MEMBER.

## Base URL

```
http://localhost:3000
```

## Authentication

All API endpoints require authentication using a Bearer token in the Authorization header.

### Authentication Header Format

```
Authorization: Bearer <your_supabase_access_token>
```

### Getting an Access Token

1. Sign in using Supabase Auth to obtain an access token
2. Include the token in the Authorization header for all API requests
3. Tokens are validated against Supabase Auth on every request

### Authentication Errors

- **401 Unauthorized**: Missing, invalid, or expired access token
- **403 Forbidden**: Valid token but insufficient permissions for the requested operation

## User Roles

### ADMIN
- Full access to all resources across all countries
- Can create and manage payment methods
- Can checkout and cancel orders
- Sees all restaurants and orders regardless of country

### MANAGER
- Can checkout and cancel orders
- Access restricted to their assigned country
- Sees only restaurants and orders in their country
- Cannot manage payment methods

### MEMBER
- Can browse restaurants and create orders
- Access restricted to their assigned country
- Cannot checkout or cancel orders
- Cannot manage payment methods

## Country Scoping

The system supports two countries:
- **IN** (India)
- **US** (United States)

### Country-Based Access Rules

1. **ADMIN users**: See all data from all countries
2. **MANAGER users**: See only data from their assigned country
3. **MEMBER users**: See only data from their assigned country
4. **Order creation**: Orders are automatically assigned to the user's country

---

## API Endpoints

## Restaurants

### Get All Restaurants

Retrieves a list of restaurants accessible to the authenticated user.

**Endpoint:** `GET /restaurants`

**Authentication:** Required (All roles)

**Access Control:**
- ADMIN: Returns all restaurants from all countries
- MANAGER: Returns only restaurants in user's country
- MEMBER: Returns only restaurants in user's country

**Request Example:**

```bash
curl -X GET http://localhost:3000/restaurants \
  -H "Authorization: Bearer <your_token>"
```

**Response (200 OK):**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Spice Paradise",
    "country": "IN",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "name": "Mumbai Street Food",
    "country": "IN",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
]
```

**Response Fields:**
- `id` (string, uuid): Unique restaurant identifier
- `name` (string): Restaurant name
- `country` (string): Country code (IN or US)
- `status` (string): Restaurant status (ACTIVE or INACTIVE)
- `createdAt` (string, ISO 8601): Creation timestamp
- `updatedAt` (string, ISO 8601): Last update timestamp

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication token

---

### Get Restaurant Menu

Retrieves all available menu items for a specific restaurant.

**Endpoint:** `GET /restaurants/:id/menu`

**Authentication:** Required (All roles)

**Path Parameters:**
- `id` (string, uuid, required): Restaurant ID

**Request Example:**

```bash
curl -X GET http://localhost:3000/restaurants/123e4567-e89b-12d3-a456-426614174000/menu \
  -H "Authorization: Bearer <your_token>"
```

**Response (200 OK):**

```json
[
  {
    "id": "323e4567-e89b-12d3-a456-426614174002",
    "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Butter Chicken",
    "description": "Creamy tomato-based curry with tender chicken",
    "priceCents": 35000,
    "currency": "INR",
    "available": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "423e4567-e89b-12d3-a456-426614174003",
    "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Paneer Tikka Masala",
    "description": "Grilled cottage cheese in rich masala gravy",
    "priceCents": 28000,
    "currency": "INR",
    "available": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Response Fields:**
- `id` (string, uuid): Unique menu item identifier
- `restaurantId` (string, uuid): Restaurant identifier
- `name` (string): Menu item name
- `description` (string, nullable): Item description
- `priceCents` (number): Price in cents (e.g., 35000 = ₹350.00 or $350.00)
- `currency` (string): Currency code (INR or USD)
- `available` (boolean): Whether the item is currently available
- `createdAt` (string, ISO 8601): Creation timestamp
- `updatedAt` (string, ISO 8601): Last update timestamp

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication token
- `404 Not Found`: Restaurant not found

---

## Orders

### Create Order

Creates a new order in DRAFT status. The order country is automatically set to the authenticated user's country.

**Endpoint:** `POST /orders`

**Authentication:** Required (All roles)

**Request Body:**

```json
{
  "restaurantId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Request Body Fields:**
- `restaurantId` (string, uuid, required): ID of the restaurant for this order

**Request Example:**

```bash
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

**Response (201 Created):**

```json
{
  "id": "523e4567-e89b-12d3-a456-426614174004",
  "userId": "623e4567-e89b-12d3-a456-426614174005",
  "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
  "country": "IN",
  "status": "DRAFT",
  "totalAmountCents": 0,
  "currency": "INR",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Response Fields:**
- `id` (string, uuid): Unique order identifier
- `userId` (string, uuid): User who created the order
- `restaurantId` (string, uuid): Restaurant for this order
- `country` (string): Order country (automatically set to user's country)
- `status` (string): Order status (DRAFT, PENDING, PAID, or CANCELED)
- `totalAmountCents` (number): Total order amount in cents
- `currency` (string): Currency code
- `createdAt` (string, ISO 8601): Creation timestamp
- `updatedAt` (string, ISO 8601): Last update timestamp

**Error Responses:**
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing authentication token
- `404 Not Found`: Restaurant not found

---

### Get All Orders

Retrieves orders accessible to the authenticated user.

**Endpoint:** `GET /orders`

**Authentication:** Required (All roles)

**Access Control:**
- ADMIN: Returns all orders from all countries
- MANAGER: Returns only orders in user's country
- MEMBER: Returns only orders in user's country

**Request Example:**

```bash
curl -X GET http://localhost:3000/orders \
  -H "Authorization: Bearer <your_token>"
```

**Response (200 OK):**

```json
[
  {
    "id": "523e4567-e89b-12d3-a456-426614174004",
    "userId": "623e4567-e89b-12d3-a456-426614174005",
    "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
    "country": "IN",
    "status": "DRAFT",
    "totalAmountCents": 63000,
    "currency": "INR",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:05:00.000Z"
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication token

---

### Get Order by ID

Retrieves details of a specific order.

**Endpoint:** `GET /orders/:id`

**Authentication:** Required (All roles)

**Path Parameters:**
- `id` (string, uuid, required): Order ID

**Request Example:**

```bash
curl -X GET http://localhost:3000/orders/523e4567-e89b-12d3-a456-426614174004 \
  -H "Authorization: Bearer <your_token>"
```

**Response (200 OK):**

```json
{
  "id": "523e4567-e89b-12d3-a456-426614174004",
  "userId": "623e4567-e89b-12d3-a456-426614174005",
  "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
  "country": "IN",
  "status": "DRAFT",
  "totalAmountCents": 63000,
  "currency": "INR",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:05:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication token
- `404 Not Found`: Order not found

---

### Add Item to Order

Adds a menu item to a draft order. If the item already exists in the order, updates the quantity. The order total is automatically recalculated.

**Endpoint:** `POST /orders/:id/items`

**Authentication:** Required (All roles)

**Path Parameters:**
- `id` (string, uuid, required): Order ID

**Request Body:**

```json
{
  "menuItemId": "323e4567-e89b-12d3-a456-426614174002",
  "quantity": 2
}
```

**Request Body Fields:**
- `menuItemId` (string, uuid, required): ID of the menu item to add
- `quantity` (number, required): Quantity of the item (minimum: 1)

**Request Example:**

```bash
curl -X POST http://localhost:3000/orders/523e4567-e89b-12d3-a456-426614174004/items \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "menuItemId": "323e4567-e89b-12d3-a456-426614174002",
    "quantity": 2
  }'
```

**Response (201 Created):**

```json
{
  "id": "723e4567-e89b-12d3-a456-426614174006",
  "orderId": "523e4567-e89b-12d3-a456-426614174004",
  "menuItemId": "323e4567-e89b-12d3-a456-426614174002",
  "quantity": 2,
  "unitPriceCents": 35000,
  "createdAt": "2024-01-15T11:05:00.000Z"
}
```

**Response Fields:**
- `id` (string, uuid): Unique order item identifier
- `orderId` (string, uuid): Order identifier
- `menuItemId` (string, uuid): Menu item identifier
- `quantity` (number): Item quantity
- `unitPriceCents` (number): Price per unit in cents (captured at time of addition)
- `createdAt` (string, ISO 8601): Creation timestamp

**Error Responses:**
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing authentication token
- `404 Not Found`: Order or menu item not found
- `422 Unprocessable Entity`: Order is not in DRAFT status, menu item not available, or menu item does not belong to order's restaurant

---

### Remove Item from Order

Removes an item from a draft order. The order total is automatically recalculated.

**Endpoint:** `DELETE /orders/:id/items/:itemId`

**Authentication:** Required (All roles)

**Path Parameters:**
- `id` (string, uuid, required): Order ID
- `itemId` (string, uuid, required): Order item ID

**Request Example:**

```bash
curl -X DELETE http://localhost:3000/orders/523e4567-e89b-12d3-a456-426614174004/items/723e4567-e89b-12d3-a456-426614174006 \
  -H "Authorization: Bearer <your_token>"
```

**Response (200 OK):**

```
(Empty response body)
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication token
- `404 Not Found`: Order or order item not found
- `422 Unprocessable Entity`: Order is not in DRAFT status

---

### Checkout Order

Processes payment for an order and updates the status to PAID. Only ADMIN and MANAGER roles can checkout orders.

**Endpoint:** `POST /orders/:id/checkout`

**Authentication:** Required (ADMIN or MANAGER only)

**Path Parameters:**
- `id` (string, uuid, required): Order ID

**Request Body:**

```json
{
  "paymentMethodId": "823e4567-e89b-12d3-a456-426614174007"
}
```

**Request Body Fields:**
- `paymentMethodId` (string, uuid, required): ID of the payment method to use

**Request Example:**

```bash
curl -X POST http://localhost:3000/orders/523e4567-e89b-12d3-a456-426614174004/checkout \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethodId": "823e4567-e89b-12d3-a456-426614174007"
  }'
```

**Response (200 OK):**

```json
{
  "id": "523e4567-e89b-12d3-a456-426614174004",
  "userId": "623e4567-e89b-12d3-a456-426614174005",
  "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
  "country": "IN",
  "status": "PAID",
  "totalAmountCents": 63000,
  "currency": "INR",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:10:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: User does not have ADMIN or MANAGER role
- `404 Not Found`: Order or payment method not found
- `422 Unprocessable Entity`: Order status is not valid for checkout, order is empty, or payment processing failed

---

### Cancel Order

Cancels an order and its associated payment. Only ADMIN and MANAGER roles can cancel orders.

**Endpoint:** `POST /orders/:id/cancel`

**Authentication:** Required (ADMIN or MANAGER only)

**Path Parameters:**
- `id` (string, uuid, required): Order ID

**Request Example:**

```bash
curl -X POST http://localhost:3000/orders/523e4567-e89b-12d3-a456-426614174004/cancel \
  -H "Authorization: Bearer <your_token>"
```

**Response (200 OK):**

```json
{
  "id": "523e4567-e89b-12d3-a456-426614174004",
  "userId": "623e4567-e89b-12d3-a456-426614174005",
  "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
  "country": "IN",
  "status": "CANCELED",
  "totalAmountCents": 63000,
  "currency": "INR",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:15:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: User does not have ADMIN or MANAGER role
- `404 Not Found`: Order not found

---

## Payment Methods

### Get All Payment Methods

Retrieves all active payment methods. Accessible to all authenticated users.

**Endpoint:** `GET /payment-methods`

**Authentication:** Required (All roles)

**Request Example:**

```bash
curl -X GET http://localhost:3000/payment-methods \
  -H "Authorization: Bearer <your_token>"
```

**Response (200 OK):**

```json
[
  {
    "id": "823e4567-e89b-12d3-a456-426614174007",
    "provider": "MOCK",
    "label": "Mock Visa Card",
    "brand": "MOCK",
    "last4": "4242",
    "expMonth": 12,
    "expYear": 2025,
    "country": null,
    "active": true,
    "isDefault": true,
    "createdByUserId": "623e4567-e89b-12d3-a456-426614174005",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  {
    "id": "923e4567-e89b-12d3-a456-426614174008",
    "provider": "MOCK",
    "label": "Mock Mastercard",
    "brand": "MOCK",
    "last4": "5555",
    "expMonth": 6,
    "expYear": 2026,
    "country": null,
    "active": true,
    "isDefault": false,
    "createdByUserId": "623e4567-e89b-12d3-a456-426614174005",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

**Response Fields:**
- `id` (string, uuid): Unique payment method identifier
- `provider` (string): Payment provider (MOCK or STRIPE)
- `label` (string): Display label for the payment method
- `brand` (string, nullable): Card brand
- `last4` (string, nullable): Last 4 digits of card
- `expMonth` (number, nullable): Expiration month (1-12)
- `expYear` (number, nullable): Expiration year
- `country` (string, nullable): Country code (IN or US)
- `active` (boolean): Whether the payment method is active
- `isDefault` (boolean): Whether this is the default payment method
- `createdByUserId` (string, uuid): User who created the payment method
- `createdAt` (string, ISO 8601): Creation timestamp
- `updatedAt` (string, ISO 8601): Last update timestamp

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication token

---

### Create Payment Method

Creates a new payment method with MOCK provider. Only ADMIN users can create payment methods.

**Endpoint:** `POST /payment-methods`

**Authentication:** Required (ADMIN only)

**Request Body:**

```json
{
  "label": "Primary Card",
  "brand": "MOCK",
  "last4": "4242",
  "expMonth": 12,
  "expYear": 2025,
  "country": "IN",
  "isDefault": false
}
```

**Request Body Fields:**
- `label` (string, required): Display label for the payment method
- `brand` (string, optional): Card brand (auto-generated as MOCK if not provided)
- `last4` (string, optional): Last 4 digits of card (auto-generated if not provided, must be exactly 4 characters)
- `expMonth` (number, optional): Expiration month (1-12)
- `expYear` (number, optional): Expiration year (minimum: 2024)
- `country` (string, optional): Country code (IN or US)
- `isDefault` (boolean, optional): Whether this should be the default payment method (default: false)

**Request Example:**

```bash
curl -X POST http://localhost:3000/payment-methods \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Primary Card",
    "expMonth": 12,
    "expYear": 2025,
    "country": "IN",
    "isDefault": false
  }'
```

**Response (201 Created):**

```json
{
  "id": "a23e4567-e89b-12d3-a456-426614174009",
  "provider": "MOCK",
  "label": "Primary Card",
  "brand": "MOCK",
  "last4": "1234",
  "expMonth": 12,
  "expYear": 2025,
  "country": "IN",
  "active": true,
  "isDefault": false,
  "createdByUserId": "623e4567-e89b-12d3-a456-426614174005",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: User does not have ADMIN role

---

### Update Payment Method

Updates an existing payment method. Only ADMIN users can update payment methods.

**Endpoint:** `PATCH /payment-methods/:id`

**Authentication:** Required (ADMIN only)

**Path Parameters:**
- `id` (string, uuid, required): Payment method ID

**Request Body:**

```json
{
  "label": "Updated Card Label",
  "active": true,
  "isDefault": true
}
```

**Request Body Fields (all optional):**
- `label` (string): Display label for the payment method
- `active` (boolean): Whether the payment method is active
- `isDefault` (boolean): Whether this should be the default payment method

**Request Example:**

```bash
curl -X PATCH http://localhost:3000/payment-methods/823e4567-e89b-12d3-a456-426614174007 \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Updated Card Label",
    "isDefault": true
  }'
```

**Response (200 OK):**

```json
{
  "id": "823e4567-e89b-12d3-a456-426614174007",
  "provider": "MOCK",
  "label": "Updated Card Label",
  "brand": "MOCK",
  "last4": "4242",
  "expMonth": 12,
  "expYear": 2025,
  "country": null,
  "active": true,
  "isDefault": true,
  "createdByUserId": "623e4567-e89b-12d3-a456-426614174005",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T12:05:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: User does not have ADMIN role
- `404 Not Found`: Payment method not found

---

## Error Response Format

All error responses follow a consistent format:

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "path": "/orders"
}
```

**Error Response Fields:**
- `statusCode` (number): HTTP status code
- `message` (string): Error message
- `error` (string, optional): Error type
- `timestamp` (string, ISO 8601): Error timestamp
- `path` (string): Request path that caused the error

## Common HTTP Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or validation error
- `401 Unauthorized`: Missing, invalid, or expired authentication token
- `403 Forbidden`: Valid authentication but insufficient permissions
- `404 Not Found`: Requested resource not found
- `422 Unprocessable Entity`: Business logic error (e.g., invalid order state)
- `500 Internal Server Error`: Server error

---

## Testing with cURL

### Complete Order Flow Example

```bash
# 1. Get restaurants
curl -X GET http://localhost:3000/restaurants \
  -H "Authorization: Bearer <your_token>"

# 2. Get menu for a restaurant
curl -X GET http://localhost:3000/restaurants/<restaurant_id>/menu \
  -H "Authorization: Bearer <your_token>"

# 3. Create a new order
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId": "<restaurant_id>"}'

# 4. Add items to the order
curl -X POST http://localhost:3000/orders/<order_id>/items \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"menuItemId": "<menu_item_id>", "quantity": 2}'

# 5. Get payment methods
curl -X GET http://localhost:3000/payment-methods \
  -H "Authorization: Bearer <your_token>"

# 6. Checkout the order (ADMIN/MANAGER only)
curl -X POST http://localhost:3000/orders/<order_id>/checkout \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethodId": "<payment_method_id>"}'
```

---

## Swagger/OpenAPI Documentation

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

The Swagger UI provides:
- Interactive API testing
- Request/response schemas
- Authentication configuration
- Example payloads
- Error response documentation

---

## Notes

### Mock Payment Processing

- The system uses a MOCK payment provider for testing
- No external payment APIs are integrated
- All payment processing is simulated in the database
- Payment methods are stored with provider='MOCK'
- Payments always succeed unless there's a validation error

### Currency Handling

- All monetary amounts are stored in cents (e.g., 35000 = ₹350.00 or $350.00)
- India (IN) uses INR currency
- United States (US) uses USD currency
- Currency is automatically set based on the restaurant's country

### Order Status Flow

```
DRAFT → PENDING → PAID
  ↓
CANCELED
```

- **DRAFT**: Order is being built, items can be added/removed
- **PENDING**: Order is ready for checkout (currently not used in implementation)
- **PAID**: Order has been successfully paid
- **CANCELED**: Order has been canceled

### Payment Status Flow

```
REQUIRES_ACTION → SUCCEEDED
                → FAILED
                → CANCELED
```

- **REQUIRES_ACTION**: Payment requires additional action (not used in MOCK provider)
- **SUCCEEDED**: Payment completed successfully
- **FAILED**: Payment failed
- **CANCELED**: Payment was canceled

---

## Support

For issues or questions about the API, please refer to:
- Main README.md for setup instructions
- Swagger documentation at `/api/docs`
- Backend source code in `backend/src/`
