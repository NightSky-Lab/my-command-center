"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { PerformancePoint } from "@/lib/types";
import { SectionCard } from "./section-card";

const BAR_COLORS = ["#34d399", "#10b981", "#059669", "#047857"];

export function PerformanceChart({
  data,
  title = "Analisis Prestasi UASA 2024",
}: {
  data: PerformancePoint[];
  title?: string;
}) {
  const chartData = data.map((d) => ({
    name: d.label.replace("Tahun ", ""),
    value: d.value,
  }));

  return (
    <SectionCard title={title} icon="BarChart3" href="/analisis">
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 24, right: 8, left: -16, bottom: 0 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `Tahun ${v}`}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v: React.ReactNode) => `${v}%`}
                fill="hsl(var(--foreground))"
                fontSize={12}
                fontWeight={700}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
