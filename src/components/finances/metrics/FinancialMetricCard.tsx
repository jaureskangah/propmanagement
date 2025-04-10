
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendIndicator } from "./TrendIndicator";
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
  const bgColor = chartColor === '#22C55E' 
    ? "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" 
    : chartColor === '#F59E0B' 
      ? "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
      : "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20";
  
  const borderColor = chartColor === '#22C55E' 
    ? "border-green-100 dark:border-green-800/30 hover:border-green-200 dark:hover:border-green-700/40" 
    : chartColor === '#F59E0B' 
      ? "border-amber-100 dark:border-amber-800/30 hover:border-amber-200 dark:hover:border-amber-700/40"
      : "border-blue-100 dark:border-blue-800/30 hover:border-blue-200 dark:hover:border-blue-700/40";
  
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-gradient-to-br ${bgColor} ${borderColor}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-800/50 shadow-sm transition-all duration-300 group-hover:scale-110">
              <MetricIcon icon={icon} chartColor={chartColor} />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors dark:text-gray-300">{title}</h3>
          </div>
          {trend !== undefined && <TrendIndicator trend={trend} isPositiveMetric={isPositiveMetric} />}
        </div>
        <div className="mt-3">
          <div className="text-xl font-bold transition-all duration-300 group-hover:translate-x-1 animate-fade-in dark:text-white">{value}</div>
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
