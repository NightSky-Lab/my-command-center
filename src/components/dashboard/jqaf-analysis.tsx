"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import { PieChart as PieIcon } from "lucide-react";
import type { Student } from "@/lib/types";

const MASTER = "#10b981";
const FAIL = "#f43f5e";
const YEARS = [1, 2, 3, 4, 5, 6];

export function JqafAnalysis({ students }: { students: Student[] }) {
  const total = students.length;
  const masters = students.filter((s) => s.jqaf_status === "menguasai").length;
  const fails = total - masters;
  const pct = total ? Math.round((masters / total) * 1000) / 10 : 0;

  const pieData = [
    { name: "Menguasai", value: masters, color: MASTER },
    { name: "Tidak Menguasai", value: fails, color: FAIL },
  ];
  const barData = YEARS.map((y) => {
    const inYear = students.filter((s) => s.year === y);
    return {
      name: `Tahun ${y}`,
      Menguasai: inYear.filter((s) => s.jqaf_status === "menguasai").length,
      Tidak: inYear.filter((s) => s.jqaf_status === "tidak_menguasai").length,
    };
  });

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <PieIcon className="size-5 text-brand" /> Analisis JQAF
        </h2>
        <Link href="/jqaf" className="text-xs font-medium text-brand hover:underline">
          Lihat Laporan
        </Link>
      </div>

      <div className="grid items-center gap-4 sm:grid-cols-2">
        {/* Donut */}
        <div className="relative h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={2}
                stroke="none"
              >
                {pieData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{pct}%</span>
            <span className="text-[11px] text-muted-foreground">Menguasai</span>
          </div>
        </div>

        {/* Legend + bar */}
        <div className="space-y-3">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full" style={{ background: MASTER }} />
              Menguasai ({masters})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full" style={{ background: FAIL }} />
              Tidak ({fails})
            </span>
          </div>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(v: string) => v.replace("Tahun ", "T")}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                <Bar dataKey="Menguasai" stackId="a" fill={MASTER} maxBarSize={26} />
                <Bar dataKey="Tidak" stackId="a" fill={FAIL} radius={[3, 3, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
