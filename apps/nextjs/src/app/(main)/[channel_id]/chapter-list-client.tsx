"use client";

import React from "react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { HashIcon, SearchXIcon } from "lucide-react";

import { Button } from "@bt/ui/button";
import { Skeleton } from "@bt/ui/skeleton";

import { api } from "~/trpc/react";
import ChapterItem from "./chapter-client";

export function ChaptersList() {
  const params = useParams();
  const searchParams = useSearchParams();
  const chapterQuery = searchParams.get("chapter");
  const router = useRouter();
  const pathname = usePathname();

  const deleteQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const chapters = api.chapters.all.useQuery(
    { channelId: params.channel_id as string, query: chapterQuery },
    {
      enabled: !!params.channel_id,
      queryKeyHashFn: (queryKey) =>
        `${queryKey}-${params.channel_id}-${chapterQuery}`,
    },
  );

  if (chapters.isLoading)
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-md" />
        ))}
      </div>
    );

  if (chapters.data?.length === 0 && chapterQuery)
    return (
      <div className="mt-28 flex flex-col items-center gap-2 px-3">
        <SearchXIcon className="size-8" strokeWidth={1.25} />
        <div className="text-center text-base font-semibold">No Results</div>
        <p className="text-center text-xs text-muted-foreground">
          No chapters exists to this search term `{chapterQuery}`
        </p>
        <Button
          onClick={() =>
            router.push(
              pathname + "?" + deleteQueryString("chapter", chapterQuery),
            )
          }
          variant={"link"}
          size={"sm"}
        >
          Clear Search
        </Button>
      </div>
    );

  if (chapters.data?.length === 0)
    return (
      <div className="mt-28 flex flex-col items-center gap-2 px-3">
        <HashIcon className="size-8" strokeWidth={1.25} />
        <div className="text-center text-base font-semibold">No chapters</div>
        <p className="text-center text-xs text-muted-foreground">
          Create chapter to add videos by clicking on above plus icon
        </p>
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-2">
      {chapters.data?.map((chapter) => (
        <Link
          key={chapter.id}
          href={`/${params.channel_id}/chapter/${chapter.id}`}
        >
          <ChapterItem chapter={chapter} />
        </Link>
      ))}
    </div>
  );
}
