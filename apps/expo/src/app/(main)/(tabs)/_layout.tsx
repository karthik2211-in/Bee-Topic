import React from "react";
import { Tabs } from "expo-router";

import "expo-blur";

import { BlurView } from "expo-blur";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute", // Position the tab bar
          borderTopWidth: 1, // Remove top border
          elevation: 0, // Remove shadow for Android
          height: 64,
        },
        tabBarBackground() {
          return (
            <BlurView
              intensity={100} // Adjust intensity for the blur effect
              tint="dark" // or 'dark'
              style={{ flex: 1 }}
            />
          );
        },
        tabBarShowLabel: false,
      }}
    />
  );
}
