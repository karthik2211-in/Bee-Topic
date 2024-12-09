import React from "react";
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvent, useEventListener } from "expo";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import * as Orientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import Slider from "@react-native-community/slider";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Muted, Small } from "~/components/ui/typography";
import { ActivityIndicator } from "~/lib/activity-indicator";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { PauseCircle } from "~/lib/icons/PauseCircle";
import { PlayCircle } from "~/lib/icons/PlayCircle";
import { SkipForward } from "~/lib/icons/SkipForward";
import { StepBack } from "~/lib/icons/StepBack";
import { StepForward } from "~/lib/icons/StepForward";

const AnimatedPlayCircle = Animated.createAnimatedComponent(PlayCircle);
const AnimatedPauseCircle = Animated.createAnimatedComponent(PauseCircle);

// export default function VideoPlayer() {
//   const { id: videoId } = useLocalSearchParams<{ id: string }>();
//   const utils = api.useUtils();
//   const navigation = useNavigation();
//   const { data: videoDetails, isLoading } = api.videos.byId.useQuery({
//     id: videoId,
//   });
//   const { mutate: incrementView } = api.videos.incrementView.useMutation();
//   const { mutate: subscribe, isPending: isSubscribing } =
//     api.subscriptions.create.useMutation({
//       onSuccess(data, variables, context) {
//         console.log(data, variables, context);
//       },
//       onSettled() {
//         utils.invalidate();
//       },
//     });

//   const { mutate: createAnalytic } = api.analytics.create.useMutation({});
//   const { mutate: unSubscribe, isPending: isUnSubscribing } =
//     api.subscriptions.delete.useMutation({
//       onSuccess(data, variables, context) {
//         console.log(data, variables, context);
//       },
//       onSettled() {
//         utils.invalidate();
//       },
//     });
//   const [viewRecorded, setViewRecorded] = useState(false);
//   const videoRef = useRef<VideoRef>(null);
//   const router = useRouter();
//   const [paused, setPaused] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0); // in seconds
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [showControls, setShowControls] = useState(false);
//   const [isBuffering, setIsBuffering] = useState(false);
//   const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout>();
//   //Segments of the video watched by the user
//   const [watchSegments, setWatchSegments] = useState<
//     { from: number; to: number }[] | never
//   >([]);
//   const [currentStartTime, setCurrentStartTime] = useState<null | number>(null);
//   const [currentEndTime, setCurrentEndTime] = useState<null | number>(null);

//   const togglePlayPause = () => {
//     setPaused(!paused);
//   };

//   const handleLoad: ReactVideoEvents["onLoad"] = (meta) => {
//     setDuration(meta.duration);
//   };

//   const handleProgress: ReactVideoEvents["onProgress"] = (progress) => {
//     if (progress.currentTime >= 1 && !viewRecorded && videoDetails?.id) {
//       incrementView(videoDetails.id);
//       setViewRecorded(true); // Ensure it only triggers once
//     }
//     setCurrentTime(progress.currentTime);
//   };

//   // When the video starts playing, set the start time
//   const startSegment = (currentTime: number) => {
//     setCurrentStartTime(currentTime);
//   };

//   // When the video pauses or stops, capture the segment and reset start time
//   const endSegment = (currentTime: number) => {
//     if (currentStartTime !== null) {
//       setWatchSegments((segments) => [
//         ...segments,
//         { from: currentStartTime, to: currentTime },
//       ]);
//       setCurrentStartTime(null);
//     }
//   };

//   const onPlaybackStatusChange: ReactVideoEvents["onPlaybackStateChanged"] = (
//     status,
//   ) => {
//     if (status.isPlaying && currentStartTime === null) {
//       startSegment(currentTime); // Start a new segment if video is playing
//     } else if (!status.isPlaying && currentStartTime !== null) {
//       endSegment(currentEndTime ?? currentTime); // End the current segment if video stops or pauses
//       setCurrentEndTime(null); // after added make end time to null to detect again the another segment
//     }
//     console.log("Triggered", status);
//   };

//   const handleEnd = () => {
//     setPaused(true);
//   };

//   const handleSeek = (time: number) => {
//     setCurrentEndTime(currentTime); //detect the seek and store the end time before get seek
//     videoRef.current?.seek(time);
//     setCurrentTime(time);
//   };

// const enterFullScreen = () => {
//   setIsFullScreen(true);
//   NavigationBar.setVisibilityAsync("hidden");
//   Orientation.lockToLandscape(); // Lock to landscape for full-screen mode
// };

// const exitFullScreen = () => {
//   setIsFullScreen(false);
//   NavigationBar.setVisibilityAsync("visible");
//   Orientation.lockToPortrait(); // Reset to portrait when exiting full-screen
// };

//   const handleBackPress = () => {
//     exitFullScreen();
//     return false; // Allow default back action
//   };

//   // Auto-hide controls after 3 seconds
//   const resetControlsTimeout = () => {
//     if (controlsTimeout) {
//       clearTimeout(controlsTimeout);
//     }
//     const timeout = setTimeout(() => setShowControls(false), 3000);
//     setControlsTimeout(timeout);
//   };

//   useEffect(() => {
//     resetControlsTimeout(); // Reset on initial render and control toggles
//   }, [showControls, isFullScreen]);

// useEffect(() => {
//   const backHandler = BackHandler.addEventListener(
//     "hardwareBackPress",
//     handleBackPress,
//   );

//   return () => {
//     backHandler.remove();
//     if (controlsTimeout) clearTimeout(controlsTimeout); // Clear timeout on unmount
//   };
// }, [isFullScreen, controlsTimeout]);

//   //Changing the orientation of the screen
//   useEffect(() => {
//     if (!isFullScreen) {
//       Orientation.lockToPortrait();
//     }
//   }, [isFullScreen]);

//   //Enter full screen when the player screen is mounted
//   useEffect(() => {
//     enterFullScreen();
//   }, []);

//   //create analytics data for watched segments
//   useEffect(() => {
//     const listner = navigation.addListener("beforeRemove", (e) => {
//       if (watchSegments.length > 0 && currentStartTime) {
//         [...watchSegments, { from: currentStartTime, to: currentTime }].forEach(
//           (segment) => {
//             createAnalytic({ ...segment, videoId });
//           },
//         );
//       } else {
//         createAnalytic({
//           from: currentStartTime ?? 0,
//           to: currentTime,
//           videoId,
//         });
//       }
//       console.log(watchSegments);
//     });

//     return () => {
//       listner();
//     };
//   }, [currentTime, watchSegments]);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
//       <Tabs.Screen options={{ tabBarStyle: { display: "none" } }} />
//       <Stack.Screen
//         options={{
//           title: videoDetails?.chapters.title ?? "",
//           headerTitleAlign: "center",
//           headerShown: false,
//           fullScreenGestureEnabled: true,
//           orientation: "landscape",
//           animation: "flip",
//         }}
//       />
//       <StatusBar
//         hidden={isFullScreen}
//         style="auto"
//         animated
//         hideTransitionAnimation="fade"
//       />
//       {isLoading && !videoDetails ? (
//         <View
//           style={{
//             flex: 1,
//             height: "100%",
//             width: "auto",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <ActivityIndicator color={"white"} size={40} />
//         </View>
//       ) : (
//         <>
//           <TouchableOpacity
//             style={{
//               position: "relative",
//               backgroundColor: "black",
//               flex: isFullScreen ? 1 : undefined,
//             }}
//             activeOpacity={1}
//             onPress={() => setShowControls(!showControls)}
//           >
//             <View
//               style={{
//                 backgroundColor: "black",
//                 height: isFullScreen ? "100%" : undefined,
//                 width: isFullScreen ? "100%" : undefined,
//               }}
//             >
//               <Video
//                 source={{
//                   uri: `https://utfs.io/f/${videoDetails?.ut_fileKey}`,
//                 }}
//                 style={{
//                   width: "100%",
//                   height: isFullScreen ? "100%" : (70 * 19) / 6,
//                 }}
//                 controls={false}
//                 ref={videoRef}
//                 paused={paused}
//                 onLoad={handleLoad}
//                 onProgress={handleProgress}
//                 onEnd={handleEnd}
//                 resizeMode="contain"
//                 onBuffer={(e) => setIsBuffering(e.isBuffering)}
//                 onPlaybackStateChanged={onPlaybackStatusChange}
//               />
//               {isBuffering ? (
//                 <View
//                   style={{
//                     position: "absolute",
//                     width: "100%",
//                     height: "100%",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     backgroundColor: "transparent",
//                   }}
//                 >
//                   <ActivityIndicator size={40} color={"white"} />
//                 </View>
//               ) : (
//                 <>
//                   {showControls && (
//                     <TouchableOpacity
//                       onPress={() => setShowControls(!showControls)}
//                       activeOpacity={1}
//                       style={{
//                         position: "absolute",
//                       }}
//                       className="h-full w-full items-center justify-between bg-black/60"
//                     >
//                       {/**Header */}
//                       <Animated.View
//                         exiting={FadeInDown}
//                         entering={FadeInUp}
//                         className="w-full flex-row items-center justify-between p-5"
//                       >
//                         <TouchableOpacity
//                           onPress={() => {
//                             exitFullScreen();
//                             router.back();
//                           }}
//                         >
//                           <ArrowLeft
//                             size={24}
//                             color={"#ffff"}
//                             strokeWidth={1.25}
//                           />
//                         </TouchableOpacity>
//                         {/* <TouchableOpacity
//                       onPress={() =>
//                         isFullScreen ? exitFullScreen() : enterFullScreen()
//                       }
//                     >
//                       {isFullScreen ? (
//                         <Minimize2
//                           size={24}
//                           color={"#ffff"}
//                           strokeWidth={1.25}
//                         />
//                       ) : (
//                         <Maximize2
//                           size={24}
//                           color={"#ffff"}
//                           strokeWidth={1.25}
//                         />
//                       )}
//                     </TouchableOpacity> */}
//                       </Animated.View>

//                       {/**Middle */}
//                       <TouchableOpacity onPress={togglePlayPause}>
//                         {paused ? (
//                           <AnimatedPlayCircle
//                             entering={ZoomIn.duration(100)}
//                             strokeWidth={1}
//                             size={64}
//                             color={"#ffff"}
//                           />
//                         ) : (
//                           <AnimatedPauseCircle
//                             strokeWidth={1}
//                             entering={ZoomIn.duration(100)}
//                             size={64}
//                             color={"#ffff"}
//                           />
//                         )}
//                       </TouchableOpacity>

//                       {/**Footer */}
//                       <Animated.View
//                         exiting={FadeInUp}
//                         entering={FadeInDown}
//                         className={cn(
//                           "w-full flex-shrink flex-row items-center justify-between px-3 py-2",
//                           isFullScreen && "py-5",
//                         )}
//                       >
//                         <View className="w-full flex-shrink">
//                           <Text className="mr-4 self-end text-white">
//                             {formatTime(currentTime)} / {formatTime(duration)}
//                           </Text>
// <Slider
//   style={{ width: "auto", flexShrink: 1 }}
//   minimumValue={0}
//   maximumValue={duration}
//   value={currentTime}
//   onSlidingComplete={(time) => handleSeek(time)}
//   minimumTrackTintColor="yellow"
//   maximumTrackTintColor="yellow"
//   thumbTintColor="yellow"
// />
//                         </View>
//                       </Animated.View>
//                     </TouchableOpacity>
//                   )}
//                 </>
//               )}
//             </View>
//           </TouchableOpacity>

//           {/* {!isFullScreen && (
//             <View className="gap-3 p-4">
//               <H3>{videoDetails?.title}</H3>
//               <Muted className="text-xs">
//                 {videoDetails?.viewCount &&
//                   formatViewCount(videoDetails.viewCount)}{" "}
//                 views •{" "}
//                 {videoDetails?.createdAt &&
//                   formatDistanceToNowStrict(videoDetails?.createdAt, {
//                     addSuffix: true,
//                   })}
//               </Muted>
//               {videoDetails?.description && (
//                 <Muted>{videoDetails?.description}</Muted>
//               )}
//               <Card className="flex flex-row items-center gap-2 overflow-hidden p-3">
//                 <CardContent className="aspect-video h-16 w-20 items-center justify-center rounded-lg border border-border bg-primary/5 p-0">
//                   <Sprout size={18} className="text-foreground/30" />
//                 </CardContent>
//                 <CardHeader className="w-full flex-shrink flex-row items-center justify-between p-0">
//                   <View className="w-1/2 justify-between">
//                     <CardTitle
//                       className="text-sm"
//                       numberOfLines={1}
//                       ellipsizeMode="tail"
//                     >
//                       {videoDetails?.chapters.channel?.title}
//                     </CardTitle>
//                     <CardDescription className="p-0 text-xs text-foreground/70">
//                       {videoDetails?.chapters.channel.subscriptionsCount}{" "}
//                       Subscribers
//                     </CardDescription>
//                   </View>
//                   <Button
//                     size={"sm"}
//                     disabled={isSubscribing || isUnSubscribing}
//                     onPress={() =>
//                       videoDetails?.chapters?.channel?.isSubscribed
//                         ? unSubscribe({
//                             channelId: videoDetails?.chapters?.channelId ?? "",
//                           })
//                         : subscribe({
//                             channelId: videoDetails?.chapters?.channelId ?? "",
//                           })
//                     }
//                     variant={
//                       videoDetails?.chapters?.channel?.isSubscribed
//                         ? "secondary"
//                         : "default"
//                     }
//                     // disabled
//                     className="rounded-full"
//                   >
//                     <Text>
//                       {videoDetails?.chapters?.channel?.isSubscribed
//                         ? "Subscribed"
//                         : "Subscribe to Watch"}
//                     </Text>
//                   </Button>
//                 </CardHeader>
//               </Card>
//               <View className="flex-row items-center gap-2">
//                 <Avatar className="size-6" alt="Channel Creator">
//                   <AvatarImage
//                     source={{
//                       uri: videoDetails?.chapters.channel.createdByImageUrl,
//                     }}
//                   />
//                   <AvatarFallback className="items-center justify-center">
//                     <Text>
//                       {videoDetails?.chapters.channel.createdBy?.charAt(0)}
//                     </Text>
//                   </AvatarFallback>
//                 </Avatar>
//                 <Muted>
//                   {videoDetails?.chapters.channel.createdBy} • Creator of this
//                   channel{" "}
//                 </Muted>
//               </View>
//             </View>
//           )} */}
//         </>
//       )}
//     </SafeAreaView>
//   );
// }

// Helper function to format time for display
const { height, width } = Dimensions.get("screen");

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function VideoScreen() {
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
        <Animated.View
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
                <Small className="text-center">Basics of Web</Small>
                <Muted className="text-foreground/60">1. Introduction</Muted>
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
                  pointerEvents="box-only"
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
                <Button
                  disabled={player.status === "loading"}
                  className="h-10 active:bg-transparent"
                  variant={"ghost"}
                  size={"sm"}
                >
                  <SkipForward size={20} className="text-foreground" />
                  <Text className="text-sm">Next Video</Text>
                </Button>
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "transparent",
    position: "absolute",
    height,
    width,
    top: 1,
    zIndex: 10,
  },
  controlsContainer: {
    position: "absolute",
    zIndex: 10,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    height,
    width,
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  controlsInner: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    height,
    width: "100%",
  },
});

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
