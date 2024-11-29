"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, XCircleIcon } from "lucide-react";

import { Button } from "@bt/ui/button";
import { Input } from "@bt/ui/input";

export default function SearchCoupon() {
  const searchParams = useSearchParams();
  const channelQuery = searchParams.get("coupon");
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
        placeholder="Search coupons..."
        value={channelQuery ?? ""}
        onChange={(e) =>
          router.push(
            pathname + "?" + createQueryString("coupon", e.target.value),
          )
        }
        className="h-10 ps-8"
      />
      {channelQuery && (
        <Button
          size={"icon"}
          variant={"ghost"}
          className="absolute right-0 hover:bg-transparent"
          onClick={() =>
            router.push(
              pathname + "?" + deleteQueryString("coupon", channelQuery),
            )
          }
        >
          <XCircleIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}
