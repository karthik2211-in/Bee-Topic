import type { TRPCRouterRecord } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { addDays, addMonths, addYears, endOfDay } from "date-fns";
import { z } from "zod";

import { and, eq, lte, sql } from "@bt/db";
import {
  CouponEmails,
  Coupons,
  Subscriptions,
  Transactions,
} from "@bt/db/schema";

import { protectedProcedure } from "../trpc";
import { getChannelById } from "./channels";

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

  getSubscribers: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .mutation((opts) => {
      return opts.ctx.db.transaction(async (tx) => {
        const subscribers = await tx.query.Subscriptions.findMany({
          where: eq(Subscriptions.channelId, opts.input.channelId),
        });
        const clerk = await clerkClient();
        return Promise.all(
          subscribers.map(async (subscriber) => {
            const user = await clerk.users.getUser(subscriber.clerkUserId);
            const subscriberWithExtra = await getChannelById({
              channelId: opts.input.channelId,
              ctx: opts.ctx,
            });
            return {
              ...subscriber,
              email: user.primaryEmailAddress?.emailAddress,
              imageUrl: user.imageUrl,
              fullName: user.fullName,
              ...subscriberWithExtra,
              subscribedAt: subscriber.createdAt,
            };
          }),
        );
      });
    }),

  delete: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .mutation((opts) =>
      opts.ctx.db
        .update(Subscriptions)
        .set({ isPaused: true })
        .where(
          and(
            eq(Subscriptions.channelId, opts.input.channelId),
            eq(Subscriptions.clerkUserId, opts.ctx.session.userId),
          ),
        ),
    ),

  validateCouponAndCreate: protectedProcedure
    .input(
      z.object({ coupon: z.string().min(1), channelId: z.string().min(1) }),
    )
    .mutation(async (opts) => {
      /* Validate code against UserID and channelID */
      const coupon = await opts.ctx.db.query.Coupons.findFirst({
        where: and(
          eq(Coupons.code, opts.input.coupon),
          eq(Coupons.channelId, opts.input.channelId),
        ),
      });

      if (!coupon)
        throw new TRPCError({ code: "BAD_REQUEST", message: "code not valid" });

      /* Check for expiration */
      if (endOfDay(new Date(Date.now())) >= endOfDay(coupon.endsOn))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "code is not valid anymore, expired",
        });

      const client = await clerkClient();
      const user = await client.users.getUser(opts.ctx.session.userId);

      /* Check for coupon reuse for same user*/
      const transaction = await opts.ctx.db.query.Transactions.findFirst({
        where: and(
          eq(Transactions.couponId, coupon.id),
          eq(Transactions.clerkUserId, user.id),
        ),
      });

      if (transaction)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Code already used for subscription",
        });

      if (coupon.type === "open") {
        /* Check for excemption of usage of open token */
        const aggr = await opts.ctx.db
          .select({
            totalTransaction: sql`count(*)`
              .mapWith(Number)
              .as("totalTransaction"),
          })
          .from(Transactions)
          .where(eq(Transactions.couponId, coupon.id))
          .groupBy(Transactions.couponId);
        const numberOfTransactions = aggr.at(0)?.totalTransaction;

        if (
          numberOfTransactions &&
          numberOfTransactions >= coupon.maxUsersCountForOpen
        )
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "coupon reaced maximum limit",
          });
      } else {
        /* Check for valid user */
        const couponEmail = await opts.ctx.db.query.CouponEmails.findFirst({
          where: and(
            eq(CouponEmails.couponId, coupon.id),
            eq(
              CouponEmails.email,
              user.primaryEmailAddress?.emailAddress ?? "",
            ),
          ),
        });

        if (!couponEmail)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "unauthorize for this coupon code",
          });
      }

      /**Create Subscription */
      const endOfSubscription =
        coupon.subscriptonFrequency === "monthly"
          ? endOfDay(addMonths(new Date(Date.now()), coupon.subscriptionCount))
          : endOfDay(addYears(new Date(Date.now()), coupon.subscriptionCount));
      const subscriptionTransaction = await opts.ctx.db.transaction(
        async (tx) => {
          await tx.insert(Transactions).values({
            channelId: opts.input.channelId,
            clerkUserId: user.id,
            couponId: coupon.id,
          });

          const subscription = await tx
            .insert(Subscriptions)
            .values({
              channelId: opts.input.channelId,
              clerkUserId: user.id,
              startsOn: new Date(Date.now()),
              endsOn: endOfSubscription,
            })
            .onConflictDoUpdate({
              set: {
                startsOn: new Date(Date.now()),
                endsOn: endOfSubscription,
                isPaused: false,
              },
              target: [Subscriptions.clerkUserId, Subscriptions.channelId],
            });

          return subscription;
        },
      );
      return {
        coupon,
      };
    }),
} satisfies TRPCRouterRecord;
