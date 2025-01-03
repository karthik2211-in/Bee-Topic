"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@bt/ui/textarea";
import { toast } from "@bt/ui/toast";

import { api } from "~/trpc/react";
import { UploadDropzone } from "~/utils/uploadthing";
import { DeleteChannelDialog } from "../../create-channel";

const channelDetailsSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  thumbneilId: z.string().optional(),
});

export default function Page() {
  const params = useParams();
  const { data: video, isLoading } = api.channels.byId.useQuery({
    id: params.channel_id as string,
  });
  const utils = api.useUtils();
  const form = useForm({
    schema: channelDetailsSchema,
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const { mutateAsync: updateChannel } = api.channels.update.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      router.refresh();
      utils.videos.invalidate();
      form.reset({
        title: data[0]?.title,
        description: data[0]?.description ?? "",
        thumbneilId: data[0]?.thumbneilId ?? "",
      });
    },
  });

  const router = useRouter();

  async function onSubmitVideo(values: z.infer<typeof channelDetailsSchema>) {
    await updateChannel({ id: params.channel_id as string, ...values });
    toast.success("Channels details saved");
  }

  React.useEffect(() => {
    form.reset({
      title: video?.title,
      description: video?.description ?? "",
      thumbneilId: video?.thumbneilId ?? "",
    });
  }, [isLoading]);

  if (isLoading)
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <Loader2
          strokeWidth={1.25}
          className="size-10 animate-spin text-foreground"
        />
      </div>
    );
  return (
    <div className="relative w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitVideo)}>
          <div className="flex items-start justify-between bg-background/90 py-3 pr-48">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Channel Details
            </h4>

            <div className="space-x-3">
              <DeleteChannelDialog channelId={params.channel_id as string}>
                <Button
                  type="button"
                  variant={"ghost"}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </DeleteChannelDialog>
              <Button
                disabled={!form.formState.isDirty}
                isLoading={form.formState.isSubmitting}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-5 py-5 pr-32">
            <div className="col-span-3 w-full space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Title
                      <span className="text-xs text-muted-foreground">
                        {" (Required)"}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Untitled"
                        {...field}
                      />
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
                    <FormLabel> Description</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" rows={10} {...field} />
                    </FormControl>
                    <FormDescription>
                      Tell more about the channel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2 w-full">
              <FormField
                control={form.control}
                name="thumbneilId"
                render={({ field }) => (
                  <div className="relative flex aspect-auto h-60 w-full items-center justify-center overflow-hidden rounded-md border bg-background/90">
                    {field.value ? (
                      <Image
                        alt="thumbneil"
                        fill
                        src={`https://utfs.io/f/${field.value}`}
                      />
                    ) : (
                      <UploadDropzone
                        className="ut-button:bg-secondary ut-button:after:bg-primary ut-button:text-secondary-foreground ut-button:hover:opacity-90 ut-button:ring-primary ut-button:outline-primary ut-button:w-full h-full border-none"
                        endpoint={"imageUploader"}
                        onClientUploadComplete={async (res) => {
                          field.onChange(res.at(0)?.key);
                          console.log("response", res);
                          await updateChannel({
                            id: params.channel_id as string,
                            ...form.getValues(),
                            thumbneilId: res.at(0)?.key,
                          });
                          toast.success("Channel thumbneil updated");
                        }}
                      />
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
