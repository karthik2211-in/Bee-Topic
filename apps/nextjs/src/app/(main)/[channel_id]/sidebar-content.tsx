"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2Icon,
  GemIcon,
  LineChartIcon,
  Plus,
  Router,
  Settings,
  TicketPercent,
} from "lucide-react";

import { cn } from "@bt/ui";
import { Button } from "@bt/ui/button";
import { Separator } from "@bt/ui/separator";

import { api } from "~/trpc/react";
import { ChaptersList } from "./chapter-list-client";
import { CreateChapterDialog } from "./create-chapter";
import SearchChapter from "./search-chapter";

export default function SideBarContent() {
  const params = useParams();
  const videoId = params.video_id;
  const pathname = usePathname();
  const { data } = api.videos.byId.useQuery(
    { video_id: videoId as string },
    { enabled: !!videoId },
  );

  if (pathname.startsWith(`/${params.channel_id}/settings`))
    return (
      <>
        <Link href={`/${params.channel_id}`}>
          <Button
            size={"lg"}
            variant={"ghost"}
            className="w-full justify-start gap-4 px-3 text-sm"
          >
            <ArrowLeft strokeWidth={1.25} />
            Channel Content
          </Button>
        </Link>
        <div className="py-1">
          <div className="text-base font-semibold">Channel Settings</div>
        </div>
        <div className="flex w-full flex-col space-y-2">
          <Link href={`/${params.channel_id}/settings`}>
            <Button
              variant={"ghost"}
              className={cn(
                "h-11 w-full justify-start gap-6 px-4 text-sm text-foreground/70",
                pathname === `/${params.channel_id}/settings` &&
                  "bg-accent text-foreground",
              )}
            >
              <Edit2Icon strokeWidth={1.25} className="size-5" />
              Details
            </Button>
          </Link>
          <Link href={`/${params.channel_id}/settings/coupons`}>
            <Button
              variant={"ghost"}
              className={cn(
                "h-11 w-full justify-start gap-6 px-4 text-sm text-foreground/70",
                pathname === `/${params.channel_id}/settings/coupons` &&
                  "bg-accent text-foreground",
              )}
            >
              <TicketPercent strokeWidth={1.25} className="size-5" />
              Coupons
            </Button>
          </Link>
          <Link href={`/${params.channel_id}/settings/subscriptions`}>
            <Button
              variant={"ghost"}
              className={cn(
                "h-11 w-full justify-start gap-6 px-4 text-sm text-foreground/70",
                pathname === `/${params.channel_id}/settings/subscriptions` &&
                  "bg-accent text-foreground",
              )}
            >
              <GemIcon strokeWidth={1.25} className="size-5" />
              Subscriptions
            </Button>
          </Link>
        </div>
      </>
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
      <Link href={`/${params.channel_id}/settings`}>
        <Button
          size={"lg"}
          variant={"ghost"}
          className="w-full justify-start gap-4 px-3 text-sm"
        >
          <Settings className="size-5" strokeWidth={1.25} />
          Channel Settings
        </Button>
      </Link>
      <Separator />
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
