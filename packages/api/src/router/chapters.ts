import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq, ilike, sql } from "@bt/db";
import {
  Chapters,
  CreateChapterSchema,
  UpdateChapterSchema,
  Videos,
} from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

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
