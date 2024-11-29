"use client";

import React, { useEffect } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { format, formatDistanceToNowStrict, subDays } from "date-fns";
import { CalendarIcon, PlusIcon, Users2 } from "lucide-react";
import { z } from "zod";

import { RouterOutputs } from "@bt/api";
import { CreateCouponSchema } from "@bt/db/schema";
import { cn } from "@bt/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@bt/ui/avatar";
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
import { ScrollArea } from "@bt/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bt/ui/select";
import { Separator } from "@bt/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@bt/ui/sheet";
import { Skeleton } from "@bt/ui/skeleton";
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

const addEmailsSchema = z.object({
  emails: z
    .string()
    .refine(
      (value) => {
        return value.split(",").length > 1 || !value.includes(" ");
      },
      {
        message: "Email addresses must be separated by commas.",
      },
    )
    .refine(
      (value) => {
        const emails = value.split(",").map((email) => email.trim());

        try {
          emails.forEach((email) => z.string().email().parse(email));
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "One or more emails are invalid or not properly formatted.",
      },
    ),
});

export function CustomerListItem({
  customer,
}: {
  customer: RouterOutputs["coupons"]["byId"]["customers"][number];
}) {
  const utils = api.useUtils();
  const router = useRouter();
  const { mutateAsync: removeEmail, isPending } =
    api.coupons.removeEmail.useMutation({
      onSuccess(data) {
        toast.info(`${data.at(0)?.email} is removed`);
        utils.coupons.invalidate();
        router.refresh();
      },

      onError() {
        toast.error(`Something went wrong`, {
          description: "Try again later!",
        });
      },
    });

  return (
    <div className="flex items-center justify-between gap-1" key={customer.id}>
      <div className="flex items-center gap-2">
        <Avatar className="size-9 border-2 border-accent-foreground/30">
          <AvatarImage src={customer?.imageUrl} />
          <AvatarFallback>
            {customer.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{customer?.fullName}</div>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
          {!customer.fullName && (
            <p className="text-xs text-muted-foreground/80">
              Not a member of BeeTopic
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <Button
          onClick={() => removeEmail({ couponEmailId: customer.id })}
          isLoading={isPending}
          loadingText=""
          variant={"link"}
          className="px-0"
        >
          Remove
        </Button>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNowStrict(customer.createdAt, {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}

export function ViewCouponSheetPortal() {
  const [open, onChangeOpen] = React.useState(false);
  const [openPopover, onChangeOpenPopover] = React.useState(false);
  const searchParams = useSearchParams();
  const form = useForm({
    schema: addEmailsSchema,
    mode: "onChange",
    defaultValues: {
      emails: "",
    },
  });
  const couponId = searchParams.get("open_coupon_id");
  const { data, isLoading } = api.coupons.byId.useQuery(
    { couponId: couponId! },
    { enabled: !!couponId },
  );
  const utils = api.useUtils();
  const { mutateAsync: addEmail } = api.coupons.addEmail.useMutation({
    onSuccess(data, variables) {
      toast.success(`${variables.email} is added`);
    },
    onSettled() {
      utils.coupons.invalidate();
      router.refresh();
      onChangeOpenPopover(false);
    },
    onError(error, variables) {
      if (error.shape?.code === -32603)
        toast.error(`${variables.email} is already exists`);
      else
        toast.error(`Something went wrong`, {
          description: `When adding the ${variables.email}`,
        });
    },
  });

  const { mutateAsync: deleteCoupon, isPending } =
    api.coupons.delete.useMutation({
      onSuccess(data) {
        toast.info(`${data.at(0)?.code} is deleted`, {
          position: "bottom-center",
        });
        utils.coupons.invalidate();
        router.replace(
          pathname + "?" + deleteQueryString("open_coupon_id", couponId ?? ""),
        );
        router.refresh();
      },

      onError() {
        toast.error(`Something went wrong`, {
          description: `When deleting the code`,
          position: "bottom-center",
        });
      },
    });

  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const deleteQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    onChangeOpen(!!couponId);
  }, [couponId]);

  useEffect(() => {
    setContainer(document.getElementById("settings-section"));
  }, []);

  async function onSubmit(values: z.infer<typeof addEmailsSchema>) {
    await Promise.all(
      values.emails
        .split(",")
        .map((email) =>
          addEmail({ email: email.trim().toLowerCase(), couponId: couponId! }),
        ),
    );
    form.reset();
  }

  return (
    <Sheet
      modal={false}
      open={open}
      onOpenChange={(open) => {
        if (!open && couponId) {
          router.push(
            pathname + "?" + deleteQueryString("open_coupon_id", couponId),
            { scroll: false },
          );
        }
      }}
    >
      <SheetContent
        className="top-16 max-h-[calc(100vh-60px)] space-y-5 bg-background/80 shadow-none backdrop-blur-xl sm:max-w-xl"
        container={container}
      >
        <SheetHeader>
          <SheetTitle className="text-primary">
            {isLoading ? (
              <Skeleton className="mb-3 h-5 w-20 rounded-full" />
            ) : (
              data?.code
            )}
          </SheetTitle>
          {isLoading ? (
            <Skeleton className="h-2 w-60 rounded-full" />
          ) : (
            <SheetDescription
              className={cn(!data?.description && "text-muted-foreground/40")}
            >
              {data?.description ?? "--- no description provided ---"}
            </SheetDescription>
          )}
          {isLoading ? (
            <Skeleton className="h-3 w-60 rounded-full" />
          ) : (
            <small className="text-sm font-medium leading-none">
              Subscription of {data?.subscriptionCount}{" "}
              {data?.subscriptonFrequency == "monthly" ? "month" : "year"}
            </small>
          )}
          {/* <Button variant={"outline"} className="w-full">
            Edit Coupon
          </Button> */}
        </SheetHeader>
        <Separator />
        <div className="flex h-full flex-col gap-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-semibold">Customers</div>
              <p className="text-xs text-muted-foreground">
                All only users access to this coupon
              </p>
            </div>
            <Popover open={openPopover} onOpenChange={onChangeOpenPopover}>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-20">
                  Add <PlusIcon className="size-4" strokeWidth={1.25} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="h-fit w-[400px]">
                <Form {...form}>
                  <form
                    className="space-y-3"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <FormField
                      control={form.control}
                      name="emails"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              rows={4}
                              className="resize-none"
                              placeholder="Enter emails seperated with comma ( , )"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full text-right">
                      <Button isLoading={form.formState.isSubmitting}>
                        Apply
                      </Button>
                    </div>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
          </div>
          <ScrollArea className="max-h-[70%]">
            <div className="flex flex-col gap-3 pb-10 pr-5">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    className="flex items-center justify-between gap-1"
                    key={index}
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-9 rounded-full" />
                      <div>
                        <Skeleton className="mb-2 h-3 w-32 rounded-full" />
                        <Skeleton className="h-2 w-1/2 rounded-full" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="mb-2 h-8 w-20" />
                      <Skeleton className="ml-auto h-1 w-14 rounded-full" />
                    </div>
                  </div>
                ))
              ) : data?.customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20">
                  <Users2
                    className="size-20 text-muted-foreground/50"
                    strokeDasharray={2}
                    strokeDashoffset={4}
                    strokeWidth={0.2}
                  />
                  <p className="w-1/2 text-center text-xs text-muted-foreground/80">
                    Add users to the particular coupon code to restrict the
                    copoun to that users
                  </p>
                </div>
              ) : (
                data?.customers.map((customer) => (
                  <CustomerListItem key={customer.id} {...{ customer }} />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <SheetFooter className="fixed bottom-5 left-5 right-5 w-[90%]">
          <Button
            size={"lg"}
            variant={"outline"}
            isLoading={isPending}
            loadingText="Processing..."
            onClick={() => deleteCoupon({ couponId: couponId! })}
            className="w-full border-destructive bg-background/60 text-destructive backdrop-blur-md hover:bg-background/80 hover:backdrop-blur-2xl"
          >
            Delete Coupon
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
