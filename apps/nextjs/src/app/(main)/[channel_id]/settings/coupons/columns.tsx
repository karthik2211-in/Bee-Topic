"use client";

import { ColumnDef } from "@tanstack/react-table";

import { RouterOutputs } from "@bt/api";

export type Coupon = RouterOutputs["coupons"]["all"][0];

export const CouponColumns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "startsOn",
    header: "Starts On",
  },
  {
    accessorKey: "endsOn",
    header: "Expires On",
  },
];
