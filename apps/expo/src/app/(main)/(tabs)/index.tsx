import {
  ActivityIndicator,
  Image,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Link, Tabs } from "expo-router";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
import { H1, Lead, Muted } from "~/components/ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { api } from "~/utils/api";

export default function Index() {
  const { user } = useUser();
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
      enabled: !!user?.id,
    },
  );
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex-1">
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
                  width: 130,
                }}
              />
            );
          },
        }}
      />

      {false ? (
        <View className="gap-3 p-3">
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
            <H1 className="my-3 font-mono leading-snug tracking-widest text-foreground/70">
              Let's learn something new today{" "}
            </H1>
          )}
          ListEmptyComponent={
            <View className="h-full w-full flex-1 items-center justify-center">
              <Lead>No Channels Created Yet</Lead>
            </View>
          }
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
          renderItem={({ item: channel }) => {
            return (
              <Card
                key={channel.id}
                style={{ position: "relative" }}
                className="my-3 min-h-52 overflow-hidden rounded-2xl"
              >
                <Link asChild href={`/channels/${channel.id}`}>
                  <TouchableNativeFeedback style={{ borderRadius: 40 }}>
                    <View className="flex-1">
                      <Image
                        source={require("assets/honey.png")}
                        style={{
                          height: 200,
                          width: 200,
                          position: "absolute",
                          right: -60,
                          top: -60,
                          opacity: 0.3,
                        }}
                      />
                      <CardHeader className="gap-2">
                        <CardTitle className="leading-snug">
                          {channel.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {channel.totalChapters} Chapters •{" "}
                          {channel.subscriptionCount} Subscribers
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-row flex-wrap justify-between p-0 py-4"></CardContent>
                      <CardFooter className="w-full flex-col items-start gap-2">
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
                      </CardFooter>
                    </View>
                  </TouchableNativeFeedback>
                </Link>
              </Card>
            );
          }}
          onEndReached={() => {
            console.log("Reached", hasNextPage);
            fetchNextPage();
          }}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          onEndReachedThreshold={0.8} // Adjust threshold for when to load more data
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={isDarkColorScheme ? "black" : "white"}
              />
            ) : (
              <View style={{ height: 50 }} />
            )
          }
        />
      )}
    </View>
  );
}
