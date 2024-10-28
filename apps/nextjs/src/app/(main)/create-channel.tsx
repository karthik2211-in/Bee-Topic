"use client";

import React from "react";
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

const createChannelSchema = z.object({
  title: z
    .string()
    .max(256)
    .min(1, { message: "title of the channel is required" }),
});

export function CreateChannelButton() {
  const [open, onChangeOpen] = React.useState(false);
  const form = useForm({ schema: createChannelSchema });

  async function onSubmit(values: z.infer<typeof createChannelSchema>) {}

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
          <form>
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
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={() => onChangeOpen(false)} variant={"secondary"}>
            Cancel
          </Button>
          <Button
            isLoading={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
