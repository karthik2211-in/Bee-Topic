"use client";

import React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@bt/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function Page() {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "July", desktop: 214, mobile: 140 },
    { month: "Agust", desktop: 214, mobile: 140 },
    { month: "September", desktop: undefined, mobile: undefined },
    { month: "October", desktop: undefined, mobile: undefined },
    { month: "November", desktop: undefined, mobile: undefined },
    { month: "December", desktop: undefined, mobile: undefined },
  ];
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
            <CardDescription>{"Watch time (hours)"}</CardDescription>
            <CardTitle className="text-2xl">34</CardTitle>
          </div>
          <Button variant={"ghost"}>2024</Button>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="h-80 min-h-[100px] w-full"
          >
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <ChartLegend content={<ChartLegendContent />} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <Line
                dot={false}
                dataKey="desktop"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                type={"natural"}
              />
              <Line
                dot={false}
                dataKey="mobile"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                type={"natural"}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
