"use client";

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
      className="w-full border-b-0"
    >
      <TabsList className="h-11 w-full justify-start">
        <TabsTrigger
          onClick={() =>
            router.push(`/${params.channel_id}/chapter/${params.chapter_id}`)
          }
          value="videos"
          className="py-5"
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
          className="py-5"
        >
          Study Materials
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
