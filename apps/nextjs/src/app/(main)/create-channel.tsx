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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@bt/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@bt/ui/form";
import { Input } from "@bt/ui/input";
import { toast } from "@bt/ui/toast";

import { api } from "~/trpc/react";

const createChannelSchema = z.object({
  title: z
    .string()
    .max(256)
    .min(1, { message: "title of the channel is required" }),
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
    });
  }

  return (
    <Dialog onOpenChange={onChangeOpen} open={open}>
      <DialogTrigger asChild>
        <Button size={"lg"}>
          <PlusCircleIcon className="size-4" />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent className="top-[35%] max-w-md">
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
            <DialogFooter>
              <Button isLoading={form.formState.isSubmitting}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EditChannelDialog({
  children,
  channelId,
}: {
  children: React.ReactNode;
  channelId: string;
}) {
  const [open, onChangeOpen] = React.useState(false);
  const { data: channel, isLoading } = api.channels.byId.useQuery(
    { id: channelId },
    { enabled: open },
  );
  const form = useForm({
    schema: createChannelSchema,
    defaultValues: { title: "" },
  });
  const router = useRouter();
  const utils = api.useUtils();
  const { mutateAsync: updateChannel } = api.channels.update.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.info("Channel details saved");
      form.reset();
      router.refresh();
      utils.channels.invalidate();
      onChangeOpen(false);
    },
  });

  React.useEffect(() => {
    form.reset({ title: channel?.title });
  }, [isLoading]);

  async function onSubmit(values: z.infer<typeof createChannelSchema>) {
    await updateChannel({
      title: values.title,
      id: channelId,
    });
  }

  return (
    <Dialog onOpenChange={onChangeOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="top-[35%] max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex h-20 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ) : (
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
              <DialogFooter>
                <Button
                  disabled={!form.formState.isDirty}
                  isLoading={form.formState.isSubmitting}
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
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
      onSuccess() {
        toast.success("Channel deleted");
        router.refresh();
        utils.channels.invalidate();
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
