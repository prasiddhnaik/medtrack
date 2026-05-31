"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyAdherencePoint } from "@/types";

type AdherenceChartProps = {
  data: DailyAdherencePoint[];
};

export function AdherenceChart({ data }: AdherenceChartProps) {
  const roundedData = data.map((point) => ({
    ...point,
    percentage: Math.round(point.percentage),
  }));

  return (
    <section className="rounded-lg border border-border bg-surface p-5 text-text shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-medium leading-tight text-text">
            Last 7 days
          </h2>
          <p className="mt-1 text-[15px] text-text-muted">
            Daily adherence by scheduled dose logs
          </p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={roundedData}>
            <CartesianGrid stroke="#E8E6DF" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B6A64", fontSize: 13 }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B6A64", fontSize: 13 }}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Adherence"]}
              cursor={{ fill: "#F7F6F2" }}
            />
            <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
              {roundedData.map((point) => (
                <Cell key={point.date} fill={getBarColor(point.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function getBarColor(percentage: number) {
  if (percentage >= 100) {
    return "#0F6E56";
  }

  if (percentage >= 50) {
    return "#1D9E75";
  }

  return "#BA7517";
}
