"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Player from "next-video/player";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@bt/ui/alert-dialog";
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
import { toast } from "@bt/ui/toast";

import { api } from "~/trpc/react";

// Form schema for video details
const videoDetailsSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
});

export function DeleteVideoDialog({
  videoId,
  children,
}: {
  videoId: string;
  children: React.ReactNode;
}) {
  const [open, onChangeOpen] = React.useState(false);

  const router = useRouter();

  const utils = api.useUtils();

  const { mutateAsync: deleteChapter, isPending } =
    api.videos.delete.useMutation({
      onError(error) {
        toast.error(error.message);
      },
      onSuccess() {
        toast.success("Video deleted");
        router.back();
        router.refresh();
        utils.videos.invalidate();
        utils.chapters.invalidate();
        onChangeOpen(false);
      },
    });

  async function handleDelete() {
    await deleteChapter(videoId);
  }

  return (
    <AlertDialog open={open} onOpenChange={onChangeOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="top-[35%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            video and remove your content within your video
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            isLoading={isPending}
            variant={"destructive"}
          >
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Page() {
  const params = useParams();
  const { data: video, isLoading } = api.videos.byId.useQuery({
    id: params.video_id as string,
  });
  const utils = api.useUtils();
  const { mutateAsync: updateVideo } = api.videos.update.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      toast.success("Video details saved");
      router.refresh();
      utils.videos.invalidate();
    },
  });

  const router = useRouter();

  async function onSubmitVideo(values: z.infer<typeof videoDetailsSchema>) {
    await updateVideo({ id: params.video_id as string, ...values });
  }

  const form = useForm({
    schema: videoDetailsSchema,
    defaultValues: {
      title: "",
      description: "",
    },
  });

  React.useEffect(() => {
    form.reset({ title: video?.title, description: video?.description ?? "" });
  }, [isLoading]);

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitVideo)}>
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={() => {
                router.back();
              }}
              size={"lg"}
              variant={"outline"}
            >
              <ArrowLeft />
              Chapter content
            </Button>

            <div className="space-x-3">
              <DeleteVideoDialog videoId={params.video_id as string}>
                <Button type="button" size={"lg"} variant={"destructive"}>
                  Remove
                </Button>
              </DeleteVideoDialog>
              <Button isLoading={form.formState.isSubmitting} size={"lg"}>
                Save
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 px-52 py-10">
            <Player
              accentColor="hsl(45 100% 60%)"
              className="aspect-video overflow-hidden rounded-lg border border-primary"
              src={`https://utfs.io/f/${video?.ut_fileKey}`}
            />
            <div className="w-full space-y-6 py-4">
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
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
