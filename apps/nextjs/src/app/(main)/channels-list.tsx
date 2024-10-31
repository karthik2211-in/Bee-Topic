"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNowStrict } from "date-fns";
import {
  MoreHorizontalIcon,
  SearchXIcon,
  ShellIcon,
  TvMinimal,
} from "lucide-react";

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
import { Skeleton } from "@bt/ui/skeleton";

import { api } from "~/trpc/react";
import { DeleteChannelDialog, EditChannelDialog } from "./create-channel";

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
        <Card className="overflow-hidden rounded-lg transition-all duration-200 hover:cursor-pointer hover:bg-accent/60">
          <Link key={channel.id} href={`/${channel.id}`}>
            <CardContent className="flex h-44 items-center justify-center border-b bg-primary/15">
              <ShellIcon className="size-20 text-primary" strokeWidth={1.3} />
            </CardContent>
          </Link>
          <CardHeader className="w-full flex-row justify-between p-4">
            <div className="space-y-2">
              <CardTitle>{channel.title}</CardTitle>
              <CardDescription>
                {channel.chapterCount} chapters •{" "}
                {formatDistanceToNowStrict(channel.createdAt, {
                  addSuffix: true,
                })}
              </CardDescription>
            </div>
            <DropdownMenu key={channel.id}>
              <DropdownMenuTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent key={channel.id}>
                <EditChannelDialog key={channel.id} channelId={channel.id}>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Edit
                  </DropdownMenuItem>
                </EditChannelDialog>
                <DeleteChannelDialog channelId={channel.id}>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive"
                  >
                    Remove
                  </DropdownMenuItem>
                </DeleteChannelDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}
