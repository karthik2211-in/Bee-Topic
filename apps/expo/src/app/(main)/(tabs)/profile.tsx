import React from "react";
import { Text, View } from "react-native";
import { Tabs } from "expo-router";

export default function Profile() {
  return (
    <View>
      <Tabs.Screen
        options={{
          title: "Profile",
          headerTitle: "🐝 BeeTopic",
        }}
      />
      <Text>Profile</Text>
    </View>
  );
}
