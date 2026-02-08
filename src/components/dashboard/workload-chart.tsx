"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { Workload } from "@/lib/data";
import { TrendingUp } from "lucide-react";

type WorkloadChartProps = {
  data: Workload[];
  onBarClick?: (payload: Workload | null) => void;
};

const chartConfig = {
  standard: {
    label: "常態專案",
    color: "hsl(var(--chart-1))",
  },
  urgent: {
    label: "老闆插單",
    color: "hsl(var(--chart-2))",
  },
};

export function WorkloadChart({ data, onBarClick }: WorkloadChartProps) {
  const handleChartClick = (e: any) => {
    if (e && e.activePayload && e.activePayload.length > 0 && onBarClick) {
        onBarClick(e.activePayload[0].payload as Workload);
    } else if (onBarClick) {
        onBarClick(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            部屬工作量分析
        </CardTitle>
        <CardDescription>
          常態專案與「老闆插單」任務的區別。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart 
            accessibilityLayer 
            data={data} 
            onClick={handleChartClick} 
            className="cursor-pointer"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
             <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="standard"
              stackId="a"
              fill="var(--color-standard)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="urgent"
              stackId="a"
              fill="var(--color-urgent)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
