ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'MEMBER' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" "country_code" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_email_verified";