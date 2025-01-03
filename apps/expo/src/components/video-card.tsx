import React, { forwardRef } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import * as VideoThumbnails from "expo-video-thumbnails";

import { RouterOutputs } from "@bt/api";

import { formatDuration, formatViewCount } from "~/lib/utils";
import { AspectRatio } from "./ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Muted } from "./ui/typography";

export default forwardRef<
  React.ComponentRef<typeof Card>,
  React.ComponentProps<typeof Card> & {
    videoData: RouterOutputs["videos"]["infinite"]["items"][0];
  }
>(({ videoData, ...props }, ref) => {
  const [thumbneil, setThumbneil] = React.useState<string | null>(null);

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        `https://utfs.io/f/${videoData.ut_fileKey}`,
        {
          time: 20000,
          quality: 1,
          headers: {
            "Cache-Control": "max-age=3600",
          },
        },
      );
      setThumbneil(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  React.useEffect(() => {
    generateThumbnail();
  }, []);

  return (
    <Card
      ref={ref}
      className="mt-1 flex w-full gap-2 rounded-none border-0 p-6 py-3 shadow-none"
      {...props}
    >
      <View className="w-full max-w-full flex-row">
        <CardContent className="rounded-sm p-0 pt-1">
          <AspectRatio
            ratio={9 / 6}
            style={{ width: 94, height: 64 }}
            className="overflow-hidden rounded-md border border-border/40 bg-accent/80 object-cover"
          >
            {thumbneil && (
              <Image
                source={thumbneil}
                style={{ width: 94, height: 64 }}
                contentFit="cover"
                cachePolicy={"memory-disk"}
                transition={100}
              />
            )}
          </AspectRatio>
        </CardContent>
        <CardHeader className="h-full w-full flex-wrap items-start justify-between gap-0.5 py-0">
          <CardTitle className="pr-10 text-base">{videoData?.title}</CardTitle>
          <CardDescription className="p-0 text-foreground/70">
            {formatDuration(videoData.duration)} •{" "}
            {formatViewCount(videoData.viewCount ?? 0)} views
          </CardDescription>
          {videoData.description && (
            <CardDescription className="w-full max-w-full flex-grow-0 pr-20 text-xs">
              {videoData.description}
            </CardDescription>
          )}
        </CardHeader>
      </View>
    </Card>
  );
});
