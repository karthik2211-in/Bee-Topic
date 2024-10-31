"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Edit2, HashIcon, MoreVerticalIcon, Trash2 } from "lucide-react";

import { RouterOutputs } from "@bt/api";
import { cn } from "@bt/ui";
import { Button } from "@bt/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bt/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@bt/ui/dropdown-menu";

import { EditChapterDialog } from "./create-chapter";

export default function ChapterItem({
  chapter,
}: {
  chapter: RouterOutputs["chapters"]["all"][number];
}) {
  const params = useParams();
  const [open, onChangeOpen] = useState(false);
  return (
    <Card
      className={cn(
        "group flex overflow-hidden rounded-md shadow-none transition-all duration-150 hover:cursor-pointer hover:bg-accent/30",
        params.chapter_id === chapter.id && "bg-accent/30",
      )}
    >
      <CardContent className="flex size-12 items-center justify-center border-r bg-primary/20 p-2">
        <HashIcon strokeWidth={1} />
      </CardContent>
      <CardHeader className="flex w-full flex-row items-center justify-between gap-1 space-y-0 p-0 px-2">
        <div>
          <CardTitle className="m-0 p-0 text-sm font-medium">
            {chapter.title}
          </CardTitle>
          <CardDescription className="m-0 p-0 font-mono text-xs">
            {chapter.videosCount} videos
          </CardDescription>
        </div>

        {/* <DropdownMenu key={chapter.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="size-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-[150px]">
            <EditChapterDialog chapterId={chapter.id}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit2 className="mr-2 size-4" /> Edit
              </DropdownMenuItem>
            </EditChapterDialog>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </CardHeader>
    </Card>
  );
}
