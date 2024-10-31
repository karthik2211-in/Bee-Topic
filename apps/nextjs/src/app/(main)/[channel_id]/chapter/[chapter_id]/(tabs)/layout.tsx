import React from "react";
import { Edit2, Trash } from "lucide-react";

import { Button } from "@bt/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bt/ui/tabs";

import { api } from "~/trpc/server";
import {
  DeleteChapterDialog,
  EditChapterDialog,
} from "../../../create-chapter";
import { ChapterTabs } from "./chapter-tabs";

export default async function ChannelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { channel_id: string; chapter_id: string };
}) {
  const chapter = await api.chapters.byId({ id: params.chapter_id });
  return (
    <div className="w-full">
      <div className="flex justify-between p-6">
        <div>
          <h1 className="text-3xl font-bold">{chapter?.title}</h1>
          <p className="text-sm text-muted-foreground">
            {chapter?.description}
          </p>
        </div>
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
