import { relations, sql } from "drizzle-orm";
import { pgEnum, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const SubscriptionFrequency = pgEnum("subscription_frequency", [
  "monthly",
  "yearly",
]);

export const CollegeCourseType = pgEnum("college_course_type", [
  "puc",
  "diploma",
  "engineering",
]);

export const CouponType = pgEnum("coupon_type", ["open", "restricted"]);

export const Channels = pgTable("channels", (t) => ({
  id: t
    .varchar({ length: 100 })
    .default(sql`CONCAT('bt-chan-', gen_random_uuid())`)
    .primaryKey(),
  createdByClerkUserId: t.text().notNull(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  createdAt: t.timestamp().defaultNow().notNull(),
  isPublished: t.boolean().default(false),
  thumbneilId: t.varchar({ length: 100 }),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const CreateChannelSchema = createInsertSchema(Channels, {
  title: z.string().max(256),
  description: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdByClerkUserId: true,
});

export const UpdateChannelSchema = createInsertSchema(Channels, {
  title: z.string().max(256),
  description: z.string().optional(),
  id: z.string().min(1),
}).omit({
  createdAt: true,
  updatedAt: true,
  createdByClerkUserId: true,
});

export const Chapters = pgTable("chapters", (t) => ({
  id: t
    .varchar({ length: 100 })
    .default(sql`CONCAT('bt-chap-', gen_random_uuid())`)
    .primaryKey(),
  channelId: t
    .varchar({ length: 100 })
    .references(() => Channels.id, {
      onDelete: "cascade",
      onUpdate: "set null",
    })
    .notNull(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const CreateChapterSchema = createInsertSchema(Chapters, {
  title: z.string().max(256),
  description: z.string(),
  channelId: z.string().min(1),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateChapterSchema = createInsertSchema(Chapters, {
  id: z.string().min(1),
  title: z.string().max(256),
  description: z.string(),
  channelId: z.string().min(1),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const Videos = pgTable("videos", (t) => ({
  id: t
    .varchar({ length: 100 })
    .default(sql`CONCAT('bt-video-', gen_random_uuid())`)
    .primaryKey(),
  chapterId: t
    .varchar({ length: 100 })
    .references(() => Chapters.id, {
      onDelete: "cascade",
      onUpdate: "set null",
    })
    .notNull(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  duration: t.real().notNull(),
  ut_fileKey: t.text().notNull(),
  viewCount: t.integer().default(0),
  isPublished: t.boolean().default(false),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().$onUpdate(() => new Date()),
}));

export const VideosAnalytics = pgTable("videos_analytics", (t) => ({
  id: t
    .varchar({ length: 100 })
    .default(sql`CONCAT('bt-vian-', gen_random_uuid())`)
    .primaryKey(),
  videoId: t
    .varchar({ length: 100 })
    .references(() => Videos.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  clerkUserId: t.text().notNull(),
  from: t.real().notNull(),
  to: t.real().notNull(),
  watchedAt: t.timestamp().defaultNow().notNull(),
}));

export const Coupons = pgTable("coupons", (t) => ({
  id: t
    .varchar({ length: 100 })
    .default(sql`CONCAT('bt-coupon-', gen_random_uuid())`)
    .primaryKey(),
  code: t.varchar({ length: 100 }).notNull().unique(),
  description: t.text(),
  subscriptionCount: t.integer().default(1).notNull(),
  subscriptonFrequency: SubscriptionFrequency("subscripiton_frequency").default(
    "monthly",
  ),
  type: CouponType("type").default("open").notNull(),
  maxUsersCountForOpen: t.integer().notNull().default(1),
  channelId: t
    .varchar({ length: 100 })
    .references(() => Channels.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  startsOn: t
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  endsOn: t.timestamp({ mode: "date", withTimezone: true }).notNull(),
  createdAt: t.timestamp({ mode: "date", withTimezone: true }).defaultNow(),
}));

export const CouponEmails = pgTable(
  "coupon_emails",
  (t) => ({
    id: t
      .varchar({ length: 100 })
      .default(sql`CONCAT('bt-coupon-uid-', gen_random_uuid())`)
      .primaryKey(),
    email: t.varchar({ length: 255 }).notNull(),
    couponId: t
      .varchar({ length: 100 })
      .references(() => Coupons.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    updatedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdate(() => new Date()),
    createdAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  }),
  (couponEmails) => ({
    uniqueCouponEmail: uniqueIndex("unique_coupon_email").on(
      couponEmails.couponId,
      couponEmails.email,
    ),
  }),
);

export const Transactions = pgTable("transactions", (t) => ({
  id: t
    .varchar({ length: 100 })
    .default(sql`CONCAT('bt-trans-', gen_random_uuid())`)
    .primaryKey(),
  clerkUserId: t.text().notNull(),
  couponId: t.varchar({ length: 100 }).references(() => Coupons.id, {
    onDelete: "set null",
    onUpdate: "set null",
  }),
  channelId: t
    .varchar({ length: 100 })
    .references(() => Channels.id, {
      onDelete: "set null",
      onUpdate: "set null",
    })
    .notNull(),
  createdAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
}));

export const UserChannelState = pgTable(
  "user_channel_state",
  (t) => ({
    id: t
      .varchar({ length: 100 })
      .default(sql`CONCAT('bt-ucs-', gen_random_uuid())`)
      .primaryKey(),
    clerkUserId: t.text().notNull(),
    channelId: t
      .varchar({ length: 100 })
      .references(() => Channels.id, {
        onDelete: "cascade",
        onUpdate: "set null",
      })
      .notNull(),
    activeChapterId: t.varchar({ length: 100 }).references(() => Chapters.id, {
      onDelete: "cascade",
      onUpdate: "set null",
    }),
    createdAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  }),
  (ucs) => ({
    uniqueUCS: uniqueIndex().on(ucs.clerkUserId, ucs.channelId),
  }),
);

export const Subscriptions = pgTable(
  "subscriptions",
  (t) => ({
    id: t
      .varchar({ length: 100 })
      .default(sql`CONCAT('bt-sub-', gen_random_uuid())`)
      .primaryKey(),
    channelId: t
      .varchar({ length: 100 })
      .references(() => Channels.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    isPaused: t.boolean().default(false),
    clerkUserId: t.text().notNull(),
    startsOn: t
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    endsOn: t.timestamp({ mode: "date", withTimezone: true }).notNull(),
    createdAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  }),
  (subscription) => ({
    uniqueChannelSubscriber: uniqueIndex("unique_channel_subscriber").on(
      subscription.channelId,
      subscription.clerkUserId,
    ),
  }),
);

export const Institutions = pgTable("institutions", (t) => ({
  id: t
    .varchar({ length: 100 })
    .default(sql`CONCAT('bt-ins-', gen_random_uuid())`)
    .primaryKey(),
  name: t.text().notNull().unique(),
  type: CollegeCourseType("type").notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
  createdAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
}));

export const Courses = pgTable("courses", (t) => ({
  id: t
    .varchar({ length: 100 })
    .default(sql`CONCAT('bt-ins-', gen_random_uuid())`)
    .primaryKey(),
  instituionId: t
    .varchar({ length: 100 })
    .notNull()
    .references(() => Institutions.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  name: t.text().notNull().unique(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
  createdAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
}));

//Input Schemas

export const CreateInstitutionSchema = createInsertSchema(Institutions, {
  name: z.string().min(1, "Name is required"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const CreateVideoSchema = createInsertSchema(Videos, {
  title: z.string().max(256),
  description: z.string(),
  ut_fileKey: z.string().min(1, "Required"),
  chapterId: z.string().min(1),
  duration: z.number().min(1),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateVideoSchema = createInsertSchema(Videos, {
  title: z.string().max(256),
  description: z.string(),
  id: z.string().min(1),
}).omit({
  ut_fileKey: true,
  chapterId: true,
  createdAt: true,
  updatedAt: true,
  duration: true,
});

export const CreateVideosAnalytics = createInsertSchema(VideosAnalytics, {
  videoId: z.string().min(1, "Video Id is missing"),
  from: z.number(),
  to: z.number(),
}).omit({
  clerkUserId: true,
  id: true,
  watchedAt: true,
});

export const CreateCouponSchema = createInsertSchema(Coupons, {
  channelId: z.string().min(1, "Channel ID is missing"),
  code: z.string().min(1, "CODE is missing"),
  description: z.string(),
  startsOn: z.date({ required_error: "A starts on date is required" }),
  endsOn: z.date({ required_error: "A ends on date is required" }),
  subscriptionCount: z.number().min(1, "Invalid count"),
  maxUsersCountForOpen: z
    .number({ required_error: "Required", invalid_type_error: "Invalid" })
    .min(1, "Invalid count"),
}).omit({ id: true, channelId: true, createdAt: true });

export const UpdateCouponSchema = createInsertSchema(Coupons, {
  code: z.string().min(1, "CODE is missing"),
  description: z.string(),
  startsOn: z.date({ required_error: "A starts on date is required" }),
  endsOn: z.date({ required_error: "A ends on date is required" }),
  subscriptionCount: z.number().min(1, "Invalid count"),
  id: z.string().min(1, "couponId is missing"),
  maxUsersCountForOpen: z
    .number({ required_error: "Required", invalid_type_error: "Invalid" })
    .min(1, "Invalid count"),
}).omit({ channelId: true });

//Relations
export const ChannelsRelations = relations(Channels, ({ many }) => ({
  chapters: many(Chapters),
  coupons: many(Coupons),
  subscriptions: many(Subscriptions),
}));

export const CouponsRelations = relations(Coupons, ({ one, many }) => ({
  channel: one(Channels, {
    fields: [Coupons.channelId],
    references: [Channels.id],
  }),
  customers: many(CouponEmails),
}));

export const CouponEmailsRelations = relations(CouponEmails, ({ one }) => ({
  coupon: one(Coupons, {
    fields: [CouponEmails.couponId],
    references: [Coupons.id],
  }),
}));

export const SubscriptionsRelations = relations(Subscriptions, ({ one }) => ({
  channel: one(Channels, {
    fields: [Subscriptions.channelId],
    references: [Channels.id],
  }),
}));

export const ChaptersRelations = relations(Chapters, ({ one, many }) => ({
  channel: one(Channels, {
    fields: [Chapters.channelId],
    references: [Channels.id],
  }),
  videos: many(Videos),
}));

export const VideosRelations = relations(Videos, ({ one, many }) => ({
  chapters: one(Chapters, {
    fields: [Videos.chapterId],
    references: [Chapters.id],
  }),
  analytics: many(VideosAnalytics),
}));

export const VideosAnalyticsRelations = relations(
  VideosAnalytics,
  ({ one }) => ({
    video: one(Videos, {
      fields: [VideosAnalytics.videoId],
      references: [Videos.id],
    }),
  }),
);

export const InstitutionsRelations = relations(Institutions, ({ many }) => ({
  courses: many(Courses),
}));

export const CoursesRelations = relations(Courses, ({ one }) => ({
  institution: one(Institutions, {
    fields: [Courses.instituionId],
    references: [Institutions.id],
  }),
}));
