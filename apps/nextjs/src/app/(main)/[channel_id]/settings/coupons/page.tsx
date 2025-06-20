import React from "react";
import { TicketPercentIcon } from "lucide-react";

import { DataTable } from "~/components/data-table";
import { api } from "~/trpc/server";
import { CouponColumns } from "./columns";
import { CreateCouponButton, ViewCouponSheetPortal } from "./coupon-actions";
import SearchCoupon from "./search-coupon";

export default async function Page({
  params,
}: {
  params: { channel_id: string };
}) {
  const Coupons = await api.coupons.all({ channelId: params.channel_id });
  return (
    <div>
      <ViewCouponSheetPortal />
      <div className="top-16 z-50 flex items-center justify-between bg-background/90 py-3 pr-48">
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Coupons
          </h4>
          <p className="text-sm text-muted-foreground">
            Create offer coupons for your costomer for this channel
            subscriptions.
          </p>
        </div>
        <CreateCouponButton />
      </div>
      <div className="flex flex-col gap-5 py-5 pr-48">
        <div className="flex gap-3">
          <SearchCoupon />
        </div>
        <DataTable
          emptyStateComponent={
            <div className="flex h-56 flex-col items-center justify-center gap-3">
              <TicketPercentIcon
                className="size-16 text-foreground/40"
                strokeWidth={1}
              />
              <div className="flex flex-col items-center justify-center">
                <div className="text-lg font-semibold">No Coupons</div>
                <p className="w-3/4 text-center text-sm text-muted-foreground">
                  Create coupon to your user to access subscription offers for
                  this channel
                </p>
              </div>
            </div>
          }
          columns={CouponColumns}
          data={Coupons}
        />
      </div>
    </div>
  );
}
