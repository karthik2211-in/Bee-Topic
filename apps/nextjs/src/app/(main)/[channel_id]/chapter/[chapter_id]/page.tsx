import React from "react";
import { Search } from "lucide-react";

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
    </div>
  );
}
