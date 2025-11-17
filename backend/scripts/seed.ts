import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import {
  users,
  restaurants,
  menuItems,
  paymentMethods,
} from '../src/core/database/schema';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const DATABASE_URL = process.env.DATABASE_URL || '';
const DEFAULT_PASSWORD = 'Password123!';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Initialize Database Connection
const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool);

// User data to seed
const usersData = [
  {
    email: 'nick@example.com',
    role: 'ADMIN' as const,
    country: 'IN' as const,
    name: 'Nick',
  },
  {
    email: 'captain.marvel@example.com',
    role: 'MANAGER' as const,
    country: 'IN' as const,
    name: 'Captain Marvel',
  },
  {
    email: 'captain.america@example.com',
    role: 'MANAGER' as const,
    country: 'US' as const,
    name: 'Captain America',
  },
  {
    email: 'thanos@example.com',
    role: 'MEMBER' as const,
    country: 'IN' as const,
    name: 'Thanos',
  },
  {
    email: 'thor@example.com',
    role: 'MEMBER' as const,
    country: 'IN' as const,
    name: 'Thor',
  },
  {
    email: 'travis@example.com',
    role: 'MEMBER' as const,
    country: 'US' as const,
    name: 'Travis',
  },
];

// Restaurant data for India
const restaurantsIN = [
  {
    name: 'Spice Paradise',
    country: 'IN' as const,
    status: 'ACTIVE' as const,
    menuItems: [
      {
        name: 'Butter Chicken',
        description: 'Creamy tomato-based curry with tender chicken',
        priceCents: 35000,
        currency: 'INR',
      },
      {
        name: 'Paneer Tikka Masala',
        description: 'Grilled cottage cheese in rich masala gravy',
        priceCents: 28000,
        currency: 'INR',
      },
      {
        name: 'Biryani',
        description: 'Fragrant basmati rice with spiced meat',
        priceCents: 32000,
        currency: 'INR',
      },
      {
        name: 'Naan Bread',
        description: 'Freshly baked Indian flatbread',
        priceCents: 5000,
        currency: 'INR',
      },
      {
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes',
        priceCents: 8000,
        currency: 'INR',
      },
      {
        name: 'Mango Lassi',
        description: 'Sweet yogurt drink with mango',
        priceCents: 12000,
        currency: 'INR',
      },
      {
        name: 'Dal Makhani',
        description: 'Creamy black lentils slow-cooked overnight',
        priceCents: 22000,
        currency: 'INR',
      },
    ],
  },
  {
    name: 'Mumbai Street Food',
    country: 'IN' as const,
    status: 'ACTIVE' as const,
    menuItems: [
      {
        name: 'Pav Bhaji',
        description: 'Spiced vegetable mash with buttered bread rolls',
        priceCents: 15000,
        currency: 'INR',
      },
      {
        name: 'Vada Pav',
        description: 'Spiced potato fritter in a bread bun',
        priceCents: 8000,
        currency: 'INR',
      },
      {
        name: 'Pani Puri',
        description: 'Crispy shells filled with tangy water',
        priceCents: 10000,
        currency: 'INR',
      },
      {
        name: 'Dosa',
        description: 'Crispy rice crepe with potato filling',
        priceCents: 12000,
        currency: 'INR',
      },
      {
        name: 'Idli Sambar',
        description: 'Steamed rice cakes with lentil soup',
        priceCents: 10000,
        currency: 'INR',
      },
      {
        name: 'Masala Chai',
        description: 'Spiced Indian tea with milk',
        priceCents: 5000,
        currency: 'INR',
      },
      {
        name: 'Bhel Puri',
        description: 'Puffed rice with vegetables and tangy sauce',
        priceCents: 9000,
        currency: 'INR',
      },
      {
        name: 'Chole Bhature',
        description: 'Spiced chickpeas with fried bread',
        priceCents: 18000,
        currency: 'INR',
      },
    ],
  },
  {
    name: 'Tandoor House',
    country: 'IN' as const,
    status: 'ACTIVE' as const,
    menuItems: [
      {
        name: 'Tandoori Chicken',
        description: 'Clay oven roasted chicken with spices',
        priceCents: 38000,
        currency: 'INR',
      },
      {
        name: 'Seekh Kebab',
        description: 'Minced meat skewers grilled in tandoor',
        priceCents: 32000,
        currency: 'INR',
      },
      {
        name: 'Garlic Naan',
        description: 'Naan bread topped with garlic and butter',
        priceCents: 7000,
        currency: 'INR',
      },
      {
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese marinated in spices',
        priceCents: 28000,
        currency: 'INR',
      },
      {
        name: 'Chicken Tikka',
        description: 'Boneless chicken pieces marinated and grilled',
        priceCents: 35000,
        currency: 'INR',
      },
    ],
  },
];

// Restaurant data for United States
const restaurantsUS = [
  {
    name: 'American Diner',
    country: 'US' as const,
    status: 'ACTIVE' as const,
    menuItems: [
      {
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and cheese',
        priceCents: 1299,
        currency: 'USD',
      },
      {
        name: 'French Fries',
        description: 'Crispy golden fries with sea salt',
        priceCents: 499,
        currency: 'USD',
      },
      {
        name: 'Chicken Wings',
        description: 'Buffalo wings with ranch dressing',
        priceCents: 1099,
        currency: 'USD',
      },
      {
        name: 'Caesar Salad',
        description: 'Romaine lettuce with parmesan and croutons',
        priceCents: 899,
        currency: 'USD',
      },
      {
        name: 'Milkshake',
        description: 'Thick and creamy vanilla milkshake',
        priceCents: 599,
        currency: 'USD',
      },
      {
        name: 'Hot Dog',
        description: 'All-beef hot dog with classic toppings',
        priceCents: 699,
        currency: 'USD',
      },
      {
        name: 'Onion Rings',
        description: 'Crispy battered onion rings',
        priceCents: 549,
        currency: 'USD',
      },
    ],
  },
  {
    name: 'Pizza Palace',
    country: 'US' as const,
    status: 'ACTIVE' as const,
    menuItems: [
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato, mozzarella, and basil',
        priceCents: 1499,
        currency: 'USD',
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Loaded with pepperoni and cheese',
        priceCents: 1699,
        currency: 'USD',
      },
      {
        name: 'BBQ Chicken Pizza',
        description: 'Grilled chicken with BBQ sauce and red onions',
        priceCents: 1799,
        currency: 'USD',
      },
      {
        name: 'Veggie Supreme',
        description: 'Loaded with fresh vegetables',
        priceCents: 1599,
        currency: 'USD',
      },
      {
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter',
        priceCents: 599,
        currency: 'USD',
      },
      {
        name: 'Mozzarella Sticks',
        description: 'Breaded mozzarella with marinara sauce',
        priceCents: 799,
        currency: 'USD',
      },
      {
        name: 'Soda',
        description: 'Refreshing soft drink',
        priceCents: 299,
        currency: 'USD',
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert',
        priceCents: 699,
        currency: 'USD',
      },
    ],
  },
  {
    name: 'Steakhouse Grill',
    country: 'US' as const,
    status: 'ACTIVE' as const,
    menuItems: [
      {
        name: 'Ribeye Steak',
        description: '12oz premium ribeye cooked to perfection',
        priceCents: 3499,
        currency: 'USD',
      },
      {
        name: 'Filet Mignon',
        description: '8oz tender filet with herb butter',
        priceCents: 3999,
        currency: 'USD',
      },
      {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon',
        priceCents: 2799,
        currency: 'USD',
      },
      {
        name: 'Baked Potato',
        description: 'Loaded with butter, sour cream, and chives',
        priceCents: 699,
        currency: 'USD',
      },
      {
        name: 'Grilled Asparagus',
        description: 'Fresh asparagus with olive oil',
        priceCents: 799,
        currency: 'USD',
      },
      {
        name: 'Lobster Tail',
        description: 'Butter-poached lobster tail',
        priceCents: 4299,
        currency: 'USD',
      },
    ],
  },
];

async function createAuthUser(
  email: string,
  password: string,
  name: string,
): Promise<string> {
  console.log(`Creating auth user: ${name} (${email})`);

  // Create user in Supabase Auth
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
      },
    });

  if (authError) {
    throw new Error(
      `Failed to create auth user ${email}: ${authError.message}`,
    );
  }

  console.log(`✓ Auth user created: ${name} with ID ${authData.user.id}`);
  return authData.user.id;
}

async function seedUsers() {
  console.log('\n=== Seeding Users ===');

  const userIds: Record<string, string> = {};

  for (const userData of usersData) {
    try {
      // Create user in Supabase Auth
      const authUserId = await createAuthUser(
        userData.email,
        DEFAULT_PASSWORD,
        userData.name,
      );

      // Insert user into public.users table
      const [dbUser] = await db
        .insert(users)
        .values({
          id: authUserId,
          email: userData.email,
          role: userData.role,
          country: userData.country,
          isEmailVerified: true,
        })
        .returning();

      userIds[userData.name] = dbUser.id;
      console.log(
        `✓ Database user created: ${userData.name} (${userData.role}, ${userData.country})`,
      );
    } catch (error) {
      console.error(`✗ Failed to seed user ${userData.name}:`, error);
      throw error;
    }
  }

  console.log(`\n✓ Successfully seeded ${usersData.length} users`);
  return userIds;
}

async function seedRestaurants() {
  console.log('\n=== Seeding Restaurants ===');

  const allRestaurants = [...restaurantsIN, ...restaurantsUS];
  let totalMenuItems = 0;

  for (const restaurantData of allRestaurants) {
    try {
      console.log(
        `\nSeeding restaurant: ${restaurantData.name} (${restaurantData.country})`,
      );

      // Insert restaurant
      const [restaurant] = await db
        .insert(restaurants)
        .values({
          name: restaurantData.name,
          country: restaurantData.country,
          status: restaurantData.status,
        })
        .returning();

      console.log(`✓ Restaurant created: ${restaurant.name}`);

      // Insert menu items
      for (const menuItemData of restaurantData.menuItems) {
        await db.insert(menuItems).values({
          restaurantId: restaurant.id,
          name: menuItemData.name,
          description: menuItemData.description,
          priceCents: menuItemData.priceCents,
          currency: menuItemData.currency,
          available: true,
        });

        totalMenuItems++;
      }

      console.log(
        `✓ Added ${restaurantData.menuItems.length} menu items to ${restaurant.name}`,
      );
    } catch (error) {
      console.error(
        `✗ Failed to seed restaurant ${restaurantData.name}:`,
        error,
      );
      throw error;
    }
  }

  console.log(
    `\n✓ Successfully seeded ${allRestaurants.length} restaurants with ${totalMenuItems} menu items`,
  );
}

async function seedPaymentMethods(userIds: Record<string, string>) {
  console.log('\n=== Seeding Payment Methods ===');

  const nickUserId = userIds.Nick;

  if (!nickUserId) {
    throw new Error('Nick user ID not found. Cannot seed payment methods.');
  }

  const paymentMethodsData = [
    {
      provider: 'MOCK' as const,
      label: 'Mock Visa Card',
      brand: 'MOCK',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      active: true,
      isDefault: true,
      createdByUserId: nickUserId,
    },
    {
      provider: 'MOCK' as const,
      label: 'Mock Mastercard',
      brand: 'MOCK',
      last4: '5555',
      expMonth: 6,
      expYear: 2026,
      active: true,
      isDefault: false,
      createdByUserId: nickUserId,
    },
  ];

  for (const paymentMethodData of paymentMethodsData) {
    try {
      const [paymentMethod] = await db
        .insert(paymentMethods)
        .values(paymentMethodData)
        .returning();

      console.log(
        `✓ Payment method created: ${paymentMethod.label} (${paymentMethod.brand} ending in ${paymentMethod.last4})`,
      );
    } catch (error) {
      console.error(
        `✗ Failed to seed payment method ${paymentMethodData.label}:`,
        error,
      );
      throw error;
    }
  }

  console.log(
    `\n✓ Successfully seeded ${paymentMethodsData.length} payment methods`,
  );
}

async function main() {
  console.log('🌱 Starting database seed...\n');
  console.log(`Database URL: ${DATABASE_URL.substring(0, 30)}...`);
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Default Password: ${DEFAULT_PASSWORD}\n`);

  try {
    // Seed users first
    const userIds = await seedUsers();

    // Seed restaurants and menu items
    await seedRestaurants();

    // Seed payment methods
    await seedPaymentMethods(userIds);

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('=== Test Accounts ===');
    console.log('All accounts use password: Password123!\n');
    usersData.forEach((user) => {
      console.log(
        `${user.name.padEnd(20)} | ${user.email.padEnd(35)} | ${user.role.padEnd(10)} | ${user.country}`,
      );
    });
    console.log('\n');
  } catch (error) {
    console.error('\n❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Database connection closed');
  }
}

void main();
