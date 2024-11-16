"use client";

import { AppProgressBar as ProgresBar } from "next-nprogress-bar";

export default function ProgresBarProvider() {
  return (
    <ProgresBar
      height="2px"
      color="hsl(47.9 95.8% 53.1%)"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
