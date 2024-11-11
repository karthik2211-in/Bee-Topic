import React from "react";
import { ActivityIndicator } from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import * as Linking from "expo-linking";
import * as Browser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void Browser.warmUpAsync();
    return () => {
      void Browser.coolDownAsync();
    };
  }, []);
};

Browser.maybeCompleteAuthSession();

export const GoogleSignInButton = () => {
  void useWarmUpBrowser();
  const [isLoading, setIsLoading] = React.useState(false);
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isDarkColorScheme } = useColorScheme();

  const onPress = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/", { scheme: "beetopic" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
    setIsLoading(false);
  }, []);

  return (
    <Button
      disabled={isLoading}
      size={"lg"}
      onPress={onPress}
      className="w-full"
      variant={"outline"}
    >
      <Svg
        width="20"
        height="20"
        viewBox="0 0 256 262"
        fill="none"
        x="http://www.w3.org/2000/svg"
      >
        <G clipPath="url(#clip0_80418_389)">
          <Path
            d="M255.878 133.451C255.878 122.717 255.007 114.884 253.122 106.761H130.55V155.209H202.497C201.047 167.249 193.214 185.381 175.807 197.565L175.563 199.187L214.318 229.21L217.003 229.478C241.662 206.704 255.878 173.196 255.878 133.451Z"
            fill="#4285F4"
          />
          <Path
            d="M130.55 261.1C165.798 261.1 195.389 249.495 217.003 229.478L175.807 197.565C164.783 205.253 149.987 210.62 130.55 210.62C96.0271 210.62 66.726 187.847 56.281 156.37L54.75 156.5L14.452 187.687L13.925 189.152C35.393 231.798 79.49 261.1 130.55 261.1Z"
            fill="#34A853"
          />
          <Path
            d="M56.281 156.37C53.525 148.247 51.93 139.543 51.93 130.55C51.93 121.556 53.525 112.853 56.136 104.73L56.063 103L15.26 71.312L13.925 71.947C5.077 89.644 0 109.517 0 130.55C0 151.583 5.077 171.455 13.925 189.152L56.281 156.37Z"
            fill="#FBBC05"
          />
          <Path
            d="M130.55 50.479C155.064 50.479 171.6 61.068 181.029 69.917L217.873 33.943C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947L56.1361 104.73C66.7261 73.253 96.0271 50.479 130.55 50.479Z"
            fill="#EB4335"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_80418_389">
            <Rect width="256" height="262" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>

      <Text className="font-semibold">Continue with Google</Text>
      {isLoading && (
        <ActivityIndicator color={isDarkColorScheme ? "white" : "black"} />
      )}
    </Button>
  );
};
