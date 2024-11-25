import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const Channels = pgTable("channels", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  createdByClerkUserId: t.text().notNull(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  createdAt: t.timestamp().defaultNow().notNull(),
  isPublished: t.boolean().default(false),
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
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  channelId: t
    .uuid()
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
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  chapterId: t
    .uuid()
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
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  videoId: t
    .uuid()
    .references(() => Videos.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  clerkUserId: t.text().notNull(),
  from: t.real().notNull(),
  to: t.real().notNull(),
  watchedAt: t.timestamp().defaultNow().notNull(),
}));

export const Subscriptions = pgTable("subscriptions", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  channelId: t
    .uuid()
    .references(() => Channels.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  clerkUserId: t.text().notNull(),
}));

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

//Relations
export const ChannelsRelations = relations(Channels, ({ many }) => ({
  chapters: many(Chapters),
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
