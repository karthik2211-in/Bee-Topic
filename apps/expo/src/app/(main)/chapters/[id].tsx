import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Hash } from "~/lib/icons/Hash";
import { PlayCircle } from "~/lib/icons/PlayCircle";
import { Tv } from "~/lib/icons/Tv";
import { api } from "~/utils/api";

export default function Chapter() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: chapter } = api.chapters.byId.useQuery(
    { id },
    { queryHash: `${id}` },
  );
  const {
    data: videos,
    isRefetching,
    hasNextPage,
    isLoading,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
  } = api.videos.infinite.useInfiniteQuery(
    { limit: 5, chapterId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor, queryHash: `${id}` },
  );

  console.log(videos?.pages.flatMap((page) => page.items));

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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={40} />
        </View>
      ) : (
        <FlashList
          ListHeaderComponent={
            <Card
              key={chapter?.id}
              className="border-b-hairline overflow-hidden rounded-none border-border"
            >
              <CardContent className="border-b-hairline h-52 items-center justify-center bg-primary/20 p-0">
                <Hash size={42} className="text-foreground/30" />
              </CardContent>
              <CardHeader className="p-3">
                <CardTitle>{chapter?.title}</CardTitle>
                <CardDescription className="p-0 text-foreground/70">
                  {chapter?.description}
                </CardDescription>
                <Card className="flex flex-row items-center overflow-hidden rounded-none border-0">
                  <CardContent className="border-hairline aspect-video h-16 w-20 items-center justify-center rounded-lg bg-primary/20 p-0">
                    <Tv size={18} className="text-foreground/30" />
                  </CardContent>
                  <CardHeader className="w-full flex-shrink flex-row items-center justify-between p-3">
                    <View className="justify-between">
                      <CardTitle className="text-base">
                        {chapter?.title}
                      </CardTitle>
                      <CardDescription className="p-0 text-xs text-foreground/70">
                        200 Subscribers
                      </CardDescription>
                    </View>
                    <Button size={"sm"} className="rounded-full">
                      <Text>Subscribe</Text>
                    </Button>
                  </CardHeader>
                </Card>
              </CardHeader>
            </Card>
          }
          data={videos?.pages?.flatMap((page) => page.items) || []}
          keyExtractor={(item, index) => item.id}
          estimatedItemSize={2}
          renderItem={({ item: video }) => (
            <Card className="mb-2 flex flex-shrink flex-row items-center overflow-hidden p-3">
              <CardContent className="items-center justify-center rounded-sm p-0">
                <PlayCircle size={32} className="text-primary" />
              </CardContent>
              <CardHeader className="h-full w-full flex-shrink flex-row items-start justify-between p-3">
                <View>
                  <CardTitle className="text-base">{video?.title}</CardTitle>
                  <CardDescription className="p-0 text-xs text-foreground/70">
                    {video?.description}
                  </CardDescription>
                </View>
              </CardHeader>
            </Card>
          )}
          onEndReached={() => {
            console.log("Reached", hasNextPage);
            fetchNextPage();
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
