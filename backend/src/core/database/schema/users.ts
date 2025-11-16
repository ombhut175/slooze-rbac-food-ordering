import { pgTable, text, timestamp, uuid, pgEnum, boolean } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'ADMIN',
  'MANAGER',
  'MEMBER',
]);

export const countryCodeEnum = pgEnum('country_code', ['IN', 'US']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').notNull().default('MEMBER'),
  country: countryCodeEnum('country').notNull().default('IN'),
  isEmailVerified: boolean('is_email_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
