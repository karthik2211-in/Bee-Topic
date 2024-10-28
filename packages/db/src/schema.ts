import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const Channels = pgTable("channels", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  createdByClerkUserId: t.text().notNull(),
  title: t.varchar({ length: 256 }).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreateChannelSchema = createInsertSchema(Channels, {
  title: z.string().max(256),
}).omit({
  id: true,
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
  updatedAt: t.timestamp().$onUpdateFn(() => sql`now()`),
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

//Relations
export const ChannelsRelations = relations(Channels, ({ many }) => ({
  chapters: many(Chapters),
}));

export const ChaptersRelations = relations(Chapters, ({ one }) => ({
  channel: one(Channels, {
    fields: [Chapters.channelId],
    references: [Channels.id],
  }),
}));
