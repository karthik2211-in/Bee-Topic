import { View } from "react-native";

import { H1 } from "~/components/ui/typography";
import { GoogleSignInButton } from "~/utils/auth";

export default function GetStarted() {
  return (
    <View style={{ flex: 1 }}>
      <H1>Welcome to Beetopic</H1>
      <H1>Welcome to KUmar</H1>
      <GoogleSignInButton />
    </View>
  );
}
