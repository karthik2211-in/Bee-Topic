"use client";

import React from "react";
import { useParams } from "next/navigation";

import { Button } from "@bt/ui/button";

import { DataTable } from "~/components/data-table";
import { api } from "~/trpc/react";
import { CouponColumns } from "./columns";
import SearchCoupon from "./search-coupon";

export default function Page() {
  const channelId = useParams().channel_id as string;
  const [Coupons] = api.coupons.all.useSuspenseQuery({ channelId });
  return (
    <div>
      <div className="sticky top-16 z-50 flex items-start justify-between bg-background/90 pr-48">
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Coupons
          </h4>
          <p className="text-sm text-muted-foreground">
            Create offer coupons for your costomer for this channel
            subscriptions.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5 py-5">
        <div className="flex gap-3">
          <SearchCoupon />
          <Button variant={"secondary"} size={"lg"}>
            Create
          </Button>
        </div>
        <DataTable columns={CouponColumns} data={Coupons} />
      </div>
    </div>
  );
}
