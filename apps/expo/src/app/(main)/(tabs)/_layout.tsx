import React from "react";
import { Tabs } from "expo-router";

import "expo-blur";

import { BlurView } from "expo-blur";

import { useColorScheme } from "~/lib/useColorScheme";

export default function TabsLayout() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute", // Position the tab bar
          borderTopWidth: 0.2, // Remove top border
          elevation: 0, // Remove shadow for Android
          height: 54,
        },
        tabBarBackground() {
          return (
            <BlurView
              intensity={100} // Adjust intensity for the blur effect
              tint={isDarkColorScheme ? "dark" : "light"} // or 'dark'
              style={{ flex: 1 }}
            />
          );
        },
        tabBarShowLabel: false,
      }}
    />
  );
}
