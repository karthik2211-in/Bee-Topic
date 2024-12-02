import {
  ActivityIndicator,
  Image,
  TouchableNativeFeedback,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  ReduceMotion,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Link, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { H3, Lead, Muted } from "~/components/ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { api } from "~/utils/api";

const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function Index() {
  const { userId } = useAuth();
  const utils = api.useUtils();
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    api.channels.infinite.useInfiniteQuery(
      { limit: 5 },
      {
        initialCursor: undefined,
        getNextPageParam: (lastPage) => {
          console.log("lastPage", lastPage.nextCursor);
          return lastPage.nextCursor;
        },
        enabled: !!userId,
      },
    );
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex-1">
      <StatusBar translucent />
      <Tabs.Screen
        options={{
          headerTitle(props) {
            return (
              <Image
                source={
                  isDarkColorScheme
                    ? require("assets/VerticalLogoDark.png")
                    : require("assets/VerticalLogoLight.png")
                }
                style={{
                  height: 60,
                  width: 160,
                }}
              />
            );
          },
          headerTransparent: true,
          headerBackground(props) {
            return (
              <BlurView
                intensity={300}
                tint="systemMaterialDark"
                style={{
                  flex: 1,
                  backgroundColor: isDarkColorScheme
                    ? "hsla(20,14.3%,4.1%, 0.8)"
                    : "hsla(0,0%,100%, 0.8)",
                }}
              />
            );
          },
          headerTitleAlign: "center",
        }}
      />

      {isLoading ? (
        <View className="mt-24 gap-3 p-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={"h-56 w-full rounded-2xl"} />
          ))}
        </View>
      ) : (
        <FlashList
          data={data?.pages?.flatMap((page) => page.items) || []}
          keyExtractor={(item, index) => item.id}
          estimatedItemSize={400}
          ListHeaderComponent={() => (
            <View className="mt-24 gap-1 pb-3">
              <H3 className="text-center capitalize leading-snug text-foreground">
                Something New Today
              </H3>
              <Muted className="text-center font-semibold">
                Latest channels from BeeTopic
              </Muted>
            </View>
          )}
          ListEmptyComponent={
            <View className="h-full w-full flex-1 items-center justify-center">
              <Lead>No Channels Created Yet</Lead>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
          renderItem={({ item: channel, index }) => {
            utils.channels.byId.prefetch({ id: channel.id });
            return (
              <AnimatedCard
                entering={FadeInDown.duration(500)
                  // .delay(200 + index * 200)
                  .springify(2000)
                  .easing(Easing.linear)}
                key={channel.id}
                style={{ position: "relative" }}
                className="mt-3 min-h-52 overflow-hidden rounded-md border border-border/80"
              >
                <Link asChild href={`/channels/${channel.id}`}>
                  <TouchableNativeFeedback
                    background={{ type: "RippleAndroid", borderless: false }}
                    useForeground={false}
                    style={{ borderRadius: 40 }}
                  >
                    <View className="flex-1">
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
                          {channel.title}
                        </CardTitle>
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
                      <CardFooter className="w-full flex-1 items-center justify-center gap-2 border-t border-border bg-muted/20 px-3 py-3">
                        <Muted className="text-xs font-medium">
                          {channel.totalChapters} Chapters •{" "}
                          {channel.subscriptionCount} Subscribers
                        </Muted>
                      </CardFooter>
                    </View>
                  </TouchableNativeFeedback>
                </Link>
              </AnimatedCard>
            );
          }}
          onEndReached={() => {
            console.log("Reached", hasNextPage);
            fetchNextPage();
          }}
          onEndReachedThreshold={0.8} // Adjust threshold for when to load more data
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                className="my-4"
                color={isDarkColorScheme ? "white" : "black"}
              />
            ) : (
              <View style={{ height: 32 }} />
            )
          }
        />
      )}
    </View>
  );
}
