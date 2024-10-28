"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, PlusCircleIcon } from "lucide-react";
import { z } from "zod";

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

const createChapterSchema = z.object({
  title: z
    .string()
    .max(256)
    .min(1, { message: "title of the chapter is required" }),
  description: z.string(),
});

export function CreateChapterButton() {
  const [open, onChangeOpen] = React.useState(false);
  const form = useForm({
    schema: createChapterSchema,
    defaultValues: { title: "", description: "" },
  });
  const router = useRouter();
  const params = useParams();
  const { mutateAsync: createChapter } = api.chapters.create.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("Chapter created");
      form.reset();
      router.refresh();
      onChangeOpen(false);
    },
  });

  async function onSubmit(values: z.infer<typeof createChapterSchema>) {
    await createChapter({
      title: values.title,
      channelId: params.channel_id as string,
      description: values.description,
    });
  }

  return (
    <Dialog onOpenChange={onChangeOpen} open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size={"icon"} className="size-8 w-10" variant={"secondary"}>
              <Plus className="size-5" />
            </Button>
          </DialogTrigger>
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
          <DialogTitle>New Chapter</DialogTitle>
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
              <Button isLoading={form.formState.isSubmitting}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
