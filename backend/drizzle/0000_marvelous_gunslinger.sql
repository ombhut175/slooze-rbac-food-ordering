CREATE TYPE "public"."country_code" AS ENUM('IN', 'US');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('DRAFT', 'PENDING', 'PAID', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('MOCK', 'STRIPE');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('REQUIRES_ACTION', 'SUCCEEDED', 'FAILED', 'CANCELED');--> statement-breakpoint
CREATE TYPE "public"."restaurant_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'MANAGER', 'MEMBER');--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price_cents" integer NOT NULL,
	"currency" char(3) DEFAULT 'INR' NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"menu_item_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price_cents" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"country" "country_code" NOT NULL,
	"status" "order_status" DEFAULT 'DRAFT' NOT NULL,
	"total_amount_cents" integer DEFAULT 0 NOT NULL,
	"currency" char(3) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" "payment_provider" DEFAULT 'MOCK' NOT NULL,
	"label" text NOT NULL,
	"stripe_payment_method_id" text,
	"brand" text,
	"last4" text,
	"exp_month" smallint,
	"exp_year" smallint,
	"country" "country_code",
	"active" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"payment_method_id" uuid NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" char(3) NOT NULL,
	"status" "payment_status" DEFAULT 'REQUIRES_ACTION' NOT NULL,
	"stripe_payment_intent_id" text,
	"error_code" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"country" "country_code" NOT NULL,
	"status" "restaurant_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_checking" (
	"id" serial PRIMARY KEY NOT NULL,
	"service" text NOT NULL,
	"status" text NOT NULL,
	"message" text,
	"details" jsonb,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_menu_items_restaurant" ON "menu_items" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "idx_menu_items_available" ON "menu_items" USING btree ("available");--> statement-breakpoint
CREATE INDEX "idx_order_items_order" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_order_items_order_menu_item" ON "order_items" USING btree ("order_id","menu_item_id");--> statement-breakpoint
CREATE INDEX "idx_orders_user" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_orders_country" ON "orders" USING btree ("country");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_orders_restaurant" ON "orders" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "idx_payment_methods_active" ON "payment_methods" USING btree ("active");--> statement-breakpoint
CREATE INDEX "idx_payment_methods_country" ON "payment_methods" USING btree ("country");--> statement-breakpoint
CREATE INDEX "idx_payments_status" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_payments_order" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_restaurants_country" ON "restaurants" USING btree ("country");--> statement-breakpoint
CREATE INDEX "idx_restaurants_status" ON "restaurants" USING btree ("status");