"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";

import { Button } from "@bt/ui/button";
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

const signInSchema = z.object({
  email: z.string().email().min(1, "Required"),
});

export default function Page() {
  const form = useForm({
    schema: signInSchema,
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {};

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mb-40 flex w-1/4 flex-col items-center gap-3">
        <h3 className="text-xl font-semibold">🐝 BeeTopic - Console</h3>
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <p className="text-muted-foreground">Continue with dashboard</p>
        <Form {...form}>
          <form
            className="w-full space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size={"lg"} className="w-full">
              Continue <ArrowRight className="size-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
