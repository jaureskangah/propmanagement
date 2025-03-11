
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetric } from "@/components/DashboardMetric";
import { LucideIcon } from "lucide-react";

interface FinancialMetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  chartColor: string;
}

export function FinancialMetricCard({
  title,
  value,
  description,
  icon,
  chartColor
}: FinancialMetricCardProps) {
  return (
    <DashboardMetric
      title={title}
      value={value}
      icon={icon}
      description={description}
      chartColor={chartColor}
    />
  );
}

export function FinancialMetricSkeleton() {
  return (
    <Skeleton className="h-24 w-full" />
  );
}
