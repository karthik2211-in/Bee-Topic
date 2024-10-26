import React from "react";
import { ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import * as Browser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

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
    >
      {isLoading && <ActivityIndicator color={"black"} />}
      <Text className="font-semibold">Continue with Google</Text>
    </Button>
  );
};
