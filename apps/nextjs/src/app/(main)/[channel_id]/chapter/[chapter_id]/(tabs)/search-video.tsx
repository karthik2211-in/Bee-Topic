"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, XCircleIcon } from "lucide-react";

import { Button } from "@bt/ui/button";
import { Input } from "@bt/ui/input";

export default function SearchVideo() {
  const searchParams = useSearchParams();
  const videoQuery = searchParams.get("video");
  const router = useRouter();
  const pathname = usePathname();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const deleteQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <div className="relative flex w-full items-center">
      <Search className="absolute ml-2.5 mr-2.5 size-4 text-muted-foreground" />
      <Input
        placeholder="Search video..."
        value={videoQuery ?? ""}
        onChange={(e) =>
          router.push(
            pathname + "?" + createQueryString("video", e.target.value),
          )
        }
        className="h-10 ps-8"
      />
      {videoQuery && (
        <Button
          size={"icon"}
          variant={"ghost"}
          className="absolute right-0 hover:bg-transparent"
          onClick={() =>
            router.push(pathname + "?" + deleteQueryString("video", videoQuery))
          }
        >
          <XCircleIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}
