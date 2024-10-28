import { authRouter } from "./router/auth";
import { channelsRouter } from "./router/channels";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  channels: channelsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
