
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendIndicator } from "./TrendIndicator";
import { MetricIcon } from "./MetricIcon";
import { FinancialMetricCardProps } from "./types";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

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
  
  // Generate simple chart data
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 20
  }));
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-800/20 hover:translate-y-[-2px] group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <MetricIcon icon={icon} chartColor={chartColor} />
            <h3 className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{title}</h3>
          </div>
          <TrendIndicator trend={trend} isPositiveMetric={isPositiveMetric} />
        </div>
        <div className="mt-1">
          <div className="text-xl font-bold transition-all duration-300 group-hover:translate-x-1">{value}</div>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        
        {/* Add chart visualization like in Dashboard */}
        <div className="h-16 mt-4 transition-transform duration-300 group-hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                fill={`url(#gradient-${title})`}
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                className={cn(
                  "transition-all duration-300 group-hover:opacity-90"
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialMetricSkeleton() {
  return (
    <Skeleton className="h-[180px] w-full" />
  );
}
