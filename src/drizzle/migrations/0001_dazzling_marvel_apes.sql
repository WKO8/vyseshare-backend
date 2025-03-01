ALTER TABLE "users" ADD COLUMN "recovery_token" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "recovery_token_expiry" timestamp;