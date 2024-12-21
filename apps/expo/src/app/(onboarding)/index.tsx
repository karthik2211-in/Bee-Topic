import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, useClerk, useSession, useUser } from "@clerk/clerk-expo";
import { BlurView } from "@react-native-community/blur";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { H3, Lead, Muted } from "~/components/ui/typography";
import { User } from "~/lib/icons/User";
import { useColorScheme } from "~/lib/useColorScheme";
import { api } from "~/utils/api";

const academicSchema = z.object({
  institutionName: z.object({ value: z.string(), label: z.string() }),
  course: z.object({ value: z.string(), label: z.string() }),
});

const AnimatedAvatar = Animated.createAnimatedComponent(Avatar);
const AnimatedH3 = Animated.createAnimatedComponent(H3);

export default function Index() {
  const { user } = useUser();
  const { session } = useSession();
  const router = useRouter();
  const form = useForm({
    schema: academicSchema,
    mode: "onChange",
  });
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  const { isDarkColorScheme } = useColorScheme();
  const { mutateAsync } = api.auth.updatePublicMetaData.useMutation({
    onSuccess: () => {
      session?.reload();
      router.replace("/(main)");
    },
  });

  const institutions = [
    { label: "BMS College of Engineering", value: "bms" },
    { label: "KIMS College of Nursing", value: "kims" },
    { label: "Dayanada Sagar College of Engineering", value: "dsce" },
    { label: "Sri Venkateshwara College of Engineering", value: "svce" },
    { label: "KIA College of Engineering", value: "kia" },
  ];
  const courses = [
    { label: "B.E. in Computer Science", value: "bcs" },
    { label: "B.E. in Electronics and Communication", value: "bec" },
    { label: "B.E. in Mechanical Engineering", value: "bme" },
    { label: "B.E. in Civil Engineering", value: "bce" },
    { label: "B.E. in Electrical Engineering", value: "bee" },
  ];

  async function onSubmit(values: z.infer<typeof academicSchema>) {
    const { institutionName, course } = values;
    await mutateAsync({
      institutionName: institutionName.value,
      course: course.value,
    });
  }

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <View style={{ flex: 1 }} className="items-center">
      <Animated.View
        entering={FadeIn.duration(1000).delay(1000)}
        className="absolute -top-10 size-52 rounded-full bg-primary"
      />
      <BlurView
        style={[
          StyleSheet.absoluteFill,
          {
            flex: 1,
            alignItems: "center",
            gap: 12,
            paddingTop: 64,
            height: "auto",
            width: "auto",
            // backgroundColor: "red",
          },
        ]}
        blurAmount={64}
        blurType={isDarkColorScheme ? "dark" : "light"}
      />
      <View className="w-full items-center gap-3 px-6 pt-16">
        <StatusBar backgroundColor="transparent" />
        <AnimatedAvatar
          entering={FadeInDown.duration(1000)}
          alt="Avatar"
          className="size-24 border-2 border-border/80"
        >
          <AvatarImage src={user?.imageUrl} source={{ uri: user?.imageUrl }} />
          <AvatarFallback>
            <User
              size={32}
              strokeWidth={0.5}
              className="fill-foreground/10 text-foreground"
            />
          </AvatarFallback>
        </AnimatedAvatar>
        <AnimatedH3 entering={FadeInDown.duration(1000).delay(500)}>
          Hey, {user?.fullName}
        </AnimatedH3>
        <Lead className="text-center">
          Let's get started by adding your academic details
        </Lead>
        <Form {...form}>
          <View className={"w-full gap-6"}>
            <FormField
              control={form.control}
              name="institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          className="native:text-lg text-sm text-foreground"
                          placeholder="Select Institution"
                        />
                      </SelectTrigger>
                      <SelectContent insets={contentInsets} className="w-full">
                        <SelectGroup>
                          <SelectLabel>Institutions</SelectLabel>
                          {institutions.map((institution) => (
                            <SelectItem
                              key={institution.value}
                              label={institution.label}
                              value={institution.value}
                            >
                              {institution.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          className="native:text-lg text-sm text-foreground"
                          placeholder="Select Course"
                        />
                      </SelectTrigger>
                      <SelectContent insets={contentInsets} className="w-full">
                        <SelectGroup>
                          <SelectLabel>Courses</SelectLabel>
                          {courses.map((course) => (
                            <SelectItem
                              key={course.value}
                              label={course.label}
                              value={course.value}
                            >
                              {course.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              isLoading={form.formState.isSubmitting}
              onPress={handleSubmit}
              className="w-full"
            >
              <Text>Continue</Text>
            </Button>
          </View>
        </Form>
      </View>
    </View>
  );
}
