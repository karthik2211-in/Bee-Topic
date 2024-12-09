import { useSegments } from "expo-router";
import { Tabs } from "expo-router/tabs";

import { Text } from "~/components/ui/text";
import { Home } from "~/lib/icons/Home";
import { User } from "~/lib/icons/User";

export default function TabsLayout() {
  const segment = useSegments();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            borderTopWidth: 0.2, // Remove top border
            elevation: 0, // Remove shadow for Android
            height: 64,
            display: segment["0"] === "videos" ? "none" : "flex",
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarItemStyle: {
              alignItems: "center",
              justifyContent: "center",
            },
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 10 }}>Home</Text>
            ),
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Home
                fillOpacity={0.19}
                fill={focused ? color : "transparent"}
                color={color}
                size={size}
                strokeWidth={0.5}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarItemStyle: {
              alignItems: "center",
              justifyContent: "center",
            },
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 10 }}>Profile</Text>
            ),
            tabBarIcon: ({ color, size, focused }) => (
              <User
                fillOpacity={0.19}
                fill={focused ? color : "transparent"}
                color={color}
                size={size}
                strokeWidth={0.5}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
