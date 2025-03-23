
import React from "react";

interface TooltipProps {
  isExpense?: boolean;
}

export const ChartTooltip: React.FC<TooltipProps> = ({ isExpense = false }) => {
  return {
    contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      fontSize: '11px',
      padding: '8px',
    },
    formatter: isExpense 
      ? (value: number) => [`$${value.toLocaleString()}`] 
      : undefined
  };
};
