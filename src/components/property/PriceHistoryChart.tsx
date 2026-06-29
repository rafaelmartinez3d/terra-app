"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PricePoint {
  recordedAt: string;
  value: number;
}

interface PriceHistoryChartProps {
  data: PricePoint[];
  currency?: string;
}

export default function PriceHistoryChart({
  data,
  currency = "BRL",
}: PriceHistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No price history available yet.
      </div>
    );
  }

  const chartData = data.map((p) => ({
    date: new Date(p.recordedAt).toLocaleDateString("pt-BR"),
    value: p.value,
  }));

  const minVal = Math.min(...chartData.map((d) => d.value)) * 0.9;
  const maxVal = Math.max(...chartData.map((d) => d.value)) * 1.1;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(val);

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis
            domain={[minVal, maxVal]}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            tickFormatter={(v) => formatCurrency(v as number)}
          />
          <Tooltip
            formatter={(value: unknown) => formatCurrency(Number(value))}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#059669"
            strokeWidth={2}
            dot={{ fill: "#059669", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
