import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import Orientation from "react-native-orientation-locker";
import { SafeAreaView } from "react-native-safe-area-context";
import Video, { ReactVideoEvents, VideoRef } from "react-native-video";
import * as NavigationBar from "expo-navigation-bar";
import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import Slider from "@react-native-community/slider";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowLeft, Minimize2 } from "lucide-react-native";

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
import { H3, H4, Muted } from "~/components/ui/typography";
import { Maximize2 } from "~/lib/icons/Maximize2";
import { PauseCircle } from "~/lib/icons/PauseCircle";
import { PlayCircle } from "~/lib/icons/PlayCircle";
import { Sprout } from "~/lib/icons/Sprout";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

export default function VideoPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const utils = api.useUtils();
  const { data: videoDetails, isLoading } = api.videos.byId.useQuery({ id });
  const { mutate: incrementView } = api.videos.incrementView.useMutation();
  const { mutate: subscribe, isPending: isSubscribing } =
    api.subscriptions.create.useMutation({
      onSuccess(data, variables, context) {
        console.log(data, variables, context);
      },
      onSettled() {
        utils.invalidate();
      },
    });
  const { mutate: unSubscribe, isPending: isUnSubscribing } =
    api.subscriptions.delete.useMutation({
      onSuccess(data, variables, context) {
        console.log(data, variables, context);
      },
      onSettled() {
        utils.invalidate();
      },
    });
  const [viewRecorded, setViewRecorded] = useState(false);
  const videoRef = useRef<VideoRef>(null);
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout>();

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const handleLoad: ReactVideoEvents["onLoad"] = (meta) => {
    setDuration(meta.duration);
  };

  const handleProgress: ReactVideoEvents["onProgress"] = (progress) => {
    if (progress.currentTime >= 1 && !viewRecorded && videoDetails?.id) {
      incrementView(videoDetails.id);
      setViewRecorded(true); // Ensure it only triggers once
    }
    setCurrentTime(progress.currentTime);
  };

  const handleEnd = () => {
    setPaused(true);
  };

  const handleSeek = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
  };

  const enterFullScreen = () => {
    setIsFullScreen(true);
    NavigationBar.setVisibilityAsync("hidden");
    Orientation.lockToLandscape(); // Lock to landscape for full-screen mode
  };

  const exitFullScreen = () => {
    setIsFullScreen(false);
    NavigationBar.setVisibilityAsync("visible");
    Orientation.lockToPortrait(); // Reset to portrait when exiting full-screen
  };

  const handleBackPress = () => {
    if (isFullScreen) {
      exitFullScreen();
      return true; // Prevent default back action
    }
    return false; // Allow default back action
  };

  // Auto-hide controls after 3 seconds
  const resetControlsTimeout = () => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => setShowControls(false), 3000);
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    resetControlsTimeout(); // Reset on initial render and control toggles
  }, [showControls, isFullScreen]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress,
    );

    return () => {
      backHandler.remove();
      if (controlsTimeout) clearTimeout(controlsTimeout); // Clear timeout on unmount
    };
  }, [isFullScreen, controlsTimeout]);

  useEffect(() => {
    if (!isFullScreen) {
      Orientation.lockToPortrait();
    }
  }, [isFullScreen]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: videoDetails?.chapters.title ?? "",
          headerTitleAlign: "center",
          headerShown: false,
          fullScreenGestureEnabled: true,
          presentation: "containedModal",
          animation: "slide_from_bottom",
          animationDuration: 10,
          headerRight: () => <Muted>1/3</Muted>,
        }}
      />
      <StatusBar
        hidden={isFullScreen}
        style="auto"
        animated
        hideTransitionAnimation="fade"
      />
      {isLoading && !videoDetails ? (
        <View
          style={{
            flex: 1,
            height: "100%",
            width: "auto",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={{
              position: "relative",
              backgroundColor: "black",
              flex: isFullScreen ? 1 : undefined,
            }}
            activeOpacity={1}
            onPress={() => setShowControls(!showControls)}
          >
            <View
              style={{
                backgroundColor: "black",
                height: isFullScreen ? "100%" : undefined,
                width: isFullScreen ? "100%" : undefined,
              }}
            >
              <Video
                source={{
                  uri: `https://utfs.io/f/${videoDetails?.ut_fileKey}`,
                }}
                style={{
                  width: "100%",
                  height: isFullScreen ? "100%" : (70 * 19) / 6,
                }}
                controls={false}
                ref={videoRef}
                paused={paused}
                onLoad={handleLoad}
                onProgress={handleProgress}
                onEnd={handleEnd}
                resizeMode="contain"
                onBuffer={(e) => setIsBuffering(e.isBuffering)}
              />
              {isBuffering ? (
                <View
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <ActivityIndicator size={"large"} color={"white"} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowControls(!showControls)}
                  activeOpacity={1}
                  style={{
                    position: "absolute",
                    opacity: showControls ? 1 : 0,
                    pointerEvents: showControls ? "auto" : "none",
                  }}
                  className="h-full w-full items-center justify-between bg-black/60"
                >
                  {/**Header */}
                  <View className="w-full flex-row items-center justify-between p-5">
                    <TouchableOpacity
                      onPress={() =>
                        isFullScreen ? exitFullScreen() : router.back()
                      }
                    >
                      <ArrowLeft size={24} color={"#ffff"} strokeWidth={1.25} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        isFullScreen ? exitFullScreen() : enterFullScreen()
                      }
                    >
                      {isFullScreen ? (
                        <Minimize2
                          size={24}
                          color={"#ffff"}
                          strokeWidth={1.25}
                        />
                      ) : (
                        <Maximize2
                          size={24}
                          color={"#ffff"}
                          strokeWidth={1.25}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  {/**Middle */}
                  <TouchableOpacity onPress={togglePlayPause}>
                    {paused ? (
                      <PlayCircle strokeWidth={1} size={64} color={"#ffff"} />
                    ) : (
                      <PauseCircle strokeWidth={1} size={64} color={"#ffff"} />
                    )}
                  </TouchableOpacity>

                  {/**Footer */}
                  <View
                    className={cn(
                      "w-full flex-shrink flex-row items-center justify-between px-3 py-2",
                      isFullScreen && "py-5",
                    )}
                  >
                    <View className="w-full flex-shrink">
                      <Text className="mr-4 self-end text-white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </Text>
                      <Slider
                        style={{ width: "auto", flexShrink: 1 }}
                        minimumValue={0}
                        maximumValue={duration}
                        value={currentTime}
                        onSlidingComplete={(time) => handleSeek(time)}
                        minimumTrackTintColor="green"
                        maximumTrackTintColor="green"
                        thumbTintColor="green"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>

          {!isFullScreen && (
            <View className="gap-3 p-4">
              <H3>{videoDetails?.title}</H3>
              <Muted className="text-xs">
                {videoDetails?.viewCount &&
                  formatViewCount(videoDetails.viewCount)}{" "}
                views •{" "}
                {videoDetails?.createdAt &&
                  formatDistanceToNowStrict(videoDetails?.createdAt, {
                    addSuffix: true,
                  })}
              </Muted>
              {videoDetails?.description && (
                <Muted>{videoDetails?.description}</Muted>
              )}
              <Card className="flex flex-row items-center gap-2 overflow-hidden p-3">
                <CardContent className="aspect-video h-16 w-20 items-center justify-center rounded-lg border border-border bg-primary/5 p-0">
                  <Sprout size={18} className="text-foreground/30" />
                </CardContent>
                <CardHeader className="w-full flex-shrink flex-row items-center justify-between p-0">
                  <View className="w-1/2 justify-between">
                    <CardTitle
                      className="text-sm"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {videoDetails?.chapters.channel?.title}
                    </CardTitle>
                    <CardDescription className="p-0 text-xs text-foreground/70">
                      {videoDetails?.chapters.channel.subscriptionsCount}{" "}
                      Subscribers
                    </CardDescription>
                  </View>
                  <Button
                    size={"sm"}
                    disabled={isSubscribing || isUnSubscribing}
                    onPress={() =>
                      videoDetails?.chapters?.channel?.isSubscribed
                        ? unSubscribe({
                            channelId: videoDetails?.chapters?.channelId ?? "",
                          })
                        : subscribe({
                            channelId: videoDetails?.chapters?.channelId ?? "",
                          })
                    }
                    variant={
                      videoDetails?.chapters?.channel?.isSubscribed
                        ? "secondary"
                        : "default"
                    }
                    // disabled
                    className="rounded-full"
                  >
                    <Text>
                      {videoDetails?.chapters?.channel?.isSubscribed
                        ? "Subscribed"
                        : "Subscribe to Watch"}
                    </Text>
                  </Button>
                </CardHeader>
              </Card>
              <View className="flex-row items-center gap-2">
                <Avatar className="size-6" alt="Channel Creator">
                  <AvatarImage
                    source={{
                      uri: videoDetails?.chapters.channel.createdByImageUrl,
                    }}
                  />
                  <AvatarFallback className="items-center justify-center">
                    <Text>
                      {videoDetails?.chapters.channel.createdBy?.charAt(0)}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <Muted>
                  {videoDetails?.chapters.channel.createdBy} • Creator of this
                  channel{" "}
                </Muted>
              </View>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

// Helper function to format time for display
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export function formatViewCount(number: number) {
  if (number >= 1_000_000_000) {
    return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return number.toString();
}
