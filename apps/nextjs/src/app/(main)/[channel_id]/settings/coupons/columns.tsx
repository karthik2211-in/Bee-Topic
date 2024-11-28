"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { RouterOutputs } from "@bt/api";

export type Coupon = RouterOutputs["coupons"]["all"][0];

export const CouponColumns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell(props) {
      return <span className="text-primary">{props.row.original.code}</span>;
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
