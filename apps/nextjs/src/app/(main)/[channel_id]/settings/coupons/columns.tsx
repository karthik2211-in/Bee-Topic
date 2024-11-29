"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { RouterOutputs } from "@bt/api";
import { Button } from "@bt/ui/button";

export type Coupon = RouterOutputs["coupons"]["all"][0];

export const CouponColumns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell(props) {
      const searchParams = useSearchParams();
      const router = useRouter();
      const pathname = usePathname();

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
          className="pointer-events-auto z-40"
          variant={"link"}
        >
          {props.row.original.code}
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell(props) {
      return (
        <p className="text-sm text-muted-foreground">
          {props.row.original.description ?? "-"}
        </p>
      );
    },
  },
  {
    accessorKey: "startsOn",
    header: "Starts On",
    cell(props) {
      return (
        <p className="text-sm text-muted-foreground">
          {format(props.row.original.startsOn, "do, MMM y")}
        </p>
      );
    },
  },
  {
    accessorKey: "endsOn",
    header: "Expires On",
    cell(props) {
      return (
        <p className="text-sm text-muted-foreground">
          {format(props.row.original.endsOn, "do, MMM y")}
        </p>
      );
    },
  },
];
