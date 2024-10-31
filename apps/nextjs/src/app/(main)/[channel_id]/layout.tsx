import React from "react";
import { Plus } from "lucide-react";

import { Button } from "@bt/ui/button";
import { TooltipProvider } from "@bt/ui/tooltip";

import { ChaptersList } from "./chapter-list-client";
import { CreateChapterDialog } from "./create-chapter";
import SearchChapter from "./search-chapter";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
  params: { channel_id: string; chapter_id: string };
}) {
  return (
    <main className="z-10 flex flex-1">
      <TooltipProvider>
        <aside
          style={{ marginTop: -64, paddingTop: 64 }}
          className="sticky inset-0 hidden h-screen w-60 flex-shrink-0 flex-col gap-3 border-r bg-secondary/25 p-2 backdrop-blur-xl lg:flex 2xl:w-72"
        >
          <nav className="shadow-overflow relative flex w-full flex-col gap-3 overflow-y-auto overflow-x-hidden px-3 py-3 lg:pr-0">
            <p className="text-sm text-muted-foreground">All chapters</p>
            <div className="flex gap-2">
              <SearchChapter />
              <CreateChapterDialog>
                <Button
                  size={"icon"}
                  className="size-8 w-10"
                  variant={"secondary"}
                >
                  <Plus className="size-5" />
                </Button>
              </CreateChapterDialog>
            </div>

            <ChaptersList />
          </nav>
        </aside>
        <div className="w-full min-w-0">{children}</div>
      </TooltipProvider>
    </main>
  );
}
