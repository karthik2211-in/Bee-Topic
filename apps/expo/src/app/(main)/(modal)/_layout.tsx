import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Stack, useRouter } from "expo-router";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

export default function ModalLayout() {
  const modalRef = React.useRef<BottomSheetModal>(null);
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "containedTransparentModal",
          animation: "slide_from_bottom",
        }}
      />
      <BottomSheet
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: isDarkColorScheme
            ? NAV_THEME.dark.background
            : NAV_THEME.light.background,
        }}
        onClose={() => router.back()}
        handleComponent={(props) => (
          <Animated.View
            {...props}
            className="border-b-hairline items-center justify-center border-b-border bg-background py-4"
          >
            <View className="h-1.5 w-16 rounded-full bg-accent" />
          </Animated.View>
        )}
        style={{ borderTopEndRadius: 10, overflow: "hidden" }}
        index={0}
        ref={modalRef}
        snapPoints={["75%", "100%"]}
      >
        <BottomSheetView
          style={{ flex: 1 }}
          className="gap-5 bg-popover px-3 py-5"
        >
          <Stack
            screenOptions={{
              presentation: "transparentModal",
              headerShown: false,
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
