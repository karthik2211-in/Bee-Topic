import type { TRPCRouterRecord } from "@trpc/server";
import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  intervalToDuration,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { z } from "zod";

import { and, between, eq, sql } from "@bt/db";
import { CreateVideosAnalytics, VideosAnalytics } from "@bt/db/schema";

import { protectedProcedure } from "../trpc";

export const analyticsRouter = {
  create: protectedProcedure
    .input(CreateVideosAnalytics)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(VideosAnalytics)
        .values({ ...input, clerkUserId: ctx.session.userId });
    }),

  getVideoWatchTime: protectedProcedure
    .input(
      z.object({
        videoId: z.string().min(1),

        range: z.enum(["month", "week"]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const start =
        input.range === "month"
          ? startOfMonth(new Date())
          : startOfWeek(new Date());
      const end =
        input.range === "month"
          ? endOfMonth(new Date())
          : endOfWeek(new Date());
      const segments = await ctx.db
        .select({
          from: VideosAnalytics.from,
          to: VideosAnalytics.to,
        })
        .from(VideosAnalytics)
        .where(eq(VideosAnalytics.videoId, input.videoId))
        .orderBy(VideosAnalytics.from);

      const rows = await Promise.all(
        eachDayOfInterval({ start, end }).map(async (date) => {
          const analytics = await ctx.db
            .select({
              from: VideosAnalytics.from,
              to: VideosAnalytics.to,
            })
            .from(VideosAnalytics)
            .where(
              and(
                eq(VideosAnalytics.videoId, input.videoId),
                between(
                  VideosAnalytics.watchedAt,
                  startOfDay(date),
                  endOfDay(date),
                ),
              ),
            )
            .orderBy(VideosAnalytics.from);
          // Calculate total watch time by summing each analytics for day duration
          const totalWatchTime = analytics.reduce((sum, segment) => {
            return sum + (Math.floor(segment.to) - Math.floor(segment.from));
          }, 0);

          return {
            date,
            watchtime: totalWatchTime
              ? (totalWatchTime / 60).toPrecision(2)
              : undefined,
          };
        }),
      );

      // Calculate total watch time by summing each segment duration
      const totalWatchTime = segments.reduce((sum, segment) => {
        return sum + (Math.floor(segment.to) - Math.floor(segment.from));
      }, 0);

      return {
        totalWatchTime: (totalWatchTime / 60).toPrecision(2),
        rows,
      };
    }),
} satisfies TRPCRouterRecord;
