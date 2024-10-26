import React from "react";
import { View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Index() {
  const { signOut } = useAuth();
  return (
    <View className="p-4">
      <Text>Index</Text>
      <Button onPress={() => signOut()}>
        <Text>Sign out</Text>
      </Button>
    </View>
  );
}
