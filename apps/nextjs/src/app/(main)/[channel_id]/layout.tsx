import React from "react";

import { TooltipProvider } from "@bt/ui/tooltip";

import SideBarContent from "./sidebar-content";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <main className="z-10 flex flex-1">
      <TooltipProvider>
        <aside
          style={{ marginTop: -65, paddingTop: 65 }}
          className="sticky inset-0 hidden h-screen w-60 flex-shrink-0 flex-col gap-3 border-r bg-background p-2 backdrop-blur-xl lg:flex 2xl:w-72"
        >
          <nav className="shadow-overflow relative flex w-full flex-col gap-3 overflow-y-auto overflow-x-hidden px-3 py-3">
            <SideBarContent />
          </nav>
        </aside>
        <div className="w-full min-w-0 px-10 py-5">{children}</div>
      </TooltipProvider>
    </main>
  );
}
