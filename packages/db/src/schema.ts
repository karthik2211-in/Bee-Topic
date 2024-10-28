import { sql } from "drizzle-orm";
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
