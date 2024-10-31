"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchXIcon, ShellIcon, TvMinimal } from "lucide-react";

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

export function ChannelsListClient() {
  const searchParams = useSearchParams();
  const channelQuery = searchParams.get("channel");
  const channels = api.channels.all.useQuery(
    { query: channelQuery as string },
    { queryHash: `${channelQuery}` },
  );
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

  if (channels.isLoading)
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-60 w-full rounded-md" />
        ))}
      </div>
    );

  if (channels.data?.length === 0 && channelQuery)
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
          No channels name starts with `{channelQuery}`
        </p>
        <Button
          onClick={() =>
            router.push(
              pathname + "?" + deleteQueryString("channel", channelQuery),
            )
          }
          variant={"link"}
          className="text-indigo-600"
        >
          Clear search
        </Button>
      </section>
    );

  if (channels.data?.length === 0)
    return (
      <section
        aria-label="Channels Empty"
        className="flex flex-col items-center gap-3 py-40"
      >
        <TvMinimal className="size-10" strokeWidth={1.25} />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          No channels
        </h4>
        <p className="w-1/3 text-center text-sm text-muted-foreground">
          Create one by clicking on create channel and organize a space for your
          course/subject
        </p>
      </section>
    );

  return (
    <section aria-label="Channels Grid" className="grid grid-cols-4 gap-4">
      {channels.data?.map((channel) => (
        <Link key={channel.id} href={`/${channel.id}`}>
          <Card className="overflow-hidden rounded-lg transition-all duration-200 hover:cursor-pointer hover:bg-accent/60">
            <CardContent className="flex h-44 items-center justify-center border-b bg-primary/15">
              <ShellIcon className="size-20 text-primary" strokeWidth={1.3} />
            </CardContent>
            <CardHeader className="p-4">
              <CardTitle>{channel.title}</CardTitle>
              <CardDescription className="font-mono">
                {channel.chapterCount} chapters
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </section>
  );
}
