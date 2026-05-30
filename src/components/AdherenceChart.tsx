"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
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
  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="percentage" fill="#047857" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
