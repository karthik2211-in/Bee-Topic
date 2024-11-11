"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus, PlusCircleIcon } from "lucide-react";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@bt/ui/alert-dialog";
import { Button, buttonVariants } from "@bt/ui/button";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@bt/ui/tooltip";

import { api } from "~/trpc/react";
import { getChapterById } from "~/utils/actions";

const createChapterSchema = z.object({
  title: z
    .string()
    .max(256)
    .min(1, { message: "title of the chapter is required" }),
  description: z.string(),
});

export function CreateChapterDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const [open, onChangeOpen] = useState(false);

  const form = useForm({
    schema: createChapterSchema,
    defaultValues: async () => {
      return {
        title: "",
        description: "",
      };
    },
    mode: "onChange",
    resetOptions: {
      keepDefaultValues: true,
    },
    reValidateMode: "onChange",
  });

  const router = useRouter();

  const utils = api.useUtils();

  const { mutateAsync: createChapter } = api.chapters.create.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("Chapter created");
      form.reset();
      router.refresh();
      utils.chapters.invalidate();
      onChangeOpen(false);
    },
  });

  async function handleSubmit(values: z.infer<typeof createChapterSchema>) {
    await createChapter({
      title: values.title,
      channelId: params.channel_id as string,
      description: values.description,
    });
  }

  return (
    <Dialog key={"Create Chapter"} onOpenChange={onChangeOpen} open={open}>
      {/**Disable the tooltip when it's edit mode */}
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
        </TooltipTrigger>
        <TooltipContent
          className="bg-secondary text-secondary-foreground"
          side="right"
          sideOffset={10}
        >
          Create Chapter
        </TooltipContent>
      </Tooltip>
      <DialogContent className="top-[35%] max-w-md">
        <DialogHeader>
          <DialogTitle>{"New Chapter"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
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
                    <Textarea className="resize-none" rows={4} {...field} />
                  </FormControl>
                  <FormDescription>
                    It's recommended to add to give a context of the chapter
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button isLoading={form.formState.isSubmitting}>
                {"Create"}
              </Button>
            </DialogFooter>
          </form>
          {/* )} */}
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EditChapterDialog({
  chapterId,
  children,
}: {
  chapterId: string;
  children: React.ReactNode;
}) {
  const params = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, onChangeOpen] = React.useState(false);

  const form = useForm({
    schema: createChapterSchema,
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const fetchDetails = React.useCallback(async () => {
    setIsLoading(true);
    const data = await getChapterById(chapterId);
    form.reset({ title: data?.title, description: data?.description ?? "" });
    setIsLoading(false);
  }, [chapterId]);

  React.useEffect(() => {
    if (open) fetchDetails();
  }, [open]);

  const router = useRouter();

  const utils = api.useUtils();

  const { mutateAsync: updateChapter } = api.chapters.update.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.info("Chapter details updted");
      form.reset();
      router.refresh();
      utils.chapters.invalidate();
      onChangeOpen(false);
    },
  });

  async function handleSubmit(values: z.infer<typeof createChapterSchema>) {
    await updateChapter({
      id: chapterId,
      channelId: params.channel_id as string,
      ...values,
    });
  }

  return (
    <Dialog onOpenChange={onChangeOpen} open={open}>
      {/**Disable the tooltip when it's edit mode */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="top-[35%] max-w-md">
        <DialogHeader>
          <DialogTitle>{"Edit Chapter"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          {isLoading ? (
            <div className="flex h-20 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
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
                      <Textarea className="resize-none" rows={4} {...field} />
                    </FormControl>
                    <FormDescription>
                      It's recommended to add to give a context of the chapter
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  disabled={!form.formState.isDirty}
                  isLoading={form.formState.isSubmitting}
                >
                  Save Details
                </Button>
              </DialogFooter>
            </form>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteChapterDialog({
  chapterId,
  children,
}: {
  chapterId: string;
  children: React.ReactNode;
}) {
  const params = useParams();
  const [open, onChangeOpen] = React.useState(false);

  const router = useRouter();

  const utils = api.useUtils();

  const { mutateAsync: deleteChapter, isPending } =
    api.chapters.delete.useMutation({
      onError(error) {
        toast.error(error.message);
      },
      onSuccess() {
        toast.success("Chapter deleted");
        router.push(`/${params.channel_id}`);
        router.refresh();
        utils.chapters.invalidate();
        onChangeOpen(false);
      },
    });

  async function handleDelete() {
    await deleteChapter(chapterId);
  }

  return (
    <AlertDialog open={open} onOpenChange={onChangeOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="top-[35%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            chapter and remove your content within your chapter
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
