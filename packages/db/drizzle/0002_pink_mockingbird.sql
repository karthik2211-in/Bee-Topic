CREATE TYPE "public"."subscription_frequency" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupon_emails" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-coupon-uid-', gen_random_uuid()) NOT NULL,
	"email" varchar(255) NOT NULL,
	"coupon_id" varchar(100) NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupons" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-coupon-', gen_random_uuid()) NOT NULL,
	"code" varchar(100) NOT NULL,
	"description" text,
	"subscription_count" integer DEFAULT 1,
	"subscripiton_frequency" "subscription_frequency" DEFAULT 'monthly',
	"channel_id" varchar(100) NOT NULL,
	"starts_on" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_on" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "channels" ALTER COLUMN "id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "channels" ALTER COLUMN "id" SET DEFAULT CONCAT('bt-chan-', gen_random_uuid());--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "id" SET DEFAULT CONCAT('bt-chap-', gen_random_uuid());--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "channel_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "id" SET DEFAULT CONCAT('bt-sub-', gen_random_uuid());--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "channel_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "id" SET DEFAULT CONCAT('bt-video-', gen_random_uuid());--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "chapter_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "videos_analytics" ALTER COLUMN "id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "videos_analytics" ALTER COLUMN "id" SET DEFAULT CONCAT('bt-vian-', gen_random_uuid());--> statement-breakpoint
ALTER TABLE "videos_analytics" ALTER COLUMN "video_id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "channels" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "channels" ADD COLUMN "is_published" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "coupon_id" varchar(100);--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "starts_on" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "ends_on" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coupon_emails" ADD CONSTRAINT "coupon_emails_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coupons" ADD CONSTRAINT "coupons_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_coupon_email" ON "coupon_emails" USING btree ("coupon_id","email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
