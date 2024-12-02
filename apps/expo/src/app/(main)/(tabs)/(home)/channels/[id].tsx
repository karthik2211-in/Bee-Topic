import React from "react";
import {
  ActivityIndicator,
  Image,
  TouchableNativeFeedback,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
// import RazorPay from "react-native-razorpay";
import { BlurView } from "expo-blur";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
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
    hasNextPage,
    isLoading,
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
          headerTitle: "",
          headerTitleStyle: { fontSize: 18 },
          headerShadowVisible: false,
        }}
      />
      {isLoading ? (
        <View className="gap-4 p-3">
          <View className="relative h-64 min-h-64 gap-2 px-2 py-4">
            <Skeleton className="h-6 w-4/5 rounded-full" />
            <Skeleton className="h-6 w-4/6 rounded-full" />
            <Skeleton className={"h-3 w-1/2"} />
            <View className="mt-auto items-end gap-4">
              <View className="mt-auto w-full flex-col gap-2">
                <Muted>Created by</Muted>
                <View className="flex-row items-center gap-2">
                  <Skeleton className={"size-6 rounded-full"} />
                  <Skeleton className={"h-3 w-1/4"} />
                </View>
              </View>
              <Skeleton className={"h-12 w-full rounded-full"} />
            </View>
          </View>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={"h-24 w-full"} />
          ))}
        </View>
      ) : (
        <FlashList
          data={chapters?.pages?.flatMap((page) => page.items) || []}
          estimatedItemSize={200}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <Card className="h-fit rounded-none border-0 border-b border-b-border">
              <CardContent className="flex-1 object-contain p-0">
                <Image
                  source={{
                    uri: "https://s2.dmcdn.net/v/PhtPf1ZckrzTH_Sd3/x1080",
                  }}
                  resizeMode="cover"
                  style={{
                    width: "auto",
                    flex: 1,
                    height: 205,
                  }}
                />
              </CardContent>
              <CardHeader className="items-start gap-2 p-3">
                <CardTitle className="text-xl leading-snug">
                  {channel?.title}
                </CardTitle>
                {channel?.description && (
                  <CardDescription className="text-foreground/70">
                    {channel?.description}
                  </CardDescription>
                )}
                <View className="flex-row items-center gap-1">
                  <Muted className="text-xs">Created by</Muted>
                  <View className="flex-row items-center justify-center gap-1">
                    <Avatar
                      className="size-5 border border-border"
                      alt="Channel Creator"
                    >
                      <AvatarImage
                        source={{
                          uri: channel?.createdByImageUrl,
                        }}
                      />
                      <AvatarFallback className="items-center justify-center">
                        <Text>{channel?.createdBy?.charAt(0)}</Text>
                      </AvatarFallback>
                    </Avatar>
                    <Muted className="text-xs font-semibold">
                      {channel?.createdBy}
                    </Muted>
                  </View>
                </View>
              </CardHeader>
              <CardFooter className="w-full flex-1 flex-col items-center justify-center gap-2 px-3 py-3">
                <Button className="w-full">
                  <Text>Subscribe Now</Text>
                </Button>
                <Muted className="text-xs font-medium">
                  {channel?.totalChapters} Chapters •{" "}
                  {channel?.subscriptionsCount} Subscribers
                </Muted>
              </CardFooter>
            </Card>
          }
          ListEmptyComponent={
            <View className="h-60 flex-1 items-center justify-center px-10">
              <Lead>No Chapters</Lead>
              <Muted className="text-center">
                If the creator of this channel posts any new chapters will be
                seen here and we will notify you about that.
              </Muted>
            </View>
          }
          renderItem={({ item: chapter }) => (
            <Link href={`/chapters/${chapter.id}`} asChild>
              <TouchableNativeFeedback>
                <Card className="border-b-hairline mt-[1px] box-border gap-2 overflow-auto rounded-none border-0 px-3 py-5">
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
                        <CardDescription className={"text-foreground/90"}>
                          {chapter.totalVideos} videos
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
