import { Image, TouchableOpacity, View } from "react-native";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";
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
import { Text } from "~/components/ui/text";
import { Muted } from "~/components/ui/typography";
import VideoCard from "~/components/video-card";
import { ActivityIndicator } from "~/lib/activity-indicator";
import { Crown } from "~/lib/icons/Crown";
import { Pause } from "~/lib/icons/Pause";
import { Sprout } from "~/lib/icons/Sprout";
import { useColorScheme } from "~/lib/useColorScheme";
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
    channel?.isSubscribed &&
    !channel?.isSubscriptionPaused &&
    !channel?.isSubscriptionExpired;

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
            <Card className="mt-32 h-fit rounded-none border-0 border-b border-b-border pb-3">
              <CardContent className="relative flex-1 items-center justify-center object-contain py-0">
                {channel?.thumbneilId ? (
                  <Image
                    source={{
                      uri: `https://utfs.io/f/${channel.thumbneilId}`,
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
                ) : (
                  <View
                    style={{
                      width: "auto",
                      flex: 1,
                      height: 205,
                    }}
                    className="items-center justify-center border-b border-b-border"
                  >
                    <Sprout size={64} className="text-muted-foreground/80" />
                  </View>
                )}
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
