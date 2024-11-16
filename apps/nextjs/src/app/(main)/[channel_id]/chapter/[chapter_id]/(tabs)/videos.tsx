"use client";

import React from "react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  formatDistance,
  formatDistanceStrict,
  formatDistanceToNow,
  formatDistanceToNowStrict,
} from "date-fns";
import { PlayCircleIcon, SearchXIcon } from "lucide-react";

import { Badge } from "@bt/ui/badge";
import { Button } from "@bt/ui/button";
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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const videoQuery = searchParams.get("video");
  const { data: videos, isLoading } = api.videos.all.useQuery(
    {
      chapterId: params.chapter_id as string,
      query: videoQuery,
    },
    { queryHash: `${params.chapter_id}-${videoQuery}` },
  );

  const deleteQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name, value);

      return params.toString();
    },
    [searchParams],
  );

  function formatDuration(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // Format the result based on duration length
    if (hrs > 0) {
      // Format as "H:MM:SS"
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    } else {
      // Format as "M:SS"
      return `${mins}:${String(secs).padStart(2, "0")}`;
    }
  }

  if (isLoading)
    return (
      <div className="grid grid-cols-4 gap-3 py-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton className="h-64 w-full rounded-md" key={index} />
        ))}
      </div>
    );

  if (videos?.length === 0 && videoQuery)
    return (
      <section
        aria-label="Channels Empty"
        className="flex flex-col items-center gap-3 py-40"
      >
        <SearchXIcon className="size-10" strokeWidth={1.25} />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          No Results
        </h4>
        <p className="w-1/3 text-center text-sm text-muted-foreground">
          No videos exists in this title `{videoQuery}`
        </p>
        <Button
          onClick={() =>
            router.push(pathname + "?" + deleteQueryString("video", videoQuery))
          }
          variant={"link"}
          className="text-indigo-600"
        >
          Clear search
        </Button>
      </section>
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
        <Link
          href={`/${video.chapters.channel.id}/chapter/${video.chapterId}/v/${video.id}`}
        >
          <Card className="w-full overflow-hidden rounded-md hover:bg-accent active:scale-[98%]">
            <CardContent className="relative flex h-44 items-center justify-center border-b bg-primary/5 p-0">
              <PlayCircleIcon className="size-10 text-primary/60" />
              <Badge className="absolute bottom-3 right-3 bg-black/50 font-normal text-white shadow-none hover:bg-black/50">
                {formatDuration(video.duration)}
              </Badge>
            </CardContent>
            <CardHeader className="p-4">
              <CardTitle className="truncate text-base">
                {video.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {formatViewCount(video.viewCount ?? 0)} views •{" "}
                {formatDistanceToNowStrict(video.createdAt, {
                  addSuffix: true,
                })}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function formatViewCount(number: number) {
  if (number >= 1_000_000_000) {
    return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return number.toString();
}
