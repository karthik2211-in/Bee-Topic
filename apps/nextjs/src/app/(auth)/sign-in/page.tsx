"use client";

import React from "react";
import { useSignIn } from "@clerk/nextjs";
import { SignInStatus } from "@clerk/types";
import { ArrowRight, Loader2Icon } from "lucide-react";
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
import { Input } from "@bt/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@bt/ui/input-otp";
import { toast } from "@bt/ui/toast";

const signInSchema = z.object({
  email: z.string().email().min(1, "Required"),
});

const verifySchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function Page() {
  const { isLoaded, setActive, signIn } = useSignIn();
  const [status, setStatus] = React.useState<SignInStatus | null>(null);
  const signInform = useForm({
    schema: signInSchema,
    defaultValues: {
      email: "",
    },
  });

  const verifyform = useForm({
    schema: verifySchema,
    defaultValues: {
      code: "",
    },
  });

  const onCreateSignin = async (values: z.infer<typeof signInSchema>) => {
    try {
      if (isLoaded) {
        const signInFlow = await signIn.create({
          identifier: values.email,
          strategy: "email_code",
        });
        setStatus(signInFlow.status);
      }
    } catch (e: any) {
      toast.error("Error signing in", {
        description: e.errors[0].message,
        position: "bottom-center",
      });
    }
  };

  const onVerifyCode = async (values: z.infer<typeof verifySchema>) => {
    try {
      if (isLoaded) {
        const signInFlow = await signIn.attemptFirstFactor({
          code: values.code,
          strategy: "email_code",
        });
        if (signInFlow.status === "complete")
          setActive({ session: signInFlow.createdSessionId });
      }
    } catch (e: any) {
      toast.error("Verification Error", {
        description: e.errors[0].longMessage,
        position: "bottom-center",
      });
    }
  };

  const renderForm = () => {
    switch (status) {
      case "needs_first_factor":
        return (
          <>
            <h2 className="text-2xl font-semibold">Verification</h2>
            <p className="text-center text-muted-foreground">
              verify your email to continue
            </p>
            <Form key={"verify-form"} {...verifyform}>
              <form
                className="w-full space-y-6"
                onSubmit={verifyform.handleSubmit(onVerifyCode)}
              >
                <FormField
                  control={verifyform.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col items-center">
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="text-center">
                        Please enter your one-time-code sent your email{" "}
                        <p className="text-foreground">
                          {signInform.getValues().email}
                        </p>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={verifyform.formState.isSubmitting}
                  size={"lg"}
                  className="w-full"
                >
                  Verify{" "}
                  {verifyform.formState.isSubmitting ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : null}
                </Button>
              </form>
            </Form>
          </>
        );

      default:
        return (
          <>
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-muted-foreground">Continue with dashboard</p>
            <Form key={"indentifier-form"} {...signInform}>
              <form
                className="w-full space-y-6"
                onSubmit={signInform.handleSubmit(onCreateSignin)}
              >
                <FormField
                  control={signInform.control}
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
                <Button
                  size={"lg"}
                  className="w-full"
                  disabled={signInform.formState.isSubmitting}
                >
                  Continue{" "}
                  {signInform.formState.isSubmitting ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                </Button>
              </form>
            </Form>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mb-40 flex w-1/4 flex-col items-center gap-3">
        <h3 className="text-xl font-semibold">🐝 BeeTopic - Console</h3>
        {renderForm()}
      </div>
    </div>
  );
}
