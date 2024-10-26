import { TouchableNativeFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, Large, Lead, Muted } from "~/components/ui/typography";

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page", headerShown: false }} />
      <View className="h-full w-full items-center justify-center gap-8 bg-background p-4">
        <H1>BeeTopic</H1>
        <Lead className="text-center text-3xl leading-snug">
          Where students collects the knowledge like bees 🐝 gathering honey 🍯
        </Lead>
        <View className="mt-40 w-full items-center gap-3">
          <Muted className="text-base">continue with one click</Muted>
          <Button size={"lg"} className="w-full">
            <Text className="font-semibold">Continue with Google</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
