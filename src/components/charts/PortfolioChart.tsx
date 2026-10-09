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
import { useCurrency } from "@/context/CurrencyContext";

interface PortfolioChartProps {
  data: ChartDataPoint[];
  title?: string;
}

export function PortfolioChart({
  data,
  title = "Portfolio performance",
}: PortfolioChartProps) {
  const { formatDisplay, formatCompactDisplay } = useCurrency();

  return (
    <section className="glass-card p-5 sm:p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span>
          <h2 className="font-serif text-2xl font-normal tracking-tight">{title}</h2>
          <p className="text-sm text-muted">12-month value trend</p>
        </span>
        <span className="flex gap-2">
          {["1M", "3M", "6M", "1Y", "ALL"].map((period) => (
            <button
              key={period}
              type="button"
              className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                period === "1Y"
                  ? "bg-white/[0.08] text-foreground"
                  : "text-muted hover:text-foreground"
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
                <stop offset="0%" stopColor="#e7e5e4" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#e7e5e4" stopOpacity={0} />
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
              tickFormatter={(v) => formatCompactDisplay(v)}
              width={56}
            />
            <Tooltip
              contentStyle={{
                background: "#1a2332",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value: number) => [formatDisplay(value), "Value"]}
            />
            <Area
              type="linear"
              dataKey="value"
              stroke="#e7e5e4"
              strokeWidth={1.5}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </span>
    </section>
  );
}
