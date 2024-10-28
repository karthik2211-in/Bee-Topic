import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoutes = createRouteMatcher(["/sign-in"]);

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoutes(request)) await auth.protect();
  },
  { afterSignInUrl: "/" },
);

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
