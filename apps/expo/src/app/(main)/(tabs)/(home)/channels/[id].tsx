import {
  ActivityIndicator,
  Image,
  TouchableNativeFeedback,
  View,
} from "react-native";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlashList } from "@shopify/flash-list";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
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
import { Muted } from "~/components/ui/typography";
import { Crown } from "~/lib/icons/Crown";
import { Hash } from "~/lib/icons/Hash";
import { PlayCircle } from "~/lib/icons/PlayCircle";
import { useColorScheme } from "~/lib/useColorScheme";
import { formatDuration, formatViewCount } from "~/lib/utils";
import { api } from "~/utils/api";

export default function Chapter() {
  const params = useLocalSearchParams<{ id: string }>();

  const channelId = params.id;
  const utils = api.useUtils();
  const { data: channel } = api.channels.byId.useQuery({ id: channelId });
  const { isDarkColorScheme } = useColorScheme();

  const { mutate: unSubscribe, isPending: isUnSubscribing } =
    api.subscriptions.delete.useMutation({
      async onSuccess(data, variables, context) {
        console.log(data, variables, context);
        await utils.channels.invalidate();
      },
      async onSettled() {
        await utils.channels.invalidate();
      },
    });

  //Fetch chapters
  const { data: chaptersList, isLoading: isChaptersLoading } =
    api.chapters.all.useQuery({ channelId }, { enabled: !!channelId });
  const chapters = chaptersList?.data;

  //Fetch videos based on active chapter ID
  const {
    data: videos,
    hasNextPage,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = api.videos.infinite.useInfiniteQuery(
    { limit: 5, chapterId: chaptersList?.activeChapterId ?? "" },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!chaptersList?.activeChapterId,
    },
  );

  const videosData = videos?.pages?.flatMap((page) => page.items) || [];

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerTransparent: true,
          headerTintColor: "#ffff",
        }}
      />
      <StatusBar style={"light"} />

      {isLoading || isChaptersLoading ? (
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
          data={videosData}
          estimatedItemSize={200}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <Card className="h-fit rounded-none border-0 border-b border-b-border pb-3">
              <CardContent className="relative flex-1 object-contain p-0">
                <LinearGradient
                  colors={
                    isDarkColorScheme
                      ? [
                          "rgba(0,0,0,0.9)",
                          "rgba(0,0,0,0.6)",
                          "rgba(0,0,0,0.2)",
                          "rgba(0,0,0,0.4)",
                          "rgba(0,0,0,1)",
                        ]
                      : [
                          "rgba(0,0,0,0.9)",
                          "rgba(0,0,0,0.6)",
                          "rgba(255,255,255,0.2)",
                          "rgba(255,255,255,0.4)",
                          "rgba(255,255,255,1)",
                        ]
                  }
                  style={{
                    flex: 1,
                    position: "absolute",
                    top: 0,
                    zIndex: 9999,
                    height: "100%",
                    width: "100%",
                  }}
                />
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/1356762790/video/web-development-concept.jpg?s=640x640&k=20&c=ONFGjyXNy8CqhTSmnEI2X7X1tEvHCBsT83imvtDgdCI=",
                  }}
                  resizeMode="cover"
                  style={{
                    width: "auto",
                    flex: 1,
                    height: 300,
                  }}
                />
              </CardContent>
              <CardHeader className="items-start gap-2 p-3">
                <CardTitle className="text-xl leading-snug">
                  {channel?.title}
                </CardTitle>
                <Muted className="align-middle font-medium">
                  {channel?.totalChapters} Chapters{"    "}
                  {channel?.subscriptionsCount} Subscribers{"    "}
                  <Muted>Created by</Muted>{" "}
                  <Muted className="font-semibold">{channel?.createdBy}</Muted>
                </Muted>
                {channel?.description && (
                  <CardDescription className="text-foreground/70">
                    {channel?.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="w-full flex-1 flex-col items-center justify-center gap-2 px-3 py-3">
                {channel?.isSubscribed && !channel.isSubscriptionExpired ? (
                  <AlertDialog className="w-full">
                    <AlertDialogTrigger asChild>
                      <Button
                        size={"lg"}
                        isLoading={isUnSubscribing}
                        variant={"outline"}
                        className="w-full bg-accent/5"
                      >
                        <Animated.View
                          entering={FadeIn.duration(200).easing(Easing.linear)}
                          className="rounded-full border-[1px] border-primary bg-primary/10 p-1"
                        >
                          <Crown size={12} className="text-primary" />
                        </Animated.View>
                        <Text>Subscribed</Text>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Do you want to unsubscribe?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          By unsubscribing this channel you will lost your
                          subscription and you won't long be access the contents
                          of this channel.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          <Text>Cancel</Text>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            isLoading={isUnSubscribing}
                            onPress={() => unSubscribe({ channelId })}
                          >
                            <Text>Continue</Text>
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : channel?.isSubscribed && channel.isSubscriptionExpired ? (
                  <Link href={`/(modal)/subscribe/${channel?.id}`} asChild>
                    <Button
                      size={"lg"}
                      variant={"secondary"}
                      className="w-full"
                    >
                      <Text>Renew Subscription</Text>
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/(modal)/subscribe/${channel?.id}`} asChild>
                    <Button size={"lg"} className="w-full">
                      <Text>Subscribe</Text>
                    </Button>
                  </Link>
                )}

                <Link href={`/chapters-list/${channel?.id}`} asChild>
                  <Button size={"lg"} variant={"secondary"} className="w-full">
                    <Text className="font-normal">
                      {
                        chapters?.find(
                          (chapter) =>
                            chapter.id === chaptersList?.activeChapterId,
                        )?.title
                      }
                    </Text>
                  </Button>
                </Link>
                <Muted>
                  {
                    chapters?.find(
                      (chapter) => chapter.id === chaptersList?.activeChapterId,
                    )?.description
                  }
                </Muted>
              </CardFooter>
            </Card>
          }
          renderItem={({ item: video, index, extraData }) => {
            utils.videos.byId.prefetch({ video_file_key: video.ut_fileKey });
            return (
              <Link
                href={`/videos/${video.ut_fileKey}?next=${videosData[index + 1]?.ut_fileKey}`}
                asChild
              >
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(
                    "rgba(255,255,255,0.2)",
                    false,
                  )}
                >
                  <Card className="my-3 flex gap-2 overflow-hidden border-0 p-3">
                    <View className="flex-shrink flex-row items-center">
                      <CardContent className="items-center justify-center rounded-sm p-0">
                        <PlayCircle
                          size={38}
                          className="fill-foreground/10 text-card-foreground/50"
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
