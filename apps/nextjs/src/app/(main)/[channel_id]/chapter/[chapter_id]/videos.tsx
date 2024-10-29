"use client";

import { useParams } from "next/navigation";
import { PlayCircleIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bt/ui/card";
import { Skeleton } from "@bt/ui/skeleton";

import { api } from "~/trpc/react";

export function Videos() {
  const params = useParams();
  console.log(params);
  const { data: videos, isLoading } = api.videos.all.useQuery({
    chapterId: params.chapter_id as string,
  });

  if (isLoading)
    return (
      <div className="grid grid-cols-4 gap-3 py-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton className="h-64 w-full rounded-md" key={index} />
        ))}
      </div>
    );

  if (videos?.length === 0)
    return (
      <section
        aria-label="Channels Empty"
        className="flex flex-col items-center gap-3 py-40"
      >
        <PlayCircleIcon className="size-10" strokeWidth={1.25} />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          No Videos
        </h4>
        <p className="w-1/3 text-center text-sm text-muted-foreground">
          Start adding videos by clicking on new video. Share your meaning full
          knowledge with bees 🐝
        </p>
      </section>
    );

  return (
    <div className="grid grid-cols-4 gap-3 py-4">
      {videos?.map((video) => (
        <Card className="w-full overflow-hidden rounded-md">
          <CardContent className="flex h-44 items-center justify-center bg-primary/20 p-0">
            <PlayCircleIcon className="size-10" />
          </CardContent>
          <CardHeader className="p-4">
            <CardTitle className="text-base">{video.title}</CardTitle>
            <CardDescription className="text-xs">
              20 min • 20k views • 1 min ago
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
