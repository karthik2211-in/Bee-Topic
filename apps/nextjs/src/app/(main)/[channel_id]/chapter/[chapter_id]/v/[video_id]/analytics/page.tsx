"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@bt/ui/chart";
import { Button } from "@bt/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bt/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@bt/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bt/ui/select";
import { Skeleton } from "@bt/ui/skeleton";

import { api } from "~/trpc/react";

const chartConfig = {
  watchtime: {
    label: "Watch Time",
    color: "hsl(47.9 95.8% 61%)",
  },
} satisfies ChartConfig;

export default function Page() {
  const params = useParams();
  const videoId = params.video_id as string;
  const [filterType, setFilterType] = useState<"month" | "week">("week");

  const { data, isLoading } = api.analytics.getVideoWatchTime.useQuery({
    videoId,
    range: filterType,
  });

  return (
    <div className="pr-48">
      <div className="h-16">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Video Analytics
        </h4>
      </div>
      <Card className="shadow-none">
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-2">
            <CardDescription>{"Watch time (minutes)"}</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <CardTitle className="text-2xl">{data?.totalWatchTime}</CardTitle>
            )}
          </div>
          <Select
            value={filterType}
            onValueChange={(value: "month" | "week") => setFilterType(value)}
          >
            <SelectTrigger className="w-[140px] justify-center gap-5">
              <SelectValue placeholder="Select a filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-80 min-h-[200] w-full"
            >
              <LineChart accessibilityLayer data={data?.rows}>
                <CartesianGrid vertical={false} />
                {/* <ChartLegend content={<ChartLegendContent />} /> */}
                <ChartTooltip
                  label={"How"}
                  content={
                    <ChartTooltipContent
                      indicator="dashed"
                      labelKey="date"
                      labelFormatter={(label: Date, payload) => {
                        const item = payload.at(0)?.payload;
                        const date = item.date as Date;
                        return format(date, "LLL, d");
                      }}
                    />
                  }
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  tickCount={10}
                  axisLine={false}
                  tickFormatter={(value) => format(value as Date, "LLL, d")}
                />
                <YAxis
                  dataKey="watchtime"
                  tickLine={false}
                  tickMargin={10}
                  tickCount={10}
                  axisLine={false}
                  orientation="right"
                />
                <Line
                  isAnimationActive={false}
                  dot={false}
                  dataKey="watchtime"
                  stroke="var(--color-watchtime)"
                  strokeWidth={2}
                  type={"bump"}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
