import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@bt/db";
import { Coupons, CraeteCouponSchema, UpdateCouponSchema } from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const couponsRouter = {
  all: protectedProcedure
    .input(z.object({ channelId: z.string().min(1, "No channelID") }))
    .query((opts) =>
      opts.ctx.db.query.Coupons.findMany({
        where: eq(Coupons.channelId, opts.input.channelId),
      }),
    ),
  create: protectedProcedure
    .input(CraeteCouponSchema)
    .mutation((opts) => opts.ctx.db.insert(Coupons).values(opts.input)),

  update: protectedProcedure.input(UpdateCouponSchema).mutation((opts) =>
    opts.ctx.db
      .update(Coupons)
      .set(opts.input)
      .where(eq(Coupons.id, opts.input.id ?? ""))
      .returning(),
  ),

  delete: protectedProcedure
    .input(z.object({ couponId: z.string().min(1) }))
    .mutation((opts) =>
      opts.ctx.db
        .delete(Coupons)
        .where(and(eq(Coupons.id, opts.input.couponId))),
    ),
} satisfies TRPCRouterRecord;
