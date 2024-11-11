import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@bt/ui";
import { ThemeProvider } from "@bt/ui/theme";
import { Toaster } from "@bt/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { env } from "~/env";
import { ourFileRouter } from "./api/uploadthing/core";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://beetopic.com"
      : "http://localhost:3000",
  ),
  title: "BeeTopic",
  description: "Where Every Bee Gathers Sweet Knowledge.",
  openGraph: {
    title: "BeeTopic",
    description: "Where Every Bee Gathers Sweet Knowledge.",
    url: "https://beetopic.com",
    siteName: "BeeTopic",
  },
  twitter: {
    card: "summary_large_image",
    site: "https://beetopic.com",
    creator: "@jbportals",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider
          enableColorScheme
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Providers>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <TRPCReactProvider>{props.children}</TRPCReactProvider>

            <Toaster richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
