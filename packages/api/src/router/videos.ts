import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { asc, eq } from "@bt/db";
import { CreateVideoSchema, Videos } from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const VideosRouter = {
  all: protectedProcedure
    .input(z.object({ chapterId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Videos.findMany({
        orderBy: asc(Videos.createdAt),
        limit: 10,
        where: eq(Videos.chapterId, input.chapterId),
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

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Videos).where(eq(Videos.id, input));
  }),
} satisfies TRPCRouterRecord;
