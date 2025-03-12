
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetric } from "@/components/DashboardMetric";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialMetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  chartColor: string;
  trend?: number;
}

export function FinancialMetricCard({
  title,
  value,
  description,
  icon,
  chartColor,
  trend
}: FinancialMetricCardProps) {
  const isTrendPositive = trend !== undefined && trend > 0;
  const isTrendNegative = trend !== undefined && trend < 0;
  const isTrendNeutral = trend !== undefined && trend === 0;

  // Déterminer si une augmentation est positive ou négative selon la métrique
  const isPositiveMetric = title !== 'unpaidRent' && title !== 'totalExpenses';
  
  const renderTrendIndicator = () => {
    if (trend === undefined) return null;
    
    const trendAbs = Math.abs(trend);
    
    // Déterminer la couleur en fonction de la métrique et de la tendance
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
        {trendAbs}%
      </div>
    );
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-800/20 hover:translate-y-[-2px]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className={cn(
              "flex items-center justify-center rounded-full p-2 mr-3",
              chartColor === "#22C55E" && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
              chartColor === "#F43F5E" && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
              chartColor === "#3B82F6" && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              chartColor === "#8B5CF6" && "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            )}>
              {icon}
            </span>
            <h3 className="font-medium text-muted-foreground">{title}</h3>
          </div>
          {renderTrendIndicator()}
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialMetricSkeleton() {
  return (
    <Skeleton className="h-24 w-full" />
  );
}
