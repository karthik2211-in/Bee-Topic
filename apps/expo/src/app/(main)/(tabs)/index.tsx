import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Tabs } from "expo-router";
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
import { Large, Lead, Muted } from "~/components/ui/typography";
import { Hash } from "~/lib/icons/Hash";
import { Home } from "~/lib/icons/Home";
import { api } from "~/utils/api";

export default function Index() {
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.channels.infinite.useInfiniteQuery(
    { limit: 5 },
    {
      initialCursor: undefined,
      getNextPageParam: (lastPage) => {
        console.log("lastPage", lastPage.nextCursor);
        return lastPage.nextCursor;
      },
    },
  );

  return (
    <View className="flex-1">
      <Tabs.Screen
        options={{
          title: "Home",
          headerTitle: "🐝 BeeTopic",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlashList
          data={data?.pages.flatMap((page) => page.items)}
          keyExtractor={(item, index) => item.id + index}
          estimatedItemSize={400}
          StickyHeaderComponent={() => (
            <Lead>Let's learn something new today 🧠</Lead>
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
          renderItem={({ item: channel }) => (
            <Card
              key={channel.id}
              className="my-6 border-0 bg-transparent shadow-none"
            >
              <CardHeader className="flex-row items-center justify-between p-0">
                <View>
                  <CardTitle className="text-base">{channel.title}</CardTitle>
                  <CardDescription className="text-sm">
                    10 Chapters • 200 Subscribers
                  </CardDescription>
                </View>
                <Button size={"sm"} className="rounded-full">
                  <Text>Subscribe</Text>
                </Button>
              </CardHeader>
              <CardContent className="flex-row flex-wrap justify-between p-0 py-4">
                {channel.chapters?.length === 0 ? (
                  <View className="border-hairline aspect-square h-32 w-full items-center justify-center gap-2 rounded-md border-dashed border-border">
                    <Hash size={32} className="text-muted-foreground" />
                    <Lead>No chapters yet</Lead>
                    <Muted className="w-1/2 text-center">
                      Subscribe to get all notification about this channel
                      updates
                    </Muted>
                  </View>
                ) : (
                  channel.chapters.map((chapter) => (
                    <Card
                      key={chapter.id}
                      className="my-2.5 aspect-square w-[48%] overflow-hidden"
                    >
                      <CardContent className="border-b-hairline h-32 items-center justify-center bg-primary/20 p-0">
                        <Hash size={42} className="text-foreground/30" />
                      </CardContent>
                      <CardHeader className="p-3">
                        <CardTitle
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          className="text-base"
                        >
                          {chapter.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          10 videos
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </CardContent>
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
