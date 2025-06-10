import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import VideoPlayer from "~/components/video-player";
import { api } from "~/utils/api";

export default function VideoScreen() {
  const params = useLocalSearchParams<{ id: string; next: string }>();
  const videoId = params.id;
  const nextVideoId = params.next;
  const [viewRecorded, setViewRecorded] = React.useState(false);
  const { data: videoDetails } = api.videos.byId.useQuery({
    video_file_key: videoId,
  });
  const { mutate: incrementView } = api.videos.incrementView.useMutation();

  //Segments of the video watched by the user
  const [watchSegments, setWatchSegments] = useState<
    { from: number; to: number }[] | never
  >([]);
  const [currentStartTime, setCurrentStartTime] = useState<null | number>(null);
  const [currentEndTime, setCurrentEndTime] = useState<null | number>(null);
  const [currentTime, setCurrentTime] = useState(0); // in seconds

  const { mutate: createAnalytic } = api.analytics.create.useMutation({});

  // When the video starts playing, set the start time
  const startSegment = (currentTime: number) => {
    setCurrentStartTime(currentTime);
  };

  // When the video pauses or stops, capture the segment and reset start time
  const endSegment = (currentTime: number) => {
    if (currentStartTime !== null) {
      setWatchSegments((segments) => [
        ...segments,
        { from: currentStartTime, to: currentTime },
      ]);
      setCurrentStartTime(null);
    }
  };

  const navigation = useNavigation();

  //create analytics data for watched segments
  useEffect(() => {
    const listner = navigation.addListener("beforeRemove", (e) => {
      if (watchSegments.length > 0 && currentStartTime) {
        [...watchSegments, { from: currentStartTime, to: currentTime }].forEach(
          (segment) => {
            createAnalytic({ ...segment, videoId: videoDetails?.id ?? "" });
          },
        );
      } else {
        createAnalytic({
          from: currentStartTime ?? 0,
          to: currentTime,
          videoId: videoDetails?.id ?? "",
        });
      }
      console.log(watchSegments);
    });

    return () => {
      listner();
    };
  }, [currentTime, watchSegments]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animationMatchesGesture: true,
          orientation: "landscape",
        }}
        redirect={!videoDetails?.chapters.channel.isSubscribed}
      />
      <VideoPlayer
        videoId={videoId}
        metadata={{
          title: videoDetails?.title ?? "",
          description: `${videoDetails?.chapters.channel.title} ( ${videoDetails?.chapters.title} )`,
        }}
        // FooterComponent={
        //   <Link
        //     style={{ opacity: nextVideoId ? 1 : 0 }}
        //     disabled={!nextVideoId}
        //     href={`/videos/${nextVideoId}?next=${""}`}
        //     replace
        //     asChild
        //   >
        //     <Button variant={"ghost"} className="h-10 active:bg-transparent">
        //       <SkipForward size={18} className="text-foreground" />
        //       <Text>Next Video</Text>
        //     </Button>
        //   </Link>
        // }
        onStatusChange={({ isPlaying }) => {
          if (isPlaying && currentStartTime === null) {
            startSegment(currentTime); // Start a new segment if video is playing
          } else if (!isPlaying && currentStartTime !== null) {
            endSegment(currentEndTime ?? currentTime); // End the current segment if video stops or pauses
            setCurrentEndTime(null); // after added make end time to null to detect again the another segment
          }
          console.log("Triggered", isPlaying);
        }}
        onProgress={(currentTime) => {
          if (currentTime >= 1 && !viewRecorded && videoDetails?.id) {
            incrementView(videoDetails.id);
            setViewRecorded(true); // Ensure it only triggers once
          }

          setCurrentTime(currentTime);
        }}
        videoSource={`https://utfs.io/f/${videoId}`}
        nextVideoSource={nextVideoId && `https://utfs.io/f/${nextVideoId}`}
      />
    </>
  );
}
