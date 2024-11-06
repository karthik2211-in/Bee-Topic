import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
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
import { ArrowLeft, Minimize2 } from "lucide-react-native";

import { Text } from "~/components/ui/text";
import { H4, Muted } from "~/components/ui/typography";
import { Maximize2 } from "~/lib/icons/Maximize2";
import { PauseCircle } from "~/lib/icons/PauseCircle";
import { PlayCircle } from "~/lib/icons/PlayCircle";
import { api } from "~/utils/api";

export default function VideoPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: videoDetails, isLoading } = api.videos.byId.useQuery({ id });
  const videoRef = useRef<VideoRef>(null);
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout>();

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const handleLoad: ReactVideoEvents["onLoad"] = (meta) => {
    setDuration(meta.duration);
  };

  const handleProgress: ReactVideoEvents["onProgress"] = (progress) => {
    setCurrentTime(progress.currentTime);
  };

  const handleEnd = () => {
    setPaused(true);
    videoRef.current?.seek(0);
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
          animation: "fade_from_bottom",
          headerRight: () => <Muted>1/3</Muted>,
        }}
      />
      <StatusBar
        hidden={isFullScreen}
        style="auto"
        animated
        hideTransitionAnimation="fade"
      />
      {isLoading ? (
        <ActivityIndicator size={"large"} />
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
              />
              {showControls && (
                <TouchableOpacity
                  onPress={() => setShowControls(!showControls)}
                  activeOpacity={1}
                  style={{ position: "absolute" }}
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
                      <PlayCircle strokeWidth={1} size={44} color={"#ffff"} />
                    ) : (
                      <PauseCircle strokeWidth={1} size={44} color={"#ffff"} />
                    )}
                  </TouchableOpacity>

                  {/**Footer */}
                  <View className="w-full flex-shrink flex-row items-center justify-between px-3 py-2">
                    <View className="w-full flex-shrink">
                      <Text className="mr-4 self-end">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </Text>
                      <Slider
                        style={{ width: "100%", flexShrink: 1 }}
                        minimumValue={0}
                        maximumValue={duration}
                        value={currentTime}
                        onValueChange={(time) => handleSeek(time)}
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
            <View className="p-4">
              <H4>{videoDetails?.title}</H4>
              <Muted>{videoDetails?.description}</Muted>
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
