import React, { Suspense } from "react";
import { Edit2, Trash } from "lucide-react";

import { Button } from "@bt/ui/button";
import { Skeleton } from "@bt/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bt/ui/tabs";

import { api } from "~/trpc/server";
import {
  DeleteChapterDialog,
  EditChapterDialog,
} from "../../../create-chapter";
import { ChapterTabs } from "./chapter-tabs";

async function ChapterDetails({ chapter_id }: { chapter_id: string }) {
  const chapter = await api.chapters.byId({ id: chapter_id });
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold">{chapter?.title}</h1>
      <p className="line-clamp-2 max-w-2xl text-sm text-muted-foreground">
        {chapter?.description}
      </p>
    </div>
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
    <div className="w-full">
      <div className="flex h-28 justify-between p-6">
        <Suspense
          fallback={
            <div className="space-y-1">
              <Skeleton className="h-7 w-64 rounded-full" />
              <Skeleton className="h-2 w-96 rounded-full" />
              <Skeleton className="h-2 w-64 rounded-full" />
            </div>
          }
        >
          <ChapterDetails chapter_id={params.chapter_id} />
        </Suspense>
        <div className="space-x-2">
          <EditChapterDialog chapterId={params.chapter_id}>
            <Button size={"sm"} variant={"outline"}>
              <Edit2 className="size-4" /> Edit
            </Button>
          </EditChapterDialog>
          <DeleteChapterDialog chapterId={params.chapter_id}>
            <Button
              size={"sm"}
              className="text-destructive"
              variant={"outline"}
            >
              <Trash className="size-4" />
              Remove
            </Button>
          </DeleteChapterDialog>
        </div>
      </div>

      <div className="px-6">
        <ChapterTabs />
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
