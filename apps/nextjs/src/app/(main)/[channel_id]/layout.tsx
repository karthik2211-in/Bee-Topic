import React, { Suspense } from "react";
import { HashIcon, Plus, Search } from "lucide-react";

import { Button } from "@bt/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bt/ui/card";
import { Input } from "@bt/ui/input";
import { Skeleton } from "@bt/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bt/ui/tooltip";

import { api } from "~/trpc/server";
import { CreateChapterButton } from "./create-chapter";

async function ChaptersList({ channelId }: { channelId: string }) {
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
    <div className="flex w-full flex-col gap-2">
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          className="flex overflow-hidden rounded-md shadow-none hover:cursor-pointer hover:bg-accent/90"
        >
          <CardContent className="flex size-12 items-center justify-center border-r bg-primary/20 p-2">
            <HashIcon />
          </CardContent>
          <CardHeader className="flex flex-col justify-center gap-1 space-y-0 p-0 px-2">
            <CardTitle className="m-0 p-0 text-sm font-medium">
              {chapter.title}
            </CardTitle>
            <CardDescription className="m-0 p-0 font-mono text-xs">
              0 videos
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default function ChannelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { channel_id: string };
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
              <ChaptersList channelId={params.channel_id} />
            </Suspense>
          </nav>
        </aside>
        <div className="w-full min-w-0">{children}</div>
      </TooltipProvider>
    </main>
  );
}
