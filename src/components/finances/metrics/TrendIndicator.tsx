
import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialMetricTrendProps } from "./types";

export function TrendIndicator({ trend, isPositiveMetric }: FinancialMetricTrendProps) {
  if (trend === undefined) return null;
  
  const isTrendPositive = trend > 0;
  const isTrendNegative = trend < 0;
  const isTrendNeutral = trend === 0;
  
  // Determine the color based on the metric type and trend direction
  // For metrics like income, a positive trend is good
  // For metrics like expenses or unpaid rent, a negative trend is good
  const isPositiveIndicator = isPositiveMetric ? isTrendPositive : isTrendNegative;
  const isNegativeIndicator = isPositiveMetric ? isTrendNegative : isTrendPositive;
  
  return (
    <div className={cn(
      "flex items-center text-xs font-medium ml-2 px-2 py-0.5 rounded transition-colors",
      isPositiveIndicator && "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
      isNegativeIndicator && "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
      isTrendNeutral && "text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800/50"
    )}>
      {isTrendPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : isTrendNegative ? <ArrowDown className="h-3 w-3 mr-1" /> : null}
      {isTrendPositive ? "+" : ""}{isTrendNegative ? "-" : ""}{Math.abs(trend)}%
    </div>
  );
}
