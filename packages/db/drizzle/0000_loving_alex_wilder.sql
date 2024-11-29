CREATE TYPE "public"."subscription_frequency" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channels" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-chan-', gen_random_uuid()) NOT NULL,
	"created_by_clerk_user_id" text NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_published" boolean DEFAULT false,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chapters" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-chap-', gen_random_uuid()) NOT NULL,
	"channel_id" varchar(100) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-sub-', gen_random_uuid()) NOT NULL,
	"channel_id" varchar(100) NOT NULL,
	"clerk_user_id" text NOT NULL,
	"coupon_id" varchar(100),
	"starts_on" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_on" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videos" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-video-', gen_random_uuid()) NOT NULL,
	"chapter_id" varchar(100) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"duration" real NOT NULL,
	"ut_file_key" text NOT NULL,
	"view_count" integer DEFAULT 0,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videos_analytics" (
	"id" varchar(100) PRIMARY KEY DEFAULT CONCAT('bt-vian-', gen_random_uuid()) NOT NULL,
	"video_id" varchar(100) NOT NULL,
	"clerk_user_id" text NOT NULL,
	"from" real NOT NULL,
	"to" real NOT NULL,
	"watched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapters" ADD CONSTRAINT "chapters_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "videos" ADD CONSTRAINT "videos_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "videos_analytics" ADD CONSTRAINT "videos_analytics_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_coupon_email" ON "coupon_emails" USING btree ("coupon_id","email");