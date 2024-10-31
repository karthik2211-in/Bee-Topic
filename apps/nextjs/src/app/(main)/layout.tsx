import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";

import { Button } from "@bt/ui/button";
import { ThemeToggle } from "@bt/ui/theme";

import ChannelSwitcher from "./channel-switcher";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="sticky inset-0 z-20 flex flex-col border-b bg-secondary/25 backdrop-blur-xl">
        <header className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href={"/"}>
              <h4 className="font-mono text-xl font-semibold">🐝BeeTopic</h4>
            </Link>
            <ChannelSwitcher />
          </div>
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
  );
}
