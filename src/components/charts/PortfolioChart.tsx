"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartDataPoint } from "@/types";
import { formatCompactNumber, formatCurrency } from "@/lib/finance";

interface PortfolioChartProps {
  data: ChartDataPoint[];
  title?: string;
}

export function PortfolioChart({
  data,
  title = "Portfolio performance",
}: PortfolioChartProps) {
  return (
    <section className="glass-card p-5 sm:p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted">12-month value trend</p>
        </span>
        <span className="flex gap-2">
          {["1M", "3M", "6M", "1Y", "ALL"].map((period) => (
            <button
              key={period}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                period === "1Y"
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {period}
            </button>
          ))}
        </span>
      </header>

      <span className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(v) => formatCompactNumber(v)}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: "#1a2332",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value: number) => [formatCurrency(value), "Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </span>
    </section>
  );
}
