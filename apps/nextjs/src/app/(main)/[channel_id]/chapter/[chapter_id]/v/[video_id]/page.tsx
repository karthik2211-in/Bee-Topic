"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Player from "next-video/player";

import { Button } from "@bt/ui/button";

import { api } from "~/trpc/react";

export default function Page() {
  const params = useParams();
  const { data: video, isLoading } = api.videos.byId.useQuery({
    id: params.video_id as string,
  });
  const router = useRouter();

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2
          strokeWidth={1.25}
          className="size-20 animate-spin text-primary"
        />
      </div>
    );
  return (
    <div className="w-full p-4">
      <div className="flex justify-between">
        <Button onClick={() => router.back()} size={"lg"} variant={"outline"}>
          <ArrowLeft />
          Chapter content
        </Button>

        <div className="space-x-3">
          <Button size={"lg"} variant={"destructive"}>
            Remove
          </Button>
          <Button size={"lg"}>Save</Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 px-52 py-10">
        <Player
          accentColor="hsl(45 100% 60%)"
          className="overflow-hidden rounded-lg border border-primary"
          src={`https://utfs.io/f/${video?.ut_fileKey}`}
        />
      </div>
    </div>
  );
}
