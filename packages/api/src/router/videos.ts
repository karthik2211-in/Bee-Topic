import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, asc, eq, gte, ilike } from "@bt/db";
import { CreateVideoSchema, UpdateVideoSchema, Videos } from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const VideosRouter = {
  all: protectedProcedure
    .input(
      z.object({
        chapterId: z.string().min(1),
        query: z.string().nullable().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.Videos.findMany({
        orderBy: asc(Videos.title),
        limit: 10,
        where: input.query
          ? and(
              eq(Videos.chapterId, input.chapterId),
              ilike(Videos.title, `%${input.query}%`),
            )
          : eq(Videos.chapterId, input.chapterId),
        with: {
          chapters: {
            columns: {
              id: true,
            },
            with: {
              channel: {
                columns: {
                  id: true,
                },
              },
            },
          },
        },
      });
    }),

  infinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
        direction: z.enum(["forward", "backward"]), // optional, useful for bi-directional query
      }),
    )
    .input(z.object({ chapterId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, chapterId } = input;

      if (!chapterId)
        throw new TRPCError({
          message: "No chapter ID mentioned",
          code: "BAD_REQUEST",
        });

      console.log("Incoming Cursor", chapterId);

      const items = await ctx.db.query.Videos.findMany({
        orderBy: [asc(Videos.title)],
        where: cursor
          ? and(eq(Videos.chapterId, chapterId), gte(Videos.title, cursor))
          : eq(Videos.chapterId, chapterId),
        limit: limit + 1,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.title;
        console.log("Next Cursor", nextCursor);
      }

      return {
        items,
        nextCursor,
      };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Videos.findFirst({
        where: eq(Videos.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateVideoSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Videos).values(input);
    }),

  update: protectedProcedure
    .input(UpdateVideoSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...values } = input;
      return ctx.db
        .update(Videos)
        .set(values)
        .where(eq(Videos.id, id!))
        .returning();
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Videos).where(eq(Videos.id, input));
  }),
} satisfies TRPCRouterRecord;
