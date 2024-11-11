import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, asc, count, desc, eq, gte, ilike, sql } from "@bt/db";
import {
  Chapters,
  CreateChapterSchema,
  UpdateChapterSchema,
  Videos,
} from "@bt/db/schema";

import { protectedProcedure } from "../trpc";
import { getChannelById } from "./channels";

export const ChaptersRouter = {
  all: protectedProcedure
    .input(
      z.object({ channelId: z.string().min(1), query: z.string().nullable() }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          id: Chapters.id,
          title: Chapters.title,
          createdAt: Chapters.createdAt,
          videosCount: sql`count(${Videos.id})`
            .mapWith(Number)
            .as("videosCount"),
        })
        .from(Chapters)
        .leftJoin(Videos, eq(Videos.chapterId, Chapters.id)) // Adjust 'channelId' to the actual foreign key field
        .where(
          input.query
            ? and(
                eq(Chapters.channelId, input.channelId),
                ilike(Chapters.title, `%${input.query}%`),
              )
            : eq(Chapters.channelId, input.channelId),
        )
        .groupBy(Chapters.id)
        .orderBy(asc(Chapters.title));
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chapter = await ctx.db.query.Chapters.findFirst({
        where: eq(Chapters.id, input.id),
      });

      if (!chapter) return null;

      const channel = await getChannelById(chapter.channelId, ctx);
      return {
        ...chapter,
        channel,
      };
    }),

  infinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
        direction: z.enum(["forward", "backward"]), // optional, useful for bi-directional query
      }),
    )
    .input(z.object({ channelId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, channelId } = input;

      if (!channelId)
        throw new TRPCError({
          message: "No channel ID mentioned",
          code: "BAD_REQUEST",
        });

      // console.log("Incoming Cursor", channelId);

      const items = await ctx.db.query.Chapters.findMany({
        orderBy: [asc(Chapters.title)],
        where: cursor
          ? and(eq(Chapters.channelId, channelId), gte(Chapters.title, cursor))
          : eq(Chapters.channelId, channelId),
        limit: limit + 1,
        with: {
          channel: true,
        },
      });

      const mappedItems = await Promise.all(
        items.map(async (chapter) => {
          const data = await ctx.db
            .select({ totalVideos: count(Videos.chapterId) })
            .from(Videos)
            .where(eq(Videos.chapterId, chapter.id))
            .groupBy(Videos.chapterId);
          return {
            totalVideos: data.at(0)?.totalVideos ?? 0,
            ...chapter,
          };
        }),
      );

      let nextCursor: typeof cursor | undefined = undefined;
      if (mappedItems.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.title;
        console.log("Next Cursor", nextCursor);
      }

      return {
        items: mappedItems,
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(CreateChapterSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Chapters).values(input);
    }),

  update: protectedProcedure
    .input(UpdateChapterSchema)
    .mutation(({ ctx, input }) => {
      const { id, channelId, ...values } = input;
      return ctx.db
        .update(Chapters)
        .set(values)
        .where(eq(Chapters.id, id!))
        .returning();
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Chapters).where(eq(Chapters.id, input));
  }),
} satisfies TRPCRouterRecord;
