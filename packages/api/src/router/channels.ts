import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, asc, desc, eq, gt, gte, ilike, lt, lte, sql } from "@bt/db";
import {
  Channels,
  Chapters,
  CreateChannelSchema,
  UpdateChannelSchema,
} from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const channelsRouter = {
  all: protectedProcedure
    .input(z.object({ query: z.string().nullable() }).optional())
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          id: Channels.id,
          title: Channels.title,
          createdAt: Channels.createdAt,
          chapterCount: sql`count(${Chapters.id})`
            .mapWith(Number)
            .as("chapterCount"),
        })
        .from(Channels)
        .leftJoin(Chapters, eq(Chapters.channelId, Channels.id)) // Adjust 'channelId' to the actual foreign key field
        .where(
          input?.query
            ? and(
                eq(Channels.createdByClerkUserId, ctx.session.userId),
                ilike(Channels.title, `%${input.query}%`),
              )
            : eq(Channels.createdByClerkUserId, ctx.session.userId),
        )
        .groupBy(Channels.id)
        .orderBy(desc(Channels.createdAt));
    }),

  infinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.date().nullish(), // <-- "cursor" needs to exist, but can be any type
        direction: z.enum(["forward", "backward"]), // optional, useful for bi-directional query
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      console.log("Incoming Cursor", cursor);

      const items = await ctx.db.query.Channels.findMany({
        orderBy: [asc(Channels.createdAt)],
        where: cursor ? gte(Channels.createdAt, cursor) : undefined,
        limit: limit + 1,
        with: {
          chapters: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.createdAt;
        console.log("Next Cursor", nextCursor);
      }

      console.log("items", items.length, items);

      return {
        items,
        nextCursor,
      };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Channels.findFirst({
        where: and(
          eq(Channels.id, input.id),
          eq(Channels.createdByClerkUserId, ctx.session.userId),
        ),
      });
    }),

  create: protectedProcedure
    .input(CreateChannelSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(Channels)
        .values({ ...input, createdByClerkUserId: ctx.session.userId });
    }),

  update: protectedProcedure
    .input(UpdateChannelSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...values } = input;
      return ctx.db
        .update(Channels)
        .set(values)
        .where(eq(Channels.id, id!))
        .returning();
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Channels)
      .where(
        and(
          eq(Channels.id, input),
          eq(Channels.createdByClerkUserId, ctx.session.userId ?? ""),
        ),
      );
  }),
} satisfies TRPCRouterRecord;
