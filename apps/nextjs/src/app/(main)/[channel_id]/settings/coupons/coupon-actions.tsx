import React from "react";
import { useParams, useRouter } from "next/navigation";
import { format, subDays } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { z } from "zod";

import { CreateCouponSchema } from "@bt/db/schema";
import { cn } from "@bt/ui";
import { Button } from "@bt/ui/button";
import { Calendar } from "@bt/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@bt/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bt/ui/select";
import { Textarea } from "@bt/ui/textarea";
import { toast } from "@bt/ui/toast";

import { api } from "~/trpc/react";

export function CreateCouponButton() {
  const params = useParams();
  const channelId = params.channel_id as string;
  const [open, onChangeOpen] = React.useState(false);
  const form = useForm({
    schema: CreateCouponSchema,
    defaultValues: {
      code: "",
      startsOn: new Date(),
      endsOn: new Date(),
      subscriptonFrequency: "monthly",
      subscriptionCount: 1,
    },
  });
  const router = useRouter();
  const utils = api.useUtils();
  const { mutateAsync: createCoupon } = api.coupons.create.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("Coupon created");
      form.reset();
      router.refresh();
      utils.coupons.invalidate();
      onChangeOpen(false);
    },
  });

  async function onSubmit(values: z.infer<typeof CreateCouponSchema>) {
    await createCoupon({
      ...values,
      code: values.code.toUpperCase(),
      channelId,
    });
  }

  return (
    <Dialog onOpenChange={onChangeOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          Create
          <PlusIcon className="size-5" strokeWidth={1.25} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Coupon</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value.toUpperCase()} />
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
                    <Textarea
                      {...field}
                      value={field.value?.toString()}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Recommended to increase the accessbility
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full gap-2">
              <FormField
                control={form.control}
                name="startsOn"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Starts On</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date! > form.getValues().endsOn)
                              form.setValue("endsOn", date ?? new Date());
                            field.onChange(date);
                          }}
                          disabled={(date) => date < subDays(new Date(), 1)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endsOn"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Ends On</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < (form.getValues().startsOn ?? new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subscriptonFrequency"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Subscription Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscriptionCount"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>
                    No. of {form.getValues().subscriptonFrequency}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button size={"lg"} isLoading={form.formState.isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
