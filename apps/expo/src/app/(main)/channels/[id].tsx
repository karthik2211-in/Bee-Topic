import React from "react";
import {
  ActivityIndicator,
  Image,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { H3, Lead, Muted } from "~/components/ui/typography";
import { Hash } from "~/lib/icons/Hash";
import { useColorScheme } from "~/lib/useColorScheme";
import { api } from "~/utils/api";

export default function Chapter() {
  const params = useLocalSearchParams<{ id: string }>();
  const { isDarkColorScheme } = useColorScheme();
  const channelId = params.id;
  const utils = api.useUtils();
  const { data: channel } = api.channels.byId.useQuery({ id: channelId });
  const { mutate: subscribe, isPending: isSubscribing } =
    api.subscriptions.create.useMutation({
      onSuccess(data, variables, context) {
        console.log(data, variables, context);
      },
      onSettled() {
        utils.channels.invalidate();
      },
    });
  const { mutate: unSubscribe, isPending: isUnSubscribing } =
    api.subscriptions.delete.useMutation({
      onSuccess(data, variables, context) {
        console.log(data, variables, context);
      },
      onSettled() {
        utils.channels.invalidate();
      },
    });
  const {
    data: chapters,
    isRefetching,
    hasNextPage,
    isLoading,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
  } = api.chapters.infinite.useInfiniteQuery(
    { limit: 5, channelId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Channel Details",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 18 },
          headerShadowVisible: false,
        }}
      />
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <FlashList
          data={chapters?.pages?.flatMap((page) => page.items) || []}
          estimatedItemSize={2}
          contentContainerStyle={{ padding: 12 }}
          keyExtractor={(item, index) => item.id}
          ListHeaderComponent={
            <View className="relative h-64 min-h-64 px-2 py-4">
              <Image
                source={require("../../../../assets/honey.png")}
                style={{
                  height: 200,
                  width: 200,
                  position: "absolute",
                  right: -60,
                  top: -60,
                  opacity: 0.6,
                }}
              />
              <H3 className="w-4/5">{channel?.title}</H3>
              <Muted>
                {channel?.totalChapters} Chapters •{" "}
                {channel?.subscriptionsCount} Subscribers
              </Muted>
              <View className="mt-auto items-end gap-4">
                <View className="mt-auto w-full flex-col gap-2">
                  <Muted>Created by</Muted>
                  <View className="flex-row items-center gap-2">
                    <Avatar className="size-6" alt="Channel Creator">
                      <AvatarImage
                        source={{
                          uri: channel?.createdByImageUrl,
                        }}
                      />
                      <AvatarFallback className="items-center justify-center">
                        <Text>{channel?.createdBy?.charAt(0)}</Text>
                      </AvatarFallback>
                    </Avatar>
                    <Muted>{channel?.createdBy}</Muted>
                  </View>
                </View>
                <Button
                  disabled={isSubscribing || isUnSubscribing}
                  onPress={() =>
                    channel?.isSubscribed
                      ? unSubscribe({ channelId })
                      : subscribe({ channelId })
                  }
                  variant={channel?.isSubscribed ? "secondary" : "default"}
                  // disabled
                  className="w-full rounded-full"
                >
                  <Text>
                    {channel?.isSubscribed
                      ? "Subscribed"
                      : "Subscribe to Watch"}
                  </Text>
                  {(isSubscribing || isUnSubscribing) && (
                    <ActivityIndicator size={"small"} color={"#ffff"} />
                  )}
                </Button>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="border-t-hairline h-60 flex-1 items-center justify-center border-t-border px-10">
              <Lead>No Chapters</Lead>
              <Muted className="text-center">
                If the creator of this channel posts any new chapters will be
                seen here and we will notify you about that.
              </Muted>
            </View>
          }
          renderItem={({ item: chapter }) => (
            <Link href={`/chapters/${chapter.id}`} asChild>
              <TouchableNativeFeedback disabled={!channel?.isSubscribed}>
                <Card className="relative mb-3 flex gap-2 overflow-hidden p-3">
                  {!channel?.isSubscribed && (
                    <BlurView
                      intensity={100}
                      style={{
                        height: "140%",
                        width: "140%",
                        position: "absolute",
                        flex: 1,
                        zIndex: 10,
                      }}
                      tint={
                        isDarkColorScheme
                          ? "systemThinMaterialDark"
                          : "systemUltraThinMaterialLight"
                      }
                    />
                  )}
                  <View className="flex-shrink flex-row items-center">
                    <CardContent className="items-center justify-center rounded-sm p-0">
                      <Hash
                        size={32}
                        className="text-card-foreground/50"
                        strokeWidth={1}
                      />
                    </CardContent>
                    <CardHeader className="h-full w-full flex-shrink items-start justify-between px-3 py-0">
                      <View className="gap-1">
                        <CardTitle className="text-base">
                          {chapter?.title}
                        </CardTitle>
                        <CardDescription>
                          {chapter.totalVideos} Videos
                        </CardDescription>
                      </View>
                    </CardHeader>
                  </View>
                  {chapter.description && <Muted>{chapter.description}</Muted>}
                </Card>
              </TouchableNativeFeedback>
            </Link>
          )}
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
