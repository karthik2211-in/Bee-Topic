import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipPath, Defs, G, Path, Svg } from "react-native-svg";
import { Stack } from "expo-router";

import { H1, Lead, Muted } from "~/components/ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { GoogleSignInButton } from "~/utils/auth";

export default function Index() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page", headerShown: false }} />
      <View className="h-full w-full items-center justify-center gap-8 bg-background p-4">
        <Image
          source={
            isDarkColorScheme
              ? require("assets/TextLogoDark.png")
              : require("assets/TextLogoLight.png")
          }
          style={{ height: 210, width: 210 }}
        />
        <Lead className="text-center text-3xl leading-snug">
          Where Every Bee Gathers Sweet Knowledge 🍯
        </Lead>
        <View className="mt-44 w-full items-center gap-3">
          <Muted className="text-base">continue with one click</Muted>
          <GoogleSignInButton />
        </View>
      </View>
    </SafeAreaView>
  );
}
