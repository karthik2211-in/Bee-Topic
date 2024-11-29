import type { TRPCRouterRecord } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";

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
} satisfies TRPCRouterRecord;
