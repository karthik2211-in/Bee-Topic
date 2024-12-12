import React, { useCallback, useState } from "react";
import { TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import { Tabs } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { Large, Muted } from "~/components/ui/typography";
import { ActivityIndicator } from "~/lib/activity-indicator";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { LogOut } from "~/lib/icons/LogOut";
import { Moon } from "~/lib/icons/Moon";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/utils/cn";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const onSignOut = useCallback(async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  }, []);
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  return (
    <View className="items-center gap-2 py-3">
      <Tabs.Screen
        options={{
          title: "Profile",
          headerTitle: "Profile",
        }}
      />
      <Avatar className="size-28" alt="User Avatar">
        <AvatarImage source={{ uri: user?.imageUrl }} />
        <AvatarFallback>
          <Text>{user?.fullName?.charAt(0)}</Text>
        </AvatarFallback>
      </Avatar>
      <Large>{user?.fullName}</Large>
      <Muted>{user?.primaryEmailAddress?.emailAddress}</Muted>
      <View className="w-full py-5">
        <Separator />
        <TouchableNativeFeedback
          onPress={() => {
            const newTheme = isDarkColorScheme ? "light" : "dark";
            setColorScheme(newTheme);
            setAndroidNavigationBar(newTheme);
            AsyncStorage.setItem("theme", newTheme);
          }}
          className="w-full justify-between"
        >
          <View className="h-14 w-full flex-row items-center justify-between px-8">
            <Text>Swtich to {isDarkColorScheme ? "Light" : "Dark"} Theme</Text>
            {isDarkColorScheme ? (
              <Sun size={20} className="text-foreground" />
            ) : (
              <Moon size={20} className="text-foreground" />
            )}
          </View>
        </TouchableNativeFeedback>
        <Separator />
        <TouchableNativeFeedback
          onPress={() => {
            onSignOut();
          }}
          className="w-full justify-between"
          disabled={isSigningOut}
        >
          <View
            className={cn(
              "h-14 w-full flex-row items-center justify-between px-8",
              isSigningOut && "opacity-60",
            )}
          >
            <Text className="text-destructive">Sign out</Text>
            {isSigningOut ? (
              <ActivityIndicator />
            ) : (
              <LogOut size={20} className="text-destructive" />
            )}
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}
