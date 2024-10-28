"use client";

import React from "react";
import { useParams } from "next/navigation";
import { HashIcon } from "lucide-react";

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
  chapter: RouterOutputs["chapters"]["all"][number];
}) {
  const params = useParams();
  return (
    <Card
      className={cn(
        "flex overflow-hidden rounded-md shadow-none transition-all duration-150 hover:cursor-pointer hover:bg-accent/90 active:scale-[98%]",
        params.chapter_id === chapter.id && "bg-accent/90",
      )}
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
  );
}
