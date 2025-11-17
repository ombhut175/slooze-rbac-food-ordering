import {
  pgTable,
  pgEnum,
  text,
  uuid,
  timestamp,
  integer,
  boolean,
  char,
  smallint,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users, countryCodeEnum } from './users';
export const restaurantStatusEnum = pgEnum('restaurant_status', [
  'ACTIVE',
  'INACTIVE',
]);
export const orderStatusEnum = pgEnum('order_status', [
  'DRAFT',
  'PENDING',
  'PAID',
  'CANCELED',
]);
export const paymentProviderEnum = pgEnum('payment_provider', [
  'MOCK',
  'STRIPE',
]);
export const paymentStatusEnum = pgEnum('payment_status', [
  'REQUIRES_ACTION',
  'SUCCEEDED',
  'FAILED',
  'CANCELED',
]);

export const restaurants = pgTable(
  'restaurants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    country: countryCodeEnum('country').notNull(),
    status: restaurantStatusEnum('status').notNull().default('ACTIVE'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    countryIdx: index('idx_restaurants_country').on(table.country),
    statusIdx: index('idx_restaurants_status').on(table.status),
  }),
);

export const menuItems = pgTable(
  'menu_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    restaurantId: uuid('restaurant_id')
      .notNull()
      .references(() => restaurants.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    priceCents: integer('price_cents').notNull(),
    currency: char('currency', { length: 3 }).notNull().default('INR'),
    available: boolean('available').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    restaurantIdx: index('idx_menu_items_restaurant').on(table.restaurantId),
    availableIdx: index('idx_menu_items_available').on(table.available),
    priceCentsCheck: sql`CHECK (price_cents >= 0)`,
  }),
);

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    restaurantId: uuid('restaurant_id')
      .notNull()
      .references(() => restaurants.id, { onDelete: 'restrict' }),
    country: countryCodeEnum('country').notNull(),
    status: orderStatusEnum('status').notNull().default('DRAFT'),
    totalAmountCents: integer('total_amount_cents').notNull().default(0),
    currency: char('currency', { length: 3 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index('idx_orders_user').on(table.userId),
    countryIdx: index('idx_orders_country').on(table.country),
    statusIdx: index('idx_orders_status').on(table.status),
    restaurantIdx: index('idx_orders_restaurant').on(table.restaurantId),
    totalAmountCheck: sql`CHECK (total_amount_cents >= 0)`,
  }),
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    menuItemId: uuid('menu_item_id')
      .notNull()
      .references(() => menuItems.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').notNull(),
    unitPriceCents: integer('unit_price_cents').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    orderIdx: index('idx_order_items_order').on(table.orderId),
    uniqueOrderMenuItem: uniqueIndex('uq_order_items_order_menu_item').on(
      table.orderId,
      table.menuItemId,
    ),
    quantityCheck: sql`CHECK (quantity > 0)`,
    unitPriceCheck: sql`CHECK (unit_price_cents >= 0)`,
  }),
);

export const paymentMethods = pgTable(
  'payment_methods',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    provider: paymentProviderEnum('provider').notNull().default('MOCK'),
    label: text('label').notNull(),
    stripePaymentMethodId: text('stripe_payment_method_id'),
    brand: text('brand'),
    last4: text('last4'),
    expMonth: smallint('exp_month'),
    expYear: smallint('exp_year'),
    country: countryCodeEnum('country'),
    active: boolean('active').notNull().default(true),
    isDefault: boolean('is_default').notNull().default(false),
    createdByUserId: uuid('created_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    activeIdx: index('idx_payment_methods_active').on(table.active),
    countryIdx: index('idx_payment_methods_country').on(table.country),
    last4Check: sql`CHECK (length(last4) = 4 OR last4 IS NULL)`,
    expMonthCheck: sql`CHECK (exp_month BETWEEN 1 AND 12 OR exp_month IS NULL)`,
  }),
);

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
      .notNull()
      .unique()
      .references(() => orders.id, { onDelete: 'cascade' }),
    paymentMethodId: uuid('payment_method_id')
      .notNull()
      .references(() => paymentMethods.id, { onDelete: 'restrict' }),
    provider: paymentProviderEnum('provider').notNull(),
    amountCents: integer('amount_cents').notNull(),
    currency: char('currency', { length: 3 }).notNull(),
    status: paymentStatusEnum('status').notNull().default('REQUIRES_ACTION'),
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    errorCode: text('error_code'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index('idx_payments_status').on(table.status),
    orderIdx: index('idx_payments_order').on(table.orderId),
    amountCentsCheck: sql`CHECK (amount_cents >= 0)`,
  }),
);
