import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0.2, // Remove top border
          elevation: 0, // Remove shadow for Android
          height: 54,
        },

        tabBarShowLabel: false,
      }}
    />
  );
}
