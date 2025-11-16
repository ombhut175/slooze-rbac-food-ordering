ALTER TABLE "users" ALTER COLUMN "country" SET DEFAULT 'IN';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_email_verified" boolean DEFAULT false NOT NULL;