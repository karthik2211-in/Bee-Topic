import { Stack } from "expo-router/stack";

export default function MainStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    />
  );
}
