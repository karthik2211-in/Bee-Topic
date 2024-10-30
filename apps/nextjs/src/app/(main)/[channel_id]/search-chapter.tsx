"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@bt/ui/input";

export default function SearchChapter() {
  const searchParams = useSearchParams();
  const chapterQuery = searchParams.get("chapter");
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

  return (
    <div className="relative flex w-full items-center">
      <Search className="absolute ml-2.5 mr-2.5 size-4 text-muted-foreground" />
      <Input
        placeholder="Search chapter..."
        value={chapterQuery ?? ""}
        onChange={(e) =>
          router.push(
            pathname + "?" + createQueryString("chapter", e.target.value),
          )
        }
        className="h-8 ps-8"
      />
    </div>
  );
}
