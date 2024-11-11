"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  BookA,
  Edit2,
  Folder,
  FolderOpen,
  HashIcon,
  MoreVerticalIcon,
  Trash2,
} from "lucide-react";

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
  return (
    <Card
      className={cn(
        "group flex overflow-hidden rounded-md border-0 bg-transparent text-foreground/60 shadow-none transition-all duration-150 hover:cursor-pointer hover:bg-accent",
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
          <CardTitle className="m-0 p-0 text-sm font-medium">
            {chapter.title}
          </CardTitle>
          <CardDescription className="m-0 p-0 font-mono text-[10px]">
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
