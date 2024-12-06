import React from "react";
import { Image, View } from "react-native";
import Animated, { Easing, FlipInXDown } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { Check } from "~/lib/icons/Check";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

const subscribeSchema = z.object({
  coupon_code: z
    .string({ required_error: "code must be filled" })
    .min(1, "code must be filled"),
});

export default function Index() {
  const params = useLocalSearchParams<{ channel_id: string }>();

  const channelId = params.channel_id;
  const { data: chaptersList } = api.chapters.all.useQuery({ channelId });
  const utils = api.useUtils();
  const router = useRouter();
  const { mutate: setActiveChapter } =
    api.channels.setActiveChapterForUser.useMutation({
      onSettled(data, error, variables, context) {
        utils.chapters.invalidate();
        router.back();
      },
    });

  return (
    <View style={{ flex: 1 }} className="items-center">
      <Muted className="mb-4 text-base">Chapters</Muted>
      <View className="w-full flex-1 gap-2">
        {chaptersList?.data.map((chapter) => (
          <Button
            variant={"ghost"}
            size={"lg"}
            className="w-full justify-between rounded-none"
            key={chapter.id}
            onPress={() =>
              setActiveChapter({ channelId, activeChapterId: chapter.id })
            }
          >
            <Text
              className={cn(
                "font-normal text-muted-foreground",
                chaptersList.activeChapterId === chapter.id &&
                  "font-semibold text-foreground",
              )}
            >
              {chapter.title}
            </Text>
            {chaptersList.activeChapterId === chapter.id && (
              <Check size={18} className="text-foreground" />
            )}
          </Button>
        ))}
      </View>
    </View>
  );
}
