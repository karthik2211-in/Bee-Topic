import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { asc, desc, eq, sql } from "@bt/db";
import { Chapters, CreateChapterSchema, Videos } from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const ChaptersRouter = {
  all: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
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
        .where(eq(Chapters.channelId, input.channelId))
        .groupBy(Chapters.id)
        .orderBy(desc(Chapters.createdAt));
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Chapters.findFirst({
        where: eq(Chapters.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateChapterSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Chapters).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Chapters).where(eq(Chapters.id, input));
  }),
} satisfies TRPCRouterRecord;
