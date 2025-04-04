
import React from "react";

interface PaymentChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const PaymentChartTooltip = ({ active, payload, label }: PaymentChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-xs">
        <p className="font-semibold mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
