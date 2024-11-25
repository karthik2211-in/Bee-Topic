import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const paymentsRouter = {
  createOrder: protectedProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.pg.orders.create({
        amount: input.amount,
        currency: "INR",
        customer_id: ctx.session.userId,
      });
    }),

  createSubscription: protectedProcedure
    .input(
      z.object({
        plan_id: z.string(),
        total_count: z.number(),
        channel_id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.pg.subscriptions.create({
        plan_id: input.plan_id,
        total_count: input.total_count,
        notes: {
          channel_id: input.channel_id,
        },
      });
    }),
} satisfies TRPCRouterRecord;
