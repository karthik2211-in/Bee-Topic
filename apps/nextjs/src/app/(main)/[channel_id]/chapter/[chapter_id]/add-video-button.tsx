"use client";

import React from "react";
import { PlusCircleIcon } from "lucide-react";

import { Button } from "@bt/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@bt/ui/sheet";

export default function AddVideoButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"lg"}>
          <PlusCircleIcon className="size-4" />
          Add New
        </Button>
      </SheetTrigger>
      <SheetContent className="w-2/5 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>New Video</SheetTitle>
          <SheetDescription>
            Fill in the details below to add a new video to the chapter.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button size={"lg"}>Add</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
