import React from "react";
import { MouseIcon } from "lucide-react";

export default function page() {
  return (
    <section className="mx-auto flex h-full w-full flex-1 flex-col items-center justify-center gap-2">
      <MouseIcon className="size-14" strokeWidth={1.25} />
      <div className="text-lg font-semibold">No chapters selected</div>
      <p className="text-sm text-muted-foreground">
        Select by click on one chapter from left sidebar
      </p>
    </section>
  );
}
