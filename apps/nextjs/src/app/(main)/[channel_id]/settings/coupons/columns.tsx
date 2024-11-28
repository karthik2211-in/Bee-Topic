"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { RouterOutputs } from "@bt/api";
import { Button } from "@bt/ui/button";

import { ViewCouponSheet } from "./coupon-actions";

export type Coupon = RouterOutputs["coupons"]["all"][0];

export const CouponColumns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell(props) {
      return (
        <>
          <ViewCouponSheet>
            <Button className="pointer-events-auto z-40" variant={"link"}>
              {props.row.original.code}
            </Button>
          </ViewCouponSheet>
        </>
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
          {format(props.row.original.startsOn, "do, MMM Y")}
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
          {format(props.row.original.endsOn, "do, MMM Y")}
        </p>
      );
    },
  },
];
