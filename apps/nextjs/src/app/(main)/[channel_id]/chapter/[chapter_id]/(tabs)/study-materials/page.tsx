import React from "react";
import { Clock10Icon } from "lucide-react";

export default function Page() {
  return (
    <section
      aria-label="Channels Empty"
      className="flex flex-col items-center gap-3 py-40"
    >
      <Clock10Icon className="size-10" strokeWidth={1.25} />
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Comming soon
      </h4>
      <p className="w-1/3 text-center text-sm text-muted-foreground">
        We are trying hard to deliver this feature to you. So please be patience
      </p>
    </section>
  );
}
