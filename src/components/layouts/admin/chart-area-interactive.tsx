"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartLead } from "@/services/leads";

export const description = "An interactive area chart";

const chartConfig = {
  Advertisement: {
    label: "Advertisement",
    color: "#f94144",
  },
  Cold_Outreach: {
    label: "Cold Outreach",
    color: "#f3722c",
  },
  Email_Campaign: {
    label: "Email Campaign",
    color: "#f8961e",
  },
  Other: {
    label: "Other",
    color: "#f9844a",
  },
  Phone_Call: {
    label: "Phone Call",
    color: "#f9c74f",
  },
  Referral: {
    label: "Referral",
    color: "#90be6d",
  },
  Social_Media: {
    label: "Social Media",
    color: "#43aa8b",
  },
  Trade_Show: {
    label: "Trade Show",
    color: "#4d908e",
  },
  Website: {
    label: "Website",
    color: "#577590",
  },
  total: {
    label: "Total",
    color: "#414141",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  chartLead,
}: {
  chartLead: ChartLead[] | null;
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const chartData = chartLead;
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    if (!chartData?.length || !chartData) return [];

    // find latest day in data
    const referenceDate = new Date(
      Math.max(...chartData.map((d) => new Date(d.day).getTime()))
    );

    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() - daysToSubtract);

    // filter by date + flatten sources
    return chartData
      .filter((item) => {
        const date = new Date(item.day);
        return date >= startDate && date <= referenceDate;
      })
      .map((item) => {
        const flattened: Record<string, number | string | Date> = {
          day: item.day, // keep original string
          date: new Date(item.day), // add proper Date object for XAxis
        };

        let total = 0;
        for (const [key, value] of Object.entries(item.sources)) {
          const safeKey = key.replace(/\s+/g, "_");
          flattened[safeKey] = value;
          total += value as number;
        }

        flattened.Total = total;

        return flattened;
      });
  }, [chartData, timeRange]);
  console.log(filteredData);
  if (!chartLead) return;
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Conversion</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return value.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? 1 : 10}
              content={({ label, payload }) => {
                if (!payload?.length) return null;

                const data = payload[0].payload; // row from filteredData

                // Define colors per source
                const sourceColors = Object.fromEntries(
                  Object.entries(chartConfig).map(([key, { label, color }]) => [
                    key,
                    { label, color },
                  ])
                ) as Record<string, { label: string; color: string }>;
                return (
                  <div className="rounded-lg border bg-white p-2 shadow-md">
                    <div className="font-medium">
                      {new Date(label as string).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="mt-1 space-y-1 text-sm">
                      {Object.entries(data)
                        .filter(([key]) => key !== "day" && key !== "date")
                        .map(([key, value]) => {
                          const color =
                            sourceColors[key] ?? "var(--color-fallback)";
                          return (
                            <div
                              key={key}
                              className="flex justify-between items-cente1 gap-3"
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: color.color }}
                                />
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="font-medium">
                                {value as number}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              }}
            />

            <Area
              dataKey="Total"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
