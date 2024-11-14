"use client";

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

  const { data, trpc } = api.analytics.getVideoWatchTime.useQuery({
    videoId,
    range: "month",
  });

  return (
    <div className="px-8 py-5">
      <div className="h-16">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Video Analytics
        </h4>
      </div>
      <Card className="shadow-none">
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-2">
            <CardDescription>{"Watch time (minutes)"}</CardDescription>
            <CardTitle className="text-2xl">{data?.totalWatchTime}</CardTitle>
          </div>
          <Button variant={"ghost"}>2024</Button>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-96 min-h-[200] w-full"
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
                tickCount={100}
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
        </CardContent>
      </Card>
    </div>
  );
}
