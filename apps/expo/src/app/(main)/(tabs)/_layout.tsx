import React from "react";
import { Stack, Tabs } from "expo-router";

import { Text } from "~/components/ui/text";
import { Home } from "~/lib/icons/Home";
import { User } from "~/lib/icons/User";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            borderTopWidth: 0.2, // Remove top border
            elevation: 0, // Remove shadow for Android
            height: 54,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarItemStyle: {
              paddingTop: 10,
              alignItems: "center",
              justifyContent: "center",
            },
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 10 }}>Home</Text>
            ),
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarItemStyle: {
              paddingTop: 10,
              alignItems: "center",
              justifyContent: "center",
            },
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 10 }}>Profile</Text>
            ),
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
    </>
  );
}
