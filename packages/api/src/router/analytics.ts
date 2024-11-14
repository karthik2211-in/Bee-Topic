import type { TRPCRouterRecord } from "@trpc/server";

import { CreateVideosAnalytics, VideosAnalytics } from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const AnalyticsRouter = {
  create: protectedProcedure
    .input(CreateVideosAnalytics)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(VideosAnalytics)
        .values({ ...input, clerkUserId: ctx.session.userId });
    }),
} satisfies TRPCRouterRecord;
