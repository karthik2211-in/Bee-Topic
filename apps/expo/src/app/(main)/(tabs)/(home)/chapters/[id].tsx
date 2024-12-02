import React from "react";
import { ActivityIndicator, TouchableNativeFeedback, View } from "react-native";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { Lead, Muted } from "~/components/ui/typography";
import { Hash } from "~/lib/icons/Hash";
import { PlayCircle } from "~/lib/icons/PlayCircle";
import { Sprout } from "~/lib/icons/Sprout";
import { api } from "~/utils/api";
import { formatViewCount } from "../videos/[id]";

export default function Chapter() {
  const params = useLocalSearchParams<{ id: string }>();
  const chapterId = params.id;
  const { data: chapter } = api.chapters.byId.useQuery({ id: chapterId });
  const {
    data: videos,
    isRefetching,
    hasNextPage,
    isLoading,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
  } = api.videos.infinite.useInfiniteQuery(
    { limit: 5, chapterId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  const utils = api.useUtils();

  const { mutate: subscribe, isPending: isSubscribing } =
    api.subscriptions.create.useMutation({
      onSuccess(data, variables, context) {
        console.log(data, variables, context);
      },
      onSettled() {
        utils.chapters.invalidate();
      },
    });
  const { mutate: unSubscribe, isPending: isUnSubscribing } =
    api.subscriptions.delete.useMutation({
      onSuccess(data, variables, context) {
        console.log(data, variables, context);
      },
      onSettled() {
        utils.chapters.invalidate();
      },
    });

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
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Chapter Details",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 18 },
          headerShadowVisible: false,
        }}
      />
      {isLoading ? (
        <View className="gap-2 p-3">
          <Card
            key={chapter?.id}
            className="border-b-hairline mb-2 overflow-hidden border-border"
          >
            <CardContent className="h-52 items-center justify-center border-b border-border bg-primary/5 p-0">
              <Hash size={54} className="text-foreground/20" />
            </CardContent>
            <CardHeader className="gap-2 p-3">
              <Skeleton className={"h-6 w-4/5 rounded-full"} />
              <Skeleton className={"mt-1 h-2 w-5/6 rounded-full"} />
              <Skeleton className={"mt-0.5 h-2 w-4/6 rounded-full"} />
              <Card className="flex flex-row items-center overflow-hidden rounded-none border-0">
                <CardContent className="aspect-video h-16 w-20 items-center justify-center rounded-lg border border-border bg-primary/5 p-0">
                  <Sprout size={18} className="text-foreground/30" />
                </CardContent>
                <CardHeader className="w-full flex-shrink flex-row items-center justify-between p-3">
                  <View className="w-1/2 justify-between gap-1">
                    <Skeleton className={"h-3 w-full rounded-full"} />
                    <Skeleton className={"mt-1 h-2 w-1/2 rounded-full"} />
                  </View>
                  <Skeleton className={"h-8 w-1/3 rounded-full"} />
                </CardHeader>
              </Card>
            </CardHeader>
          </Card>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={"h-24 w-full"} />
          ))}
        </View>
      ) : (
        <FlashList
          data={videos?.pages?.flatMap((page) => page.items) || []}
          estimatedItemSize={2}
          contentContainerStyle={{ padding: 12 }}
          keyExtractor={(item, index) => item.id}
          ListHeaderComponent={
            <Card
              key={chapter?.id}
              className="border-b-hairline mb-3 overflow-hidden border-border"
            >
              <CardContent className="h-52 items-center justify-center border-b border-border bg-primary/5 p-0">
                <Hash size={54} className="text-foreground/20" />
              </CardContent>
              <CardHeader className="gap-2 p-3">
                <CardTitle>{chapter?.title}</CardTitle>
                {chapter?.description && (
                  <CardDescription className="p-0 text-foreground/70">
                    {chapter?.description}
                  </CardDescription>
                )}
                <Card className="flex flex-row items-center overflow-hidden rounded-none border-0">
                  <CardContent className="aspect-video h-16 w-20 items-center justify-center rounded-lg border border-border bg-primary/5 p-0">
                    <Sprout size={18} className="text-foreground/30" />
                  </CardContent>
                  <CardHeader className="w-full flex-shrink flex-row items-center justify-between p-3">
                    <View className="w-1/2 justify-between gap-1">
                      <CardTitle
                        className="text-sm"
                        ellipsizeMode="tail"
                        style={{ width: "auto" }}
                        numberOfLines={1}
                        textBreakStrategy="simple"
                      >
                        {chapter?.channel?.title}
                      </CardTitle>
                      <CardDescription className="p-0 text-xs text-foreground/70">
                        {chapter?.channel.subscriptionsCount} Subscribers
                      </CardDescription>
                    </View>
                  </CardHeader>
                </Card>
              </CardHeader>
            </Card>
          }
          ListEmptyComponent={
            <View className="border-t-hairline h-60 flex-1 items-center justify-center border-t-border px-10">
              <Lead>No Videos</Lead>
              <Muted className="text-center">
                If the creator of this channel uploads any new videos will be
                seen here and we will notify you about that.
              </Muted>
            </View>
          }
          renderItem={({ item: video }) => {
            utils.videos.byId.prefetch({ id: video.id }); //prefetch the video details to avoid the loading screen on video screen
            return (
              <Link href={`/videos/${video.id}`} asChild>
                <TouchableNativeFeedback>
                  <Card className="mb-3 flex gap-2 overflow-hidden p-3">
                    <View className="flex-shrink flex-row items-center">
                      <CardContent className="items-center justify-center rounded-sm p-0">
                        <PlayCircle
                          size={32}
                          className="text-card-foreground/50"
                          strokeWidth={1}
                        />
                      </CardContent>
                      <CardHeader className="h-full w-full flex-shrink items-start justify-between px-3 py-0">
                        <View className="gap-1">
                          <CardTitle className="text-base">
                            {video?.title}
                          </CardTitle>
                          <CardDescription className="p-0 text-xs text-foreground/70">
                            {formatDuration(video.duration)} •{" "}
                            {formatViewCount(video.viewCount ?? 0)} views
                          </CardDescription>
                        </View>
                      </CardHeader>
                    </View>
                    {video.description && <Muted>{video.description}</Muted>}
                  </Card>
                </TouchableNativeFeedback>
              </Link>
            );
          }}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          onEndReachedThreshold={0.8} // Adjust threshold for when to load more data
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color="#4CAF50" />
            ) : (
              <View style={{ height: 50 }} />
            )
          }
        />
      )}
    </View>
  );
}
