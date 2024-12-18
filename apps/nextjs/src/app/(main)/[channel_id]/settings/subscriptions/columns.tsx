"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { RouterOutputs } from "@bt/api";
import { Avatar, AvatarFallback, AvatarImage } from "@bt/ui/avatar";
import { Button } from "@bt/ui/button";

export type Subscriber = RouterOutputs["subscriptions"]["getSubscribers"][0];

export const SubscribersColumns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "email",
    header: "Subscriber",
    cell(props) {
      const searchParams = useSearchParams();
      const router = useRouter();
      const pathname = usePathname();
      const row = props.row.original;

      const createQueryString = React.useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set(name, value);

          return params.toString();
        },
        [searchParams],
      );

      return (
        <Button
          onClick={(e) => {
            router.push(
              pathname +
                "?" +
                createQueryString("open_coupon_id", props.row.original.id),
              {
                scroll: false,
              },
            );
          }}
          className="pointer-events-auto z-40 h-full items-center justify-start gap-3"
          variant={"ghost"}
        >
          <Avatar className="size-9 border-2 border-accent-foreground/30">
            <AvatarImage src={row.imageUrl} />
            <AvatarFallback>
              {row?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-start text-sm font-medium">
              {row?.fullName}
            </div>
            <p className="text-sm text-muted-foreground">{row.email}</p>
          </div>
        </Button>
      );
    },
  },
];
