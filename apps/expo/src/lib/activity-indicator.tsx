import { ActivityIndicator as Loader } from "react-native";
import { cssInterop } from "nativewind";

import { cn } from "./utils";

cssInterop(Loader, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});

export function ActivityIndicator({
  className,
  ...props
}: React.ComponentProps<typeof Loader>) {
  return <Loader {...props} className={cn("text-foreground", className)} />;
}
