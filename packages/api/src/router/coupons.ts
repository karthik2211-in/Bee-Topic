import type { TRPCRouterRecord } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@bt/db";
import {
  CouponEmails,
  Coupons,
  CreateCouponSchema,
  UpdateCouponSchema,
} from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const couponsRouter = {
  all: protectedProcedure
    .input(z.object({ channelId: z.string().min(1, "No channelID") }))
    .query((opts) =>
      opts.ctx.db.query.Coupons.findMany({
        where: eq(Coupons.channelId, opts.input.channelId),
        orderBy: desc(Coupons.createdAt),
      }),
    ),
  addEmail: protectedProcedure
    .input(z.object({ email: z.string().email(), couponId: z.string().min(1) }))
    .mutation((opts) =>
      opts.ctx.db
        .insert(CouponEmails)
        .values({ email: opts.input.email, couponId: opts.input.couponId }),
    ),
  byId: protectedProcedure
    .input(z.object({ couponId: z.string().min(1, "No channelID") }))
    .query(async (opts) => {
      const coupon = await opts.ctx.db.query.Coupons.findFirst({
        where: eq(Coupons.id, opts.input.couponId),
        with: {
          channel: true,
          customers: {
            orderBy: desc(CouponEmails.createdAt),
          },
        },
      });

      if (!coupon)
        throw new TRPCError({ message: "No coupon found", code: "NOT_FOUND" });

      const client = await clerkClient();
      const mappedCustomersResponse = await Promise.all(
        coupon.customers.map(async (customer) => {
          const clerk_user = (
            await client.users.getUserList({ emailAddress: [customer.email] })
          ).data.at(0);

          return {
            ...customer,
            imageUrl: clerk_user?.imageUrl,
            fullName: clerk_user?.fullName,
          };
        }),
      );

      return {
        ...coupon,
        customers: mappedCustomersResponse,
      };
    }),
  create: protectedProcedure
    .input(
      CreateCouponSchema.and(
        z.object({ channelId: z.string().min(1, "channelId is Missing") }),
      ),
    )
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
