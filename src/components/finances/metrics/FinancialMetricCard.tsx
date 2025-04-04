
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendIndicator } from "../TrendIndicator";
import { MetricIcon } from "./MetricIcon";
import { FinancialMetricCardProps } from "./types";

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
  const isPositiveMetric = title !== 'totalExpenses' && title !== 'unpaidRent';
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-800/20 hover:translate-y-[-2px] dark-card-gradient">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <MetricIcon icon={icon} chartColor={chartColor} />
            <h3 className="text-sm font-medium text-muted-foreground dark:text-gray-300">{title}</h3>
          </div>
          <TrendIndicator trend={trend} isPositiveMetric={isPositiveMetric} />
        </div>
        <div className="mt-1">
          <div className="text-xl font-bold dark:text-white">{value}</div>
          <p className="text-xs text-muted-foreground mt-0.5 dark:text-gray-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialMetricSkeleton() {
  return (
    <Skeleton className="h-20 w-full dark:bg-gray-700" />
  );
}
