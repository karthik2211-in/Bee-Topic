import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { StyleSheet } from "react-native-css-interop";
import Animated, {
  Easing,
  FadeIn, useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { BlurView } from "expo-blur";

import { H1, Lead, Muted } from "~/components/ui/typography";
import { useColorScheme } from "~/lib/useColorScheme";
import { GoogleSignInButton } from "~/utils/auth";

const AnimatedH1 = Animated.createAnimatedComponent(H1);
const AnimatedLead = Animated.createAnimatedComponent(Lead);
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function GetStarted() {
  const { isDarkColorScheme } = useColorScheme();
  const rotate = useSharedValue(0);
  NavigationBar.setPositionAsync("absolute");

  const animatedImageProps = useAnimatedProps(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  }, []);

  useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration: 10000 }), -1);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={"transparent"} />
      <LinearGradient
        style={{ flex: 1 }}
        colors={[
          "hsla(47.9,95.8%,53.1%,0.3)",
          "hsla(47.9,95.8%,53.1%,0.05)",
          "hsla(47.9,95.8%,53.1%,0.0)",
          "hsla(47.9,95.8%,53.1%,0.05)",
          "hsla(47.9,95.8%,53.1%,0.3)",
        ]}
      />
      {/* <ImageBackground
        source={require("assets/honey-comb.png")}
        style={[StyleSheet.absoluteFill, { flex: 1 }]}
      /> */}
      <BlurView
        blurAmount={40}
        blurType={isDarkColorScheme ? "dark" : "light"}
        style={[StyleSheet.absoluteFill, { flex: 1 }]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            transformOrigin: "center",
          },
        ]}
        className="px-6"
      >
        <AnimatedImage
          role={"img"}
          source={require("assets/honey.png")}
          style={[
            { height: 100, width: 100, marginBottom: 20 },
            animatedImageProps,
          ]}
        />
        <AnimatedH1
          entering={FadeIn.duration(1000).easing(Easing.linear)}
          className="text-center"
        >
          Collect, Grow, Thrive
        </AnimatedH1>
        <AnimatedLead
          entering={FadeIn.duration(1000).delay(300).easing(Easing.linear)}
          className="text-center"
        >
          Where Every Bee Gathers Sweet Knowledge.
        </AnimatedLead>
        <GoogleSignInButton />
        <Muted>by continuing you'll accept all our terms and conditions</Muted>
      </View>
    </View>
  );
}
