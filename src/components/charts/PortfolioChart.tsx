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
      <header className="mb-6">
        <h2 className="font-serif text-2xl leading-none tracking-[-0.03em]">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted">Twelve-month value</p>
      </header>

      <span className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8eb4ff" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#8eb4ff" stopOpacity={0} />
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
              tick={{ fill: "#9aa6b8", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9aa6b8", fontSize: 11 }}
              tickFormatter={(v) => formatCompactDisplay(v)}
              width={56}
            />
            <Tooltip
              contentStyle={{
                background: "#10151d",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#9aa6b8" }}
              formatter={(value: number) => [formatDisplay(value), "Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#e7eef8"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </span>
    </section>
  );
}
