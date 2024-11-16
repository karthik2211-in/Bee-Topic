import React from "react";
import { UserButton } from "@clerk/nextjs";

import { ThemeToggle } from "@bt/ui/theme";

import ChannelSwitcher from "./channel-switcher";
import ProgresBarProvider from "./ProgressBarProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProgresBarProvider />
      <main className="flex min-h-screen flex-col">
        <div className="sticky inset-0 z-20 flex flex-col border-b bg-background/90 backdrop-blur-xl">
          <header className="relative flex h-16 items-center justify-between px-4">
            <ChannelSwitcher />
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* <Button size={"icon"} variant={"outline"} className="rounded-full">
              <Bell className="size-5" strokeWidth={1.8} />
              </Button> */}
              <UserButton
                appearance={{
                  elements: { userButtonAvatarBox: "border size-9" },
                }}
              />
            </div>
          </header>
        </div>
        {children}
      </main>
    </>
  );
}
