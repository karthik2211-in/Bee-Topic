import React from "react";
import { Image, View } from "react-native";
import Animated, { Easing, FlipInXDown } from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { H4, Large, Muted, Small } from "~/components/ui/typography";
import { Crown } from "~/lib/icons/Crown";
import { api } from "~/utils/api";

const subscribeSchema = z.object({
  coupon_code: z
    .string({ required_error: "code must be filled" })
    .min(1, "code must be filled"),
});

export default function Index() {
  const params = useLocalSearchParams<{ channel_id: string }>();
  const form = useForm({
    schema: subscribeSchema,
    mode: "onChange",
  });
  const channelId = params.channel_id;
  const { data: channel } = api.channels.byId.useQuery({ id: channelId });
  const utils = api.useUtils();
  const {
    mutateAsync: validateCoupon,
    isPending,
    isSuccess,
  } = api.subscriptions.validateCouponAndCreate.useMutation({
    onError(error) {
      form.setError(
        "coupon_code",
        { message: error.message, type: "onChange" },
        { shouldFocus: true },
      );
    },
    async onSuccess() {
      await utils.channels.invalidate();
      await utils.chapters.invalidate();
    },
  });

  async function onSubmit(values: z.infer<typeof subscribeSchema>) {
    await validateCoupon({ channelId, coupon: values.coupon_code });
  }

  return (
    <View style={{ flex: 1 }} className="gap-4">
      <H4>Subscription</H4>
      <View className="flex-row gap-3">
        <Image
          source={{
            uri: "https://s2.dmcdn.net/v/PhtPf1ZckrzTH_Sd3/x1080",
          }}
          resizeMode="contain"
          style={{
            width: 80,
            height: 20,
            aspectRatio: 8 / 6,
          }}
        />
        <View className="pt-2">
          <Small>{channel?.title}</Small>
          <View className="gap-1">
            <Muted className="text-xs">Created by</Muted>
            <View className="flex-row items-center gap-1">
              <Avatar
                className="size-5 border border-border"
                alt="Channel Creator"
              >
                <AvatarImage
                  source={{
                    uri: channel?.createdByImageUrl,
                  }}
                />
                <AvatarFallback className="items-center justify-center">
                  <Text>{channel?.createdBy?.charAt(0)}</Text>
                </AvatarFallback>
              </Avatar>
              <Muted className="text-xs font-semibold">
                {channel?.createdBy}
              </Muted>
            </View>
          </View>
        </View>
      </View>
      <Separator />

      {isSuccess ? (
        <View className="items-center gap-2">
          <Animated.View
            entering={FlipInXDown.duration(950)
              .delay(500)
              .springify(2000)
              .easing(Easing.cubic)}
            className="rounded-full border-2 border-primary bg-primary/10 p-6"
          >
            <Crown size={40} strokeWidth={1.25} className="text-primary" />
          </Animated.View>
          <Large className="w-3/4 text-center">
            Hurray! Your a member of this channel now 🥳
          </Large>
          <Muted>You have accessed 3 months worth membership</Muted>
        </View>
      ) : (
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="coupon_code"
              render={({ field }) => (
                <FormItem className="items-center">
                  <FormLabel>Have a coupon code?</FormLabel>
                  <FormControl>
                    <Input
                      textAlign="center"
                      className="h-10 w-full text-primary"
                      autoCapitalize="characters"
                      style={{ fontWeight: "bold" }}
                      {...field}
                      onChangeText={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    A promotion code you will get from creator of this channel
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button isLoading={isPending} onPress={form.handleSubmit(onSubmit)}>
              <Text>Apply</Text>
            </Button>
          </View>
        </Form>
      )}
    </View>
  );
}
