import { authRouter } from "./router/auth";
import { channelsRouter } from "./router/channels";
import { ChaptersRouter } from "./router/chapters";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  channels: channelsRouter,
  chapters: ChaptersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
