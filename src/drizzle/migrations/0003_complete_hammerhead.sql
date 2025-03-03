ALTER TABLE "files" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "url" text NOT NULL;