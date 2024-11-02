import React from "react";
import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { H3, Muted } from "~/components/ui/typography";
import { Hash } from "~/lib/icons/Hash";
import { Tv } from "~/lib/icons/Tv";
import { api } from "~/utils/api";

export default function Chapter() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: chapter, isLoading } = api.chapters.byId.useQuery({ id });
  return (
    <View>
      <Stack.Screen
        options={{
          title: "Chapter Details",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 18 },
          headerShadowVisible: false,
        }}
      />
      <Card
        key={chapter?.id}
        className="border-b-hairline overflow-hidden rounded-none border-border/25"
      >
        <CardContent className="border-b-hairline h-56 items-center justify-center bg-primary/20 p-0">
          <Hash size={42} className="text-foreground/30" />
        </CardContent>
        <CardHeader className="p-3">
          <CardTitle>{chapter?.title}</CardTitle>
          <CardDescription className="p-0 text-foreground/70">
            {chapter?.description}
          </CardDescription>
          <Muted>0 Videos</Muted>
          <Card className="flex flex-row items-center overflow-hidden rounded-none border-0">
            <CardContent className="border-hairline aspect-video h-14 w-16 items-center justify-center rounded-sm border-border bg-primary/20 p-0">
              <Tv size={18} className="text-foreground/30" />
            </CardContent>
            <CardHeader className="w-full flex-shrink flex-row items-center justify-between p-3">
              <View className="justify-between">
                <CardTitle className="text-base">{chapter?.title}</CardTitle>
                <CardDescription className="p-0 text-xs text-foreground/70">
                  200 Subscribers
                </CardDescription>
              </View>
              <Button size={"sm"} className="rounded-full">
                <Text>Subscribe</Text>
              </Button>
            </CardHeader>
          </Card>
        </CardHeader>
      </Card>
    </View>
  );
}
