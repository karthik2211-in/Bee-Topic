import { Stack } from "expo-router/stack";

export default function MainStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        animation: "fade",
        headerShadowVisible: false,
      }}
    />
  );
}
