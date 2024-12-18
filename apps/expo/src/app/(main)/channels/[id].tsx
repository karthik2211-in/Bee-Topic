import {
  Image,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "@react-native-community/blur";
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
import VideoCard from "~/components/video-card";
import { ActivityIndicator } from "~/lib/activity-indicator";
import { Crown } from "~/lib/icons/Crown";
import { Hash } from "~/lib/icons/Hash";
import { Pause } from "~/lib/icons/Pause";
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

  const hasPermissionToAccess =
    channel?.isSubscribed && !channel?.isSubscriptionPaused;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerTransparent: true,
          headerBackground() {
            return (
              <BlurView
                blurAmount={64}
                blurType={isDarkColorScheme ? "extraDark" : "light"}
                style={{
                  flex: 1,
                  overflow: "hidden",
                }}
              />
            );
          },
        }}
      />

      {isLoading || isChaptersLoading ? (
        <View className="mt-24 flex-1 justify-center gap-4 py-32">
          <ActivityIndicator size={"large"} className="text-primary" />
        </View>
      ) : (
        <FlashList
          data={videosData}
          estimatedItemSize={200}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <Card className="mt-28 h-fit rounded-none border-0 border-b border-b-border pb-3">
              <CardContent className="relative flex-1 items-center justify-center object-contain py-0">
                {/* <LinearGradient
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
                /> */}
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/1356762790/video/web-development-concept.jpg?s=640x640&k=20&c=ONFGjyXNy8CqhTSmnEI2X7X1tEvHCBsT83imvtDgdCI=",
                  }}
                  resizeMode="cover"
                  style={{
                    width: 200,
                    flex: 1,
                    height: 230,
                    shadowColor: "black",
                    shadowOpacity: 1,
                    borderRadius: 8,
                    aspectRatio: 9 / 6,
                  }}
                />
              </CardContent>
              <CardHeader className="items-start gap-2">
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
                  <CardDescription className="text-foreground/90">
                    {channel?.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="w-full flex-1 flex-col items-center justify-center gap-2">
                {channel?.isSubscribed &&
                !channel.isSubscriptionPaused &&
                !channel.isSubscriptionExpired ? (
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
                          Do you want to pause the subscription?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          By pausing subscription of this channel you will no
                          longer can access content of this channel.
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
                  <Link href={`/subscribe/${channel?.id}`} asChild>
                    <Button
                      size={"lg"}
                      variant={"secondary"}
                      className="w-full"
                    >
                      <Text>Renew Subscription</Text>
                    </Button>
                  </Link>
                ) : channel?.isSubscriptionPaused ? (
                  <Button
                    size={"lg"}
                    variant={"outline"}
                    className="w-full items-center"
                  >
                    <Pause
                      size={22}
                      className="fill-destructive text-destructive"
                    />
                    <Text>Resume Subscription</Text>
                  </Button>
                ) : (
                  <Link href={`/subscribe/${channel?.id}`} asChild>
                    <Button size={"lg"} className="w-full">
                      <Text>Subscribe To Watch</Text>
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
                {chapters?.find(
                  (chapter) => chapter.id === chaptersList?.activeChapterId,
                )?.description && (
                  <Muted>
                    {
                      chapters?.find(
                        (chapter) =>
                          chapter.id === chaptersList?.activeChapterId,
                      )?.description
                    }
                  </Muted>
                )}
              </CardFooter>
            </Card>
          }
          renderItem={({ item: videoData, index, extraData }) => {
            utils.videos.byId.prefetch({
              video_file_key: videoData.ut_fileKey,
            });
            return (
              <Link
                disabled={!hasPermissionToAccess}
                href={`/videos/${videoData.ut_fileKey}?next=${videosData[index + 1]?.ut_fileKey ?? ""}`}
                key={videoData.id}
                asChild
              >
                <TouchableOpacity>
                  <VideoCard
                    style={{ opacity: hasPermissionToAccess ? 1 : 0.3 }}
                    videoData={videoData}
                  />
                </TouchableOpacity>
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
