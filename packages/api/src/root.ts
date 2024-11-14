import { AnalyticsRouter } from "./router/analytics";
import { authRouter } from "./router/auth";
import { channelsRouter } from "./router/channels";
import { ChaptersRouter } from "./router/chapters";
import { subscriptionsRouter } from "./router/subscription";
import { VideosRouter } from "./router/videos";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  channels: channelsRouter,
  chapters: ChaptersRouter,
  videos: VideosRouter,
  subscriptions: subscriptionsRouter,
  analytics: AnalyticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
