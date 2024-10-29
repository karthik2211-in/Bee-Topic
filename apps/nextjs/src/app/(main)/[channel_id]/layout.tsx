import React, { Suspense } from "react";
import Link from "next/link";
import { HashIcon, Search } from "lucide-react";

import { Input } from "@bt/ui/input";
import { Skeleton } from "@bt/ui/skeleton";
import { TooltipProvider } from "@bt/ui/tooltip";

import { api, HydrateClient } from "~/trpc/server";
import ChapterItem from "./chapter-client";
import { CreateChapterButton } from "./create-chapter";

async function ChaptersList({
  channelId,
}: {
  channelId: string;
  chapterId: string;
}) {
  const chapters = await api.chapters.all({ channelId });

  if (chapters.length === 0)
    return (
      <div className="mt-28 flex flex-col items-center gap-2 px-3">
        <HashIcon className="size-8" strokeWidth={1.25} />
        <div className="text-center text-base font-semibold">No chapters</div>
        <p className="text-center text-xs text-muted-foreground">
          Create chapter to add videos by clicking on above plus icon
        </p>
      </div>
    );

  return (
    <HydrateClient>
      <div className="flex w-full flex-col gap-2">
        {chapters.map((chapter) => (
          <Link key={chapter.id} href={`/${channelId}/chapter/${chapter.id}`}>
            <ChapterItem chapter={chapter} />
          </Link>
        ))}
      </div>
    </HydrateClient>
  );
}

export default function ChannelLayout({
  children,
  params,
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
              <div className="relative flex w-full items-center">
                <Search className="absolute ml-2.5 mr-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Search chapter..." className="h-8 ps-8" />
              </div>
              <CreateChapterButton />
            </div>

            <Suspense
              fallback={
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton className="h-9 w-full rounded-md" />
                  ))}
                </div>
              }
            >
              <ChaptersList
                channelId={params.channel_id}
                chapterId={params.chapter_id}
              />
            </Suspense>
          </nav>
        </aside>
        <div className="w-full min-w-0">{children}</div>
      </TooltipProvider>
    </main>
  );
}
