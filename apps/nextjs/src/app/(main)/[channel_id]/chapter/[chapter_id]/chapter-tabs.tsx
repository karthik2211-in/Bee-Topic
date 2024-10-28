"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@bt/ui/tabs";

export function ChapterTabs() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Tabs
      value={
        pathname === `/${params.channel_id}/chapter/${params.chapter_id}`
          ? "videos"
          : pathname ===
              `/${params.channel_id}/chapter/${params.chapter_id}/study-materials`
            ? "study-materials"
            : undefined
      }
      className="w-full"
    >
      <TabsList className="w-full justify-start">
        <TabsTrigger
          onClick={() =>
            router.push(`/${params.channel_id}/chapter/${params.chapter_id}`)
          }
          value="videos"
        >
          Videos
        </TabsTrigger>

        <TabsTrigger
          value="study-materials"
          onClick={() =>
            router.push(
              `/${params.channel_id}/chapter/${params.chapter_id}/study-materials`,
            )
          }
        >
          Study Materials
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
