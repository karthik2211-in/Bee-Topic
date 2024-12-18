import React from "react";
import { Users } from "lucide-react";

import { DataTable } from "~/components/data-table";
import { api } from "~/trpc/server";
import { SubscribersColumns } from "./columns";

export default async function Page({
  params,
}: {
  params: { channel_id: string };
}) {
  const subscribers = await api.subscriptions.getSubscribers({
    channelId: params.channel_id,
  });
  return (
    <div>
      <div className="top-16 z-50 flex items-center justify-between bg-background/90 py-3 pr-48">
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Subscriptions
          </h4>
          <p className="text-sm text-muted-foreground">
            All subscriptions related details of this channel
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5 py-5 pr-48">
        <DataTable
          emptyStateComponent={
            <div className="flex h-56 flex-col items-center justify-center gap-3">
              <Users className="size-16 text-foreground/40" strokeWidth={1} />
              <div className="flex flex-col items-center justify-center">
                <div className="text-lg font-semibold">No Subscribers</div>
                <p className="w-3/4 text-center text-sm text-muted-foreground">
                  When users subscribe to this channel they will appear here
                </p>
              </div>
            </div>
          }
          columns={SubscribersColumns}
          data={subscribers}
        />
      </div>
    </div>
  );
}
