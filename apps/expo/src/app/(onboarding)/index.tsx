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

import { Institutions } from "@bt/db/schema";

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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
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
import { H3, Lead } from "~/components/ui/typography";
import { User } from "~/lib/icons/User";
import { useColorScheme } from "~/lib/useColorScheme";
import { api } from "~/utils/api";

const academicSchema = z.object({
  institution: z.object({ value: z.string(), label: z.string() }),
  course: z.object({ value: z.string(), label: z.string() }),
  courseType: z.object({ value: z.string(), label: z.string() }).optional(),
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

  const CourseType: {
    label: string;
    value: typeof Institutions.$inferSelect.type;
  }[] = [
    { label: "PUC", value: "puc" },
    { label: "Diploma", value: "diploma" },
    { label: "Engineering", value: "engineering" },
  ];

  const institutions = api.institutions.getColleges.useQuery(
    {
      type: "engineering",
    },
    // {
    //   enabled: !!form.getValues().courseType?.value,
    // },
  );
  const courses = api.institutions.getCourses.useQuery(
    {
      institutionId: form.getValues().institution?.value,
    },
    {
      enabled: !!form.getValues().institution,
    },
  );

  async function onSubmit(values: z.infer<typeof academicSchema>) {
    const { institution, course } = values;
    await mutateAsync({
      institutionId: institution.value,
      courseId: course.value,
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
          className="size-20 border-2 border-border/80"
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
            {/* <Text>{JSON.stringify(form.getValues(), undefined, 2)}</Text> */}
            <FormField
              control={form.control}
              name="institution"
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
                          {institutions?.data
                            ?.flatMap((course) => ({
                              value: course.id,
                              label: course.name,
                            }))
                            ?.map((institution) => (
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

            {form.getValues().institution && (
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
                        <SelectContent
                          insets={contentInsets}
                          className="w-full"
                        >
                          <SelectGroup>
                            {courses?.data
                              ?.flatMap((course) => ({
                                value: course.id,
                                label: course.name,
                              }))
                              ?.map((course) => (
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
            )}

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
