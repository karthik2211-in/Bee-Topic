"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PlusCircleIcon } from "lucide-react";
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
  const { mutateAsync: createChannel } = api.channels.create.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("Channel created");
      form.reset();
      router.refresh();
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
