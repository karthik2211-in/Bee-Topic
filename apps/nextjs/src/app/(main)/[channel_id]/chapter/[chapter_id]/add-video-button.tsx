"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PlusCircleIcon } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@bt/ui/sheet";
import { Textarea } from "@bt/ui/textarea";
import { toast } from "@bt/ui/toast";

import { api } from "~/trpc/react";
import { UploadButton, UploadDropzone } from "~/utils/uploadthing";

// Form schema for video details
const addVideoSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  fileKey: z.string().min(1, "Upload a video file"),
});

export default function AddVideoButton() {
  const form = useForm({ schema: addVideoSchema });
  const params = useParams();
  const { mutateAsync: addVideo } = api.videos.create.useMutation();
  const [open, setOpen] = React.useState(false);

  async function onSubmitVideo(values: z.infer<typeof addVideoSchema>) {
    try {
      await addVideo({
        title: values.title,
        description: values.description,
        chapterId: params.chapter_id as string,
        ut_fileKey: values.fileKey,
        isPublished: true,
      });
      setOpen(false);
      toast.success("Video added successfully");
    } catch (e) {}
  }

  return (
    <Sheet
      open={open}
      onOpenChange={async (isOpen) => {
        setOpen(isOpen);
      }}
    >
      <SheetTrigger asChild>
        <Button size={"lg"}>
          <PlusCircleIcon className="size-4" />
          Add New
        </Button>
      </SheetTrigger>
      <SheetContent className="w-2/5 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>New Video</SheetTitle>
          <SheetDescription>
            Fill in the details below to add a new video to the chapter.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitVideo)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="fileKey"
              render={({ field }) => (
                <FormItem>
                  {field.value ? (
                    <div>
                      <Player
                        accentColor="hsl(45 100% 60%)"
                        src={`https://utfs.io/f/${field.value}`}
                      />
                      <UploadButton
                        className="ut-button:bg-secondary ut-button:after:bg-primary ut-button:text-secondary-foreground ut-button:hover:opacity-90 ut-button:ring-primary ut-button:outline-primary ut-button:w-full"
                        endpoint={"videoUploader"}
                        onClientUploadComplete={(res) => {
                          field.onChange(res.at(0)?.key);
                          console.log("response", res);
                        }}
                      />
                    </div>
                  ) : (
                    <UploadDropzone
                      className="ut-button:bg-secondary ut-button:after:bg-primary ut-button:text-secondary-foreground ut-button:hover:opacity-90 ut-button:ring-primary ut-button:outline-primary"
                      endpoint={"videoUploader"}
                      onClientUploadComplete={(res) => {
                        field.onChange(res.at(0)?.key);
                        console.log("response", res);
                      }}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <SheetFooter>
              <Button
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                type="submit"
                size="lg"
              >
                Publish
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
