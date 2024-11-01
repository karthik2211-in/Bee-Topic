import React from "react";
import { Text, View } from "react-native";
import { Tabs } from "expo-router";

import { User } from "~/lib/icons/User";

export default function Profile() {
  return (
    <View>
      <Tabs.Screen
        options={{
          title: "Profile",
          headerTitle: "🐝 BeeTopic",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Text>Profile</Text>
    </View>
  );
}
