import React, { useEffect } from "react";
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useEvent, useEventListener } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import * as Orientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView, VideoViewProps } from "expo-video";
import Slider from "@react-native-community/slider";

import { ActivityIndicator } from "~/lib/activity-indicator";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { PauseCircle } from "~/lib/icons/PauseCircle";
import { PlayCircle } from "~/lib/icons/PlayCircle";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Muted, Small } from "./ui/typography";

const AnimatedPlayCircle = Animated.createAnimatedComponent(PlayCircle);
const AnimatedPauseCircle = Animated.createAnimatedComponent(PauseCircle);
const AnimatedLinearGradientView =
  Animated.createAnimatedComponent(LinearGradient);

const { height, width } = Dimensions.get("screen");

type VideoPlayerMetaData = {
  title: string;
  description?: string;
};

type VideoPlayerProps = Omit<VideoViewProps, "player"> & {
  videoSource: string;
  onProgress?: (currentTime: number) => void;
  nextVideoSource?: string;
  /** Identify your video with unique ID */
  videoId: string;
  metadata?:
    | VideoPlayerMetaData
    | ((videoId: string) => Promise<VideoPlayerMetaData> | VideoPlayerMetaData);
  BottomSection?: React.ReactElement | null;
};

export default function VideoPlayer({
  videoSource,
  onProgress,
  nextVideoSource,
  videoId,
  BottomSection,
  metadata,
  ...videoViewProps
}: VideoPlayerProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(true);
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.bufferOptions = {
      preferredForwardBufferDuration: 50,
      waitsToMinimizeStalling: true,
      prioritizeTimeOverSizeThreshold: true,
    };
    player.audioMixingMode = "duckOthers";
    player.preservesPitch = true;
    player.currentTime = 0;
    player.timeUpdateEventInterval = 1;
    player.play();
  });
  const [md, setMetadata] = React.useState<undefined | VideoPlayerMetaData>(
    typeof metadata === "object" ? metadata : undefined,
  );

  const [showControls, setShowControls] = React.useState(true);

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const { currentTime } = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    bufferedPosition: player.bufferedPosition,
    currentLiveTimestamp: player.currentLiveTimestamp,
    currentOffsetFromLive: player.currentOffsetFromLive,
  });

  //Set Meta data
  useEffect(() => {
    (async () => {
      if (typeof metadata === "function") {
        const md = await metadata?.(videoId);
        setMetadata(md);
      }
    })();
  }, [videoId]);

  useEffect(() => {
    onProgress?.(currentTime); //pass the current time
  }, [currentTime]);

  useEventListener(player, "statusChange", (payload) => {
    console.log("Player error", payload.error);
    console.log("player status", payload.status);
  });

  const controlsTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const startTimeToHideControls = () => {
    // Set a new timeout to hide the controls after 3 seconds
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
      controlsTimeout.current = null; // Reset the timeout reference
    }, 5000);
  };

  const handleControlsVisibility = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current); // Clear the existing timeout
    }

    setShowControls(true); // Show the controls

    startTimeToHideControls();
  };

  const handleControlsClose = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current); // Clear the existing timeout
    }

    setShowControls(false);
  };

  const enterFullScreen = async () => {
    setIsFullScreen(true);
    await NavigationBar.setVisibilityAsync("hidden");
    Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE); // Lock to landscape for full-screen mode
  };

  const exitFullScreen = async () => {
    setIsFullScreen(false);
    await NavigationBar.setVisibilityAsync("visible");
    Orientation.lockAsync(Orientation.OrientationLock.DEFAULT); // Reset to portrait when exiting full-screen
  };

  React.useEffect(() => {
    if (isFullScreen) enterFullScreen();
    else exitFullScreen();
  }, [isFullScreen]);

  function handleBackPress() {
    exitFullScreen();
    return false;
  }

  React.useEffect(() => {
    startTimeToHideControls(); //when initally video starts
  }, []);

  //Exit from the full screen if it clicked back
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress,
    );

    return () => {
      backHandler.remove();
      // if (controlsTimeout) clearTimeout(controlsTimeout); // Clear timeout on unmount
    };
  }, [isFullScreen]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar hidden translucent />
      <TouchableOpacity
        onPress={() => {
          handleControlsVisibility();
        }}
        activeOpacity={1}
        style={styles.contentContainer}
      />
      <VideoView
        {...videoViewProps}
        style={{
          width: "100%",
          flex: 1,
          height,
        }}
        pointerEvents="none"
        player={player}
        nativeControls={false}
        allowsPictureInPicture={false}
        contentFit="contain"
      />
      {showControls && (
        <AnimatedLinearGradientView
          colors={[
            "rgba(0,0,0,0.8)",
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.2)",
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.8)",
          ]}
          pointerEvents={"box-none"}
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.controlsContainer}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => {
              e.stopPropagation();
              handleControlsClose();
            }}
            disabled={!showControls}
            style={styles.controlsInner}
          >
            <Animated.View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                paddingVertical: 5,
              }}
            >
              <Button
                size={"icon"}
                variant={"ghost"}
                className="size-14 rounded-full active:bg-transparent"
                onPress={() => {
                  router.back();
                  exitFullScreen();
                }}
              >
                <ArrowLeft className="text-foreground" />
              </Button>
              <Animated.View className={"gap-1"}>
                <Small className="text-center">{md?.title}</Small>
                <Muted className="text-foreground/60">{md?.description}</Muted>
              </Animated.View>
              <Animated.View className={"w-10"}></Animated.View>
            </Animated.View>
            {player.status === "loading" ? (
              <ActivityIndicator size={52} className="text-white" />
            ) : (
              <Button
                size={"icon"}
                className="size-32 rounded-full active:bg-transparent"
                variant={"ghost"}
                onPress={(e) => {
                  if (isPlaying) {
                    player.pause();
                    if (controlsTimeout.current)
                      clearTimeout(controlsTimeout.current); //prevent closing controls when video is paused
                  } else {
                    if (controlsTimeout.current)
                      clearTimeout(controlsTimeout.current);
                    player.play();
                    startTimeToHideControls();
                  }
                }}
              >
                {isPlaying ? (
                  <AnimatedPauseCircle
                    entering={FadeIn}
                    exiting={FadeOut}
                    size={64}
                    className={"text-white"}
                    strokeWidth={1}
                  />
                ) : (
                  <AnimatedPlayCircle
                    entering={FadeIn}
                    exiting={FadeOut}
                    className={"text-white"}
                    size={64}
                    strokeWidth={1}
                  />
                )}
              </Button>
            )}
            <Animated.View
              pointerEvents={"auto"}
              style={{ width: "100%", flexShrink: 0, gap: 5 }}
            >
              <Animated.View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
                pointerEvents={"auto"}
              >
                <Small>{formatTime(currentTime)}</Small>
                <Slider
                  style={{ width: "90%", height: 26 }}
                  minimumValue={0}
                  disabled={player.status === "idle"}
                  maximumValue={player.duration}
                  value={player.currentTime}
                  removeClippedSubviews
                  onSlidingStart={() => {
                    if (controlsTimeout.current)
                      clearInterval(controlsTimeout.current); //prevent closing controls when sliding
                  }}
                  onSlidingComplete={(time) => {
                    player.currentTime = time;
                    if (!isPlaying) player.play(); //play if playback is paused
                    startTimeToHideControls(); //after time seek start to hide
                  }}
                  minimumTrackTintColor="hsl(47.9 95.8% 53.1%)"
                  maximumTrackTintColor="white"
                  thumbTintColor="hsl(47.9 95.8% 53.1%)"
                />
                <Small>{formatTime(player.duration)}</Small>
              </Animated.View>
              <Animated.View
                style={{
                  width: "auto",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingHorizontal: 20,
                }}
              >
                {BottomSection}
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        </AnimatedLinearGradientView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 1,
    zIndex: 10,
  },
  controlsContainer: {
    position: "absolute",
    zIndex: 10,
    flex: 1,
    height: "100%",
    width: "auto",
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  controlsInner: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    height: "auto",
    width: "100%",
  },
});

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
