import { Button } from "@bt/ui/button";

import { HydrateClient } from "~/trpc/server";

export default function HomePage() {
  return (
    <HydrateClient>
      <h1>Hello world</h1>
      <Button>Subscribe</Button>
    </HydrateClient>
  );
}
