import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Plus, Search } from "lucide-react";

import { Button } from "@bt/ui/button";
import { Input } from "@bt/ui/input";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="z-10 flex flex-1">
      <aside
        style={{ marginTop: -64, paddingTop: 64 }}
        className="sticky inset-0 hidden h-screen w-60 flex-shrink-0 flex-col gap-3 border-r bg-secondary/25 p-2 backdrop-blur-xl lg:flex 2xl:w-64"
      >
        <nav className="shadow-overflow relative flex w-full flex-col gap-3 overflow-y-auto overflow-x-hidden px-3 py-3 lg:pr-0">
          <p className="text-sm text-muted-foreground">All chapters</p>
          <div className="flex gap-2">
            <div className="relative flex w-full items-center">
              <Search className="absolute ml-2.5 mr-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Search chapter..." className="h-8 ps-8" />
            </div>
            <Button size={"icon"} className="size-8 w-10" variant={"secondary"}>
              <Plus className="size-5" />
            </Button>
          </div>
        </nav>
      </aside>
      <div className="w-full min-w-0">{children}</div>
    </main>
  );
}
