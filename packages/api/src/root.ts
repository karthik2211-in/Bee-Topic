import { analyticsRouter } from "./router/analytics";
import { authRouter } from "./router/auth";
import { channelsRouter } from "./router/channels";
import { ChaptersRouter } from "./router/chapters";
import { couponsRouter } from "./router/coupons";
import { institutionsRouter } from "./router/institutions";
// import { paymentsRouter } from "./router/payments";
import { subscriptionsRouter } from "./router/subscriptions";
import { VideosRouter } from "./router/videos";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  channels: channelsRouter,
  chapters: ChaptersRouter,
  videos: VideosRouter,
  subscriptions: subscriptionsRouter,
  analytics: analyticsRouter,
  // payments: paymentsRouter,
  coupons: couponsRouter,
  institutions: institutionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
