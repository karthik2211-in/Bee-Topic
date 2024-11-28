"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircleIcon } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@bt/ui/dialog";
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

const createChannelSchema = z.object({
  title: z
    .string()
    .max(256)
    .min(1, { message: "title of the channel is required" }),
  description: z.string().optional(),
});

export function CreateChannelButton() {
  const [open, onChangeOpen] = React.useState(false);
  const form = useForm({
    schema: createChannelSchema,
    defaultValues: { title: "" },
  });
  const router = useRouter();
  const utils = api.useUtils();
  const { mutateAsync: createChannel } = api.channels.create.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("Channel created");
      form.reset();
      router.refresh();
      utils.channels.invalidate();
      onChangeOpen(false);
    },
  });

  async function onSubmit(values: z.infer<typeof createChannelSchema>) {
    await createChannel({
      title: values.title,
      description: values.description,
    });
  }

  return (
    <Dialog onOpenChange={onChangeOpen} open={open}>
      <DialogTrigger asChild>
        <Button size={"lg"} className="gap-2">
          <PlusCircleIcon className="size-4" />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[45%] max-w-md">
        <DialogHeader>
          <DialogTitle>New Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    Recommended to increase the accessbility
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button isLoading={form.formState.isSubmitting}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteChannelDialog({
  channelId,
  children,
}: {
  channelId: string;
  children: React.ReactNode;
}) {
  const [open, onChangeOpen] = React.useState(false);

  const router = useRouter();

  const utils = api.useUtils();

  const { mutateAsync: deleteChapter, isPending } =
    api.channels.delete.useMutation({
      onError(error) {
        toast.error(error.message);
      },
      onSettled() {
        router.prefetch("/"); //prefetch the changed channels list before navigation
        toast.info("Channel deleted");
        utils.channels.invalidate();
        router.push("/");
        onChangeOpen(false);
      },
    });

  async function handleDelete() {
    await deleteChapter(channelId);
  }

  return (
    <AlertDialog open={open} onOpenChange={onChangeOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="top-[35%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            channel and remove your content within your channel
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
