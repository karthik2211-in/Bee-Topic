import type { TRPCRouterRecord } from "@trpc/server";
import { addDays, endOfMonth } from "date-fns";
import { z } from "zod";

import { and, eq } from "@bt/db";
import { Subscriptions } from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const subscriptionsRouter = {
  create: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .mutation((opts) =>
      opts.ctx.db.insert(Subscriptions).values({
        channelId: opts.input.channelId,
        clerkUserId: opts.ctx.session.userId,
        endsOn: addDays(new Date(), 30),
      }),
    ),

  delete: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .mutation((opts) =>
      opts.ctx.db
        .delete(Subscriptions)
        .where(
          and(
            eq(Subscriptions.channelId, opts.input.channelId),
            eq(Subscriptions.clerkUserId, opts.ctx.session.userId),
          ),
        ),
    ),
} satisfies TRPCRouterRecord;
