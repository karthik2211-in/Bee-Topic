import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@bt/db";
import { Channels, CreateChannelSchema } from "@bt/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const channelsRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Channels.findMany({
      orderBy: desc(Channels.id),
      limit: 10,
      where: eq(Channels.createdByClerkUserId, ctx.session.userId ?? ""),
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Channels.findFirst({
        where: and(
          eq(Channels.id, input.id),
          eq(Channels.createdByClerkUserId, ctx.session.userId ?? ""),
        ),
      });
    }),

  create: protectedProcedure
    .input(CreateChannelSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Channels).values(input);
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
