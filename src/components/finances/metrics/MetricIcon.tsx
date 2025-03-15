
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricIconProps {
  icon: ReactNode;
  chartColor: string;
}

export function MetricIcon({ icon, chartColor }: MetricIconProps) {
  return (
    <span className={cn(
      "flex items-center justify-center rounded-full p-2 mr-3",
      chartColor === "#22C55E" && "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
      chartColor === "#F43F5E" && "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
      chartColor === "#3B82F6" && "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      chartColor === "#8B5CF6" && "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
    )}>
      {icon}
    </span>
  );
}
