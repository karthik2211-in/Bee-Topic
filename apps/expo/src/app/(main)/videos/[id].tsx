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
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import * as Orientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import Slider from "@react-native-community/slider";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Muted, Small } from "~/components/ui/typography";
import VideoPlayer from "~/components/video-player";
import { ActivityIndicator } from "~/lib/activity-indicator";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { PauseCircle } from "~/lib/icons/PauseCircle";
import { PlayCircle } from "~/lib/icons/PlayCircle";
import { SkipForward } from "~/lib/icons/SkipForward";
import { StepBack } from "~/lib/icons/StepBack";
import { StepForward } from "~/lib/icons/StepForward";
import { api } from "~/utils/api";

const AnimatedPlayCircle = Animated.createAnimatedComponent(PlayCircle);
const AnimatedPauseCircle = Animated.createAnimatedComponent(PauseCircle);

// export default function VideoPlayer() {
//   const { id: videoId } = useLocalSearchParams<{ id: string }>();
//   const utils = api.useUtils();
//   const navigation = useNavigation();
//   const { data: videoDetails, isLoading } = api.videos.byId.useQuery({
//     id: videoId,
//   });

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

// const handleProgress: ReactVideoEvents["onProgress"] = (progress) => {
//   if (progress.currentTime >= 1 && !viewRecorded && videoDetails?.id) {
//     incrementView(videoDetails.id);
//     setViewRecorded(true); // Ensure it only triggers once
//   }
//   setCurrentTime(progress.currentTime);
// };

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

export default function VideoScreen() {
  const params = useLocalSearchParams<{ id: string; next: string }>();
  const videoId = params.id;
  const nextVideoId = params.next;
  const [viewRecorded, setViewRecorded] = React.useState(false);
  const { data: videoDetails } = api.videos.byId.useQuery({
    video_file_key: videoId,
  });
  const { mutate: incrementView } = api.videos.incrementView.useMutation();

  return (
    <>
      <Stack.Screen
        options={{
          animation: "none",
        }}
      />
      <VideoPlayer
        videoId={videoId}
        metadata={{
          title: videoDetails?.title ?? "",
          description: `${videoDetails?.chapters.channel.title} ( ${videoDetails?.chapters.title} )`,
        }}
        BottomSection={
          <Link
            style={{ opacity: nextVideoId ? 1 : 0 }}
            disabled={!nextVideoId}
            href={`/videos/${nextVideoId}`}
            replace
            asChild
          >
            <Button variant={"ghost"} className="h-10 active:bg-transparent">
              <SkipForward size={18} className="text-foreground" />
              <Text>Next Video</Text>
            </Button>
          </Link>
        }
        onProgress={(currentTime) => {
          if (currentTime >= 1 && !viewRecorded && videoDetails?.id) {
            incrementView(videoDetails.id);
            setViewRecorded(true); // Ensure it only triggers once
          }
        }}
        videoSource={`https://utfs.io/f/${videoId}`}
        nextVideoSource={nextVideoId && `https://utfs.io/f/${nextVideoId}`}
      />
    </>
  );
}
