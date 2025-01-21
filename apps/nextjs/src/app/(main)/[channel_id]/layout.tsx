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
    <main className="relative z-10 flex flex-1">
      <TooltipProvider>
        <aside
          style={{ marginTop: -65, paddingTop: 65 }}
          className="sticky inset-0 z-20 h-screen w-60 flex-shrink-0 flex-col gap-3 border-r bg-background p-2 backdrop-blur-xl"
        >
          <nav className="shadow-overflow relative flex w-full flex-col gap-3 overflow-y-auto overflow-x-hidden px-3 py-3">
            <SideBarContent />
          </nav>
        </aside>
        <div
          id="settings-section"
          style={{ transform: "translateZ(0)" }}
          className="pointer-events-auto fixed inset-0 z-10 h-full w-full flex-1 overflow-hidden pl-72 pt-16"
        >
          <div className="h-full min-h-full w-full flex-1 overflow-y-auto px-10 py-6">
            {children}
          </div>
        </div>
      </TooltipProvider>
    </main>
  );
}
