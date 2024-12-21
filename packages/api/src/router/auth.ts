import type { TRPCRouterRecord } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  signOut: protectedProcedure.mutation(async (opts) => {
    if (!opts.ctx.session.userId) {
      return { success: false };
    }
    return { success: true };
  }),
  getUsersList: protectedProcedure.query(async () => {
    const client = await clerkClient();
    const users = await client.users.getUserList();

    return users.data;
  }),
  updatePublicMetaData: protectedProcedure
    .input(z.object({ institutionName: z.string(), course: z.string() }))
    .mutation(async (opts) => {
      const client = await clerkClient();
      const user = await client.users.updateUserMetadata(
        opts.ctx.session.userId,
        {
          publicMetadata: {
            ...opts.input,
            onBoardingCompleted: true,
          },
        },
      );

      return user;
    }),
} satisfies TRPCRouterRecord;
