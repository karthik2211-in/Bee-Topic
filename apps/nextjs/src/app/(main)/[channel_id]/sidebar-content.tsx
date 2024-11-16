"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2Icon,
  LineChartIcon,
  Plus,
  Router,
} from "lucide-react";

import { cn } from "@bt/ui";
import { Button } from "@bt/ui/button";

import { api } from "~/trpc/react";
import { ChaptersList } from "./chapter-list-client";
import { CreateChapterDialog } from "./create-chapter";
import SearchChapter from "./search-chapter";

export default function SideBarContent() {
  const params = useParams();
  const videoId = params.video_id;
  const pathname = usePathname();
  const { data } = api.videos.byId.useQuery(
    { id: videoId as string },
    { enabled: !!videoId },
  );

  if (videoId)
    return (
      <>
        <Link href={`/${params.channel_id}/chapter/${params.chapter_id}`}>
          <Button
            size={"lg"}
            variant={"ghost"}
            className="h-11 w-full justify-start gap-6 px-3 text-sm"
          >
            <ArrowLeft strokeWidth={1.25} />
            Chapter content
          </Button>
        </Link>
        <div className="py-1">
          <div className="text-base font-semibold">Your Video</div>
          <p className="truncate text-sm text-muted-foreground">
            {data?.title ?? "..."}
          </p>
        </div>
        <div className="flex w-full flex-col space-y-2">
          <Link
            href={`/${params.channel_id}/chapter/${params.chapter_id}/v/${params.video_id}`}
          >
            <Button
              variant={"ghost"}
              className={cn(
                "h-11 w-full justify-start gap-6 px-4 text-sm text-foreground/70",
                pathname ===
                  `/${params.channel_id}/chapter/${params.chapter_id}/v/${params.video_id}` &&
                  "bg-accent text-foreground",
              )}
            >
              <Edit2Icon strokeWidth={1.25} className="size-5" />
              Details
            </Button>
          </Link>
          <Link
            href={`/${params.channel_id}/chapter/${params.chapter_id}/v/${params.video_id}/analytics`}
          >
            <Button
              variant={"ghost"}
              className={cn(
                "h-11 w-full justify-start gap-6 px-4 text-sm text-foreground/70",
                pathname ===
                  `/${params.channel_id}/chapter/${params.chapter_id}/v/${params.video_id}/analytics` &&
                  "bg-accent text-foreground",
              )}
            >
              <LineChartIcon strokeWidth={1.25} className="size-5" />
              Analytics
            </Button>
          </Link>
        </div>
      </>
    );

  return (
    <>
      <p className="text-sm font-semibold">CHAPTERS</p>
      <div className="flex gap-2">
        <SearchChapter />
        <CreateChapterDialog>
          <Button size={"icon"} className="size-8 w-10" variant={"secondary"}>
            <Plus className="size-5" />
          </Button>
        </CreateChapterDialog>
      </div>

      <ChaptersList />
    </>
  );
}
