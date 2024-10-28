import React from "react";
import { PlayCircleIcon, Search } from "lucide-react";

import { Button } from "@bt/ui/button";
import { Input } from "@bt/ui/input";

export default function Page() {
  return (
    <div>
      <div className="flex gap-3">
        <div className="relative flex w-full items-center">
          <Search className="absolute ml-2.5 mr-2.5 size-5 text-muted-foreground" />
          <Input placeholder="Search video..." className="h-10 ps-10" />
        </div>
        <Button size={"lg"}>Add New</Button>
      </div>
      <section
        aria-label="Channels Empty"
        className="flex flex-col items-center gap-3 py-40"
      >
        <PlayCircleIcon className="size-10" strokeWidth={1.25} />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          No Videos
        </h4>
        <p className="w-1/3 text-center text-sm text-muted-foreground">
          Start adding videos by clicking on new video. Share your meaning full
          knowledge with bees 🐝
        </p>
      </section>
    </div>
  );
}
