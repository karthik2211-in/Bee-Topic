import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, asc, count, desc, eq, gte, ilike, sql } from "@bt/db";
import {
  Channels,
  Chapters,
  CreateChannelSchema,
  UpdateChannelSchema,
  Videos,
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
          chapters: {
            limit: 4,
          },
        },
      });

      const channelsWithTotalChapters = await Promise.all(
        items.map(async (channelItem) => {
          //find the chapters count
          const item = await ctx.db
            .select({ totalChapters: count(Chapters.channelId) })
            .from(Chapters)
            .where(eq(Chapters.channelId, channelItem.id))
            .groupBy(Chapters.channelId);

          //find videos count
          const chapters = await Promise.all(
            channelItem.chapters.map(async (chapter) => {
              const chapterItem = await ctx.db
                .select({ totalVideos: count(Videos.chapterId) })
                .from(Videos)
                .where(eq(Videos.chapterId, chapter.id))
                .groupBy(Videos.chapterId);

              return {
                ...chapter,
                totalVideos: chapterItem.at(0)?.totalVideos ?? 0,
              };
            }),
          );

          return {
            ...channelItem,
            chapters,
            totalChapters: item?.at(0)?.totalChapters ?? 0,
          };
        }),
      );

      let nextCursor: typeof cursor | undefined = undefined;
      if (channelsWithTotalChapters.length > limit) {
        const nextItem = channelsWithTotalChapters.pop();
        nextCursor = nextItem!.createdAt;
        console.log("Next Cursor", nextCursor);
      }

      return {
        items: channelsWithTotalChapters,
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
