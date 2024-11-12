import "@bacons/text-decoder/install";

import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";

import { TRPCProvider } from "~/utils/api";

import "expo-router";
import "../styles.css";

import React from "react";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";

import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

// This is the main layout of the app
// It wraps your pages with the providers they need

function InitialLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");

      if (!theme) {
        setAndroidNavigationBar(colorScheme);
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      setAndroidNavigationBar(colorTheme);

      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }

      setIsColorSchemeLoaded(true);
    })().finally(() => {
      if (isLoaded) {
        const isAuthSegment = segments[0] === "(auth)";

        if (isSignedIn && isAuthSegment) {
          router.replace("/(main)");
        } else if (!isSignedIn) {
          router.replace("/(auth)");
        }
        SplashScreen.hideAsync();
      }
    });
  }, [isSignedIn, isLoaded]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <Slot screenOptions={{ headerShown: false }} />
      <StatusBar
        style={"auto"}
        backgroundColor={
          isDarkColorScheme
            ? DARK_THEME.colors.background
            : LIGHT_THEME.colors.background
        }
      />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const tokenCache = {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <TRPCProvider>
          {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
          */}
          <InitialLayout />
        </TRPCProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
