import { ActivityIndicator as Loader } from "react-native";

import { useColorScheme } from "./useColorScheme";

export function ActivityIndicator(props: React.ComponentProps<typeof Loader>) {
  const { isDarkColorScheme } = useColorScheme();
  return <Loader color={isDarkColorScheme ? "white" : "black"} {...props} />;
}
