import { StatusBar, useWindowDimensions, View } from "react-native";

import { H1 } from "~/components/ui/typography";

export default function GetStarted() {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar translucent={true} />

      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height,
          width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <H1>Welcome to Beetopic</H1>
      </View>
    </View>
  );
}
