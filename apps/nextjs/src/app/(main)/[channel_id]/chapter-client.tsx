"use client";

import { useParams } from "next/navigation";
import { Folder, FolderOpen } from "lucide-react";

import { RouterOutputs } from "@bt/api";
import { cn } from "@bt/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bt/ui/card";

export default function ChapterItem({
  chapter,
}: {
  chapter: RouterOutputs["chapters"]["all"]["data"][0];
}) {
  const params = useParams();
  return (
    <Card
      className={cn(
        "group flex overflow-hidden rounded-md border-0 bg-transparent text-foreground/60 shadow-none transition-all duration-150 hover:cursor-pointer hover:bg-accent hover:text-foreground",
        params.chapter_id === chapter.id && "bg-accent text-foreground",
      )}
    >
      <CardContent className="flex size-12 items-center justify-center bg-transparent p-2">
        {params.chapter_id === chapter.id ? (
          <FolderOpen className="size-5 text-foreground" />
        ) : (
          <Folder className="size-5 text-foreground/60" />
        )}
      </CardContent>
      <CardHeader className="flex w-full flex-row items-center justify-between gap-1 space-y-0 p-0 px-2">
        <div>
          <CardTitle className="m-0 max-w-full truncate p-0 text-sm font-medium">
            {chapter.title}
          </CardTitle>
          <CardDescription className="m-0 p-0 font-mono text-[10px]">
            {chapter.videosCount} videos
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
