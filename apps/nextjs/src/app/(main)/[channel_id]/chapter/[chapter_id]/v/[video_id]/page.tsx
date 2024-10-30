"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Player from "next-video/player";
import { z } from "zod";

import { Button } from "@bt/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@bt/ui/form";
import { Input } from "@bt/ui/input";
import { Textarea } from "@bt/ui/textarea";

import { api } from "~/trpc/react";

// Form schema for video details
const videoDetailsSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
});

export default function Page() {
  const params = useParams();
  const { data: video, isLoading } = api.videos.byId.useQuery({
    id: params.video_id as string,
  });
  const router = useRouter();

  async function onSubmitVideo(values: z.infer<typeof videoDetailsSchema>) {}

  const form = useForm({
    schema: videoDetailsSchema,
    defaultValues: {
      title: video?.title,
      description: video?.description ?? "",
    },
  });

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
          className="aspect-video overflow-hidden rounded-lg border border-primary"
          src={`https://utfs.io/f/${video?.ut_fileKey}`}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitVideo)}
            className="w-full space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Untitled" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Tell more about the video</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
