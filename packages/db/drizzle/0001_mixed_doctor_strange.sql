CREATE TYPE "public"."college_course_type" AS ENUM('puc', 'diploma', 'engineering');--> statement-breakpoint
CREATE TYPE "public"."coupon_type" AS ENUM('open', 'restricted');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-ins-', gen_random_uuid()) NOT NULL,
	"instituion_id" varchar(100) NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "courses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "institutions" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-ins-', gen_random_uuid()) NOT NULL,
	"name" text NOT NULL,
	"type" "college_course_type" NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "institutions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-trans-', gen_random_uuid()) NOT NULL,
	"clerk_user_id" text NOT NULL,
	"coupon_id" varchar(100),
	"channel_id" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_channel_state" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-ucs-', gen_random_uuid()) NOT NULL,
	"clerk_user_id" text NOT NULL,
	"channel_id" varchar(100) NOT NULL,
	"active_chapter_id" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_coupon_id_coupons_id_fk";
--> statement-breakpoint
ALTER TABLE "coupons" ALTER COLUMN "subscription_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "channels" ADD COLUMN "thumbneil_id" varchar(100);--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "type" "coupon_type" DEFAULT 'open' NOT NULL;--> statement-breakpoint
ALTER TABLE "coupons" ADD COLUMN "max_users_count_for_open" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "is_paused" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_instituion_id_institutions_id_fk" FOREIGN KEY ("instituion_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE set null ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE set null ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_channel_state" ADD CONSTRAINT "user_channel_state_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_channel_state" ADD CONSTRAINT "user_channel_state_active_chapter_id_chapters_id_fk" FOREIGN KEY ("active_chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_channel_state_clerk_user_id_channel_id_index" ON "user_channel_state" USING btree ("clerk_user_id","channel_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_channel_subscriber" ON "subscriptions" USING btree ("channel_id","clerk_user_id");--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "coupon_id";