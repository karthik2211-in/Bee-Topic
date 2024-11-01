import React from "react";
import { ScrollView, View } from "react-native";
import { Tabs } from "expo-router";

import { Home } from "~/lib/icons/Home";

export default function Index() {
  return (
    <ScrollView className="p-4">
      <Tabs.Screen
        options={{
          title: "Home",
          headerTitle: "🐝 BeeTopic",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
    </ScrollView>
  );
}
