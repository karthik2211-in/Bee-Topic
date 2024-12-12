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
      className="mt-1 flex gap-2 overflow-hidden border-0 p-3 shadow-none"
      {...props}
    >
      <View className="flex-shrink flex-row">
        <CardContent className="rounded-sm p-0 pt-1">
          <AspectRatio
            ratio={9 / 6}
            style={{ width: 94, height: 64 }}
            className="overflow-hidden rounded-sm border border-border/40 bg-accent/80 object-cover"
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
        <CardHeader className="h-full w-full flex-shrink items-start justify-between gap-2 px-3 py-0">
          <View className="gap-1">
            <CardTitle className="text-base">{videoData?.title}</CardTitle>
            <CardDescription className="p-0 text-foreground/70">
              {formatDuration(videoData.duration)} •{" "}
              {formatViewCount(videoData.viewCount ?? 0)} views
            </CardDescription>
            {videoData.description && (
              <Muted className="text-xs">{videoData.description}</Muted>
            )}
          </View>
        </CardHeader>
      </View>
    </Card>
  );
});
