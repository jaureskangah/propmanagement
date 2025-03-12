
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendIndicator } from "./TrendIndicator";
import { MetricIcon } from "./metrics/MetricIcon";
import { FinancialMetricCardProps } from "./metrics/types";

export function FinancialMetricCard({
  title,
  value,
  description,
  icon,
  chartColor,
  trend
}: FinancialMetricCardProps) {
  // Determine if an increase is positive or negative based on the metric
  // For expenses and unpaid rent, a decrease is positive
  const isPositiveMetric = title !== 'unpaidRent' && title !== 'totalExpenses';
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-800/20 hover:translate-y-[-2px]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <MetricIcon icon={icon} chartColor={chartColor} />
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          <TrendIndicator trend={trend} isPositiveMetric={isPositiveMetric} />
        </div>
        <div className="mt-1">
          <div className="text-xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialMetricSkeleton() {
  return (
    <Skeleton className="h-20 w-full" />
  );
}
