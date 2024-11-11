import React from "react";
import { Stack, Tabs } from "expo-router";

import { Home } from "~/lib/icons/Home";
import { User } from "~/lib/icons/User";

export default function TabsLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        screenOptions={{
          tabBarStyle: {
            borderTopWidth: 0.2, // Remove top border
            elevation: 0, // Remove shadow for Android
            height: 54,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
    </>
  );
}
